const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Insert sample items
    const items = [
      {
        name: "Pistola Glock",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "weapon",
        description: "Pistola semiautomática confiável",
        bonus: { damage: 25, accuracy: 80 },
        rarity: "comum",
        price: 1500,
        stackable: false,
        category: "weapons",
        available: true,
      },
      {
        name: "AK-47",
        image:
          "https://images.unsplash.com/photo-1548883356-5d8c0c0c0c0c?w=400",
        type: "weapon",
        description: "Rifle de assalto poderoso",
        bonus: { damage: 45, accuracy: 70 },
        rarity: "raro",
        price: 5000,
        stackable: false,
        category: "weapons",
        available: true,
      },
      {
        name: "Sniper Rifle",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "weapon",
        description: "Rifle de precisão de longo alcance",
        bonus: { damage: 80, accuracy: 95 },
        rarity: "lendario",
        price: 12000,
        stackable: false,
        category: "weapons",
        available: true,
      },
      {
        name: "Baseball Bat",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "weapon",
        description: "Taco de baseball para combate corpo a corpo",
        bonus: { damage: 15, accuracy: 90 },
        rarity: "comum",
        price: 200,
        stackable: false,
        category: "weapons",
        available: true,
      },
      {
        name: "Colete Balístico",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "armor",
        description: "Proteção contra tiros",
        bonus: { defense: 30, weight: 5 },
        rarity: "raro",
        price: 3000,
        stackable: false,
        category: "armor",
        available: true,
      },
      {
        name: "Capacete Militar",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "armor",
        description: "Proteção para a cabeça",
        bonus: { defense: 20, weight: 2 },
        rarity: "comum",
        price: 800,
        stackable: false,
        category: "armor",
        available: true,
      },
      {
        name: "Jaqueta de Couro",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "style",
        description: "Jaqueta estilosa de couro",
        bonus: { style: 15, reputation: 5 },
        rarity: "comum",
        price: 500,
        stackable: false,
        category: "clothing",
        available: true,
      },
      {
        name: "Terno Preto",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "style",
        description: "Terno elegante para ocasiões especiais",
        bonus: { style: 25, reputation: 10 },
        rarity: "raro",
        price: 1500,
        stackable: false,
        category: "clothing",
        available: true,
      },
      {
        name: "Relógio de Luxo",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "accessory",
        description: "Relógio caro que mostra status",
        bonus: { style: 10, reputation: 8 },
        rarity: "raro",
        price: 2000,
        stackable: false,
        category: "accessories",
        available: true,
      },
      {
        name: "Óculos Escuros",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "accessory",
        description: "Óculos estilosos",
        bonus: { style: 8, stealth: 5 },
        rarity: "comum",
        price: 300,
        stackable: false,
        category: "accessories",
        available: true,
      },
      {
        name: "Bebida Energética",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "consumable",
        description: "Restaura energia rapidamente",
        bonus: { energy: 30 },
        rarity: "comum",
        price: 50,
        stackable: true,
        category: "consumables",
        available: true,
      },
      {
        name: "Kit Médico",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "consumable",
        description: "Cura ferimentos",
        bonus: { health: 50 },
        rarity: "comum",
        price: 200,
        stackable: true,
        category: "consumables",
        available: true,
      },
      {
        name: "Pílula de Adrenalina",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "consumable",
        description: "Aumenta temporariamente as habilidades",
        bonus: { strength: 20, speed: 20 },
        rarity: "raro",
        price: 500,
        stackable: true,
        category: "consumables",
        available: true,
      },
      {
        name: "Chip Neural",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "special",
        description: "Implante que melhora habilidades",
        bonus: { intelligence: 15, reaction: 10 },
        rarity: "lendario",
        price: 8000,
        stackable: false,
        category: "special",
        available: true,
      },
      {
        name: "Chave Mestra",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        type: "special",
        description: "Abre qualquer fechadura",
        bonus: { lockpicking: 100 },
        rarity: "raro",
        price: 3000,
        stackable: false,
        category: "special",
        available: true,
      },
    ];

    console.log("📦 Inserting items...");
    const { data: itemsData, error: itemsError } = await supabase
      .from("items")
      .insert(items)
      .select();

    if (itemsError) {
      console.error("Error inserting items:", itemsError);
    } else {
      console.log(`✅ Inserted ${itemsData.length} items`);
    }

    // Insert sample businesses
    const businesses = [
      {
        name: "Restaurante Chinês",
        type: "restaurant",
        level: 1,
        income: 500,
        employees: 3,
        security: 2,
        price: 5000,
        upgrade_cost: 2500,
        owned: false,
      },
      {
        name: "Nightclub Neon",
        type: "nightclub",
        level: 1,
        income: 800,
        employees: 5,
        security: 4,
        price: 8000,
        upgrade_cost: 4000,
        owned: false,
      },
      {
        name: "Loja de Conveniência",
        type: "convenience",
        level: 1,
        income: 300,
        employees: 2,
        security: 1,
        price: 3000,
        upgrade_cost: 1500,
        owned: false,
      },
      {
        name: "Fábrica de Armas",
        type: "weapon_factory",
        level: 1,
        income: 1200,
        employees: 8,
        security: 6,
        price: 15000,
        upgrade_cost: 7500,
        owned: false,
      },
      {
        name: "Casino Royal",
        type: "casino",
        level: 1,
        income: 2000,
        employees: 10,
        security: 8,
        price: 25000,
        upgrade_cost: 12500,
        owned: false,
      },
    ];

    console.log("🏢 Inserting businesses...");
    const { data: businessesData, error: businessesError } = await supabase
      .from("businesses")
      .insert(businesses)
      .select();

    if (businessesError) {
      console.error("Error inserting businesses:", businessesError);
    } else {
      console.log(`✅ Inserted ${businessesData.length} businesses`);
    }

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seedDatabase();
