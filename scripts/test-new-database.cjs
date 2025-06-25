const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseServiceKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testNewDatabase() {
  console.log("🧪 Testando conexão com o novo banco...\n");

  console.log("📋 Informações da conexão:");
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseServiceKey.substring(0, 20)}...`);

  // Teste 1: Verificar se consegue conectar
  console.log("\n🔍 Teste 1: Verificando conexão...");
  try {
    const { data, error } = await supabase.from("items").select("*").limit(1);

    if (error) {
      console.log(`   ❌ Erro de conexão: ${error.message}`);
      console.log(`   Código: ${error.code}`);
    } else {
      console.log(`   ✅ Conexão bem-sucedida!`);
      console.log(`   Dados encontrados: ${data ? data.length : 0} registros`);
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
  }

  // Teste 2: Tentar criar um usuário de teste (para verificar rate limit)
  console.log("\n🔍 Teste 2: Testando registro de usuário...");
  try {
    const { data, error } = await supabase.auth.signUp({
      email: "test@example.com",
      password: "testpassword123",
    });

    if (error) {
      console.log(`   ❌ Erro no registro: ${error.message}`);
      console.log(`   Código: ${error.code}`);

      if (error.message.includes("rate limit")) {
        console.log(
          "\n💡 SOLUÇÃO: Desabilite a confirmação de email no Supabase Dashboard"
        );
        console.log("   1. Vá para Authentication > Settings");
        console.log('   2. Desabilite "Enable email confirmations"');
        console.log("   3. Salve as configurações");
      }
    } else {
      console.log(`   ✅ Registro bem-sucedido!`);
      console.log(`   Usuário: ${data.user?.email}`);
    }
  } catch (err) {
    console.log(`   ❌ Erro: ${err.message}`);
  }

  console.log("\n✅ Teste concluído!");
}

testNewDatabase().catch(console.error);
