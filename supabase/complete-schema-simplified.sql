-- Schema simplificado sem tabelas de histórico
-- Foca apenas nos dados essenciais para o jogo

-- ========================================
-- TABELAS PRINCIPAIS (já existem)
-- ========================================

-- players (já existe - dados do jogador)
-- users (já existe - autenticação)
-- shop_items (já existe - itens da loja)
-- player_inventory (já existe - inventário)

-- ========================================
-- TABELAS DE SISTEMAS (sem histórico)
-- ========================================

-- Tabela de roubos disponíveis
CREATE TABLE IF NOT EXISTS public.robberies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('store', 'bank', 'jewelry', 'warehouse', 'mansion', 'casino')),
  min_level INTEGER DEFAULT 1,
  energy_cost INTEGER DEFAULT 10,
  success_rate INTEGER DEFAULT 50,
  base_reward INTEGER DEFAULT 100,
  max_reward INTEGER DEFAULT 1000,
  risk_level INTEGER DEFAULT 1,
  required_equipment TEXT[],
  location VARCHAR(255) NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  cooldown_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tipos de negócios
CREATE TABLE IF NOT EXISTS public.business_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'nightclub', 'convenience', 'weapon_factory', 'casino')),
  description TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  base_income INTEGER NOT NULL,
  max_level INTEGER DEFAULT 10,
  upgrade_cost_multiplier DECIMAL(3,2) DEFAULT 1.5,
  income_multiplier DECIMAL(3,2) DEFAULT 1.2,
  risk_level INTEGER DEFAULT 1,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de negócios dos jogadores
CREATE TABLE IF NOT EXISTS public.player_businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  business_type_id UUID REFERENCES public.business_types(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  income_per_hour INTEGER NOT NULL,
  last_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tratamentos do hospital
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('health', 'energy', 'addiction', 'wanted_level', 'plastic_surgery')),
  cost INTEGER NOT NULL,
  health_restore INTEGER DEFAULT 0,
  energy_restore INTEGER DEFAULT 0,
  addiction_reduction INTEGER DEFAULT 0,
  wanted_level_reduction INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  cooldown_minutes INTEGER DEFAULT 0,
  min_level INTEGER DEFAULT 1,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de jogos do casino
CREATE TABLE IF NOT EXISTS public.casino_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('slots', 'blackjack', 'roulette', 'poker', 'dice')),
  min_bet INTEGER DEFAULT 10,
  max_bet INTEGER DEFAULT 10000,
  house_edge DECIMAL(3,2) DEFAULT 0.05,
  payout_multiplier DECIMAL(3,2) DEFAULT 1.0,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de locais da vida noturna
CREATE TABLE IF NOT EXISTS public.nightlife_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bar', 'brothel', 'rave')),
  description TEXT NOT NULL,
  energy_cost INTEGER DEFAULT 5,
  money_cost INTEGER DEFAULT 50,
  health_effect INTEGER DEFAULT 0,
  energy_effect INTEGER DEFAULT 0,
  addiction_effect INTEGER DEFAULT 0,
  reputation_effect INTEGER DEFAULT 0,
  min_level INTEGER DEFAULT 1,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de personagens da vida noturna
CREATE TABLE IF NOT EXISTS public.nightlife_characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.nightlife_venues(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('prostitute', 'dancer', 'bartender', 'dealer')),
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  effects JSONB DEFAULT '{}',
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas bancárias (simplificada)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  account_number VARCHAR(50) UNIQUE NOT NULL,
  balance INTEGER DEFAULT 0,
  account_type VARCHAR(50) DEFAULT 'checking',
  interest_rate DECIMAL(5,2) DEFAULT 0.01,
  last_interest_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de prisioneiros (simplificada)
CREATE TABLE IF NOT EXISTS public.prisoners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  crime_type VARCHAR(255) NOT NULL,
  sentence_days INTEGER NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  cell_number VARCHAR(10),
  behavior_score INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_player_businesses_player_id ON public.player_businesses(player_id);
