-- Remover tabelas de histórico
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- Remover tabelas de histórico
DROP TABLE IF EXISTS public.robbery_history CASCADE;
DROP TABLE IF EXISTS public.treatment_history CASCADE;
DROP TABLE IF EXISTS public.casino_history CASCADE;
DROP TABLE IF EXISTS public.nightlife_history CASCADE;
DROP TABLE IF EXISTS public.bank_transactions CASCADE;
DROP TABLE IF EXISTS public.prison_visits CASCADE;
DROP TABLE IF EXISTS public.business_income_history CASCADE;

-- Verificar se foram removidas
SELECT 'Tabelas de histórico removidas com sucesso!' as status; 