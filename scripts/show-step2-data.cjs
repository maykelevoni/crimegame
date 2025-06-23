console.log("🚀 STEP 2: DADOS INICIAIS\n");

console.log("📄 Cole este SQL no Supabase SQL Editor:\n");
console.log("=".repeat(80));

console.log(`-- =====================================================
-- STEP 2: DADOS INICIAIS DO URBAN HUSTLE
-- =====================================================

-- =====================================================
-- ROUBOS DISPONÍVEIS
-- =====================================================

INSERT INTO public.robberies (name, description, type, min_level, energy_cost, success_rate, base_reward, max_reward, risk_level, required_equipment, location, cooldown_minutes) VALUES
-- Roubos básicos (nível 1-5)
('Roubo de Conveniência', 'Uma pequena loja de conveniência com dinheiro limitado', 'store', 1, 5, 80, 50, 200, 1, ARRAY['weapon'], 'Centro da Cidade', 15),
('Caixa Eletrônico', 'Roubar um caixa eletrônico isolado', 'bank', 2, 8, 70, 100, 500, 2, ARRAY['weapon', 'lockpick'], 'Subúrbios', 30),
('Joalheria Pequena', 'Uma joalheria de bairro com joias básicas', 'jewelry', 3, 10, 60, 200, 1000, 3, ARRAY['weapon', 'lockpick'], 'Centro Comercial', 45),

-- Roubos intermediários (nível 6-15)
('Armazém de Eletrônicos', 'Armazém com produtos eletrônicos de valor', 'warehouse', 6, 15, 50, 500, 2500, 4, ARRAY['weapon', 'lockpick', 'armor'], 'Zona Industrial', 60),
('Banco Regional', 'Banco de médio porte com mais segurança', 'bank', 8, 20, 40, 1000, 5000, 5, ARRAY['weapon', 'lockpick', 'armor'], 'Centro Financeiro', 90),
('Joalheria de Luxo', 'Joalheria de alta classe com joias caras', 'jewelry', 10, 25, 35, 2000, 10000, 6, ARRAY['weapon', 'lockpick', 'armor'], 'Distrito de Luxo', 120),

-- Roubos avançados (nível 16+)
('Mansão de Celebridade', 'Mansão luxuosa com objetos de valor', 'mansion', 16, 35, 25, 5000, 25000, 8, ARRAY['weapon', 'lockpick', 'armor', 'stealth'], 'Beverly Hills', 180),
('Casino VIP', 'Área VIP de um casino com muito dinheiro', 'casino', 20, 50, 20, 10000, 50000, 9, ARRAY['weapon', 'lockpick', 'armor', 'stealth', 'disguise'], 'Las Vegas', 240),
('Banco Central', 'O banco mais seguro da cidade', 'bank', 25, 75, 15, 25000, 100000, 10, ARRAY['weapon', 'lockpick', 'armor', 'stealth', 'disguise', 'hacking'], 'Centro Financeiro', 360);

-- =====================================================
-- TIPOS DE NEGÓCIOS
-- =====================================================

INSERT INTO public.business_types (name, type, description, base_price, base_income, max_level, upgrade_cost_multiplier, income_multiplier, risk_level) VALUES
-- Negócios legais
('Restaurante Fast Food', 'restaurant', 'Restaurante de comida rápida com alto volume de clientes', 5000, 200, 10, 1.5, 1.2, 1),
('Loja de Conveniência', 'convenience', 'Loja 24h com produtos básicos', 3000, 150, 10, 1.4, 1.15, 1),
('Bar Local', 'nightclub', 'Bar tradicional com ambiente acolhedor', 8000, 300, 10, 1.6, 1.25, 2),

-- Negócios intermediários
('Restaurante Gourmet', 'restaurant', 'Restaurante de alta gastronomia', 15000, 600, 10, 1.7, 1.3, 2),
('Nightclub Premium', 'nightclub', 'Casa noturna de luxo com shows', 25000, 1000, 10, 1.8, 1.35, 3),
('Supermercado', 'convenience', 'Supermercado de médio porte', 12000, 500, 10, 1.6, 1.25, 2),

-- Negócios de alto risco
('Casino Underground', 'casino', 'Casino ilegal com jogos de azar', 50000, 2500, 10, 2.0, 1.5, 8),
('Fábrica de Armas', 'weapon_factory', 'Fábrica clandestina de armas', 75000, 4000, 10, 2.2, 1.6, 9),
('Casino de Luxo', 'casino', 'Casino legal de alta classe', 100000, 5000, 10, 2.5, 1.7, 5);

-- =====================================================
-- TRATAMENTOS HOSPITALARES
-- =====================================================

INSERT INTO public.treatments (name, description, type, cost, health_restore, energy_restore, addiction_reduction, wanted_level_reduction, cooldown_minutes, min_level) VALUES
-- Tratamentos básicos
('Curativo Simples', 'Tratamento básico para ferimentos leves', 'health', 50, 25, 0, 0, 0, 0, 1),
('Bebida Energética', 'Bebida que restaura energia rapidamente', 'energy', 30, 0, 30, 0, 0, 0, 1),
('Consulta Básica', 'Consulta médica para problemas simples', 'health', 100, 50, 0, 0, 0, 30, 1),

-- Tratamentos intermediários
('Cirurgia Menor', 'Cirurgia para ferimentos moderados', 'health', 500, 100, 0, 0, 0, 120, 5),
('Detox Básico', 'Tratamento para reduzir vício', 'addiction', 300, 0, 0, 20, 0, 180, 3),
('Cirurgia Plástica Menor', 'Procedimento para reduzir nível de procurado', 'wanted_level', 1000, 0, 0, 0, 10, 240, 8),

-- Tratamentos avançados
('Cirurgia de Emergência', 'Cirurgia complexa para ferimentos graves', 'health', 2000, 200, 0, 0, 0, 360, 10),
('Detox Completo', 'Tratamento intensivo para vício', 'addiction', 1500, 0, 0, 50, 0, 480, 12),
('Cirurgia Plástica Completa', 'Mudança completa de aparência', 'wanted_level', 5000, 0, 0, 0, 50, 720, 15),
('Tratamento VIP', 'Tratamento exclusivo com todos os benefícios', 'health', 10000, 300, 100, 30, 20, 1440, 20);

-- =====================================================
-- JOGOS DE CASINO
-- =====================================================

INSERT INTO public.casino_games (name, description, type, min_bet, max_bet, house_edge, payout_multiplier) VALUES
-- Jogos básicos
('Slots Básico', 'Caça-níquel simples com 3 rolos', 'slots', 1, 100, 0.10, 0.9),
('Dados Simples', 'Jogo de dados com apostas simples', 'dice', 5, 500, 0.05, 0.95),
('Blackjack Básico', 'Blackjack tradicional', 'blackjack', 10, 1000, 0.02, 0.98),

-- Jogos intermediários
('Slots Premium', 'Caça-níquel com 5 rolos e bônus', 'slots', 10, 1000, 0.08, 0.92),
('Roleta Americana', 'Roleta com duplo zero', 'roulette', 25, 2500, 0.053, 0.947),
('Poker Texas Hold''em', 'Poker tradicional contra outros jogadores', 'poker', 50, 5000, 0.03, 0.97),

-- Jogos de alto risco
('Slots VIP', 'Caça-níquel de luxo com jackpots', 'slots', 100, 10000, 0.05, 0.95),
('Roleta Europeia', 'Roleta com melhor odds', 'roulette', 100, 10000, 0.027, 0.973),
('Poker VIP', 'Mesa de poker exclusiva', 'poker', 500, 50000, 0.02, 0.98);

-- =====================================================
-- LOCAIS DE NIGHTLIFE
-- =====================================================

INSERT INTO public.nightlife_venues (name, type, description, energy_cost, money_cost, health_effect, energy_effect, addiction_effect, reputation_effect, min_level) VALUES
-- Bares
('Bar do Zé', 'bar', 'Bar tradicional com ambiente familiar', 5, 20, 0, 10, 0, 1, 1),
('Pub Irlandês', 'bar', 'Pub com cervejas importadas', 8, 50, 0, 15, 2, 2, 3),
('Bar de Luxo', 'bar', 'Bar sofisticado com coquetéis caros', 10, 100, 0, 20, 3, 5, 8),

-- Bordéis
('Casa da Rosa', 'brothel', 'Casa de encontros discreta', 15, 200, -5, 25, 5, 3, 5),
('Clube Privê', 'brothel', 'Clube exclusivo com acompanhantes de luxo', 20, 500, -10, 35, 8, 8, 12),
('Mansão dos Prazeres', 'brothel', 'Mansão de luxo com as melhores acompanhantes', 30, 1000, -15, 50, 12, 15, 18),

-- Raves
('Rave Underground', 'rave', 'Rave clandestina com música eletrônica', 25, 100, -10, 40, 15, 5, 10),
('Festival Eletrônico', 'rave', 'Festival de música eletrônica', 35, 300, -15, 60, 20, 10, 15),
('Rave VIP', 'rave', 'Rave exclusiva com DJs famosos', 50, 800, -20, 80, 25, 20, 20);

-- =====================================================
-- PERSONAGENS DA NIGHTLIFE
-- =====================================================

INSERT INTO public.nightlife_characters (venue_id, name, description, image_url, price, energy_cost, effects) VALUES
-- Personagens do Bar
((SELECT id FROM public.nightlife_venues WHERE name = 'Bar do Zé' LIMIT 1), 'Maria', 'Garçonete simpática e conversadora', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', 0, 0, '{"reputation": 1}'),
((SELECT id FROM public.nightlife_venues WHERE name = 'Pub Irlandês' LIMIT 1), 'Sean', 'Barman irlandês com histórias interessantes', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg', 0, 0, '{"reputation": 2, "energy": 5}'),
((SELECT id FROM public.nightlife_venues WHERE name = 'Bar de Luxo' LIMIT 1), 'Isabella', 'Bartender de luxo com técnicas especiais', 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg', 50, 5, '{"reputation": 3, "energy": 10}'),

-- Personagens do Bordel
((SELECT id FROM public.nightlife_venues WHERE name = 'Casa da Rosa' LIMIT 1), 'Rosa', 'Acompanhante experiente e discreta', 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg', 200, 15, '{"energy": 25, "addiction": 5}'),
((SELECT id FROM public.nightlife_venues WHERE name = 'Clube Privê' LIMIT 1), 'Valentina', 'Acompanhante de luxo com técnicas avançadas', 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg', 500, 20, '{"energy": 35, "addiction": 8, "reputation": 5}'),
((SELECT id FROM public.nightlife_venues WHERE name = 'Mansão dos Prazeres' LIMIT 1), 'Diamond', 'Acompanhante exclusiva com serviços premium', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg', 1000, 30, '{"energy": 50, "addiction": 12, "reputation": 10}'),

-- Personagens da Rave
((SELECT id FROM public.nightlife_venues WHERE name = 'Rave Underground' LIMIT 1), 'Rave Girl', 'Garota da rave com energia contagiante', 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg', 100, 25, '{"energy": 40, "addiction": 15}'),
((SELECT id FROM public.nightlife_venues WHERE name = 'Festival Eletrônico' LIMIT 1), 'DJ Luna', 'DJ famosa com música eletrizante', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg', 300, 35, '{"energy": 60, "addiction": 20, "reputation": 8}'),
((SELECT id FROM public.nightlife_venues WHERE name = 'Rave VIP' LIMIT 1), 'Queen Rave', 'Rainha da rave com experiências únicas', 'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg', 800, 50, '{"energy": 80, "addiction": 25, "reputation": 15}');

-- =====================================================
-- PRISIONEIROS
-- =====================================================

INSERT INTO public.prisoners (name, description, image_url, crime_type, sentence_days, release_date, bribe_cost, escape_difficulty) VALUES
-- Prisioneiros básicos
('João Silva', 'Ladrão de rua com vários pequenos roubos', 'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg', 'Roubo', 30, NOW() + INTERVAL '30 days', 500, 3),
('Maria Santos', 'Traficante de drogas de pequeno porte', 'https://images.pexels.com/photos/3184301/pexels-photo-3184301.jpeg', 'Tráfico', 60, NOW() + INTERVAL '60 days', 1000, 4),
('Pedro Costa', 'Assaltante de bancos pequenos', 'https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg', 'Assalto a Banco', 90, NOW() + INTERVAL '90 days', 2000, 5),

-- Prisioneiros intermediários
('Carlos Ferreira', 'Líder de gangue de rua', 'https://images.pexels.com/photos/3184303/pexels-photo-3184303.jpeg', 'Crime Organizado', 180, NOW() + INTERVAL '180 days', 5000, 6),
('Ana Oliveira', 'Traficante de armas de médio porte', 'https://images.pexels.com/photos/3184304/pexels-photo-3184304.jpeg', 'Tráfico de Armas', 365, NOW() + INTERVAL '365 days', 10000, 7),
('Roberto Lima', 'Assaltante de bancos de grande porte', 'https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg', 'Assalto a Banco', 730, NOW() + INTERVAL '730 days', 20000, 8),

-- Prisioneiros de alto perfil
('Vitor Almeida', 'Líder de cartel de drogas', 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg', 'Crime Organizado', 1825, NOW() + INTERVAL '1825 days', 50000, 9),
('Lucia Pereira', 'Traficante internacional de armas', 'https://images.pexels.com/photos/3184307/pexels-photo-3184307.jpeg', 'Tráfico Internacional', 2555, NOW() + INTERVAL '2555 days', 100000, 10),
('Marcos Rodrigues', 'Assaltante do banco central', 'https://images.pexels.com/photos/3184308/pexels-photo-3184308.jpeg', 'Crime Federal', 3650, NOW() + INTERVAL '3650 days', 200000, 10);

-- =====================================================
-- FUNÇÃO PARA GERAR NÚMEROS DE CONTA BANCÁRIA
-- =====================================================

CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    account_num VARCHAR(20);
BEGIN
    -- Gerar número de conta único
    LOOP
        account_num := 'ACC' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        
        -- Verificar se já existe
        IF NOT EXISTS (SELECT 1 FROM public.bank_accounts WHERE account_number = account_num) THEN
            RETURN account_num;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;`);

console.log("=".repeat(80));
console.log("\n✅ Execute este SQL no Supabase SQL Editor");
console.log("📊 Este script adiciona:");
console.log("   • 9 tipos de roubos (níveis 1-25)");
console.log("   • 9 tipos de negócios para compra");
console.log("   • 10 tratamentos hospitalares");
console.log("   • 9 jogos de casino");
console.log("   • 9 locais de nightlife");
console.log("   • 9 personagens da nightlife");
console.log("   • 9 prisioneiros para visitar");
console.log("   • Função para gerar números de conta bancária");
console.log("\n📝 Depois execute o próximo passo para adicionar índices e RLS");
