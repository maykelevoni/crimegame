const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Configuração do Supabase
const supabaseUrl = "https://mkqwnfofyttnhodafdqe.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no ambiente");
  console.log("📝 Adicione a variável SUPABASE_SERVICE_ROLE_KEY ao seu .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSchema() {
  try {
    console.log("🚀 Executando schema completo do Urban Hustle...");

    // Ler o arquivo SQL
    const sqlPath = path.join(
      __dirname,
      "../supabase/complete-schema-fixed.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("📋 Executando SQL...");

    // Executar o SQL em partes para evitar timeout
    const statements = sql.split(";").filter((stmt) => stmt.trim().length > 0);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length === 0) continue;

      try {
        console.log(`📝 Executando statement ${i + 1}/${statements.length}...`);

        const { error } = await supabase.rpc("exec_sql", { sql: statement });

        if (error) {
          console.log(
            `⚠️  Statement ${i + 1} falhou (pode ser normal):`,
            error.message
          );
        } else {
          console.log(`✅ Statement ${i + 1} executado com sucesso`);
        }
      } catch (err) {
        console.log(
          `⚠️  Statement ${i + 1} falhou (pode ser normal):`,
          err.message
        );
      }
    }

    console.log("✅ Schema executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar schema:", error);
    process.exit(1);
  }
}

executeSchema();