CREATE INDEX IF NOT EXISTS idx_player_businesses_type_id ON public.player_businesses(business_type_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_player_id ON public.bank_accounts(player_id);
CREATE INDEX IF NOT EXISTS idx_prisoners_player_id ON public.prisoners(player_id);
CREATE INDEX IF NOT EXISTS idx_prisoners_release_date ON public.prisoners(release_date);

-- ========================================
-- POLÍTICAS RLS
-- ========================================

-- Políticas para tabelas de referência (só leitura)
ALTER TABLE public.robberies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casino_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nightlife_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nightlife_characters ENABLE ROW LEVEL SECURITY;

-- Políticas para dados dos jogadores
ALTER TABLE public.player_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prisoners ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura para tabelas de referência
CREATE POLICY "Allow read access to robberies" ON public.robberies FOR SELECT USING (true);
CREATE POLICY "Allow read access to business_types" ON public.business_types FOR SELECT USING (true);
CREATE POLICY "Allow read access to treatments" ON public.treatments FOR SELECT USING (true);
CREATE POLICY "Allow read access to casino_games" ON public.casino_games FOR SELECT USING (true);
CREATE POLICY "Allow read access to nightlife_venues" ON public.nightlife_venues FOR SELECT USING (true);
CREATE POLICY "Allow read access to nightlife_characters" ON public.nightlife_characters FOR SELECT USING (true);

-- Políticas para dados dos jogadores
CREATE POLICY "Players can manage their own businesses" ON public.player_businesses
  FOR ALL USING (auth.uid() = (SELECT user_id FROM players WHERE id = player_id));

CREATE POLICY "Players can manage their own bank accounts" ON public.bank_accounts
  FOR ALL USING (auth.uid() = (SELECT user_id FROM players WHERE id = player_id));

CREATE POLICY "Players can view their own prison records" ON public.prisoners
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM players WHERE id = player_id));

-- ========================================
-- FUNÇÕES ÚTEIS
-- ========================================

-- Função para calcular renda dos negócios
CREATE OR REPLACE FUNCTION calculate_business_income(business_id UUID)
RETURNS INTEGER AS $$
DECLARE
  income INTEGER;
BEGIN
  SELECT 
    pb.income_per_hour * 
    EXTRACT(EPOCH FROM (NOW() - pb.last_collected)) / 3600
  INTO income
  FROM player_businesses pb
  WHERE pb.id = business_id;
  
  RETURN COALESCE(income, 0);
END;
$$ LANGUAGE plpgsql;

-- Função para coletar renda dos negócios
CREATE OR REPLACE FUNCTION collect_business_income(business_id UUID)
RETURNS INTEGER AS $$
DECLARE
  income INTEGER;
BEGIN
  -- Calcular renda
  income := calculate_business_income(business_id);
  
  -- Atualizar último coletado
  UPDATE player_businesses 
  SET last_collected = NOW()
  WHERE id = business_id;
  
  -- Adicionar dinheiro ao jogador
  UPDATE players 
  SET money = money + income
  WHERE id = (SELECT player_id FROM player_businesses WHERE id = business_id);
  
  RETURN income;
END;
$$ LANGUAGE plpgsql;

-- Função para aplicar juros bancários
CREATE OR REPLACE FUNCTION apply_bank_interest(account_id UUID)
RETURNS INTEGER AS $$
DECLARE
  interest_amount INTEGER;
  current_balance INTEGER;
  interest_rate DECIMAL;
BEGIN
  -- Pegar dados da conta
  SELECT balance, interest_rate INTO current_balance, interest_rate
  FROM bank_accounts WHERE id = account_id;
  
  -- Calcular juros (diário)
  interest_amount := FLOOR(current_balance * interest_rate / 365);
  
  -- Aplicar juros
  UPDATE bank_accounts 
  SET 
    balance = balance + interest_amount,
    last_interest_date = NOW()
  WHERE id = account_id;
  
  RETURN interest_amount;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para verificar se jogador pode ser preso
CREATE OR REPLACE FUNCTION check_prison_eligibility()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se já está preso
  IF EXISTS (
    SELECT 1 FROM prisoners 
    WHERE player_id = NEW.player_id 
    AND release_date > NOW()
  ) THEN
    RAISE EXCEPTION 'Player is already in prison';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_prison_eligibility_trigger
  BEFORE INSERT ON public.prisoners
  FOR EACH ROW EXECUTE FUNCTION check_prison_eligibility();

-- ========================================
-- DADOS INICIAIS
-- ========================================

-- Roubos básicos
INSERT INTO public.robberies (name, description, type, min_level, energy_cost, success_rate, base_reward, max_reward, risk_level, required_equipment, location) VALUES
('Convenience Store', 'A small convenience store with basic security', 'store', 1, 10, 70, 50, 200, 1, ARRAY['lockpick'], 'Downtown'),
('Gas Station', 'A gas station with minimal security', 'store', 2, 15, 65, 75, 300, 1, ARRAY['lockpick'], 'Suburbs'),
('Jewelry Store', 'A jewelry store with better security', 'jewelry', 5, 25, 50, 200, 800, 2, ARRAY['lockpick', 'crowbar'], 'Mall District'),
('Small Bank', 'A local bank branch', 'bank', 10, 40, 40, 500, 2000, 3, ARRAY['lockpick', 'crowbar', 'hacking_tool'], 'Financial District'),
('Warehouse', 'A warehouse with valuable goods', 'warehouse', 15, 50, 35, 800, 3000, 3, ARRAY['crowbar', 'hacking_tool'], 'Industrial Zone'),
('Mansion', 'A wealthy person''s mansion', 'mansion', 20, 60, 30, 1200, 5000, 4, ARRAY['lockpick', 'crowbar', 'hacking_tool'], 'Uptown'),
('Casino', 'The biggest casino in town', 'casino', 25, 80, 25, 2000, 10000, 5, ARRAY['lockpick', 'crowbar', 'hacking_tool', 'explosives'], 'Strip');

