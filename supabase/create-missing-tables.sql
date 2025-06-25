-- Criar tabelas que estão faltando
-- Execute este SQL no Supabase SQL Editor

-- Tabela businesses (se não existir)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  income INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela inventory (se não existir)
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela crime_history (se não existir)
CREATE TABLE IF NOT EXISTS crime_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  crime_id VARCHAR(255) NOT NULL,
  reward INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela game_sessions (se não existir)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  active_view VARCHAR(100) DEFAULT 'home',
  active_section VARCHAR(100) DEFAULT 'home',
  dismissed_alerts TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_inventory_player_id ON inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_crime_history_player_id ON crime_history(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON game_sessions(player_id); 