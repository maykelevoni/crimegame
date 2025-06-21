-- Create tables
CREATE TABLE IF NOT EXISTS public.players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.player_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    health INTEGER DEFAULT 100,
    max_health INTEGER DEFAULT 100,
    energy INTEGER DEFAULT 100,
    max_energy INTEGER DEFAULT 100,
    addiction INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    money INTEGER DEFAULT 1000,
    wanted_level INTEGER DEFAULT 0,
    is_imprisoned BOOLEAN DEFAULT FALSE,
    is_hospitalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('weapon', 'armor', 'style', 'accessory', 'consumable', 'special')),
    description TEXT NOT NULL,
    bonus JSONB DEFAULT '{}',
    rarity VARCHAR(50) DEFAULT 'comum' CHECK (rarity IN ('comum', 'raro', 'lendario')),
    price INTEGER NOT NULL,
    stackable BOOLEAN DEFAULT FALSE,
    category VARCHAR(100) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    equipped BOOLEAN DEFAULT FALSE,
    slot_type VARCHAR(50) CHECK (slot_type IN ('weapon', 'armor', 'style', 'accessory')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, item_id)
);

CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'nightclub', 'convenience', 'weapon_factory', 'casino')),
    level INTEGER DEFAULT 1,
    income INTEGER DEFAULT 0,
    employees INTEGER DEFAULT 0,
    security INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    upgrade_cost INTEGER DEFAULT 0,
    owned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.treatment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    cost INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    session_data JSONB DEFAULT '{}',
    active_view VARCHAR(100) DEFAULT 'home',
    active_section VARCHAR(100) DEFAULT 'home',
    dismissed_alerts TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON public.player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_inventory_player_id ON public.inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_businesses_player_id ON public.businesses(player_id);
CREATE INDEX IF NOT EXISTS idx_treatment_history_player_id ON public.treatment_history(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON public.game_sessions(player_id);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own player data" ON public.players
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player data" ON public.players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own player data" ON public.players
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own player stats" ON public.player_stats
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own player stats" ON public.player_stats
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own player stats" ON public.player_stats
    FOR UPDATE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own inventory" ON public.inventory
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own inventory items" ON public.inventory
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own inventory items" ON public.inventory
    FOR UPDATE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own inventory items" ON public.inventory
    FOR DELETE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own businesses" ON public.businesses
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own businesses" ON public.businesses
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own businesses" ON public.businesses
    FOR UPDATE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own treatment history" ON public.treatment_history
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own treatment history" ON public.treatment_history
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own game sessions" ON public.game_sessions
    FOR SELECT USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own game sessions" ON public.game_sessions
    FOR INSERT WITH CHECK (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own game sessions" ON public.game_sessions
    FOR UPDATE USING (
        player_id IN (
            SELECT id FROM public.players WHERE user_id = auth.uid()
        )
    );

-- Allow public read access to items (shop)
CREATE POLICY "Anyone can view available items" ON public.items
    FOR SELECT USING (available = true);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamps
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON public.player_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON public.game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 