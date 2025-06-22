const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "❌ Variáveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias"
  );
  console.log("💡 Se não tiver a service role key, use a anon key");
  process.exit(1);
}

// Usar service role key para contornar RLS e confirmação
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testWithServiceKey() {
  console.log("🧪 Testando com service role key...");

  try {
    // 1. Criar usuário diretamente (sem confirmação)
    console.log("\n1️⃣ Criando usuário...");
    const testEmail = `testuser${Date.now()}@gmail.com`;
    const testPassword = "test123456";

    console.log("📧 Email:", testEmail);
    console.log("🔑 Senha:", testPassword);

    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true, // Confirmar email automaticamente
      });

    if (userError) {
      console.error("❌ Erro ao criar usuário:", userError.message);
      return;
    }

    console.log("✅ Usuário criado e confirmado:", userData.user.id);

    // 2. Testar query direta na tabela players
    console.log("\n2️⃣ Testando query direta na tabela players...");
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("*")
      .limit(5);

    if (playersError) {
      console.error("❌ Erro ao acessar tabela players:", playersError.message);
      console.error("📋 Código:", playersError.code);

      if (playersError.message.includes("user_id")) {
        console.log("❌ PROBLEMA: Coluna user_id não existe");
        console.log("💡 Execute no Supabase SQL Editor:");
        console.log(`
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
        `);
        return;
      }
    } else {
      console.log("✅ Tabela players acessível");
      console.log(
        "📋 Estrutura da tabela:",
        players.length > 0 ? Object.keys(players[0]) : "Tabela vazia"
      );
    }

    // 3. Criar player diretamente
    console.log("\n3️⃣ Criando player diretamente...");
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .insert({
        name: "Test Player",
        avatar_url: "https://example.com/avatar.png",
        user_id: userData.user.id,
        level: 1,
        experience: 0,
      })
      .select()
      .single();

    if (playerError) {
      console.error("❌ Erro ao criar player:", playerError.message);
      console.error("📋 Detalhes:", playerError);
    } else {
      console.log("✅ Player criado com sucesso:", playerData);

      // 4. Testar busca do player
      console.log("\n4️⃣ Testando busca do player...");
      const { data: foundPlayer, error: findError } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

      if (findError) {
        console.error("❌ Erro ao buscar player:", findError.message);
      } else {
        console.log("✅ Player encontrado:", foundPlayer);
      }

      // 5. Limpar dados de teste
      console.log("\n5️⃣ Limpando dados de teste...");
      const { error: deletePlayerError } = await supabase
        .from("players")
        .delete()
        .eq("id", playerData.id);

      if (deletePlayerError) {
        console.log("⚠️  Erro ao deletar player:", deletePlayerError.message);
      } else {
        console.log("🧹 Player removido");
      }
    }

    // 6. Deletar usuário de teste
    console.log("\n6️⃣ Deletando usuário de teste...");
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
      userData.user.id
    );

    if (deleteUserError) {
      console.log("⚠️  Erro ao deletar usuário:", deleteUserError.message);
    } else {
      console.log("🧹 Usuário removido");
    }

    console.log("\n📝 Credenciais para testar no app:");
    console.log("📧 Email:", testEmail);
    console.log("🔑 Senha:", testPassword);
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

testWithServiceKey()
  .then(() => {
    console.log("\n✅ Teste concluído!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
