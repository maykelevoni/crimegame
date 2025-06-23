# Configuração Manual do Schema - Supabase

## Passo 1: Acessar o Painel do Supabase

1. Vá para https://supabase.com/dashboard
2. Faça login e selecione o projeto `bdxsqakwajhglrwcmhrt`
3. Vá para **SQL Editor**

## Passo 2: Executar as Queries

### Query 1: Adicionar campos faltantes na tabela players

```sql
-- Adicionar campos faltantes na tabela players
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS max_health INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS addiction INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_imprisoned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_hospitalized BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
```

### Query 2: Criar tabela crime_history

```sql
-- Criar tabela crime_history
CREATE TABLE IF NOT EXISTS public.crime_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    crime_id VARCHAR(255) NOT NULL,
    reward INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Query 3: Criar tabela treatment_history

```sql
-- Criar tabela treatment_history
CREATE TABLE IF NOT EXISTS public.treatment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    treatment_id VARCHAR(255) NOT NULL,
    treatment_name VARCHAR(255) NOT NULL,
    cost INTEGER NOT NULL,
    health_gained INTEGER DEFAULT 0,
    energy_gained INTEGER DEFAULT 0,
    addiction_reduced INTEGER DEFAULT 0,
    wanted_level_reduced INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Query 4: Criar tabela game_sessions

```sql
-- Criar tabela game_sessions
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    active_view VARCHAR(50) DEFAULT 'home',
    active_section VARCHAR(50) DEFAULT 'home',
    dismissed_alerts TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Passo 3: Verificar se funcionou

Após executar as queries, teste o app novamente. Os dados devem carregar corretamente do banco.

## Notas

- Execute as queries uma por vez
- Se alguma query falhar, pode ser que o campo já exista (isso é normal)
- Após executar, o app deve funcionar corretamente
