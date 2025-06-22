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

async function testLogin() {
  console.log("🧪 Testando login e sessão...");

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

    // 2. Tentar fazer login com um usuário existente
    console.log("\n2️⃣ Tentando login...");
    const testEmail = "test@example.com"; // Use um email que você já cadastrou
    const testPassword = "test123456";

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (loginError) {
      console.error("❌ Erro no login:", loginError.message);
      console.log("💡 Tente usar um email/senha que você já cadastrou no app");
      return;
    }

    console.log("✅ Login realizado com sucesso!");
    console.log("👤 User ID:", loginData.user.id);
    console.log("📧 Email:", loginData.user.email);

    // 3. Verificar sessão após login
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

    // 4. Testar query com sessão ativa
    console.log("\n4️⃣ Testando query com sessão ativa...");
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", loginData.user.id)
      .single();

    if (playerError) {
      console.error("❌ Erro na query do player:", playerError.message);
      console.error("📋 Código:", playerError.code);

      if (playerError.code === "PGRST116") {
        console.log("ℹ️  Nenhum player encontrado (isso é normal)");
      } else if (playerError.message.includes("user_id")) {
        console.log("❌ Problema com a coluna user_id");
      } else {
        console.log("❌ Outro tipo de erro");
      }
    } else {
      console.log("✅ Player encontrado:", playerData);
    }

    // 5. Fazer logout
    console.log("\n5️⃣ Fazendo logout...");
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

testLogin()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
