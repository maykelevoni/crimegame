-- Adicionar colunas que faltam na tabela players
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE players 
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
ADD COLUMN IF NOT EXISTS max_health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS is_imprisoned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_hospitalized BOOLEAN DEFAULT FALSE; 