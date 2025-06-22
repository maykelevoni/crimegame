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

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmUser() {
  console.log("🔧 Confirmando usuário de teste...");

  try {
    // 1. Fazer login com o usuário criado anteriormente
    console.log("\n1️⃣ Fazendo login...");
    const testEmail = "testuser1750630672370@gmail.com"; // Use o email do teste anterior
    const testPassword = "test123456";

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (loginError) {
      console.error("❌ Erro no login:", loginError.message);

      if (loginError.message.includes("Email not confirmed")) {
        console.log(
          "💡 O usuário precisa ser confirmado. Vá no Supabase Studio:"
        );
        console.log("1. Authentication > Users");
        console.log("2. Encontre o usuário:", testEmail);
        console.log('3. Clique em "Confirm user"');
        console.log(
          "4. Ou desabilite a confirmação de email em Authentication > Settings"
        );
      }
      return;
    }

    console.log("✅ Login realizado com sucesso!");
    console.log("👤 User ID:", loginData.user.id);

    // 2. Testar query do player
    console.log("\n2️⃣ Testando query do player...");
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", loginData.user.id)
      .single();

    if (playerError) {
      console.error("❌ Erro na query do player:", playerError.message);
      console.error("📋 Código:", playerError.code);

      if (playerError.message.includes("user_id")) {
        console.log("❌ PROBLEMA: Coluna user_id não existe");
        console.log("💡 Execute no Supabase SQL Editor:");
        console.log(`
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
        `);
      }
    } else {
      console.log("✅ Player encontrado:", playerData);
    }

    // 3. Fazer logout
    console.log("\n3️⃣ Fazendo logout...");
    await supabase.auth.signOut();
    console.log("✅ Logout realizado");
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

confirmUser()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
