const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixPlayersTable() {
  console.log("🔍 Verificando e corrigindo tabela players...\n");

  try {
    // Primeiro, vamos ver se conseguimos acessar a tabela
    const { data, error } = await supabase.from("players").select("*").limit(1);

    if (error) {
      console.log(`❌ Erro ao acessar tabela players: ${error.message}`);
      console.log(
        `📋 Isso pode indicar que a tabela não existe ou tem problemas de permissão`
      );
      return;
    }

    console.log("✅ Tabela players acessível!");

    if (data && data.length > 0) {
      console.log("📋 Colunas existentes:");
      const columns = Object.keys(data[0]);
      columns.forEach((col) => {
        console.log(`   - ${col}: ${typeof data[0][col]}`);
      });
    } else {
      console.log(
        "📋 Tabela está vazia, vamos tentar inserir um registro básico"
      );
    }

    // Vamos tentar inserir com apenas os campos básicos que provavelmente existem
    console.log("\n🔍 Tentando inserção com campos básicos...");
    const basicPlayer = {
      user_id: "test-user-id-" + Date.now(),
      level: 1,
      experience: 0,
      money: 1000,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("players")
      .insert(basicPlayer)
      .select();

    if (insertError) {
      console.log(`❌ Erro na inserção básica: ${insertError.message}`);
      console.log(`📋 Código: ${insertError.code}`);

      // Se a tabela não tem as colunas necessárias, vamos criar um SQL para corrigir
      console.log("\n🔧 Criando script SQL para corrigir a tabela...");

      const sqlFix = `
-- Script para corrigir a tabela players
-- Execute este SQL no Supabase SQL Editor

-- Adicionar colunas que estão faltando
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS addiction INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_imprisoned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_hospitalized BOOLEAN DEFAULT FALSE;

-- Atualizar valores padrão para registros existentes
UPDATE players 
SET 
  name = COALESCE(name, 'Player'),
  avatar_url = COALESCE(avatar_url, 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'),
  health = COALESCE(health, 100),
  max_health = COALESCE(max_health, 100),
  energy = COALESCE(energy, 100),
  max_energy = COALESCE(max_energy, 100),
  addiction = COALESCE(addiction, 0),
  reputation = COALESCE(reputation, 0),
  wanted_level = COALESCE(wanted_level, 0),
  is_imprisoned = COALESCE(is_imprisoned, FALSE),
  is_hospitalized = COALESCE(is_hospitalized, FALSE)
WHERE name IS NULL;
      `;

      console.log("📋 SQL para corrigir a tabela:");
      console.log(sqlFix);

      // Salvar o SQL em um arquivo
      const fs = require("fs");
      fs.writeFileSync("supabase/fix-players-table.sql", sqlFix);
      console.log("💾 SQL salvo em: supabase/fix-players-table.sql");
    } else {
      console.log("✅ Inserção básica bem-sucedida!");
      console.log("📋 Player criado:", insertData[0]);

      // Limpar o registro de teste
      await supabase.from("players").delete().eq("id", insertData[0].id);
      console.log("🧹 Registro de teste removido");
    }
  } catch (err) {
    console.log(`❌ Erro geral: ${err.message}`);
  }
}

fixPlayersTable().catch(console.error);
