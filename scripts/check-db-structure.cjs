const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  try {
    console.log("🔍 Checking database structure...\n");

    // First, let's see what tables exist
    console.log("1. Checking available tables...");
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (tablesError) {
      console.log("❌ Could not check tables:", tablesError.message);
    } else {
      console.log(
        "✅ Available tables:",
        tables.map((t) => t.table_name)
      );
    }

    // Check players table structure with minimal columns
    console.log("\n2. Checking players table structure...");
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("id")
      .limit(1);

    if (playersError) {
      console.error("❌ Error accessing players table:", playersError);
    } else {
      console.log("✅ Players table accessible");
    }

    // Try to get column information
    console.log("\n3. Checking players table columns...");
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_schema", "public")
      .eq("table_name", "players");

    if (columnsError) {
      console.log("❌ Could not check columns:", columnsError.message);
    } else {
      console.log("📋 Players table columns:");
      columns.forEach((col) => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    }

    // Try to create a test player to see what happens
    console.log("\n4. Testing player creation...");
    const { data: newPlayer, error: createError } = await supabase
      .from("players")
      .insert({
        name: "Test Player",
        avatar_url: "https://example.com/avatar.png",
      })
      .select()
      .single();

    if (createError) {
      console.log("❌ Error creating player:", createError.message);
    } else {
      console.log("✅ Player created successfully:", newPlayer);

      // Clean up
      await supabase.from("players").delete().eq("id", newPlayer.id);
      console.log("🧹 Test player cleaned up");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

checkDatabaseStructure();
