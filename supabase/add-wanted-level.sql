-- Adicionar campo wanted_level à tabela players
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS wanted_level INTEGER DEFAULT 0;

-- Atualizar tipos do Supabase (execute isso no Supabase Dashboard > SQL Editor)
-- Depois execute: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts 