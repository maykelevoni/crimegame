-- =====================================================
-- ALTERAR PRIMEIRO ROUBO PARA MIN_LEVEL = 0
-- =====================================================

-- Primeiro, vamos ver quais roubos existem
SELECT id, name, min_level 
FROM public.robberies 
ORDER BY min_level ASC 
LIMIT 5;

-- Alterar o primeiro roubo (menor min_level) para 0
UPDATE public.robberies 
SET min_level = 0 
WHERE id = (
    SELECT id 
    FROM public.robberies 
    ORDER BY min_level ASC 
    LIMIT 1
);

-- Verificar o resultado
SELECT id, name, min_level 
FROM public.robberies 
ORDER BY min_level ASC 
LIMIT 5;

-- =====================================================
-- ALTERNATIVA: Alterar todos os roubos básicos para 0
-- =====================================================

-- Se quiser alterar todos os roubos com min_level = 1 para 0:
-- UPDATE public.robberies 
-- SET min_level = 0 
-- WHERE min_level = 1;

-- =====================================================
-- ALTERNATIVA: Alterar roubo específico por nome
-- =====================================================

-- Se quiser alterar um roubo específico:
-- UPDATE public.robberies 
-- SET min_level = 0 
-- WHERE name = 'Convenience Store'; 

-- =====================================================
-- REMOVER CAMPOS DO JOGADOR
-- =====================================================

-- Remover campo level do jogador
ALTER TABLE public.players DROP COLUMN IF EXISTS level;

-- Remover campo experience do jogador
ALTER TABLE public.players DROP COLUMN IF EXISTS experience; 