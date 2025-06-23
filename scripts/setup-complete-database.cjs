const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
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

async function setupCompleteDatabase() {
  console.log("🚀 Configurando banco de dados completo do Urban Hustle...\n");

  try {
    // 1. Executar schema completo
    console.log("📋 Executando schema completo...");
    const schemaPath = path.join(__dirname, "../supabase/complete-schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    const { error: schemaError } = await supabase.rpc("exec_sql", {
      sql: schemaSQL,
    });
    if (schemaError) {
      console.error("❌ Erro ao executar schema:", schemaError);
      return;
    }
    console.log("✅ Schema executado com sucesso!\n");

    // 2. Popular dados iniciais
    console.log("🌱 Populando dados iniciais...");
    const seedPath = path.join(__dirname, "../supabase/seed-complete-data.sql");
    const seedSQL = fs.readFileSync(seedPath, "utf8");

    const { error: seedError } = await supabase.rpc("exec_sql", {
      sql: seedSQL,
    });
    if (seedError) {
      console.error("❌ Erro ao popular dados:", seedError);
      return;
    }
    console.log("✅ Dados iniciais populados com sucesso!\n");

    // 3. Verificar se tudo foi criado
    console.log("🔍 Verificando tabelas criadas...");

    const tables = [
      "robberies",
      "robbery_history",
      "business_types",
      "businesses",
      "business_income_history",
      "treatments",
      "treatment_history",
      "casino_games",
      "casino_history",
      "nightlife_venues",
      "nightlife_characters",
      "nightlife_history",
      "bank_accounts",
      "bank_transactions",
      "prisoners",
      "prison_visits",
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select("count(*)", { count: "exact", head: true });

      if (error) {
        console.log(`❌ Tabela ${table}: Erro - ${error.message}`);
      } else {
        console.log(`✅ Tabela ${table}: ${data[0].count} registros`);
      }
    }

    console.log("\n🎉 Banco de dados configurado com sucesso!");
    console.log("\n📊 Resumo das funcionalidades disponíveis:");
    console.log("  • 9 tipos de roubos (níveis 1-25)");
    console.log("  • 9 tipos de negócios para compra");
    console.log("  • 10 tratamentos hospitalares");
    console.log("  • 9 jogos de casino");
    console.log("  • 9 locais de nightlife");
    console.log("  • 9 personagens da nightlife");
    console.log("  • 9 prisioneiros para visitar");
    console.log("  • Sistema bancário completo");
    console.log("  • Sistema de inventário atualizado");
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

setupCompleteDatabase();
