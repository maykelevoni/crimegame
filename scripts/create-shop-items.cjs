const { createClient } = require("@supabase/supabase-js");
const { randomUUID } = require("crypto");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variáveis de ambiente não encontradas!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const shopItems = [
  // Armas
  {
    name: "Pistola Desert Eagle",
    description: "Arma de fogo poderosa e confiável",
    price: 2500,
    type: "weapon",
    rarity: "raro",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
    bonus: { damage: 45 },
    category: "weapons",
    stackable: false,
  },
  {
    name: "Metralhadora UZI",
    description: "Arma automática devastadora",
    price: 8500,
    type: "weapon",
    rarity: "lendario",
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=150&h=150&fit=crop",
    bonus: { damage: 75 },
    category: "weapons",
    stackable: false,
  },
  {
    name: "Faca Tática",
    description: "Arma branca para combate corpo a corpo",
    price: 800,
    type: "weapon",
    rarity: "comum",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
    bonus: { damage: 25 },
    category: "weapons",
    stackable: false,
  },
  {
    name: "Taco de Baseball com pregos",
    description: "Arma intimidadora e eficiente",
    price: 600,
    type: "weapon",
    rarity: "comum",
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=150&h=150&fit=crop",
    bonus: { damage: 18 },
    category: "weapons",
    stackable: false,
  },
  // Armaduras
  {
    name: "Colete Leve",
    description: "Proteção básica contra tiros",
    price: 1200,
    type: "armor",
    rarity: "comum",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    bonus: { defense: 30 },
    category: "armor",
    stackable: false,
  },
  {
    name: "Colete Militar",
    description: "Proteção avançada para missões perigosas",
    price: 3500,
    type: "armor",
    rarity: "raro",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
    bonus: { defense: 60 },
    category: "armor",
    stackable: false,
  },
  // Consumíveis
  {
    name: "Poção de Vida",
    description: "Restaura 50 pontos de vida",
    price: 300,
    type: "consumable",
    rarity: "comum",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    bonus: { health: 50 },
    category: "consumables",
    stackable: true,
  },
  {
    name: "Bebida Energética",
    description: "Restaura 40 pontos de energia",
    price: 200,
    type: "consumable",
    rarity: "comum",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    bonus: { energy: 40 },
    category: "consumables",
    stackable: true,
  },
  {
    name: "Cocaína Premium",
    description: "Aumenta temporariamente força e velocidade",
    price: 500,
    type: "consumable",
    rarity: "raro",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    bonus: { addiction: 10 },
    category: "consumables",
    stackable: true,
  },
  // Especiais
  {
    name: "Arma Dourada",
    description: "Arma lendária com poder devastador",
    price: 25000,
    type: "weapon",
    rarity: "lendario",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
    bonus: { damage: 150, reputation: 50 },
    category: "special",
    stackable: false,
  },
];

async function createShopItems() {
  try {
    console.log("🔍 Verificando itens existentes...");

    // Primeiro, vamos ver se já existem itens
    const { data: existingItems, error: selectError } = await supabase
      .from("items")
      .select("id, name");

    if (selectError) {
      console.error("❌ Erro ao buscar itens existentes:", selectError);
      return;
    }

    console.log(`📋 Encontrados ${existingItems.length} itens existentes`);

    // Criar os itens da loja
    console.log("\n🛍️ Criando itens da loja...");

    for (const item of shopItems) {
      // Verificar se o item já existe pelo nome
      const exists = existingItems.find(
        (existing) => existing.name === item.name
      );

      if (exists) {
        console.log(`⏭️ Item "${item.name}" já existe, pulando...`);
        continue;
      }

      console.log(`➕ Criando item: ${item.name}`);

      const { error: insertError } = await supabase.from("items").insert({
        id: randomUUID(), // Usar função nativa do Node.js
        name: item.name,
        description: item.description,
        price: item.price,
        type: item.type,
        rarity: item.rarity,
        image: item.image,
        bonus: item.bonus,
        category: item.category,
        stackable: item.stackable,
        available: true,
      });

      if (insertError) {
        console.error(`❌ Erro ao criar item "${item.name}":`, insertError);
      } else {
        console.log(`✅ Item "${item.name}" criado com sucesso`);
      }
    }

    console.log("\n🎉 Processo concluído!");
    console.log(
      "🔄 Agora você pode comprar itens na loja e eles aparecerão no inventário."
    );
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
  }
}

createShopItems();
