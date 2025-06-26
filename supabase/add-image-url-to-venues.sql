-- Adicionar coluna image_url na tabela nightlife_venues
ALTER TABLE nightlife_venues 
ADD COLUMN image_url TEXT;

-- Atualizar venues existentes com imagens apropriadas
UPDATE nightlife_venues 
SET image_url = CASE 
  WHEN type = 'bar' THEN 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop'
  WHEN type = 'rave' THEN 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  WHEN type = 'brothel' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop'
END
WHERE image_url IS NULL;

-- Tornar a coluna NOT NULL após popular
ALTER TABLE nightlife_venues 
ALTER COLUMN image_url SET NOT NULL; 