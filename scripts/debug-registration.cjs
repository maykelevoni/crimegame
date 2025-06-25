const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugRegistration() {
  console.log("🔍 Debug completo do registro...\n");

  console.log("📋 Configuração atual:");
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseServiceKey.substring(0, 20)}...`);

  // Teste 1: Verificar conexão básica
  console.log("\n🔍 Teste 1: Verificando conexão básica...");
  try {
    const { data, error } = await supabase.from("items").select("*").limit(1);

    if (error) {
      console.log(`   ❌ Erro de conexão: ${error.message}`);
      return;
    } else {
      console.log(
        `   ✅ Conexão OK - ${data ? data.length : 0} itens encontrados`
      );
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
    return;
  }

  // Teste 2: Verificar se usuário está logado
  console.log("\n🔍 Teste 2: Verificando usuário atual...");
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log(`   ❌ Erro ao verificar usuário: ${error.message}`);
    } else if (user) {
      console.log(`   ✅ Usuário logado: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
    } else {
      console.log(`   📝 Nenhum usuário logado`);
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
  }

  // Teste 3: Tentar registro com email real
  console.log("\n🔍 Teste 3: Tentando registro...");
  const testEmail = `debug${Date.now()}@gmail.com`;
  const testPassword = "DebugPassword123!";

  console.log(`   📧 Email: ${testEmail}`);
  console.log(`   🔑 Senha: ${testPassword}`);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.log(`   ❌ Erro no registro: ${error.message}`);
      console.log(`   📋 Código: ${error.code}`);

      // Sugestões baseadas no erro
      if (error.message.includes("rate limit")) {
        console.log("\n💡 SUGESTÃO: Rate limit ativo");
        console.log("   - Aguarde alguns minutos");
        console.log("   - Use um email diferente");
      } else if (error.message.includes("password")) {
        console.log("\n💡 SUGESTÃO: Problema com senha");
        console.log("   - Use senha mais forte (mínimo 6 caracteres)");
      } else if (error.message.includes("email")) {
        console.log("\n💡 SUGESTÃO: Problema com email");
        console.log("   - Use email real (Gmail, Hotmail, etc.)");
        console.log("   - Evite emails de teste (@example.com)");
      }
    } else {
      console.log(`   ✅ Registro bem-sucedido!`);
      console.log(`   👤 Usuário: ${data.user?.email}`);
      console.log(`   🆔 ID: ${data.user?.id}`);

      if (data.user?.email_confirmed_at) {
        console.log(`   ✅ Email confirmado automaticamente`);
      } else {
        console.log(`   📧 Email precisa ser confirmado`);
      }

      // Teste 4: Tentar login com o usuário criado
      console.log("\n🔍 Teste 4: Testando login...");
      try {
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

        if (loginError) {
          console.log(`   ❌ Erro no login: ${loginError.message}`);
        } else {
          console.log(`   ✅ Login bem-sucedido!`);
          console.log(`   👤 Usuário logado: ${loginData.user?.email}`);

          // Teste 5: Tentar criar player
          console.log("\n🔍 Teste 5: Testando criação de player...");
          try {
            const playerData = {
              user_id: loginData.user.id,
              username: `DebugPlayer_${Date.now()}`,
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
              console.log(`   ❌ Erro ao criar player: ${playerError.message}`);
              console.log(`   📋 Código: ${playerError.code}`);
            } else {
              console.log(`   ✅ Player criado com sucesso!`);
              console.log(`   🎮 Username: ${playerInsert[0].username}`);

              // Limpar dados de teste
              await supabase
                .from("players")
                .delete()
                .eq("id", playerInsert[0].id);
              console.log(`   🧹 Player de teste removido`);
            }
          } catch (playerErr) {
            console.log(`   ❌ Erro ao criar player: ${playerErr.message}`);
          }
        }
      } catch (loginErr) {
        console.log(`   ❌ Erro no login: ${loginErr.message}`);
      }
    }
  } catch (err) {
    console.log(`   ❌ Erro geral: ${err.message}`);
  }

  console.log("\n✅ Debug concluído!");
  console.log("\n💡 PRÓXIMOS PASSOS:");
  console.log("1. Se o registro funcionou, o problema pode estar no app");
  console.log("2. Se não funcionou, verifique as configurações do Supabase");
  console.log("3. Teste com um email real (Gmail, Hotmail, etc.)");
}

debugRegistration().catch(console.error);
