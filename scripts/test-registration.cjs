const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRegistration() {
  console.log("🧪 Testando registro de usuário...\n");

  // Gerar email único para teste
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = "TestPassword123!";

  console.log(`📧 Email de teste: ${testEmail}`);
  console.log(`🔑 Senha: ${testPassword}\n`);

  try {
    console.log("🔍 Tentando registrar usuário...");
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.log(`❌ Erro no registro: ${error.message}`);
      console.log(`📋 Código: ${error.code}`);

      if (
        error.message.includes("rate limit") ||
        error.message.includes("too many requests")
      ) {
        console.log("\n💡 PROBLEMA: Rate limit ativo!");
        console.log("🔧 SOLUÇÃO: Desabilite a confirmação de email");
        console.log("   1. Vá para Authentication > Configuration");
        console.log(
          '   2. Procure por "Email confirmations" ou "General user signup"'
        );
        console.log("   3. Desabilite a confirmação de email");
        console.log("   4. Salve as configurações");
      } else if (error.message.includes("email")) {
        console.log("\n💡 PROBLEMA: Configuração de email");
        console.log(
          "🔧 SOLUÇÃO: Verifique as configurações de email no Supabase"
        );
      }
    } else {
      console.log("✅ Registro bem-sucedido!");
      console.log(`👤 Usuário: ${data.user?.email}`);
      console.log(`🆔 ID: ${data.user?.id}`);

      if (data.user?.email_confirmed_at) {
        console.log("✅ Email confirmado automaticamente");
      } else {
        console.log("📧 Email precisa ser confirmado");
      }
    }
  } catch (err) {
    console.log(`❌ Erro: ${err.message}`);
  }

  console.log("\n✅ Teste concluído!");
}

testRegistration().catch(console.error);
