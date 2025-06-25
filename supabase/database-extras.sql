-- Estruturas adicionais do banco - 2025-06-25T22:35:21.419Z
-- Políticas RLS, Índices, Triggers, etc.

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Tabela: business_types
-- ✅ Tabela acessível
-- ALTER TABLE business_types ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON business_types FOR SELECT USING (true);

-- Tabela: casino_games
-- ✅ Tabela acessível
-- ALTER TABLE casino_games ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON casino_games FOR SELECT USING (true);

-- Tabela: game_sessions
-- ✅ Tabela acessível
-- ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON game_sessions FOR SELECT USING (true);

-- Tabela: inventory
-- ✅ Tabela acessível
-- ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON inventory FOR SELECT USING (true);

-- Tabela: items
-- ✅ Tabela acessível
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON items FOR SELECT USING (true);

-- Tabela: nightlife_characters
-- ✅ Tabela acessível
-- ALTER TABLE nightlife_characters ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON nightlife_characters FOR SELECT USING (true);

-- Tabela: nightlife_venues
-- ✅ Tabela acessível
-- ALTER TABLE nightlife_venues ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON nightlife_venues FOR SELECT USING (true);

-- Tabela: players
-- ✅ Tabela acessível
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON players FOR SELECT USING (true);

-- Tabela: prisoners
-- ✅ Tabela acessível
-- ALTER TABLE prisoners ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON prisoners FOR SELECT USING (true);

-- Tabela: robberies
-- ✅ Tabela acessível
-- ALTER TABLE robberies ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON robberies FOR SELECT USING (true);

-- Tabela: treatments
-- ✅ Tabela acessível
-- ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON treatments FOR SELECT USING (true);

-- ========================================
-- ÍNDICES RECOMENDADOS
-- ========================================

-- Índices para business_types
-- CREATE INDEX IF NOT EXISTS idx_business_types_id ON business_types(id);
-- CREATE INDEX IF NOT EXISTS idx_business_types_created_at ON business_types(created_at);

-- Índices para casino_games
-- CREATE INDEX IF NOT EXISTS idx_casino_games_id ON casino_games(id);
-- CREATE INDEX IF NOT EXISTS idx_casino_games_created_at ON casino_games(created_at);

-- Índices para game_sessions
-- CREATE INDEX IF NOT EXISTS idx_game_sessions_id ON game_sessions(id);
-- CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);

-- Índices para inventory
-- CREATE INDEX IF NOT EXISTS idx_inventory_id ON inventory(id);
-- CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory(created_at);

-- Índices para items
-- CREATE INDEX IF NOT EXISTS idx_items_id ON items(id);
-- CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);

-- Índices para nightlife_characters
-- CREATE INDEX IF NOT EXISTS idx_nightlife_characters_id ON nightlife_characters(id);
-- CREATE INDEX IF NOT EXISTS idx_nightlife_characters_created_at ON nightlife_characters(created_at);

-- Índices para nightlife_venues
-- CREATE INDEX IF NOT EXISTS idx_nightlife_venues_id ON nightlife_venues(id);
-- CREATE INDEX IF NOT EXISTS idx_nightlife_venues_created_at ON nightlife_venues(created_at);

-- Índices para players
-- CREATE INDEX IF NOT EXISTS idx_players_id ON players(id);
-- CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);

-- Índices para prisoners
-- CREATE INDEX IF NOT EXISTS idx_prisoners_id ON prisoners(id);
-- CREATE INDEX IF NOT EXISTS idx_prisoners_created_at ON prisoners(created_at);

-- Índices para robberies
-- CREATE INDEX IF NOT EXISTS idx_robberies_id ON robberies(id);
-- CREATE INDEX IF NOT EXISTS idx_robberies_created_at ON robberies(created_at);

-- Índices para treatments
-- CREATE INDEX IF NOT EXISTS idx_treatments_id ON treatments(id);
-- CREATE INDEX IF NOT EXISTS idx_treatments_created_at ON treatments(created_at);

-- ========================================
-- SEQUÊNCIAS (se necessário)
-- ========================================

-- Sequência para business_types
-- CREATE SEQUENCE IF NOT EXISTS business_types_id_seq;
-- ALTER TABLE business_types ALTER COLUMN id SET DEFAULT nextval('business_types_id_seq');

-- Sequência para casino_games
-- CREATE SEQUENCE IF NOT EXISTS casino_games_id_seq;
-- ALTER TABLE casino_games ALTER COLUMN id SET DEFAULT nextval('casino_games_id_seq');

-- Sequência para game_sessions
-- CREATE SEQUENCE IF NOT EXISTS game_sessions_id_seq;
-- ALTER TABLE game_sessions ALTER COLUMN id SET DEFAULT nextval('game_sessions_id_seq');

-- Sequência para inventory
-- CREATE SEQUENCE IF NOT EXISTS inventory_id_seq;
-- ALTER TABLE inventory ALTER COLUMN id SET DEFAULT nextval('inventory_id_seq');

-- Sequência para items
-- CREATE SEQUENCE IF NOT EXISTS items_id_seq;
-- ALTER TABLE items ALTER COLUMN id SET DEFAULT nextval('items_id_seq');

-- Sequência para nightlife_characters
-- CREATE SEQUENCE IF NOT EXISTS nightlife_characters_id_seq;
-- ALTER TABLE nightlife_characters ALTER COLUMN id SET DEFAULT nextval('nightlife_characters_id_seq');

-- Sequência para nightlife_venues
-- CREATE SEQUENCE IF NOT EXISTS nightlife_venues_id_seq;
-- ALTER TABLE nightlife_venues ALTER COLUMN id SET DEFAULT nextval('nightlife_venues_id_seq');

-- Sequência para players
-- CREATE SEQUENCE IF NOT EXISTS players_id_seq;
-- ALTER TABLE players ALTER COLUMN id SET DEFAULT nextval('players_id_seq');

-- Sequência para prisoners
-- CREATE SEQUENCE IF NOT EXISTS prisoners_id_seq;
-- ALTER TABLE prisoners ALTER COLUMN id SET DEFAULT nextval('prisoners_id_seq');

-- Sequência para robberies
-- CREATE SEQUENCE IF NOT EXISTS robberies_id_seq;
-- ALTER TABLE robberies ALTER COLUMN id SET DEFAULT nextval('robberies_id_seq');

-- Sequência para treatments
-- CREATE SEQUENCE IF NOT EXISTS treatments_id_seq;
-- ALTER TABLE treatments ALTER COLUMN id SET DEFAULT nextval('treatments_id_seq');

