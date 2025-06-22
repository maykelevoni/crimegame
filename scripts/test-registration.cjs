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

async function testRegistration() {
  console.log("🧪 Testando registro e criação de player...");

  try {
    // 1. Criar um usuário de teste
    const testEmail = `testuser${Date.now()}@gmail.com`;
    const testPassword = "testpassword123";

    console.log(`\n📧 Criando usuário de teste: ${testEmail}`);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.error("❌ Erro ao criar usuário:", authError.message);
      return;
    }

    console.log("✅ Usuário criado com sucesso");
    console.log("👤 User ID:", authData.user.id);

    // 2. Aguardar um pouco para garantir que o usuário foi criado
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Fazer login com o usuário criado
    console.log("\n🔐 Fazendo login...");
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (loginError) {
      console.error("❌ Erro no login:", loginError.message);
      return;
    }

    console.log("✅ Login realizado com sucesso");
    console.log("👤 User ID logado:", loginData.user.id);

    // 4. Verificar se já existe um player para este usuário
    console.log("\n🔍 Verificando se já existe player...");
    const { data: existingPlayer, error: checkError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", loginData.user.id)
      .single();

    if (checkError && checkError.code === "PGRST116") {
      console.log("📝 Nenhum player encontrado, criando novo player...");

      // 5. Criar novo player
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
        console.error("📋 Detalhes do erro:", createError);
        return;
      }

      console.log("✅ Player criado com sucesso!");
      console.log("🎮 Player ID:", newPlayer.id);
      console.log("📊 Dados do player:", {
        name: newPlayer.name,
        level: newPlayer.level,
        experience: newPlayer.experience,
        user_id: newPlayer.user_id,
      });
    } else if (checkError) {
      console.error(
        "❌ Erro ao verificar player existente:",
        checkError.message
      );
      return;
    } else {
      console.log("✅ Player já existe:", existingPlayer);
    }

    // 6. Testar busca do player
    console.log("\n🔍 Testando busca do player...");
    const { data: retrievedPlayer, error: retrieveError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", loginData.user.id)
      .single();

    if (retrieveError) {
      console.error("❌ Erro ao buscar player:", retrieveError.message);
    } else {
      console.log("✅ Player encontrado:", retrievedPlayer);
    }

    // 7. Limpar dados de teste
    console.log("\n🧹 Limpando dados de teste...");

    // Deletar player
    const { error: deletePlayerError } = await supabase
      .from("players")
      .delete()
      .eq("user_id", loginData.user.id);

    if (deletePlayerError) {
      console.log("⚠️  Erro ao deletar player:", deletePlayerError.message);
    } else {
      console.log("✅ Player deletado");
    }

    // Deletar usuário (isso pode não funcionar dependendo das configurações do Supabase)
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      loginData.user.id
    );

    if (deleteUserError) {
      console.log("⚠️  Não foi possível deletar usuário automaticamente");
      console.log("💡 Você pode deletar manualmente no Supabase Dashboard");
    } else {
      console.log("✅ Usuário deletado");
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

testRegistration()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
