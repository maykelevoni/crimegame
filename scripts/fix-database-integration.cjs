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

async function checkAndFixDatabase() {
  console.log("🔍 Verificando estrutura do banco de dados...");

  try {
    // 1. Verificar se a tabela players existe
    console.log("\n📋 Verificando tabela players...");
    const { data: tableInfo, error: tableError } = await supabase
      .from("players")
      .select("*")
      .limit(1);

    if (tableError) {
      console.error("❌ Erro ao acessar tabela players:", tableError.message);
      return;
    }

    console.log("✅ Tabela players existe e é acessível");

    // 2. Verificar estrutura da tabela (colunas)
    console.log("\n🔍 Verificando colunas da tabela players...");
    const { data: columns, error: columnsError } = await supabase.rpc(
      "get_table_columns",
      { table_name: "players" }
    );

    if (columnsError) {
      console.log(
        "⚠️  Não foi possível verificar colunas via RPC, tentando método alternativo..."
      );

      // Método alternativo: tentar inserir um registro temporário para ver os erros
      const { error: insertError } = await supabase.from("players").insert({
        name: "test_user",
        avatar_url: "test_avatar",
        user_id: "00000000-0000-0000-0000-000000000000",
      });

      if (insertError && insertError.message.includes("user_id")) {
        console.log("❌ Coluna user_id NÃO existe na tabela players");
        console.log("🔧 Tentando adicionar a coluna user_id...");

        // Tentar adicionar a coluna user_id
        const { error: alterError } = await supabase.rpc("execute_sql", {
          sql: `
              ALTER TABLE public.players 
              ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
              
              CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
            `,
        });

        if (alterError) {
          console.error(
            "❌ Erro ao adicionar coluna user_id:",
            alterError.message
          );
          console.log(
            "\n💡 Você precisa executar manualmente no Supabase SQL Editor:"
          );
          console.log(`
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
          `);
        } else {
          console.log("✅ Coluna user_id adicionada com sucesso!");
        }
      } else if (insertError) {
        console.log("⚠️  Outro erro na inserção:", insertError.message);
      } else {
        console.log("✅ Coluna user_id já existe");
      }
    } else {
      console.log("📋 Colunas encontradas:", columns);
      const hasUserId = columns.some((col) => col.column_name === "user_id");

      if (!hasUserId) {
        console.log("❌ Coluna user_id NÃO encontrada");
        console.log("🔧 Tentando adicionar a coluna user_id...");

        const { error: alterError } = await supabase.rpc("execute_sql", {
          sql: `
              ALTER TABLE public.players 
              ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
              
              CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
            `,
        });

        if (alterError) {
          console.error(
            "❌ Erro ao adicionar coluna user_id:",
            alterError.message
          );
          console.log(
            "\n💡 Você precisa executar manualmente no Supabase SQL Editor:"
          );
          console.log(`
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
          `);
        } else {
          console.log("✅ Coluna user_id adicionada com sucesso!");
        }
      } else {
        console.log("✅ Coluna user_id já existe");
      }
    }

    // 3. Verificar RLS policies
    console.log("\n🔒 Verificando RLS policies...");
    const { data: policies, error: policiesError } = await supabase.rpc(
      "get_table_policies",
      { table_name: "players" }
    );

    if (policiesError) {
      console.log("⚠️  Não foi possível verificar policies via RPC");
    } else {
      console.log("📋 Policies encontradas:", policies);
    }

    // 4. Testar inserção com user_id
    console.log("\n🧪 Testando inserção com user_id...");
    const testUserId = "00000000-0000-0000-0000-000000000000";
    const { data: testInsert, error: testInsertError } = await supabase
      .from("players")
      .insert({
        name: "test_player_fix",
        avatar_url: "test_avatar_fix",
        user_id: testUserId,
      })
      .select();

    if (testInsertError) {
      console.error("❌ Erro na inserção de teste:", testInsertError.message);
    } else {
      console.log("✅ Inserção de teste bem-sucedida:", testInsert);

      // Limpar o registro de teste
      const { error: deleteError } = await supabase
        .from("players")
        .delete()
        .eq("user_id", testUserId);

      if (deleteError) {
        console.log(
          "⚠️  Erro ao limpar registro de teste:",
          deleteError.message
        );
      } else {
        console.log("🧹 Registro de teste removido");
      }
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

checkAndFixDatabase()
  .then(() => {
    console.log("\n✅ Verificação concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  });
