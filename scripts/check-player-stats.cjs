const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mkqwnfofyttnhodafdqe.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcXduZm9meXR0bmhvZGFmZHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjQzNjMsImV4cCI6MjA2NjA0MDM2M30.5TQz23GkMKtbimGDzU79s6O-P4jz0tw8NT7uMmWu8O8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPlayerStats() {
  console.log("🔍 Verificando player_stats...\n");

  try {
    // 1. Fazer login
    console.log("1️⃣ Fazendo login...");
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "maykelevoni@gmail.com",
        password: "123456",
      });

    if (authError) {
      console.error("❌ Erro no login:", authError.message);
      return;
    }

    console.log("✅ Login realizado com sucesso!");
    console.log("👤 User ID:", authData.user.id);

    // 2. Verificar se a tabela player_stats existe
    console.log("\n2️⃣ Verificando se a tabela player_stats existe...");
    try {
      const { data: tables, error: tablesError } = await supabase
        .from("player_stats")
        .select("*")
        .limit(1);

      if (tablesError) {
        console.log(
          "❌ Tabela player_stats não existe ou não acessível:",
          tablesError.message
        );
        return;
      }

      console.log("✅ Tabela player_stats existe!");
    } catch (err) {
      console.log("❌ Erro ao verificar tabela player_stats:", err.message);
      return;
    }

    // 3. Buscar o player
    console.log("\n3️⃣ Buscando player...");
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    if (playerError) {
      console.error("❌ Erro ao buscar player:", playerError.message);
      return;
    }

    console.log("✅ Player encontrado:", {
      id: player.id,
      name: player.name,
      level: player.level,
      money: player.money,
    });

    // 4. Verificar se existem stats para este player
    console.log("\n4️⃣ Verificando stats do player...");
    const { data: stats, error: statsError } = await supabase
      .from("player_stats")
      .select("*")
      .eq("player_id", player.id)
      .single();

    if (statsError) {
      if (statsError.code === "PGRST116") {
        console.log("❌ Nenhum stats encontrado para este player");
        console.log("📝 Criando stats padrão...");

        const defaultStats = {
          player_id: player.id,
          health: 100,
          max_health: 100,
          energy: 100,
          max_energy: 100,
          addiction: 0,
          reputation: 0,
          money: 0,
          wanted_level: 0,
          is_imprisoned: false,
          is_hospitalized: false,
        };

        const { data: newStats, error: createError } = await supabase
          .from("player_stats")
          .insert(defaultStats)
          .select()
          .single();

        if (createError) {
          console.error("❌ Erro ao criar stats:", createError.message);
          return;
        }

        console.log("✅ Stats criados com sucesso:", newStats);
      } else {
        console.error("❌ Erro ao buscar stats:", statsError.message);
        return;
      }
    } else {
      console.log("✅ Stats encontrados:", stats);
    }

    // 5. Logout
    console.log("\n5️⃣ Fazendo logout...");
    await supabase.auth.signOut();
    console.log("✅ Logout realizado");
  } catch (error) {
    console.error("❌ Erro inesperado:", error.message);
  }
}

checkPlayerStats();
