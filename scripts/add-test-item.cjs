const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Usar a chave de serviço para ter mais permissões

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Erro: As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestItemToPlayer() {
  const PLAYER_NAME = "Mayke Player";

  try {
    console.log(`Buscando jogador: ${PLAYER_NAME}...`);
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id")
      .eq("name", PLAYER_NAME)
      .single();

    if (playerError || !player) {
      throw new Error(
        `Jogador "${PLAYER_NAME}" não encontrado. Erro: ${playerError?.message}`
      );
    }
    console.log(`Jogador encontrado com ID: ${player.id}`);

    console.log("Buscando um item de exemplo...");
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("id")
      .limit(1)
      .single();

    if (itemError || !item) {
      throw new Error(
        `Nenhum item encontrado na loja. Erro: ${itemError?.message}`
      );
    }
    console.log(`Item encontrado com ID: ${item.id}`);

    console.log("Adicionando item ao inventário do jogador...");
    const { error: insertError } = await supabase.from("inventory").insert({
      player_id: player.id,
      item_id: item.id,
      quantity: 1,
    });

    if (insertError) {
      // Ignora erro de duplicata, pois o item pode já estar no inventário
      if (insertError.code === "23505") {
        console.log(
          "O jogador já possui este item. Nenhum item foi adicionado."
        );
      } else {
        throw new Error(
          `Erro ao adicionar item ao inventário: ${insertError.message}`
        );
      }
    } else {
      console.log("✅ Item adicionado ao inventário com sucesso!");
    }
  } catch (error) {
    console.error(`❌ Falha na operação: ${error.message}`);
  }
}

addTestItemToPlayer();
