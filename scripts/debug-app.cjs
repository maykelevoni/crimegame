const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias"
  );
  process.exit(1);
}

// Simular exatamente o que o app faz
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugApp() {
  console.log("🔍 Debugando o que o app faz...");
  console.log("🔗 URL:", supabaseUrl);
  console.log("🔑 Key:", supabaseKey.substring(0, 20) + "...");

  try {
    // 1. Simular o que o useAuth faz
    console.log("\n1️⃣ Simulando useAuth...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ Erro ao verificar sessão:", sessionError.message);
      return;
    }

    if (!session) {
      console.log("⚠️  Nenhuma sessão ativa - fazendo login...");

      // Fazer login
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: "maykelevoni@gmail.com",
          password: "levoni08",
        });

      if (loginError) {
        console.error("❌ Erro no login:", loginError.message);
        return;
      }

      console.log("✅ Login realizado:", loginData.user.id);
    } else {
      console.log("✅ Sessão ativa:", session.user.id);
    }

    // 2. Simular o que o usePlayerData faz
    console.log("\n2️⃣ Simulando usePlayerData...");
    const user = session?.user || (await supabase.auth.getUser()).data.user;

    if (!user) {
      console.error("❌ Nenhum usuário encontrado");
      return;
    }

    console.log("👤 User ID:", user.id);

    // 3. Simular a query exata que o app faz
    console.log("\n3️⃣ Simulando query exata do app...");
    console.log("🔍 Query: SELECT * FROM players WHERE user_id = ?", user.id);

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("❌ ERRO NA QUERY:", error.message);
      console.error("📋 Código:", error.code);
      console.error("📋 Detalhes:", error.details);
      console.error("📋 Hint:", error.hint);

      // Verificar se é problema de coluna
      if (error.message.includes("user_id")) {
        console.log("\n🔧 PROBLEMA IDENTIFICADO: Coluna user_id não existe");
        console.log("💡 Execute no Supabase SQL Editor:");
        console.log(`
-- Verificar se a coluna existe
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'players' AND column_name = 'user_id';

-- Se não existir, adicionar:
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
        `);
      }

      // Verificar se é problema de RLS
      if (error.message.includes("row-level security")) {
        console.log("\n🔧 PROBLEMA IDENTIFICADO: RLS bloqueando");
        console.log("💡 Verifique as políticas RLS no Supabase Studio");
      }

      return;
    }

    console.log("✅ Query funcionou!");
    console.log("📋 Resultado:", data);

    // 4. Testar criação de player
    if (!data) {
      console.log("\n4️⃣ Testando criação de player...");
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert({
          name: "Debug Player",
          avatar_url: "https://example.com/avatar.png",
          user_id: user.id,
          level: 1,
          experience: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Erro ao criar player:", createError.message);
      } else {
        console.log("✅ Player criado:", newPlayer);

        // Limpar
        await supabase.from("players").delete().eq("id", newPlayer.id);
      }
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

debugApp()
  .then(() => {
    console.log("\n✅ Debug concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
