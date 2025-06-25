const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseServiceKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugTable(tableName) {
  console.log(`\n🔍 DEBUG: ${tableName}`);
  console.log("=".repeat(50));

  // Teste 1: Tentar selecionar tudo
  console.log("1. Testando SELECT *...");
  try {
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      console.log(`   Código: ${error.code}`);
      console.log(`   Detalhes: ${error.details}`);
    } else {
      console.log(`   ✅ Sucesso!`);
      console.log(`   Registros encontrados: ${data ? data.length : 0}`);
      if (data && data.length > 0) {
        console.log(`   Primeiro registro:`, JSON.stringify(data[0], null, 2));
      }
    }
  } catch (err) {
    console.log(`   ❌ Exceção: ${err.message}`);
  }

  // Teste 2: Tentar selecionar apenas uma coluna
  console.log("\n2. Testando SELECT com uma coluna...");
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("id")
      .limit(1);

    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    } else {
      console.log(`   ✅ Sucesso!`);
      console.log(`   Dados:`, data);
    }
  } catch (err) {
    console.log(`   ❌ Exceção: ${err.message}`);
  }

  // Teste 3: Tentar contar registros
  console.log("\n3. Testando COUNT...");
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    } else {
      console.log(`   ✅ Sucesso!`);
      console.log(`   Total de registros: ${count}`);
    }
  } catch (err) {
    console.log(`   ❌ Exceção: ${err.message}`);
  }

  // Teste 4: Verificar se a tabela existe com uma query simples
  console.log("\n4. Testando existência da tabela...");
  try {
    const { data, error } = await supabase.from(tableName).select("*").limit(0);

    if (error) {
      console.log(
        `   ❌ Tabela não existe ou erro de acesso: ${error.message}`
      );
    } else {
      console.log(`   ✅ Tabela existe e é acessível`);
    }
  } catch (err) {
    console.log(`   ❌ Exceção: ${err.message}`);
  }
}

async function debugTables() {
  console.log("🚀 Iniciando debug das tabelas problemáticas...\n");

  const problemTables = ["game_sessions", "inventory", "players"];

  for (const tableName of problemTables) {
    await debugTable(tableName);
  }

  console.log("\n✅ Debug concluído!");
}

debugTables().catch(console.error);
