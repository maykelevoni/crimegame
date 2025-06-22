const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestPlayer() {
  console.log("👤 Creating test player...");

  try {
    // First, create a test user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: "test@urbanhustle.com",
      password: "test123456",
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return;
    }

    if (!authData.user) {
      console.error("No user created");
      return;
    }

    console.log("✅ Auth user created:", authData.user.id);

    // Now sign in as this user to get the session
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: "test@urbanhustle.com",
        password: "test123456",
      });

    if (signInError) {
      console.error("Error signing in:", signInError);
      return;
    }

    console.log("✅ Signed in as test user");

    // Create player profile (now authenticated as the user)
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .insert({
        name: "TestPlayer",
        avatar_url:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        level: 1,
        experience: 0,
        user_id: authData.user.id,
      })
      .select()
      .single();

    if (playerError) {
      console.error("Error creating player:", playerError);
      return;
    }

    console.log("✅ Player created:", playerData.id);

    // Create player stats
    const { data: statsData, error: statsError } = await supabase
      .from("player_stats")
      .insert({
        player_id: playerData.id,
        health: 100,
        max_health: 100,
        energy: 100,
        max_energy: 100,
        addiction: 0,
        reputation: 0,
        money: 1000,
        wanted_level: 0,
        is_imprisoned: false,
        is_hospitalized: false,
      })
      .select()
      .single();

    if (statsError) {
      console.error("Error creating player stats:", statsError);
      return;
    }

    console.log("✅ Player stats created");

    // Add some items to inventory
    const { data: items } = await supabase.from("items").select("id").limit(3);

    if (items && items.length > 0) {
      const inventoryItems = items.map((item) => ({
        player_id: playerData.id,
        item_id: item.id,
        quantity: 1,
        equipped: false,
        slot_type: null,
      }));

      const { error: inventoryError } = await supabase
        .from("inventory")
        .insert(inventoryItems);

      if (inventoryError) {
        console.error("Error creating inventory:", inventoryError);
      } else {
        console.log("✅ Inventory created with", items.length, "items");
      }
    }

    console.log("🎉 Test player created successfully!");
    console.log("📧 Email: test@urbanhustle.com");
    console.log("🔑 Password: test123456");
    console.log("🆔 User ID:", authData.user.id);
    console.log("👤 Player ID:", playerData.id);
  } catch (error) {
    console.error("❌ Error creating test player:", error);
  }
}

createTestPlayer();
