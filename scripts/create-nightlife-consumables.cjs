const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createNightlifeConsumables() {
  console.log("🍺 Criando consumíveis do nightlife...\n");

  const consumables = [
    {
      name: "Cerveja",
      description: "Uma cerveja gelada e refrescante",
      image_url:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop",
      price: 10,
      type: "drink",
      effects: {
        energy: 5,
        addiction: 2,
      },
      available: true,
    },
    {
      name: "Whisky",
      description: "Whisky premium com sabor intenso",
      image_url:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop",
      price: 25,
      type: "drink",
      effects: {
        energy: 10,
        addiction: 5,
      },
      available: true,
    },
    {
      name: "Vodka",
      description: "Vodka pura e forte",
      image_url:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop",
      price: 20,
      type: "drink",
      effects: {
        energy: 8,
        addiction: 4,
      },
      available: true,
    },
    {
      name: "Ecstasy",
      description: "Pílula que aumenta energia e euforia",
      image_url:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      price: 50,
      type: "drug",
      effects: {
        energy: 20,
        addiction: 10,
      },
      risk_level: "High",
      available: true,
    },
    {
      name: "Cocaína",
      description: "Pó branco que aumenta energia drasticamente",
      image_url:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      price: 100,
      type: "drug",
      effects: {
        energy: 30,
        addiction: 15,
      },
      risk_level: "Very High",
      available: true,
    },
  ];

  try {
    for (const consumable of consumables) {
      console.log(`📝 Inserindo: ${consumable.name}`);

      const { data, error } = await supabase
        .from("nightlife_consumables")
        .insert([consumable])
        .select();

      if (error) {
        console.error(`❌ Erro ao inserir ${consumable.name}:`, error);
      } else {
        console.log(`✅ ${consumable.name} inserido com sucesso!`);
      }
    }

    console.log("\n🎉 Consumíveis criados com sucesso!");

    // Verificar se foram inseridos
    const { data: checkData, error: checkError } = await supabase
      .from("nightlife_consumables")
      .select("*")
      .eq("available", true);

    if (checkError) {
      console.error("❌ Erro ao verificar:", checkError);
    } else {
      console.log(`📊 Total de consumíveis disponíveis: ${checkData.length}`);
    }
  } catch (error) {
    console.error("❌ Erro geral:", error);
  }
}

createNightlifeConsumables();
