const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDifferentEmail() {
  console.log("🧪 Testando registro com email diferente...\n");

  // Lista de emails para testar
  const testEmails = [
    `user${Date.now()}@gmail.com`,
    `test${Date.now()}@hotmail.com`,
    `player${Date.now()}@yahoo.com`,
    `game${Date.now()}@outlook.com`,
  ];

  const testPassword = "TestPassword123!";

  for (const email of testEmails) {
    console.log(`📧 Testando com: ${email}`);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: testPassword,
      });

      if (error) {
        console.log(`   ❌ Erro: ${error.message}`);

        if (error.message.includes("rate limit")) {
          console.log("   ⏳ Rate limit ativo - aguardando...");
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Esperar 5 segundos
          continue;
        }
      } else {
        console.log(`   ✅ Registro bem-sucedido!`);
        console.log(`   👤 Usuário: ${data.user?.email}`);
        console.log(`   🆔 ID: ${data.user?.id}`);

        if (data.user?.email_confirmed_at) {
          console.log("   ✅ Email confirmado automaticamente");
        } else {
          console.log("   📧 Email precisa ser confirmado");
        }

        // Testar inserção na tabela players
        console.log("   🎮 Testando inserção na tabela players...");
        try {
          const playerData = {
            user_id: data.user.id,
            username: `Player_${Date.now()}`,
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
            console.log(`   ❌ Erro na tabela players: ${playerError.message}`);
          } else {
            console.log(`   ✅ Player criado com sucesso!`);
            console.log(`   🎮 Username: ${playerInsert[0].username}`);

            // Limpar dados de teste
            await supabase
              .from("players")
              .delete()
              .eq("id", playerInsert[0].id);
            console.log("   🧹 Player de teste removido");
          }
        } catch (playerErr) {
          console.log(`   ❌ Erro ao criar player: ${playerErr.message}`);
        }

        console.log("\n🎉 SUCESSO! O registro está funcionando!");
        return; // Parar após o primeiro sucesso
      }
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
    }

    console.log(""); // Linha em branco entre tentativas
  }

  console.log(
    "\n❌ Nenhum email funcionou. Verifique as configurações do Supabase."
  );
}

testDifferentEmail().catch(console.error);
