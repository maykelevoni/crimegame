console.log("🚀 PASSO 1: CRIAR TABELAS PRINCIPAIS\n");

console.log("📄 Cole este SQL no Supabase SQL Editor:\n");
console.log("=".repeat(80));

console.log(`-- =====================================================
-- PASSO 1: TABELAS PRINCIPAIS
-- =====================================================

-- Atualizar tabela players
ALTER TABLE IF EXISTS public.players 
ADD COLUMN IF NOT EXISTS health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS addiction INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS money INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_imprisoned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_hospitalized BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- =====================================================
-- SISTEMA DE ROUBOS
-- =====================================================

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

CREATE TABLE IF NOT EXISTS public.robbery_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    robbery_id UUID REFERENCES public.robberies(id) ON DELETE CASCADE,
    success BOOLEAN NOT NULL,
    reward INTEGER NOT NULL,
    energy_spent INTEGER NOT NULL,
    wanted_level_gained INTEGER DEFAULT 0,
    equipment_used TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE NEGÓCIOS
-- =====================================================

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

DROP TABLE IF EXISTS public.businesses;
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    business_type_id UUID REFERENCES public.business_types(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    income INTEGER DEFAULT 0,
    employees INTEGER DEFAULT 0,
    security INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    upgrade_cost INTEGER DEFAULT 0,
    owned BOOLEAN DEFAULT TRUE,
    last_income_collection TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.business_income_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    income_amount INTEGER NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA HOSPITALAR
-- =====================================================

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

DROP TABLE IF EXISTS public.treatment_history;
CREATE TABLE IF NOT EXISTS public.treatment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE,
    treatment_name VARCHAR(255) NOT NULL,
    cost INTEGER NOT NULL,
    health_gained INTEGER DEFAULT 0,
    energy_gained INTEGER DEFAULT 0,
    addiction_reduced INTEGER DEFAULT 0,
    wanted_level_reduced INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE CASINO
-- =====================================================

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

CREATE TABLE IF NOT EXISTS public.casino_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    game_id UUID REFERENCES public.casino_games(id) ON DELETE CASCADE,
    bet_amount INTEGER NOT NULL,
    win_amount INTEGER DEFAULT 0,
    game_result TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE NIGHTLIFE
-- =====================================================

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

CREATE TABLE IF NOT EXISTS public.nightlife_characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    venue_id UUID REFERENCES public.nightlife_venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price INTEGER DEFAULT 0,
    energy_cost INTEGER DEFAULT 0,
    effects JSONB DEFAULT '{}',
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.nightlife_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.nightlife_venues(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.nightlife_characters(id) ON DELETE SET NULL,
    money_spent INTEGER DEFAULT 0,
    energy_spent INTEGER DEFAULT 0,
    health_gained INTEGER DEFAULT 0,
    energy_gained INTEGER DEFAULT 0,
    addiction_gained INTEGER DEFAULT 0,
    reputation_gained INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA BANCÁRIO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    balance INTEGER DEFAULT 0,
    interest_rate DECIMAL(3,2) DEFAULT 0.01,
    last_interest_calculation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bank_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdraw', 'interest', 'transfer')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA PRISIONAL
-- =====================================================

CREATE TABLE IF NOT EXISTS public.prisoners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    sentence_days INTEGER NOT NULL,
    release_date TIMESTAMP WITH TIME ZONE NOT NULL,
    bribe_cost INTEGER DEFAULT 1000,
    escape_difficulty INTEGER DEFAULT 5,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prison_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    prisoner_id UUID REFERENCES public.prisoners(id) ON DELETE CASCADE,
    visit_type VARCHAR(50) NOT NULL CHECK (visit_type IN ('visit', 'bribe', 'escape_attempt')),
    money_spent INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE ITENS (ATUALIZAR)
-- =====================================================

ALTER TABLE IF EXISTS public.inventory 
DROP COLUMN IF EXISTS weapon_id,
ADD COLUMN IF NOT EXISTS item_id UUID REFERENCES public.items(id) ON DELETE CASCADE;`);

console.log("=".repeat(80));
console.log("\n✅ Execute este SQL primeiro no Supabase SQL Editor");
console.log("📝 Depois execute o próximo passo para adicionar índices e RLS");
