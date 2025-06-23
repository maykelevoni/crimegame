const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("SUPABASE_SERVICE_KEY:", supabaseServiceKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixPlayerMoney() {
  try {
    console.log("🔍 Buscando jogadores...");

    // Buscar todos os jogadores
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, name, user_id");

    if (playersError) {
      console.error("❌ Erro ao buscar jogadores:", playersError);
      return;
    }

    console.log(`📋 Encontrados ${players.length} jogadores:`);
    players.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} (ID: ${player.id})`);
    });

    if (players.length === 0) {
      console.log("❌ Nenhum jogador encontrado!");
      return;
    }

    // Atualizar o money de todos os jogadores para 1000
    for (const player of players) {
      console.log(`💰 Atualizando money do jogador ${player.name}...`);

      // Atualizar player_stats
      const { error: statsError } = await supabase
        .from("player_stats")
        .update({ money: 1000 })
        .eq("player_id", player.id);

      if (statsError) {
        console.error(
          `❌ Erro ao atualizar stats do ${player.name}:`,
          statsError
        );
      } else {
        console.log(`✅ Money atualizado para $1000 para ${player.name}`);
      }

      // Também atualizar a tabela players (caso tenha money lá também)
      const { error: playerError } = await supabase
        .from("players")
        .update({ money: 1000 })
        .eq("id", player.id);

      if (playerError) {
        console.error(
          `❌ Erro ao atualizar player ${player.name}:`,
          playerError
        );
      } else {
        console.log(
          `✅ Money atualizado na tabela players para ${player.name}`
        );
      }
    }

    console.log("🎉 Processo concluído!");
    console.log("🔄 Recarregue a página do jogo para ver as mudanças.");
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

fixPlayerMoney();
