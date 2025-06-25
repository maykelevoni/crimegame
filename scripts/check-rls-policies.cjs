const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableWithAuth(tableName) {
  console.log(`\n🔍 Verificando ${tableName} com autenticação...`);

  // Teste 1: Verificar se há usuário logado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log(
    `1. Usuário atual: ${user ? user.email : "Nenhum usuário logado"}`
  );

  // Teste 2: Tentar inserir um registro de teste (para verificar permissões)
  console.log("2. Testando inserção de registro de teste...");
  try {
    const testData = {
      test_field: "test_value",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert(testData)
      .select();

    if (error) {
      console.log(`   ❌ Erro na inserção: ${error.message}`);
      console.log(`   Código: ${error.code}`);
    } else {
      console.log(`   ✅ Inserção bem-sucedida!`);
      console.log(`   Dados inseridos:`, data);

      // Limpar o registro de teste
      if (data && data[0] && data[0].id) {
        await supabase.from(tableName).delete().eq("id", data[0].id);
        console.log(`   🧹 Registro de teste removido`);
      }
    }
  } catch (err) {
    console.log(`   ❌ Exceção na inserção: ${err.message}`);
  }

  // Teste 3: Verificar se há dados com diferentes filtros
  console.log("3. Testando diferentes consultas...");

  const queries = [
    { name: "SELECT *", query: () => supabase.from(tableName).select("*") },
    {
      name: "SELECT com LIMIT 100",
      query: () => supabase.from(tableName).select("*").limit(100),
    },
    {
      name: "SELECT com ORDER BY",
      query: () =>
        supabase
          .from(tableName)
          .select("*")
          .order("created_at", { ascending: false }),
    },
    {
      name: "SELECT com filtro de data",
      query: () =>
        supabase.from(tableName).select("*").gte("created_at", "2020-01-01"),
    },
  ];

  for (const { name, query } of queries) {
    try {
      const { data, error } = await query();
      if (error) {
        console.log(`   ❌ ${name}: ${error.message}`);
      } else {
        console.log(`   ✅ ${name}: ${data ? data.length : 0} registros`);
      }
    } catch (err) {
      console.log(`   ❌ ${name}: ${err.message}`);
    }
  }
}

async function checkTables() {
  console.log("🚀 Verificando tabelas com diferentes abordagens...\n");

  const tables = ["game_sessions", "inventory", "players"];

  for (const tableName of tables) {
    await checkTableWithAuth(tableName);
  }

  console.log("\n✅ Verificação concluída!");
  console.log("\n💡 Dicas:");
  console.log(
    "- Se as tabelas existem mas estão vazias, verifique se os dados foram inseridos no projeto correto"
  );
  console.log("- Verifique as políticas RLS no Supabase Dashboard");
  console.log("- Confirme se está usando as credenciais corretas");
}

async function checkRLSPolicies() {
  console.log("🔒 Verificando políticas RLS...\n");

  // Teste 1: Verificar se conseguimos ler dados
  console.log("🔍 Teste 1: Verificando leitura da tabela players...");
  try {
    const { data, error } = await supabase.from("players").select("*").limit(1);

    if (error) {
      console.log(`   ❌ Erro na leitura: ${error.message}`);
      console.log(`   Código: ${error.code}`);
    } else {
      console.log(`   ✅ Leitura bem-sucedida!`);
      console.log(`   Registros encontrados: ${data ? data.length : 0}`);
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
  }

  // Teste 2: Tentar inserir um registro
  console.log("\n🔍 Teste 2: Tentando inserir registro na tabela players...");
  try {
    const testPlayer = {
      user_id: "056391d6-0cfa-4bf4-a544-d0fe2e4ab213", // ID do usuário de teste
      username: "TestPlayer",
      level: 1,
      experience: 0,
      money: 1000,
      health: 100,
      energy: 100,
      reputation: 0,
      wanted_level: 0,
      addiction: 0,
    };

    const { data, error } = await supabase
      .from("players")
      .insert(testPlayer)
      .select();

    if (error) {
      console.log(`   ❌ Erro na inserção: ${error.message}`);
      console.log(`   Código: ${error.code}`);

      if (error.message.includes("row-level security")) {
        console.log("\n💡 PROBLEMA: Política RLS bloqueando inserção!");
        console.log("🔧 SOLUÇÕES:");
        console.log("");
        console.log("OPÇÃO 1 - Desabilitar RLS temporariamente:");
        console.log("   1. Vá para Database > Tables > players");
        console.log('   2. Clique em "RLS" para desabilitar');
        console.log("   3. Ou configure políticas específicas");
        console.log("");
        console.log("OPÇÃO 2 - Configurar política RLS:");
        console.log("   1. Vá para Authentication > Policies");
        console.log("   2. Crie uma política para INSERT:");
        console.log("      - Target roles: authenticated");
        console.log("      - Operation: INSERT");
        console.log("      - Policy definition: (auth.uid() = user_id)");
        console.log("");
        console.log("OPÇÃO 3 - Usar Service Role Key:");
        console.log("   - Use a service_role key em vez da anon key");
        console.log("   - (Mais seguro para operações administrativas)");
      }
    } else {
      console.log("✅ Inserção bem-sucedida!");
      console.log(`🎮 Player criado: ${data[0].username}`);

      // Limpar o registro de teste
      await supabase.from("players").delete().eq("id", data[0].id);
      console.log("🧹 Registro de teste removido");
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
  }

  // Teste 3: Verificar outras tabelas
  console.log("\n🔍 Teste 3: Verificando outras tabelas...");
  const tables = ["items", "business_types", "casino_games"];

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (error) {
        console.log(`   ❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`   ✅ ${tableName}: ${data ? data.length : 0} registros`);
      }
    } catch (err) {
      console.log(`   ❌ ${tableName}: ${err.message}`);
    }
  }

  console.log("\n✅ Verificação concluída!");
  console.log("\n💡 RECOMENDAÇÃO:");
  console.log("   Para desenvolvimento, desabilite RLS nas tabelas ou");
  console.log("   configure políticas adequadas para seu caso de uso.");
}

checkTables().catch(console.error);
checkRLSPolicies().catch(console.error);
