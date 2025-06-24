const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente não encontradas");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("🔍 Verificando tabelas no banco...\n");

  const tablesToCheck = [
    "players",
    "items",
    "inventory",
    "businesses",
    "robberies",
    "robbery_history",
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

  for (const tableName of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: Existe`);
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err.message}`);
    }
  }

  console.log("\n📋 Resumo:");
  console.log("- ✅ = Tabela existe");
  console.log("- ❌ = Tabela não existe ou erro");
}

checkTables().catch(console.error);
