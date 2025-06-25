-- Estrutura inferida do banco de dados - 2025-06-25T22:28:12.090Z
-- Gerado automaticamente a partir dos dados

-- Tabela: business_types
CREATE TABLE IF NOT EXISTS business_types (
  id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  base_price integer NOT NULL,
  base_income integer NOT NULL,
  max_level integer NOT NULL,
  upgrade_cost_multiplier integer NOT NULL,
  income_multiplier numeric NOT NULL,
  risk_level integer NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: casino_games
CREATE TABLE IF NOT EXISTS casino_games (
  id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  min_bet integer NOT NULL,
  max_bet integer NOT NULL,
  house_edge numeric NOT NULL,
  payout_multiplier integer NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: items
CREATE TABLE IF NOT EXISTS items (
  id uuid NOT NULL,
  name text NOT NULL,
  image text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  bonus jsonb NOT NULL,
  rarity text NOT NULL,
  price integer NOT NULL,
  stackable boolean NOT NULL,
  category text NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: nightlife_characters
CREATE TABLE IF NOT EXISTS nightlife_characters (
  id uuid NOT NULL,
  venue_id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price integer NOT NULL,
  energy_cost integer NOT NULL,
  effects jsonb NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: nightlife_venues
CREATE TABLE IF NOT EXISTS nightlife_venues (
  id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  energy_cost integer NOT NULL,
  money_cost integer NOT NULL,
  health_effect integer NOT NULL,
  energy_effect integer NOT NULL,
  addiction_effect integer NOT NULL,
  reputation_effect integer NOT NULL,
  min_level integer NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: prisoners
CREATE TABLE IF NOT EXISTS prisoners (
  id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  crime_type text NOT NULL,
  sentence_days integer NOT NULL,
  release_date timestamp with time zone NOT NULL,
  bribe_cost integer NOT NULL,
  escape_difficulty integer NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: robberies
CREATE TABLE IF NOT EXISTS robberies (
  id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  min_level integer NOT NULL,
  energy_cost integer NOT NULL,
  success_rate integer NOT NULL,
  base_reward integer NOT NULL,
  max_reward integer NOT NULL,
  risk_level integer NOT NULL,
  required_equipment jsonb NOT NULL,
  location text NOT NULL,
  available boolean NOT NULL,
  cooldown_minutes integer NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: treatments
CREATE TABLE IF NOT EXISTS treatments (
  id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  cost integer NOT NULL,
  health_restore integer NOT NULL,
  energy_restore integer NOT NULL,
  addiction_reduction integer NOT NULL,
  wanted_level_reduction integer NOT NULL,
  duration_minutes integer NOT NULL,
  cooldown_minutes integer NOT NULL,
  min_level integer NOT NULL,
  available boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

