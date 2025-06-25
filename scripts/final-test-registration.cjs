const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalTestRegistration() {
  console.log("🎯 Teste final do registro - CrimeGame\n");
  console.log("📋 Configuração:");
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseServiceKey.substring(0, 20)}...`);

  try {
    // Teste completo do fluxo de registro
    console.log("\n🔍 Testando fluxo completo de registro...");

    const testEmail = `finaltest${Date.now()}@gmail.com`;
    const testPassword = "FinalTest123!";
    const testUsername = `FinalPlayer_${Date.now()}`;

    console.log(`📧 Email: ${testEmail}`);
    console.log(`🎮 Username: ${testUsername}`);

    // 1. Registrar usuário
    console.log("\n1️⃣ Registrando usuário...");
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

    // 2. Fazer login
    console.log("\n2️⃣ Fazendo login...");
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

    // 3. Criar player (simulando o que o app faz)
    console.log("\n3️⃣ Criando player...");
    const playerData = {
      username: testUsername,
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
      return;
    }

    console.log(`✅ Player criado com sucesso!`);
    console.log(`🎮 Username: ${playerInsert[0].username}`);
    console.log(`💰 Money: $${playerInsert[0].money}`);
    console.log(`❤️ Health: ${playerInsert[0].health}`);
    console.log(`⚡ Energy: ${playerInsert[0].energy}`);
    console.log(`⭐ Reputation: ${playerInsert[0].reputation}`);
    console.log(`🚨 Wanted Level: ${playerInsert[0].wanted_level}`);

    // 4. Verificar se o player foi criado corretamente
    console.log("\n4️⃣ Verificando player criado...");
    const { data: playerCheck, error: checkError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", loginData.user.id)
      .single();

    if (checkError) {
      console.log(`❌ Erro ao verificar player: ${checkError.message}`);
    } else {
      console.log(`✅ Player encontrado na base de dados!`);
      console.log(`🆔 Player ID: ${playerCheck.id}`);
      console.log(`📅 Criado em: ${playerCheck.created_at}`);
    }

    // 5. Testar logout
    console.log("\n5️⃣ Testando logout...");
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      console.log(`❌ Erro no logout: ${logoutError.message}`);
    } else {
      console.log(`✅ Logout bem-sucedido!`);
    }

    // 6. Limpar dados de teste
    console.log("\n6️⃣ Limpando dados de teste...");
    await supabase.from("players").delete().eq("id", playerInsert[0].id);
    console.log(`🧹 Player de teste removido`);

    console.log("\n🎉 TESTE FINAL CONCLUÍDO COM SUCESSO!");
    console.log("\n💡 O registro está funcionando perfeitamente!");
    console.log("🚀 Você pode agora usar o app normalmente.");
  } catch (err) {
    console.log(`❌ Erro geral: ${err.message}`);
  }
}

finalTestRegistration().catch(console.error);
