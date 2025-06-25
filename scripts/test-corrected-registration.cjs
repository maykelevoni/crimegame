const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCorrectedRegistration() {
  console.log("🔍 Testando registro corrigido...\n");

  try {
    // Teste 1: Registrar usuário
    console.log("🔍 Teste 1: Registrando usuário...");
    const testEmail = `test${Date.now()}@gmail.com`;
    const testPassword = "TestPassword123!";

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.log(`❌ Erro no registro: ${authError.message}`);
      return;
    }

    console.log(`✅ Usuário registrado: ${authData.user?.email}`);
    console.log(`🆔 ID: ${authData.user?.id}`);

    // Teste 2: Fazer login
    console.log("\n🔍 Teste 2: Fazendo login...");
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (loginError) {
      console.log(`❌ Erro no login: ${loginError.message}`);
      return;
    }

    console.log(`✅ Login bem-sucedido: ${loginData.user?.email}`);

    // Teste 3: Criar player com dados corrigidos
    console.log("\n🔍 Teste 3: Criando player...");
    const playerData = {
      username: `TestPlayer_${Date.now()}`,
      user_id: loginData.user.id,
      level: 1,
      experience: 0,
      money: 1000,
      health: 100,
      energy: 100,
      reputation: 0,
      wanted_level: 0,
      addiction: 0,
    };

    const { data: playerInsert, error: playerError } = await supabase
      .from("players")
      .insert(playerData)
      .select();

    if (playerError) {
      console.log(`❌ Erro ao criar player: ${playerError.message}`);
      console.log(`📋 Código: ${playerError.code}`);
      console.log(`📋 Detalhes: ${playerError.details}`);
    } else {
      console.log(`✅ Player criado com sucesso!`);
      console.log(`🎮 Username: ${playerInsert[0].username}`);
      console.log(`💰 Money: ${playerInsert[0].money}`);
      console.log(`❤️ Health: ${playerInsert[0].health}`);

      // Limpar dados de teste
      await supabase.from("players").delete().eq("id", playerInsert[0].id);
      console.log(`🧹 Player de teste removido`);
    }

    // Teste 4: Limpar usuário de teste
    console.log("\n🔍 Teste 4: Limpando usuário de teste...");
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      loginData.user.id
    );
    if (deleteError) {
      console.log(
        `⚠️ Não foi possível deletar usuário de teste: ${deleteError.message}`
      );
    } else {
      console.log(`🧹 Usuário de teste removido`);
    }
  } catch (err) {
    console.log(`❌ Erro geral: ${err.message}`);
  }
}

testCorrectedRegistration().catch(console.error);
