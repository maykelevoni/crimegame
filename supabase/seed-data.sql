-- Insert sample items for the shop
-- Weapons
INSERT INTO public.items (name, image, type, description, bonus, rarity, price, stackable, category, available) VALUES
('Pistola Glock', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'weapon', 'Pistola semiautomática confiável', '{"damage": 25, "accuracy": 80}', 'comum', 1500, false, 'weapons', true),
('AK-47', 'https://images.unsplash.com/photo-1548883356-5d8c0c0c0c0c?w=400', 'weapon', 'Rifle de assalto poderoso', '{"damage": 45, "accuracy": 70}', 'raro', 5000, false, 'weapons', true),
('Sniper Rifle', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'weapon', 'Rifle de precisão de longo alcance', '{"damage": 80, "accuracy": 95}', 'lendario', 12000, false, 'weapons', true),
('Baseball Bat', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'weapon', 'Taco de baseball para combate corpo a corpo', '{"damage": 15, "accuracy": 90}', 'comum', 200, false, 'weapons', true);

-- Armor
INSERT INTO public.items (name, image, type, description, bonus, rarity, price, stackable, category, available) VALUES
('Colete Balístico', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'armor', 'Proteção contra tiros', '{"defense": 30, "weight": 5}', 'raro', 3000, false, 'armor', true),
('Capacete Militar', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'armor', 'Proteção para a cabeça', '{"defense": 20, "weight": 2}', 'comum', 800, false, 'armor', true);

-- Style
INSERT INTO public.items (name, image, type, description, bonus, rarity, price, stackable, category, available) VALUES
('Jaqueta de Couro', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'style', 'Jaqueta estilosa de couro', '{"style": 15, "reputation": 5}', 'comum', 500, false, 'clothing', true),
('Terno Preto', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'style', 'Terno elegante para ocasiões especiais', '{"style": 25, "reputation": 10}', 'raro', 1500, false, 'clothing', true);

-- Accessories
INSERT INTO public.items (name, image, type, description, bonus, rarity, price, stackable, category, available) VALUES
('Relógio de Luxo', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'accessory', 'Relógio caro que mostra status', '{"style": 10, "reputation": 8}', 'raro', 2000, false, 'accessories', true),
('Óculos Escuros', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'accessory', 'Óculos estilosos', '{"style": 8, "stealth": 5}', 'comum', 300, false, 'accessories', true);

-- Consumables
INSERT INTO public.items (name, image, type, description, bonus, rarity, price, stackable, category, available) VALUES
('Bebida Energética', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'consumable', 'Restaura energia rapidamente', '{"energy": 30}', 'comum', 50, true, 'consumables', true),
('Kit Médico', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'consumable', 'Cura ferimentos', '{"health": 50}', 'comum', 200, true, 'consumables', true),
('Pílula de Adrenalina', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'consumable', 'Aumenta temporariamente as habilidades', '{"strength": 20, "speed": 20}', 'raro', 500, true, 'consumables', true);

-- Special Items
INSERT INTO public.items (name, image, type, description, bonus, rarity, price, stackable, category, available) VALUES
('Chip Neural', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'special', 'Implante que melhora habilidades', '{"intelligence": 15, "reaction": 10}', 'lendario', 8000, false, 'special', true),
('Chave Mestra', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'special', 'Abre qualquer fechadura', '{"lockpicking": 100}', 'raro', 3000, false, 'special', true);

-- Insert sample businesses
INSERT INTO public.businesses (name, type, level, income, employees, security, price, upgrade_cost, owned, available) VALUES
('Restaurante Chinês', 'restaurant', 1, 500, 3, 2, 5000, 2500, false, true),
('Nightclub Neon', 'nightclub', 1, 800, 5, 4, 8000, 4000, false, true),
('Loja de Conveniência', 'convenience', 1, 300, 2, 1, 3000, 1500, false, true),
('Fábrica de Armas', 'weapon_factory', 1, 1200, 8, 6, 15000, 7500, false, true),
('Casino Royal', 'casino', 1, 2000, 10, 8, 25000, 12500, false, true);

-- Note: These businesses are available for purchase but not owned by any player yet
-- When a player buys a business, it will be linked to their player_id and owned = true 