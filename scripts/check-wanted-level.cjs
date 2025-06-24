const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing environment variables");
  console.log("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkWantedLevel() {
  try {
    console.log("🔍 Checking players table structure...");

    // Try to fetch a player to see what fields exist
    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Error fetching players:", error);
      return;
    }

    if (players && players.length > 0) {
      const player = players[0];
      console.log("📋 Available fields in players table:");
      Object.keys(player).forEach((key) => {
        console.log(`  - ${key}: ${typeof player[key]} = ${player[key]}`);
      });

      // Check if wanted_level exists
      if ("wanted_level" in player) {
        console.log("✅ wanted_level field exists!");
        console.log(`Current value: ${player.wanted_level}`);
      } else {
        console.log("❌ wanted_level field does not exist!");
        console.log("💡 Run this SQL in Supabase Dashboard:");
        console.log(
          "ALTER TABLE public.players ADD COLUMN wanted_level INTEGER DEFAULT 0;"
        );
      }
    } else {
      console.log("❌ No players found in database");
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

checkWantedLevel();
