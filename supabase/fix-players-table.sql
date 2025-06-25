
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
      