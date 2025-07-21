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
  type: "drink" | "drug" | "brothel";
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

export interface VenueConsumable {
  id: string;
  venue_id: string;
  consumable_id: string;
  venue_price: number;
  venue_effects: {
    energy?: number;
    addiction?: number;
    health?: number;
    reputation?: number;
  };
  available: boolean;
  created_at: string;
  updated_at: string;
  venue?: NightlifeVenue;
  consumable?: NightlifeConsumable;
}

export const useNightlifeConsumables = () => {
  return useQuery({
    queryKey: ["nightlife-consumables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nightlife_consumables")
        .select("*")
        .eq("available", true)
        .order("price", { ascending: true });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        return data as unknown as NightlifeConsumable[];
      }

      return [];
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

      return [];
    },
  });
};

export const useNightlifeCharacters = (venueId?: string) => {
  return useQuery({
    queryKey: ["nightlife-characters", venueId],
    queryFn: async () => {

      let query = supabase
        .from("nightlife_consumables")
        .select("*")
        .eq("available", true)
        .eq("type", "brothel");

      const { data, error } = await query.order("price", { ascending: true });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        return data as unknown as NightlifeCharacter[];
      }

      return [];
    },
    enabled: true, // Sempre buscar todos os characters
  });
};

export const useVenueConsumables = (venueId: string) => {
  return useQuery({
    queryKey: ["venue-consumables", venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venue_consumables")
        .select(`
          *,
          venue:nightlife_venues(*),
          consumable:nightlife_consumables(*)
        `)
        .eq("venue_id", venueId)
        .eq("available", true)
        .order("venue_price", { ascending: true });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        return data as unknown as VenueConsumable[];
      }

      return [];
    },
    enabled: !!venueId,
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
        .from("nightlife_consumables")
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
        } else if (consumable.type === "brothel") {
          diseaseType = "std";
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
        
        const diseaseMessages = consumable.type === "drink" ? drinkDiseaseMessages : 
                            consumable.type === "brothel" ? [
                              `🦠 FUCK! You caught an STD from a dirty whore! Your dick is burning! Hospital time!`,
                              `💉 SHIT! That bitch gave you the clap! Your junk is fucked up - straight to the hospital!`,
                              `🔥 DAMN! Your cock caught something nasty! Should've wrapped it up, you horny bastard!`,
                              `🏥 OOPS! That slut infected your dick! Time to get your diseased meat treated!`
                            ] : drugDiseaseMessages;
        const randomDiseaseMsg = diseaseMessages[Math.floor(Math.random() * diseaseMessages.length)];

        toast.error(`${randomDiseaseMsg} (Addiction: ${newStats.addiction}%)`, {
          duration: 8000,
        });
        return;
      }

      toast.dismiss(); // Clear previous notifications
      
      // Different messages for drinks vs drugs vs brothel
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
      } else if (consumable.type === "drug") {
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
      } else if (consumable.type === "brothel") {
        const brothelMessages = [
          `🔥 You fucked ${consumable.name}! Wild and dirty!`,
          `💦 ${consumable.name} gave you the ride of your life!`,
          `🍑 You banged ${consumable.name} hard and rough!`,
          `💋 ${consumable.name} satisfied all your dirty desires!`,
          `🔞 You had wild sex with ${consumable.name}!`
        ];
        const randomBrothelMsg = brothelMessages[Math.floor(Math.random() * brothelMessages.length)];
        
        let effectsText = "";
        if (effects.energy) {
          const energyText = effects.energy >= 0 ? `+${effects.energy}` : `${effects.energy}`;
          effectsText += ` ${energyText} Energy`;
        }
        if (effects.reputation) {
          effectsText += `, +${effects.reputation} Reputation`;
        }
        if (effects.health) {
          const healthText = effects.health >= 0 ? `+${effects.health}` : `${effects.health}`;
          effectsText += `, ${healthText} Health`;
        }
        
        toast.success(`${randomBrothelMsg}${effectsText}`, { duration: 5000 });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao consumir item"
      );
    },
  });
};

