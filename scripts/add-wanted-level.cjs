const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("❌ Variáveis de ambiente não encontradas");
  console.log(
    "📝 Certifique-se de que VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addWantedLevelField() {
  try {
    console.log("🔧 Adicionando campo wanted_level à tabela players...");

    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE public.players 
        ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0;
      `,
    });

    if (error) {
      console.log("❌ Erro ao adicionar campo:", error.message);

      // Fallback: tentar executar diretamente
      console.log("🔄 Tentando método alternativo...");
      const { error: directError } = await supabase
        .from("players")
        .select("wanted_level")
        .limit(1);

      if (
        directError &&
        directError.message.includes('column "wanted_level" does not exist')
      ) {
        console.log(
          "📝 Campo wanted_level não existe. Execute manualmente no Supabase Dashboard:"
        );
        console.log("");
        console.log(
          "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0;"
        );
        console.log("");
        console.log("Ou use o SQL Editor no Supabase Dashboard > SQL Editor");
      } else {
        console.log(
          "✅ Campo wanted_level já existe ou foi adicionado com sucesso!"
        );
      }
    } else {
      console.log("✅ Campo wanted_level adicionado com sucesso!");
    }
  } catch (error) {
    console.log("❌ Erro:", error.message);
    console.log("");
    console.log("📝 Execute manualmente no Supabase Dashboard > SQL Editor:");
    console.log(
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0;"
    );
  }
}

addWantedLevelField();
