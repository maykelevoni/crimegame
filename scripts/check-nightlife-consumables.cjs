const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkNightlifeConsumables() {
  console.log("🔍 Verificando consumíveis do nightlife...\n");

  try {
    // Buscar todos os consumíveis
    const { data: consumables, error } = await supabase
      .from("nightlife_consumables")
      .select("*");

    if (error) {
      console.error("❌ Erro ao buscar consumíveis:", error);
      return;
    }

    if (!consumables || consumables.length === 0) {
      console.log("⚠️  Nenhum consumível encontrado!");
      return;
    }

    console.log(`📊 Encontrados ${consumables.length} consumíveis:\n`);

    consumables.forEach((consumable, index) => {
      console.log(`${index + 1}. ${consumable.name}`);
      console.log(`   💰 Preço: $${consumable.price}`);
      console.log(`   🏷️  Tipo: ${consumable.type}`);
      console.log(`   📝 Descrição: ${consumable.description}`);
      console.log(`   ⚡ Effects:`, consumable.effects);
      console.log(`   🆔 ID: ${consumable.id}`);
      console.log("");
    });

    // Verificar estrutura da tabela
    console.log("🔧 Verificando estrutura da tabela...");
    const { data: tableInfo, error: tableError } = await supabase
      .from("nightlife_consumables")
      .select("*")
      .limit(1);

    if (tableError) {
      console.error("❌ Erro ao verificar estrutura:", tableError);
    } else {
      console.log("✅ Estrutura da tabela OK");
      console.log("📋 Colunas disponíveis:", Object.keys(tableInfo[0] || {}));
    }
  } catch (error) {
    console.error("❌ Erro geral:", error);
  }
}

checkNightlifeConsumables();
