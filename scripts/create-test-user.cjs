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

async function createAndTestUser() {
  console.log("🧪 Criando usuário de teste e testando fluxo completo...");

  try {
    // 1. Criar usuário de teste
    console.log("\n1️⃣ Criando usuário de teste...");
    const testEmail = `testuser${Date.now()}@gmail.com`;
    const testPassword = "test123456";

    console.log("📧 Email:", testEmail);
    console.log("🔑 Senha:", testPassword);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: testEmail,
        password: testPassword,
      }
    );

    if (signUpError) {
      console.error("❌ Erro ao criar usuário:", signUpError.message);
      return;
    }

    console.log("✅ Usuário criado com sucesso");
    console.log("👤 User ID:", signUpData.user.id);

    // 2. Aguardar um pouco
    console.log("\n2️⃣ Aguardando 3 segundos...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Fazer login
    console.log("\n3️⃣ Fazendo login...");
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (loginError) {
      console.error("❌ Erro no login:", loginError.message);
      return;
    }

    console.log("✅ Login realizado com sucesso!");
    console.log("👤 User ID:", loginData.user.id);

    // 4. Verificar sessão
    console.log("\n4️⃣ Verificando sessão...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("❌ Sessão não foi estabelecida");
      return;
    }

    console.log("✅ Sessão ativa confirmada");
    console.log(
      "🔑 Access Token:",
      session.access_token.substring(0, 20) + "..."
    );

    // 5. Testar query do player
    console.log("\n5️⃣ Testando query do player...");
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", loginData.user.id)
      .single();

    if (playerError) {
      console.error("❌ Erro na query do player:", playerError.message);
      console.error("📋 Código:", playerError.code);
      console.error("📋 Detalhes:", playerError.details);
      console.error("📋 Hint:", playerError.hint);

      if (playerError.code === "PGRST116") {
        console.log("ℹ️  Nenhum player encontrado (isso é normal)");
      } else if (playerError.message.includes("user_id")) {
        console.log(
          "❌ PROBLEMA: Coluna user_id não existe ou não está acessível"
        );
        console.log("💡 Execute no Supabase SQL Editor:");
        console.log(`
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
        `);
      } else {
        console.log("❌ Outro tipo de erro - verifique as políticas RLS");
      }
    } else {
      console.log("✅ Player encontrado:", playerData);
    }

    // 6. Testar criação de player
    if (!playerData) {
      console.log("\n6️⃣ Criando player de teste...");
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert({
          name: "Test Player",
          avatar_url: "https://example.com/avatar.png",
          user_id: loginData.user.id,
          level: 1,
          experience: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Erro ao criar player:", createError.message);
        console.error("📋 Detalhes:", createError);
      } else {
        console.log("✅ Player criado com sucesso:", newPlayer);

        // Limpar o player de teste
        const { error: deleteError } = await supabase
          .from("players")
          .delete()
          .eq("id", newPlayer.id);

        if (deleteError) {
          console.log("⚠️  Erro ao limpar player:", deleteError.message);
        } else {
          console.log("🧹 Player de teste removido");
        }
      }
    }

    // 7. Fazer logout
    console.log("\n7️⃣ Fazendo logout...");
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      console.error("❌ Erro no logout:", logoutError.message);
    } else {
      console.log("✅ Logout realizado com sucesso");
    }

    console.log("\n📝 Credenciais para testar no app:");
    console.log("📧 Email:", testEmail);
    console.log("🔑 Senha:", testPassword);
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

createAndTestUser()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
