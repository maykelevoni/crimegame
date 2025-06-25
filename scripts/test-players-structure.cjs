const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testPlayersStructure() {
  console.log("🔍 Testando estrutura da tabela players...\n");

  try {
    // Primeiro, vamos ver se conseguimos acessar a tabela
    const { data, error } = await supabase.from("players").select("*").limit(1);

    if (error) {
      console.log(`❌ Erro ao acessar tabela players: ${error.message}`);
      return;
    }

    console.log("✅ Tabela players acessível!");

    if (data && data.length > 0) {
      console.log("📋 Colunas existentes:");
      const columns = Object.keys(data[0]);
      columns.forEach((col) => {
        console.log(`   - ${col}: ${typeof data[0][col]} = ${data[0][col]}`);
      });
    } else {
      console.log("📋 Tabela está vazia");
    }

    // Vamos tentar inserir com um UUID válido
    console.log("\n🔍 Tentando inserção com UUID válido...");
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";
    const basicPlayer = {
      user_id: validUUID,
      level: 1,
      experience: 0,
      money: 1000,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("players")
      .insert(basicPlayer)
      .select();

    if (insertError) {
      console.log(`❌ Erro na inserção: ${insertError.message}`);
      console.log(`📋 Código: ${insertError.code}`);
      console.log(`📋 Detalhes: ${insertError.details}`);

      // Vamos tentar com apenas user_id
      console.log("\n🔍 Tentando apenas com user_id...");
      const { data: simpleInsert, error: simpleError } = await supabase
        .from("players")
        .insert({ user_id: validUUID })
        .select();

      if (simpleError) {
        console.log(`❌ Erro na inserção simples: ${simpleError.message}`);
        console.log(`📋 Código: ${simpleError.code}`);
      } else {
        console.log("✅ Inserção simples bem-sucedida!");
        console.log("📋 Player criado:", simpleInsert[0]);

        // Limpar o registro de teste
        await supabase.from("players").delete().eq("id", simpleInsert[0].id);
        console.log("🧹 Registro de teste removido");
      }
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

testPlayersStructure().catch(console.error);
