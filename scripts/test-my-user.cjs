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

async function testMyUser() {
  console.log("🧪 Testando com usuário confirmado...");

  try {
    // 1. Verificar sessão inicial
    console.log("\n1️⃣ Verificando sessão inicial...");
    const {
      data: { session: initialSession },
    } = await supabase.auth.getSession();

    if (initialSession) {
      console.log("✅ Sessão já ativa:", initialSession.user.email);
      console.log("👤 User ID:", initialSession.user.id);
    } else {
      console.log("⚠️  Nenhuma sessão ativa");
    }

    // 2. Fazer login com o usuário confirmado
    console.log("\n2️⃣ Fazendo login...");
    const userEmail = "maykelevoni@gmail.com";
    const userPassword = "levoni08";

    console.log("�� Email:", userEmail);
    console.log("👤 User ID esperado:", "0ed18bce-8261-4270-80e1-0ba5102aa8d0");

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

    if (loginError) {
      console.error("❌ Erro no login:", loginError.message);
      console.log("💡 Verifique se a senha está correta");
      return;
    }

    console.log("✅ Login realizado com sucesso!");
    console.log("👤 User ID logado:", loginData.user.id);
    console.log("📧 Email logado:", loginData.user.email);

    // 3. Verificar se o User ID está correto
    if (loginData.user.id !== "0ed18bce-8261-4270-80e1-0ba5102aa8d0") {
      console.log("⚠️  User ID diferente do esperado");
    } else {
      console.log("✅ User ID correto!");
    }

    // 4. Verificar sessão após login
    console.log("\n3️⃣ Verificando sessão após login...");
    const {
      data: { session: newSession },
    } = await supabase.auth.getSession();

    if (newSession) {
      console.log("✅ Sessão ativa confirmada");
      console.log(
        "🔑 Access Token:",
        newSession.access_token.substring(0, 20) + "..."
      );
    } else {
      console.log("❌ Sessão não foi estabelecida");
      return;
    }

    // 5. Testar query do player
    console.log("\n4️⃣ Testando query do player...");
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

    // 6. Testar criação de player se não existir
    if (!playerData) {
      console.log("\n5️⃣ Criando player...");
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert({
          name: "Mayke Player",
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
      }
    }

    // 7. Fazer logout
    console.log("\n6️⃣ Fazendo logout...");
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      console.error("❌ Erro no logout:", logoutError.message);
    } else {
      console.log("✅ Logout realizado com sucesso");
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

testMyUser()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
