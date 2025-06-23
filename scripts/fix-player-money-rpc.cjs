const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixPlayerMoneyWithRPC() {
  try {
    console.log("🔍 Verificando jogadores atuais...");

    // Primeiro, vamos ver os jogadores e seus money atuais
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name, money");

    if (playersError) {
      console.error("❌ Erro ao buscar jogadores:", playersError);
      return;
    }

    console.log(`📋 Jogadores encontrados:`);
    players.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} - Money: $${player.money}`);
    });

    // Agora vamos verificar os player_stats
    console.log("\n🔍 Verificando player_stats...");
    const { data: stats, error: statsError } = await supabase
      .from("player_stats")
      .select("player_id, money");

    if (statsError) {
      console.error("❌ Erro ao buscar player_stats:", statsError);
      return;
    }

    console.log(`📋 Player stats encontrados:`);
    stats.forEach((stat, index) => {
      console.log(
        `${index + 1}. Player ID: ${stat.player_id} - Money: $${stat.money}`
      );
    });

    // Atualizar money usando RPC
    console.log("\n💰 Atualizando money usando RPC...");

    // Atualizar players
    const { data: updatePlayersResult, error: updatePlayersError } =
      await supabase.rpc("update_all_players_money", { new_money: 1000 });

    if (updatePlayersError) {
      console.error(
        "❌ Erro ao atualizar players via RPC:",
        updatePlayersError
      );
      console.log("💡 Tentando método alternativo...");

      // Método alternativo: atualizar um por um
      for (const player of players) {
        const { error: singleUpdateError } = await supabase
          .from("players")
          .update({ money: 1000 })
          .eq("id", player.id);

        if (singleUpdateError) {
          console.error(
            `❌ Erro ao atualizar player ${player.name}:`,
            singleUpdateError
          );
        } else {
          console.log(`✅ Money atualizado para ${player.name}`);
        }
      }
    } else {
      console.log("✅ Money atualizado na tabela players via RPC");
    }

    // Atualizar player_stats
    const { data: updateStatsResult, error: updateStatsError } =
      await supabase.rpc("update_all_player_stats_money", { new_money: 1000 });

    if (updateStatsError) {
      console.error(
        "❌ Erro ao atualizar player_stats via RPC:",
        updateStatsError
      );
      console.log("💡 Tentando método alternativo...");

      // Método alternativo: atualizar um por um
      for (const stat of stats) {
        const { error: singleUpdateError } = await supabase
          .from("player_stats")
          .update({ money: 1000 })
          .eq("player_id", stat.player_id);

        if (singleUpdateError) {
          console.error(
            `❌ Erro ao atualizar stats para player ${stat.player_id}:`,
            singleUpdateError
          );
        } else {
          console.log(
            `✅ Money atualizado nos stats para player ${stat.player_id}`
          );
        }
      }
    } else {
      console.log("✅ Money atualizado na tabela player_stats via RPC");
    }

    console.log("\n🎉 Processo concluído!");
    console.log("🔄 Recarregue a página do jogo para ver as mudanças.");
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

fixPlayerMoneyWithRPC();
