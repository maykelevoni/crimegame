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

async function testSupabaseConnection() {
  console.log("🧪 Testando conexão e autenticação do Supabase...");
  console.log("🔗 URL:", supabaseUrl);
  console.log("🔑 Key:", supabaseKey.substring(0, 20) + "...");

  try {
    // 1. Testar conexão básica
    console.log("\n1️⃣ Testando conexão básica...");
    const { data: testData, error: testError } = await supabase
      .from("players")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("❌ Erro na conexão básica:", testError.message);
      console.error("📋 Detalhes:", testError);
      return;
    }

    console.log("✅ Conexão básica funcionando");

    // 2. Verificar se há usuário logado
    console.log("\n2️⃣ Verificando sessão atual...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ Erro ao verificar sessão:", sessionError.message);
      return;
    }

    if (!session) {
      console.log("⚠️  Nenhuma sessão ativa encontrada");
      console.log("💡 Você precisa estar logado no app para testar as queries");
      return;
    }

    console.log("✅ Sessão ativa encontrada");
    console.log("👤 User ID:", session.user.id);
    console.log("📧 Email:", session.user.email);

    // 3. Testar query com autenticação
    console.log("\n3️⃣ Testando query com autenticação...");
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (playerError) {
      console.error("❌ Erro na query do player:", playerError.message);
      console.error("📋 Código do erro:", playerError.code);
      console.error("📋 Detalhes completos:", playerError);

      // Se for erro de RLS, isso é esperado
      if (playerError.code === "PGRST116") {
        console.log(
          "ℹ️  Nenhum player encontrado (isso é normal se for a primeira vez)"
        );
      } else if (playerError.message.includes("user_id")) {
        console.log("❌ Problema com a coluna user_id - verifique o schema");
      } else {
        console.log("❌ Outro tipo de erro - verifique as políticas RLS");
      }
      return;
    }

    console.log("✅ Player encontrado:", playerData);

    // 4. Testar criação de player se não existir
    if (!playerData) {
      console.log("\n4️⃣ Criando player de teste...");
      const { data: newPlayer, error: createError } = await supabase
        .from("players")
        .insert({
          name: "Test Player",
          avatar_url: "https://example.com/avatar.png",
          user_id: session.user.id,
          level: 1,
          experience: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Erro ao criar player:", createError.message);
        console.error("📋 Detalhes:", createError);
        return;
      }

      console.log("✅ Player criado com sucesso:", newPlayer);

      // Limpar o player de teste
      const { error: deleteError } = await supabase
        .from("players")
        .delete()
        .eq("id", newPlayer.id);

      if (deleteError) {
        console.log("⚠️  Erro ao limpar player de teste:", deleteError.message);
      } else {
        console.log("🧹 Player de teste removido");
      }
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

testSupabaseConnection()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