-- Tipos de negócios
INSERT INTO public.business_types (name, type, description, base_price, base_income, max_level, upgrade_cost_multiplier, income_multiplier, risk_level) VALUES
('Small Restaurant', 'restaurant', 'A small restaurant serving local cuisine', 5000, 50, 10, 1.5, 1.2, 1),
('Nightclub', 'nightclub', 'A popular nightclub with high profits', 15000, 150, 10, 1.8, 1.3, 2),
('Convenience Store', 'convenience', 'A small convenience store', 3000, 30, 10, 1.4, 1.1, 1),
('Weapon Factory', 'weapon_factory', 'A factory producing illegal weapons', 50000, 500, 10, 2.0, 1.5, 5),
('Casino', 'casino', 'A small casino with gambling tables', 100000, 1000, 10, 2.5, 1.8, 4);

-- Tratamentos do hospital
INSERT INTO public.treatments (name, description, type, cost, health_restore, energy_restore, addiction_reduction, wanted_level_reduction, duration_minutes, cooldown_minutes, min_level) VALUES
('Basic Health Care', 'Basic medical treatment', 'health', 100, 50, 0, 0, 0, 0, 0, 1),
('Energy Drink', 'Restore energy quickly', 'energy', 50, 0, 30, 0, 0, 0, 0, 1),
('Detox Treatment', 'Reduce addiction levels', 'addiction', 200, 0, 0, 20, 0, 0, 60, 1),
('Bribe Police', 'Reduce wanted level', 'wanted_level', 500, 0, 0, 0, 1, 0, 0, 1),
('Plastic Surgery', 'Change your appearance', 'plastic_surgery', 1000, 0, 0, 0, 0, 0, 1440, 5);

-- Jogos do casino
INSERT INTO public.casino_games (name, description, type, min_bet, max_bet, house_edge, payout_multiplier) VALUES
('Slot Machine', 'Classic slot machine', 'slots', 10, 1000, 0.05, 1.0),
('Blackjack', 'Beat the dealer to 21', 'blackjack', 50, 5000, 0.02, 1.5),
('Roulette', 'Bet on numbers and colors', 'roulette', 25, 2500, 0.027, 2.0),
('Poker', 'Texas Hold''em poker', 'poker', 100, 10000, 0.03, 3.0),
('Dice Game', 'Roll the dice', 'dice', 20, 2000, 0.04, 1.8);

-- Locais da vida noturna
INSERT INTO public.nightlife_venues (name, type, description, energy_cost, money_cost, health_effect, energy_effect, addiction_effect, reputation_effect, min_level) VALUES
('Local Bar', 'bar', 'A cozy local bar', 5, 30, 0, -5, 5, 0, 1),
('Strip Club', 'brothel', 'An adult entertainment venue', 10, 100, -5, -10, 10, 5, 3),
('Underground Rave', 'rave', 'An illegal rave party', 15, 150, -10, -15, 15, 10, 5);

-- Personagens da vida noturna
INSERT INTO public.nightlife_characters (venue_id, name, type, description, price, effects) VALUES
((SELECT id FROM nightlife_venues WHERE name = 'Local Bar' LIMIT 1), 'Bartender', 'bartender', 'Friendly bartender', 20, '{"energy": 5, "reputation": 1}'),
((SELECT id FROM nightlife_venues WHERE name = 'Strip Club' LIMIT 1), 'Dancer', 'dancer', 'Professional dancer', 100, '{"energy": -10, "addiction": 5, "reputation": 3}'),
((SELECT id FROM nightlife_venues WHERE name = 'Underground Rave' LIMIT 1), 'Drug Dealer', 'dealer', 'Illegal substances', 200, '{"energy": -20, "addiction": 15, "reputation": 5}');

-- ========================================
-- COMENTÁRIOS FINAIS
-- ========================================

-- Este schema simplificado remove todas as tabelas de histórico
-- para economizar espaço no banco de dados e reduzir complexidade
-- 
-- Principais mudanças:
-- - Removidas: robbery_history, treatment_history, casino_history, 
--   nightlife_history, bank_transactions, prison_visits
-- - Mantidas apenas as tabelas essenciais para o funcionamento do jogo
-- - Adicionadas funções para cálculos em tempo real
-- - Mantidos triggers para integridade dos dados 