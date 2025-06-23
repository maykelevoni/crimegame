const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  console.log(
    "Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeMoneyFromPlayers() {
  console.log("🔧 Removendo coluna money da tabela players...");

  try {
    // Primeiro, vamos verificar se a coluna existe
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "players")
      .eq("column_name", "money");

    if (columnsError) {
      console.error("❌ Erro ao verificar colunas:", columnsError);
      return;
    }

    if (columns.length === 0) {
      console.log("✅ Coluna money não existe na tabela players");
      return;
    }

    console.log("✅ Coluna money encontrada na tabela players");

    // Remover a coluna money da tabela players
    const { error: alterError } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE players DROP COLUMN IF EXISTS money;",
    });

    if (alterError) {
      console.error("❌ Erro ao remover coluna money:", alterError);
      return;
    }

    console.log("✅ Coluna money removida da tabela players com sucesso!");
    console.log(
      "💰 Agora o money será gerenciado apenas na tabela player_stats"
    );
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

removeMoneyFromPlayers();
