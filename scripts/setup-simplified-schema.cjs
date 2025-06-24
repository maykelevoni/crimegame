const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente não encontradas");
  console.log(
    "📝 Certifique-se de que VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSimplifiedSchema() {
  console.log(
    "🚀 Configurando schema simplificado (sem tabelas de histórico)...\n"
  );

  try {
    // Ler o arquivo SQL
    const sqlFilePath = path.join(
      __dirname,
      "../supabase/complete-schema-simplified.sql"
    );
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    console.log("📋 Executando schema simplificado...");

    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0 && !cmd.startsWith("--"));

    let successCount = 0;
    let errorCount = 0;

    for (const command of commands) {
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc("exec_sql", {
            sql: command + ";",
          });

          if (error) {
            console.log(`⚠️  Erro: ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.log(`⚠️  Erro ao executar comando: ${err.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n✅ Schema simplificado executado!`);
    console.log(`📊 Comandos executados com sucesso: ${successCount}`);
    console.log(`⚠️  Erros: ${errorCount}`);

    if (errorCount === 0) {
      console.log("\n🎉 Schema simplificado configurado com sucesso!");
      console.log("📝 Principais mudanças:");
      console.log(
        "   - Removidas tabelas de histórico (robbery_history, treatment_history, etc.)"
      );
      console.log("   - Mantidas apenas tabelas essenciais");
      console.log("   - Adicionadas funções para cálculos em tempo real");
      console.log("   - Economia significativa de espaço no banco");
    } else {
      console.log("\n⚠️  Alguns comandos falharam. Verifique os erros acima.");
    }
  } catch (err) {
    console.error("❌ Erro ao ler ou executar schema:", err.message);
  }
}

// Função para verificar se as tabelas foram criadas
async function checkTables() {
  console.log("\n🔍 Verificando tabelas criadas...\n");

  const expectedTables = [
    "robberies",
    "business_types",
    "player_businesses",
    "treatments",
    "casino_games",
    "nightlife_venues",
    "nightlife_characters",
    "bank_accounts",
    "prisoners",
  ];

  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("count")
        .limit(1);

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: Tabela existe`);
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`);
    }
  }
}

// Executar setup
setupSimplifiedSchema()
  .then(() => checkTables())
  .catch(console.error);
