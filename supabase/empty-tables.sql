-- Estrutura das tabelas vazias - 2025-06-25T22:40:51.299Z
-- Gerado automaticamente

-- Tabela: game_sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid NOT NULL,
  player_id uuid NOT NULL,
  game_type text NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  result jsonb,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: inventory
CREATE TABLE IF NOT EXISTS inventory (
  id uuid NOT NULL,
  player_id uuid NOT NULL,
  item_id uuid NOT NULL,
  quantity integer NOT NULL,
  equipped boolean NOT NULL,
  created_at timestamp with time zone NOT NULL
);

-- Tabela: players
CREATE TABLE IF NOT EXISTS players (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  username text NOT NULL,
  level integer NOT NULL,
  experience integer NOT NULL,
  money integer NOT NULL,
  health integer NOT NULL,
  energy integer NOT NULL,
  reputation integer NOT NULL,
  wanted_level integer NOT NULL,
  addiction integer NOT NULL,
  created_at timestamp with time zone NOT NULL
);

