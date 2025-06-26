-- Criar tabela para consumíveis do nightlife
CREATE TABLE IF NOT EXISTS nightlife_consumables (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  price integer NOT NULL,
  type text NOT NULL CHECK (type IN ('drink', 'drug')),
  effects jsonb NOT NULL,
  risk_level text CHECK (risk_level IN ('Low', 'Medium', 'High', 'Very High', 'Extreme')),
  available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nightlife_consumables_updated_at 
    BEFORE UPDATE ON nightlife_consumables 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados dos consumíveis atuais
INSERT INTO nightlife_consumables (id, name, description, image_url, price, type, effects, risk_level) VALUES
-- Bebidas do Bar
('beer-001', 'Beer', 'Classic beer, gives you energy but increases addiction', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=100&fit=crop', 15, 'drink', '{"energy": 10, "addiction": 5, "health": -2}', 'Low'),
('vodka-001', 'Vodka', 'Strong vodka, more energy but higher addiction risk', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 25, 'drink', '{"energy": 15, "addiction": 8, "health": -3}', 'Medium'),
('whiskey-001', 'Whiskey', 'Premium whiskey, maximum energy boost', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop', 35, 'drink', '{"energy": 20, "addiction": 12, "health": -5}', 'Medium'),

-- Drogas da Rave
('ecstasy-001', 'Ecstasy', 'Pure MDMA, intense euphoria and energy boost', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop', 50, 'drug', '{"energy": 40, "addiction": 25, "health": -10}', 'High'),
('cocaine-001', 'Cocaine', 'Pure cocaine, extreme energy and focus', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop', 80, 'drug', '{"energy": 60, "addiction": 35, "health": -15}', 'Very High'),
('lsd-001', 'LSD', 'Acid trip, visual hallucinations and creativity', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop', 30, 'drug', '{"energy": 20, "addiction": 15, "health": -5}', 'Medium'),
('heroin-001', 'Heroin', 'Deadly heroin, extreme addiction risk', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop', 120, 'drug', '{"energy": -20, "addiction": 50, "health": -25}', 'Extreme');

-- Adicionar RLS (Row Level Security)
ALTER TABLE nightlife_consumables ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos os usuários autenticados
CREATE POLICY "Allow authenticated users to read nightlife_consumables" ON nightlife_consumables
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserção/atualização apenas para administradores (opcional)
CREATE POLICY "Allow admins to manage nightlife_consumables" ON nightlife_consumables
  FOR ALL USING (auth.role() = 'service_role'); 