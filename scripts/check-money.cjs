const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMoney() {
  try {
    console.log("🔍 Verificando money atual...\n");

    // Verificar players
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name, money");

    if (playersError) {
      console.error("❌ Erro ao buscar players:", playersError);
      return;
    }

    console.log("📋 Tabela PLAYERS:");
    if (players.length === 0) {
      console.log("   Nenhum jogador encontrado");
    } else {
      players.forEach((player, index) => {
        console.log(
          `   ${index + 1}. ${player.name} - Money: $${player.money}`
        );
      });
    }

    // Verificar player_stats
    const { data: stats, error: statsError } = await supabase
      .from("player_stats")
      .select("player_id, money");

    if (statsError) {
      console.error("❌ Erro ao buscar player_stats:", statsError);
      return;
    }

    console.log("\n📋 Tabela PLAYER_STATS:");
    if (stats.length === 0) {
      console.log("   Nenhum stats encontrado");
    } else {
      stats.forEach((stat, index) => {
        console.log(
          `   ${index + 1}. Player ID: ${stat.player_id} - Money: $${
            stat.money
          }`
        );
      });
    }

    console.log("\n💡 Para corrigir o money, você pode:");
    console.log(
      "   1. Recarregar a página do jogo (se você acabou de criar um novo jogador)"
    );
    console.log(
      "   2. Ou adicionar a SUPABASE_SERVICE_KEY ao seu arquivo .env e executar o script fix-player-money.cjs"
    );
    console.log("   3. Ou executar manualmente no Supabase SQL Editor:");
    console.log("      UPDATE players SET money = 1000;");
    console.log("      UPDATE player_stats SET money = 1000;");
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

checkMoney();
