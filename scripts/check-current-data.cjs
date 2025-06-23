const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente não encontradas");
  console.log("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCurrentData() {
  console.log("🔍 Verificando dados atuais no banco...\n");

  try {
    // 1. Verificar players
    console.log("📋 PLAYERS:");
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("*");

    if (playersError) {
      console.error("❌ Erro ao buscar players:", playersError);
    } else {
      console.log(`✅ ${players.length} players encontrados:`);
      players.forEach((player) => {
        console.log(`  - ID: ${player.id}`);
        console.log(`    Nome: ${player.name}`);
        console.log(`    Level: ${player.level}`);
        console.log(`    Experiência: ${player.experience}`);
        console.log(`    Avatar URL: ${player.avatar_url}`);
        console.log(`    User ID: ${player.user_id}`);
        console.log("");
      });
    }

    // 2. Verificar player_stats
    console.log("📊 PLAYER_STATS:");
    const { data: playerStats, error: statsError } = await supabase
      .from("player_stats")
      .select("*");

    if (statsError) {
      console.error("❌ Erro ao buscar player_stats:", statsError);
    } else {
      console.log(`✅ ${playerStats.length} registros de stats encontrados:`);
      playerStats.forEach((stat) => {
        console.log(`  - Player ID: ${stat.player_id}`);
        console.log(`    Vida: ${stat.health}/${stat.max_health}`);
        console.log(`    Energia: ${stat.energy}/${stat.max_energy}`);
        console.log(`    Vício: ${stat.addiction}%`);
        console.log(`    Reputação: ${stat.reputation}`);
        console.log(`    Dinheiro: $${stat.money}`);
        console.log(`    Procurado: ${stat.wanted_level}`);
        console.log(`    Preso: ${stat.is_imprisoned}`);
        console.log(`    Hospitalizado: ${stat.is_hospitalized}`);
        console.log("");
      });
    }

    // 3. Verificar inventory
    console.log("🎒 INVENTORY:");
    const { data: inventory, error: inventoryError } = await supabase
      .from("inventory")
      .select("*");

    if (inventoryError) {
      console.error("❌ Erro ao buscar inventory:", inventoryError);
    } else {
      console.log(`✅ ${inventory.length} itens no inventário:`);
      inventory.forEach((item) => {
        console.log(`  - Player ID: ${item.player_id}`);
        console.log(`    Item ID: ${item.item_id}`);
        console.log(`    Quantidade: ${item.quantity}`);
        console.log(`    Equipado: ${item.equipped}`);
        console.log(`    Slot Type: ${item.slot_type}`);
        console.log("");
      });
    }

    // 4. Verificar items
    console.log("🛒 ITEMS:");
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("*");

    if (itemsError) {
      console.error("❌ Erro ao buscar items:", itemsError);
    } else {
      console.log(`✅ ${items.length} itens encontrados:`);
      items.forEach((item) => {
        console.log(`  - ID: ${item.id}`);
        console.log(`    Nome: ${item.name}`);
        console.log(`    Tipo: ${item.type}`);
        console.log(`    Categoria: ${item.category}`);
        console.log(`    Preço: $${item.price}`);
        console.log(`    Raridade: ${item.rarity}`);
        console.log(`    Stackable: ${item.stackable}`);
        console.log(`    Disponível: ${item.available}`);
        console.log(`    Descrição: ${item.description}`);
        console.log("");
      });
    }

    // 5. Verificar businesses
    console.log("🏢 BUSINESSES:");
    const { data: businesses, error: businessesError } = await supabase
      .from("businesses")
      .select("*");

    if (businessesError) {
      console.error("❌ Erro ao buscar businesses:", businessesError);
    } else {
      console.log(`✅ ${businesses.length} negócios encontrados:`);
      businesses.forEach((business) => {
        console.log(`  - ID: ${business.id}`);
        console.log(`    Player ID: ${business.player_id}`);
        console.log(`    Nome: ${business.name}`);
        console.log(`    Tipo: ${business.type}`);
        console.log(`    Level: ${business.level}`);
        console.log(`    Renda: $${business.income}`);
        console.log(`    Funcionários: ${business.employees}`);
        console.log(`    Segurança: ${business.security}`);
        console.log(`    Preço: $${business.price}`);
        console.log(`    Custo Upgrade: $${business.upgrade_cost}`);
        console.log(`    Possuído: ${business.owned}`);
        console.log("");
      });
    }
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

checkCurrentData();
