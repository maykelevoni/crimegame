const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("❌ Variáveis de ambiente não encontradas");
  console.log(
    "📝 Certifique-se de que VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixFirstRobbery() {
  try {
    console.log("🔧 Alterando primeiro roubo para min_level = 0...");

    // Primeiro, vamos ver quais roubos existem
    const { data: robberies, error: selectError } = await supabase
      .from("robberies")
      .select("id, name, min_level")
      .order("min_level", { ascending: true })
      .limit(5);

    if (selectError) {
      console.log("❌ Erro ao buscar roubos:", selectError.message);
      return;
    }

    console.log("📋 Roubos encontrados:");
    robberies.forEach((robbery) => {
      console.log(`  - ${robbery.name}: min_level = ${robbery.min_level}`);
    });

    // Alterar o primeiro roubo (menor min_level) para 0
    if (robberies.length > 0) {
      const firstRobbery = robberies[0];

      const { error: updateError } = await supabase
        .from("robberies")
        .update({ min_level: 0 })
        .eq("id", firstRobbery.id);

      if (updateError) {
        console.log("❌ Erro ao atualizar roubo:", updateError.message);
        return;
      }

      console.log(
        `✅ Roubo "${firstRobbery.name}" alterado para min_level = 0`
      );
    } else {
      console.log("❌ Nenhum roubo encontrado na tabela");
    }

    // Verificar resultado
    const { data: updatedRobberies, error: finalError } = await supabase
      .from("robberies")
      .select("id, name, min_level")
      .order("min_level", { ascending: true })
      .limit(5);

    if (finalError) {
      console.log("❌ Erro ao verificar resultado:", finalError.message);
      return;
    }

    console.log("\n📋 Roubos após atualização:");
    updatedRobberies.forEach((robbery) => {
      console.log(`  - ${robbery.name}: min_level = ${robbery.min_level}`);
    });

    console.log(
      "\n✅ Script concluído! Agora o primeiro roubo pode ser feito com 0 de reputação."
    );
  } catch (error) {
    console.log("❌ Erro inesperado:", error.message);
  }
}

fixFirstRobbery();
