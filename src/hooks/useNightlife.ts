import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGameStore } from "@/stores/gameStore";

export interface NightlifeConsumable {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  type: "drink" | "drug";
  effects: {
    energy?: number;
    addiction?: number;
    health?: number;
    reputation?: number;
  };
  risk_level?: "Low" | "Medium" | "High" | "Very High" | "Extreme";
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface NightlifeVenue {
  id: string;
  name: string;
  type: string;
  description: string;
  image_url: string;
  energy_cost: number;
  money_cost: number;
  effects: {
    energy?: number;
    addiction?: number;
    health?: number;
    reputation?: number;
    wanted?: number;
  };
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface NightlifeCharacter {
  id: string;
  venue_id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  energy_cost: number;
  effects: {
    energy?: number;
    addiction?: number;
    health?: number;
    reputation?: number;
  };
  available: boolean;
  created_at: string;
}

export const useNightlifeConsumables = () => {
  return useQuery({
    queryKey: ["nightlife-consumables"],
    queryFn: async () => {

      const { data, error } = await supabase
        .from("consumables")
        .select("*")
        .eq("available", true)
        .order("price", { ascending: true });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        return data as unknown as NightlifeConsumable[];
      }

      // Mock data fallback if database is empty
      const mockConsumables: NightlifeConsumable[] = [
        // Drinks
        {
          id: "1",
          name: "Beer",
          description: "Ice cold beer to relax and unwind",
          image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&crop=center",
          price: 10,
          type: "drink",
          effects: { energy: 5, addiction: 1 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Whiskey",
          description: "Premium whiskey for the sophisticated drinker",
          image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop&crop=center",
          price: 25,
          type: "drink",
          effects: { energy: 10, addiction: 3 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Cocktail",
          description: "Exotic cocktail with a mysterious kick",
          image_url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&crop=center",
          price: 35,
          type: "drink",
          effects: { energy: 15, addiction: 2 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        // Drugs
        {
          id: "4",
          name: "Pills",
          description: "Energy pills that keep you going all night",
          image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center",
          price: 50,
          type: "drug",
          effects: { energy: 30, addiction: 8 },
          risk_level: "Medium",
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Powder",
          description: "White powder that gives intense energy boost",
          image_url: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=400&fit=crop&crop=center",
          price: 100,
          type: "drug",
          effects: { energy: 50, addiction: 15 },
          risk_level: "High",
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "6",
          name: "Crystal",
          description: "Dangerous crystal drug for extreme highs",
          image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&crop=center",
          price: 200,
          type: "drug",
          effects: { energy: 80, addiction: 25 },
          risk_level: "Extreme",
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      return mockConsumables;
    },
  });
};

export const useNightlifeVenues = () => {
  return useQuery({
    queryKey: ["nightlife-venues"],
    queryFn: async () => {

      const { data, error } = await supabase
        .from("nightlife_venues")
        .select("*")
        .eq("available", true)
        .order("money_cost", { ascending: true });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        return data as unknown as NightlifeVenue[];
      }

      // Mock data fallback if database is empty
      const mockVenues: NightlifeVenue[] = [
        {
          id: "1",
          name: "Rooftop Bar",
          type: "bar",
          description: "Upscale bar with premium drinks and live music",
          image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center",
          energy_cost: 3,
          money_cost: 50,
          effects: { energy: 20, reputation: 5 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Underground Club",
          type: "rave",
          description: "High-energy electronic music venue with party atmosphere",
          image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
          energy_cost: 5,
          money_cost: 30,
          effects: { energy: 50, addiction: 2 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Red Light District",
          type: "companion",
          description: "Discreet services for adult entertainment",
          image_url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&crop=center",
          energy_cost: 0,
          money_cost: 150,
          effects: { energy: 25, addiction: 5 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Luxury Escort Service",
          type: "companion",
          description: "High-end companionship for elite clients",
          image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
          energy_cost: 0,
          money_cost: 300,
          effects: { energy: 40, addiction: 3 },
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      return mockVenues;
    },
  });
};

export const useNightlifeCharacters = (venueId?: string) => {
  return useQuery({
    queryKey: ["nightlife-characters", venueId],
    queryFn: async () => {

      let query = supabase
        .from("prostitutes")
        .select("*")
        .eq("available", true);

      if (venueId) {
        query = query.eq("venue_id", venueId);
      }

      const { data, error } = await query.order("price", { ascending: true });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        return data as unknown as NightlifeCharacter[];
      }

      // Mock data fallback if database is empty
      const mockCharacters: NightlifeCharacter[] = [
        {
          id: "1",
          venue_id: "4", // Red Light District
          name: "Carmen",
          description: "Experienced street walker with attitude",
          image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
          price: 50,
          energy_cost: 2,
          effects: { energy: 10, addiction: 3 },
          available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          venue_id: "4", // Red Light District
          name: "Maria",
          description: "Young and wild, loves to party",
          image_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=faces",
          price: 75,
          energy_cost: 3,
          effects: { energy: 15, addiction: 5 },
          available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          venue_id: "5", // Luxury Escort Service
          name: "Sophia",
          description: "High-class escort for wealthy clients",
          image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
          price: 150,
          energy_cost: 5,
          effects: { energy: 25, addiction: 8 },
          available: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "4",
          venue_id: "5", // Luxury Escort Service
          name: "Isabella",
          description: "Elite companion with exclusive services",
          image_url: "https://images.unsplash.com/photo-1494790108755-2616b2e31b89?w=400&h=400&fit=crop&crop=faces",
          price: 200,
          energy_cost: 8,
          effects: { energy: 40, addiction: 12 },
          available: true,
          created_at: new Date().toISOString(),
        },
      ];

      // Filter by venueId if provided
      if (venueId) {
        return mockCharacters.filter(char => char.venue_id === venueId);
      }

      return mockCharacters;
    },
    enabled: true, // Sempre buscar todos os characters
  });
};

export const useConsumeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      consumableId,
    }: {
      playerId: string;
      consumableId: string;
    }) => {

      // 1. Fetch consumable information
      const { data: consumable, error: consumableError } = await supabase
        .from("consumables")
        .select("*")
        .eq("id", consumableId)
        .single();


      if (consumableError) throw consumableError;
      if (!consumable) throw new Error("Consumível não encontrado");

      // 2. Verificar se o jogador tem dinheiro suficiente
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select(
          "money, health, energy, addiction, reputation, max_health, max_energy"
        )
        .eq("id", playerId)
        .single();


      if (playerError) {
        throw playerError;
      }
      if (!player) throw new Error("Player not found");

      const playerData = player;


      if (playerData.money < consumable.price) {
        throw new Error(
          `Insufficient money! You have $${playerData.money.toLocaleString()} but need $${consumable.price.toLocaleString()}`
        );
      }

      // Check if energy is full and item gives positive energy
      if (
        consumable.effects.energy &&
        consumable.effects.energy > 0 &&
        playerData.energy >= playerData.max_energy
      ) {
        throw new Error(
          `Energy is already full! You have ${playerData.energy}/${playerData.max_energy} energy`
        );
      }

      // 3. Calcular novos valores dos stats
      const effects = consumable.effects;
      const newMoney = playerData.money - consumable.price;
      const newHealth = Math.max(
        0,
        Math.min(
          playerData.max_health,
          playerData.health + (effects.health || 0)
        )
      );
      const newEnergy = Math.max(
        0,
        Math.min(
          playerData.max_energy,
          playerData.energy + (effects.energy || 0)
        )
      );
      const newAddiction = Math.max(
        0,
        Math.min(100, playerData.addiction + (effects.addiction || 0))
      );
      const newReputation = Math.max(
        0,
        playerData.reputation + (effects.reputation || 0)
      );

      // Verificar overdose baseado no vício
      let overdoseChance = 0;
      let isOverdose = false;
      let isDisease = false;
      let diseaseType = "";

      if (newAddiction >= 80) {
        overdoseChance = 15; // 15% chance de overdose
      } else if (newAddiction >= 60) {
        overdoseChance = 8; // 8% chance de overdose
      } else if (newAddiction >= 40) {
        overdoseChance = 3; // 3% chance de overdose
      }

      // Se o item é droga, aumenta a chance
      if (consumable.type === "drug") {
        overdoseChance *= 2;
      }

      // Verificar se aconteceu overdose
      if (overdoseChance > 0 && Math.random() * 100 < overdoseChance) {
        isOverdose = true;
      }

      // Verificar doenças específicas baseadas no tipo de venue
      let diseaseChance = 0;
      if (newAddiction >= 70) {
        diseaseChance = 12; // 12% chance de doença
      } else if (newAddiction >= 50) {
        diseaseChance = 6; // 6% chance de doença
      } else if (newAddiction >= 30) {
        diseaseChance = 2; // 2% chance de doença
      }

      // Determinar tipo de doença baseado no tipo de consumível
      if (diseaseChance > 0 && Math.random() * 100 < diseaseChance) {
        isDisease = true;
        if (consumable.type === "drink") {
          diseaseType = "cirrose";
        } else {
          diseaseType = "dst";
        }
      }

      // Calcular vida final considerando overdose e doenças
      let finalHealth = newHealth;
      if (isOverdose) {
        finalHealth = Math.max(1, newHealth - 20);
      } else if (isDisease) {
        finalHealth = Math.max(1, newHealth - 15);
      }

      // 4. Atualizar o jogador
      const { error: updateError } = await supabase
        .from("players")
        .update({
          money: newMoney,
          health: finalHealth,
          energy: newEnergy,
          addiction: newAddiction,
          reputation: newReputation,
          is_hospitalized: isOverdose || isDisease, // Overdose ou doença hospitaliza
          updated_at: new Date().toISOString(),
        })
        .eq("id", playerId);


      if (updateError) throw updateError;


      // 5. Retornar os dados atualizados
      return {
        consumable,
        newStats: {
          money: newMoney,
          health: finalHealth,
          energy: newEnergy,
          addiction: newAddiction,
          reputation: newReputation,
        },
        isOverdose,
        isDisease,
      };
    },
    onSuccess: (data) => {

      // Atualizar o gameStore diretamente
      const { newStats, isOverdose, isDisease } = data;
      const updateGameStore = useGameStore.getState().updatePlayerStats;

      updateGameStore({
        money: newStats.money,
        health: newStats.health,
        energy: newStats.energy,
        addiction: newStats.addiction,
        reputation: newStats.reputation,
        isHospitalized: isOverdose || isDisease, // Usar dados retornados
      });

      // Invalidar queries relacionadas ao jogador
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["game-data"] });


      // Mostrar notificação de sucesso
      const { consumable } = data;
      const effects = consumable.effects;

      if (isOverdose) {
        toast.dismiss(); // Clear previous notifications
        
        const overdoseMessages = [
          `💊 FUCK! You overdosed like a junkie! Your body can't handle this shit anymore!`,
          `☠️ DAMN! Too much dope, you druggie bastard! Hospital time before you die!`,
          `🚑 SHIT! Your addiction is out of control! You almost killed yourself, you addict!`,
          `💀 OVERDOSE! Your body is shutting down from all the drugs! Time to get clean, motherfucker!`,
          `🏥 TOO MUCH! You pushed your limits too far! Your veins are burning with poison!`
        ];
        const randomOverdoseMsg = overdoseMessages[Math.floor(Math.random() * overdoseMessages.length)];
        
        toast.error(
          `${randomOverdoseMsg} (Addiction: ${newStats.addiction}%)`,
          { duration: 8000 }
        );
        return;
      }

      if (isDisease) {
        toast.dismiss(); // Clear previous notifications
        
        const drinkDiseaseMessages = [
          `🍺 LIVER FAILURE! You drank yourself into a coma! Your liver is fucked!`,
          `🤮 CIRRHOSIS! Too much booze destroyed your liver! You're pissing blood!`,
          `🍻 ALCOHOL POISONING! Your body is rejecting all that cheap alcohol!`,
          `🥃 LIVER DAMAGE! You're an alcoholic piece of shit! Hospital time!`
        ];
        
        const drugDiseaseMessages = [
          `💉 INFECTED NEEDLE! You caught something nasty from dirty drug gear!`,
          `🦠 DRUG DISEASE! Those street drugs were contaminated with nasty shit!`,
          `😷 HEPATITIS! Sharing needles like a dumbass gave you a disease!`,
          `🏥 INFECTION! Your drug habit gave you a serious medical condition!`
        ];
        
        const diseaseMessages = consumable.type === "drink" ? drinkDiseaseMessages : drugDiseaseMessages;
        const randomDiseaseMsg = diseaseMessages[Math.floor(Math.random() * diseaseMessages.length)];

        toast.error(`${randomDiseaseMsg} (Addiction: ${newStats.addiction}%)`, {
          duration: 8000,
        });
        return;
      }

      toast.dismiss(); // Clear previous notifications
      
      // Different messages for drinks vs drugs
      if (consumable.type === "drink") {
        const drinkMessages = [
          `🍺 You chugged that ${consumable.name} like a fucking alcoholic! Bottoms up, booze hound!`,
          `🍻 ${consumable.name} went down smooth! Getting wasted feels so good!`,
          `🥃 That ${consumable.name} hit the spot! Your liver is screaming but who gives a shit!`,
          `🍷 You downed that ${consumable.name} like a pro drunk! Cheers to being a lush!`,
          `🍸 ${consumable.name} was delicious! Nothing like liquid courage to fuel your addiction!`
        ];
        const randomDrinkMsg = drinkMessages[Math.floor(Math.random() * drinkMessages.length)];
        
        let effectsText = "";
        if (effects.energy) {
          const energyText = effects.energy >= 0 ? `+${effects.energy}` : `${effects.energy}`;
          effectsText += ` ${energyText} Energy`;
        }
        if (effects.addiction) {
          effectsText += `, +${effects.addiction}% Addiction`;
        }
        if (effects.health) {
          const healthText = effects.health >= 0 ? `+${effects.health}` : `${effects.health}`;
          effectsText += `, ${healthText} Health`;
        }
        
        toast.success(`${randomDrinkMsg}${effectsText}`, { duration: 4000 });
      } else {
        const drugMessages = [
          `💊 You popped that ${consumable.name} like a junkie! Let the high begin, druggie!`,
          `💉 ${consumable.name} is coursing through your veins! You're getting fucked up!`,
          `🚬 That ${consumable.name} hit different! Your brain is fried but you love it!`,
          `💀 ${consumable.name} is some strong shit! You're flying high, you addict!`,
          `🔥 You just took ${consumable.name} and it's fire! Time to get completely wasted!`
        ];
        const randomDrugMsg = drugMessages[Math.floor(Math.random() * drugMessages.length)];
        
        let effectsText = "";
        if (effects.energy) {
          const energyText = effects.energy >= 0 ? `+${effects.energy}` : `${effects.energy}`;
          effectsText += ` ${energyText} Energy`;
        }
        if (effects.addiction) {
          effectsText += `, +${effects.addiction}% Addiction`;
        }
        if (effects.health) {
          const healthText = effects.health >= 0 ? `+${effects.health}` : `${effects.health}`;
          effectsText += `, ${healthText} Health`;
        }
        
        toast.success(`${randomDrugMsg}${effectsText}`, { duration: 4000 });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao consumir item"
      );
    },
  });
};

export const useVisitVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      venueId,
    }: {
      playerId: string;
      venueId: string;
    }) => {
      // 1. Buscar informações do venue
      const { data: venue, error: venueError } = await supabase
        .from("nightlife_venues")
        .select("*")
        .eq("id", venueId)
        .single();

      if (venueError) throw venueError;
      if (!venue) throw new Error("Venue não encontrado");

      // 2. Verificar se o jogador tem dinheiro e energia suficientes
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select(
          "money, health, energy, addiction, reputation, max_health, max_energy"
        )
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;
      if (!player) throw new Error("Player not found");

      if (player.money < venue.money_cost) {
        throw new Error(
          `Insufficient money! You have $${player.money.toLocaleString()} but need $${venue.money_cost.toLocaleString()}`
        );
      }

      // Only check energy cost for non-companion venues
      if (venue.type !== "companion" && player.energy < venue.energy_cost) {
        throw new Error(
          `Insufficient energy! You have ${player.energy} but need ${venue.energy_cost}`
        );
      }

      // 3. Calcular novos valores dos stats
      const effects = venue.effects || {};
      const newMoney = player.money - venue.money_cost;
      
      // For companion venues (prostitutes), they should give energy, not cost it
      let newEnergy;
      if (venue.type === "companion") {
        // Prostitutes give energy directly, no energy cost
        newEnergy = Math.max(
          0,
          Math.min(player.max_energy, player.energy + (effects.energy || 0))
        );
      } else {
        // Other venues cost energy then potentially give energy
        const energyAfterCost = Math.max(0, player.energy - venue.energy_cost);
        newEnergy = Math.max(
          0,
          Math.min(player.max_energy, energyAfterCost + (effects.energy || 0))
        );
      }
      
      const newHealth = Math.max(
        0,
        Math.min(player.max_health, player.health + (effects.health || 0))
      );
      const newAddiction = Math.max(
        0,
        Math.min(100, player.addiction + (effects.addiction || 0))
      );
      const newReputation = Math.max(
        0,
        player.reputation + (effects.reputation || 0)
      );

      // For companion venues, add wanted level increase and disease chance
      let newWanted = player.wanted_level || 0;
      let isDisease = false;
      let diseaseType = "";

      if (venue.type === "companion") {
        // Increase wanted level (prostitution is illegal)
        const baseWantedIncrease = effects.wanted || Math.floor(Math.random() * 3) + 1;
        newWanted = Math.min(100, newWanted + baseWantedIncrease);

        // Disease chance based on venue quality and addiction level
        let diseaseChance = 0;
        if (venue.money_cost <= 50) { // Cheap venues (higher risk)
          diseaseChance = 15;
        } else if (venue.money_cost <= 100) { // Medium venues  
          diseaseChance = 8;
        } else if (venue.money_cost <= 150) { // Higher-end venues
          diseaseChance = 5;
        } else { // Luxury venues (lowest risk)
          diseaseChance = 2;
        }

        // Higher addiction increases disease risk
        if (newAddiction >= 70) {
          diseaseChance += 10;
        } else if (newAddiction >= 50) {
          diseaseChance += 5;
        }

        if (Math.random() * 100 < diseaseChance) {
          isDisease = true;
          diseaseType = "std";
        }
      }

      // Calculate final health considering disease
      let finalHealth = newHealth;
      if (isDisease) {
        finalHealth = Math.max(1, newHealth - 15);
      }

      // 4. Atualizar o jogador
      const { error: updateError } = await supabase
        .from("players")
        .update({
          money: newMoney,
          energy: newEnergy,
          health: finalHealth,
          addiction: newAddiction,
          reputation: newReputation,
          wanted_level: newWanted,
          is_hospitalized: isDisease,
          updated_at: new Date().toISOString(),
        })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // 5. Retornar os dados atualizados
      return {
        venue,
        newStats: {
          money: newMoney,
          energy: newEnergy,
          health: finalHealth,
          addiction: newAddiction,
          reputation: newReputation,
          wantedLevel: newWanted,
        },
        isDisease,
        diseaseType,
        wantedIncrease: venue.type === "companion" ? newWanted - (player.wanted_level || 0) : 0,
      };
    },
    onSuccess: (data) => {
      // Update game store with new stats
      const { newStats, isDisease, diseaseType, wantedIncrease } = data;
      const updateGameStore = useGameStore.getState().updatePlayerStats;

      updateGameStore({
        money: newStats.money,
        health: newStats.health,
        energy: newStats.energy,
        addiction: newStats.addiction,
        reputation: newStats.reputation,
        wantedLevel: newStats.wantedLevel,
        isHospitalized: isDisease,
      });

      // Invalidar queries relacionadas ao jogador
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["game-data"] });

      // Mostrar notificação de sucesso
      const { venue } = data;

      if (isDisease) {
        toast.dismiss(); // Clear previous notifications
        
        const diseaseMessages = [
          `🦠 FUCK! You caught an STD from a dirty whore! Your dick is burning! Hospital time!`,
          `💉 SHIT! That bitch gave you the clap! Your junk is fucked up - straight to the hospital!`,
          `🔥 DAMN! Your cock caught something nasty! Should've wrapped it up, you horny bastard!`,
          `🏥 OOPS! That slut infected your dick! Time to get your diseased meat treated!`,
          `😷 YIKES! You picked up some nasty STD! Your addiction made you careless, now you're hospitalized!`
        ];
        const randomDiseaseMsg = diseaseMessages[Math.floor(Math.random() * diseaseMessages.length)];
        
        toast.error(
          `${randomDiseaseMsg} (Addiction: ${newStats.addiction}%)`,
          { duration: 8000 }
        );
        return;
      }

      toast.dismiss(); // Clear previous notifications
      
      const effects = venue.effects || {};
      
      if (venue.type === "companion") {
        const venueMessages = [
          `🔥 You fucked some hot sluts at ${venue.name}! Your balls are empty but your energy is full!`,
          `💦 What a wild ride at ${venue.name}! Those whores drained your wallet but filled your energy tank!`,
          `🍑 You banged some fine bitches at ${venue.name}! Best money you ever spent on pussy!`,
          `💋 ${venue.name} delivered! Those prostitutes know how to work a cock and boost your energy!`,
          `🔞 Holy shit! ${venue.name} was amazing! Your dick is satisfied and your energy is recharged!`
        ];
        const randomVenueMsg = venueMessages[Math.floor(Math.random() * venueMessages.length)];
        
        let effectsText = "";
        if (effects.energy && effects.energy > 0) {
          effectsText += ` +${effects.energy} Energy`;
        }
        if (effects.addiction && effects.addiction > 0) {
          effectsText += `, +${effects.addiction}% Addiction`;
        }
        if (wantedIncrease > 0) {
          effectsText += `, +${wantedIncrease} Wanted Level`;
        }
        
        toast.success(`${randomVenueMsg}${effectsText}`, { duration: 6000 });
      } else {
        let message = `🎉 You visited ${venue.name}!`;
        if (effects.energy && effects.energy > 0) {
          message += ` +${effects.energy} Energy`;
        }
        if (effects.addiction && effects.addiction > 0) {
          message += `, +${effects.addiction}% Addiction`;
        }
        if (effects.reputation && effects.reputation > 0) {
          message += `, +${effects.reputation} Reputation`;
        }
        toast.success(message);
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao visitar venue"
      );
    },
  });
};
