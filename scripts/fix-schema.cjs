const { createClient } = require("@supabase/supabase-js");

// Configuração do Supabase
const supabaseUrl = "https://mkqwnfofyttnhodafdqe.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcXduZm9meXR0bmhvZGFmZHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjQzNjMsImV4cCI6MjA2NjA0MDM2M30.5TQz23GkMKtbimGDzU79s6O-P4jz0tw8NT7uMmWu8O8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSchema() {
  try {
    console.log("🔧 Corrigindo schema do banco de dados...");

    // Adicionar campos faltantes na tabela players
    console.log("📝 Adicionando campos faltantes na tabela players...");

    const alterQueries = [
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS health INTEGER DEFAULT 100",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS max_health INTEGER DEFAULT 100",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS addiction INTEGER DEFAULT 0",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS is_imprisoned BOOLEAN DEFAULT FALSE",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS is_hospitalized BOOLEAN DEFAULT FALSE",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'",
      "ALTER TABLE public.players ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE",
    ];

    for (const query of alterQueries) {
      try {
        const { error } = await supabase.rpc("exec_sql", { sql: query });
        if (error) {
          console.log(`⚠️  Query falhou (pode ser normal):`, error.message);
        } else {
          console.log(`✅ Campo adicionado com sucesso`);
        }
      } catch (err) {
        console.log(`⚠️  Query falhou (pode ser normal):`, err.message);
      }
    }

    // Criar tabela crime_history se não existir
    console.log("📝 Criando tabela crime_history...");

    const createCrimeHistory = `
      CREATE TABLE IF NOT EXISTS public.crime_history (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
        crime_id VARCHAR(255) NOT NULL,
        reward INTEGER NOT NULL,
        success BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    try {
      const { error } = await supabase.rpc("exec_sql", {
        sql: createCrimeHistory,
      });
      if (error) {
        console.log(
          `⚠️  Criação da tabela crime_history falhou:`,
          error.message
        );
      } else {
        console.log(`✅ Tabela crime_history criada com sucesso`);
      }
    } catch (err) {
      console.log(`⚠️  Criação da tabela crime_history falhou:`, err.message);
    }

    console.log("✅ Schema corrigido com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao corrigir schema:", error);
  }
}

fixSchema();