export const useConsumeVenueItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      venueConsumableId,
    }: {
      playerId: string;
      venueConsumableId: string;
    }) => {

      // 1. Fetch venue-consumable information
      const { data: venueConsumable, error: venueConsumableError } = await supabase
        .from("venue_consumables")
        .select(`
          *,
          venue:nightlife_venues(*),
          consumable:nightlife_consumables(*)
        `)
        .eq("id", venueConsumableId)
        .single();

      if (venueConsumableError) throw venueConsumableError;
      if (!venueConsumable) throw new Error("Venue consumable not found");

      // 2. Check if player has enough money
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

      if (playerData.money < venueConsumable.venue_price) {
        throw new Error(
          `Insufficient money! You have $${playerData.money.toLocaleString()} but need $${venueConsumable.venue_price.toLocaleString()}`
        );
      }

      // Check if energy is full and item gives positive energy
      if (
        venueConsumable.venue_effects.energy &&
        venueConsumable.venue_effects.energy > 0 &&
        playerData.energy >= playerData.max_energy
      ) {
        throw new Error(
          `Energy is already full! You have ${playerData.energy}/${playerData.max_energy} energy`
        );
      }

      // 3. Calculate new stat values using venue-specific effects
      const effects = venueConsumable.venue_effects;
      const newMoney = playerData.money - venueConsumable.venue_price;
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

      // Overdose and disease logic (same as original)
      let overdoseChance = 0;
      let isOverdose = false;
      let isDisease = false;
      let diseaseType = "";

      if (newAddiction >= 80) {
        overdoseChance = 15;
      } else if (newAddiction >= 60) {
        overdoseChance = 8;
      } else if (newAddiction >= 40) {
        overdoseChance = 3;
      }

      if (venueConsumable.consumable?.type === "drug") {
        overdoseChance *= 2;
      }

      if (overdoseChance > 0 && Math.random() * 100 < overdoseChance) {
        isOverdose = true;
      }

      let diseaseChance = 0;
      if (newAddiction >= 70) {
        diseaseChance = 12;
      } else if (newAddiction >= 50) {
        diseaseChance = 6;
      } else if (newAddiction >= 30) {
        diseaseChance = 2;
      }

      if (diseaseChance > 0 && Math.random() * 100 < diseaseChance) {
        isDisease = true;
        if (venueConsumable.consumable?.type === "drink") {
          diseaseType = "cirrose";
        } else if (venueConsumable.consumable?.type === "brothel") {
          diseaseType = "std";
        } else {
          diseaseType = "dst";
        }
      }

      let finalHealth = newHealth;
      if (isOverdose) {
        finalHealth = Math.max(1, newHealth - 20);
      } else if (isDisease) {
        finalHealth = Math.max(1, newHealth - 15);
      }

      // 4. Update player
      const { error: updateError } = await supabase
        .from("players")
        .update({
          money: newMoney,
          health: finalHealth,
          energy: newEnergy,
          addiction: newAddiction,
          reputation: newReputation,
          is_hospitalized: isOverdose || isDisease,
          updated_at: new Date().toISOString(),
        })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // 5. Return updated data
      return {
        venueConsumable,
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
      // Update the gameStore directly
      const { newStats, isOverdose, isDisease } = data;
      const updateGameStore = useGameStore.getState().updatePlayerStats;

      updateGameStore({
        money: newStats.money,
        health: newStats.health,
        energy: newStats.energy,
        addiction: newStats.addiction,
        reputation: newStats.reputation,
        isHospitalized: isOverdose || isDisease,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["game-data"] });

      // Show success notification with venue context
      const { venueConsumable } = data;
      const venueName = venueConsumable.venue?.name || "Unknown Venue";
      const consumableName = venueConsumable.consumable?.name || "Unknown Item";
      const effects = venueConsumable.venue_effects;

      if (isOverdose) {
        toast.dismiss();
        
        const overdoseMessages = [
          `💊 FUCK! You overdosed at ${venueName}! Your body can't handle this shit anymore!`,
          `☠️ DAMN! Too much at ${venueName}, you druggie bastard! Hospital time!`,
          `🚑 SHIT! ${venueName}'s stuff is too strong! You almost killed yourself!`,
          `💀 OVERDOSE at ${venueName}! Your body is shutting down!`,
          `🏥 TOO MUCH at ${venueName}! You pushed your limits too far!`
        ];
        const randomOverdoseMsg = overdoseMessages[Math.floor(Math.random() * overdoseMessages.length)];
        
        toast.error(
          `${randomOverdoseMsg} (Addiction: ${newStats.addiction}%)`,
          { duration: 8000 }
        );
        return;
      }

      if (isDisease) {
        toast.dismiss();
        
        const diseaseMessages = venueConsumable.consumable?.type === "brothel" ? [
          `🦠 FUCK! You caught an STD at ${venueName}! Should've chosen a classier place!`,
          `💉 SHIT! ${venueName} gave you the clap! Your junk is fucked up!`,
          `🔥 DAMN! ${venueName}'s girls are dirty! Your cock caught something nasty!`,
          `🏥 OOPS! ${venueName} infected your dick! Time to get treated!`
        ] : [
          `🍺 LIVER FAILURE from ${venueName}'s booze! You drank yourself into a coma!`,
          `🤮 ${venueName}'s alcohol destroyed your liver! You're pissing blood!`,
          `💉 ${venueName}'s drugs were contaminated with nasty shit!`,
          `🦠 ${venueName} gave you a serious medical condition!`
        ];
        const randomDiseaseMsg = diseaseMessages[Math.floor(Math.random() * diseaseMessages.length)];

        toast.error(`${randomDiseaseMsg} (Addiction: ${newStats.addiction}%)`, {
          duration: 8000,
        });
        return;
      }

      toast.dismiss();
      
      // Success messages with venue context
      if (venueConsumable.consumable?.type === "drink") {
        const drinkMessages = [
          `🍺 You enjoyed ${consumableName} at ${venueName}! Premium venue, premium buzz!`,
          `🍻 ${consumableName} at ${venueName} hit different! Quality establishment!`,
          `🥃 ${venueName} serves the good stuff! That ${consumableName} was worth every penny!`,
          `🍷 Classy ${consumableName} at ${venueName}! You're drinking with style!`
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
      } else if (venueConsumable.consumable?.type === "drug") {
        const drugMessages = [
          `💊 ${consumableName} at ${venueName} is some premium shit! You're flying high!`,
          `💉 ${venueName}'s ${consumableName} hit like a truck! Quality drugs!`,
          `🚬 ${venueName} has the best ${consumableName} in town! You're completely wasted!`,
          `💀 ${consumableName} from ${venueName} is fire! Your brain is fried but you love it!`
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
      } else if (venueConsumable.consumable?.type === "brothel") {
        const brothelMessages = [
          `🔥 You fucked ${consumableName} at ${venueName}! Premium pussy!`,
          `💦 ${consumableName} at ${venueName} gave you the VIP treatment!`,
          `🍑 ${venueName}'s ${consumableName} was worth every dollar! Quality service!`,
          `💋 ${venueName} delivers! ${consumableName} satisfied all your desires!`
        ];
        const randomBrothelMsg = brothelMessages[Math.floor(Math.random() * brothelMessages.length)];
        
        let effectsText = "";
        if (effects.energy) {
          const energyText = effects.energy >= 0 ? `+${effects.energy}` : `${effects.energy}`;
          effectsText += ` ${energyText} Energy`;
        }
        if (effects.reputation) {
          effectsText += `, +${effects.reputation} Reputation`;
        }
        if (effects.health) {
          const healthText = effects.health >= 0 ? `+${effects.health}` : `${effects.health}`;
          effectsText += `, ${healthText} Health`;
        }
        
        toast.success(`${randomBrothelMsg}${effectsText}`, { duration: 5000 });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error consuming venue item"
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
