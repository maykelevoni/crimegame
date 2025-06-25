const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPlayersTable() {
  console.log("🔍 Verificando estrutura da tabela players...\n");

  try {
    // Tentar buscar todos os campos da tabela players
    const { data, error } = await supabase.from("players").select("*").limit(1);

    if (error) {
      console.log(`❌ Erro ao acessar tabela players: ${error.message}`);
      console.log(`📋 Código: ${error.code}`);
      console.log(`📋 Detalhes: ${error.details}`);
      return;
    }

    if (data && data.length > 0) {
      console.log("✅ Tabela players acessível!");
      console.log("📋 Colunas encontradas:");
      const columns = Object.keys(data[0]);
      columns.forEach((col) => {
        console.log(`   - ${col}: ${typeof data[0][col]}`);
      });
    } else {
      console.log("✅ Tabela players existe mas está vazia");
    }

    // Tentar inserir um registro de teste para ver quais campos são obrigatórios
    console.log("\n🔍 Testando inserção de player...");
    const testPlayer = {
      name: "TestPlayer",
      user_id: "test-user-id",
      level: 1,
      experience: 0,
      money: 1000,
      health: 100,
      energy: 100,
      reputation: 0,
      wanted_level: 0,
      addiction: 0,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("players")
      .insert(testPlayer)
      .select();

    if (insertError) {
      console.log(`❌ Erro na inserção: ${insertError.message}`);
      console.log(`📋 Código: ${insertError.code}`);
      console.log(`📋 Detalhes: ${insertError.details}`);
      console.log(`📋 Hint: ${insertError.hint}`);
    } else {
      console.log("✅ Inserção bem-sucedida!");
      console.log("📋 Player criado:", insertData[0]);

      // Limpar o registro de teste
      await supabase.from("players").delete().eq("id", insertData[0].id);
      console.log("🧹 Registro de teste removido");
    }
  } catch (err) {
    console.log(`❌ Erro geral: ${err.message}`);
  }
}

checkPlayersTable().catch(console.error);
