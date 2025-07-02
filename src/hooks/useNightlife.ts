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
      console.log("🔍 DEBUG: Fetching nightlife consumables...");

      const { data, error } = await supabase
        .from("consumables")
        .select("*")
        .eq("available", true)
        .order("price", { ascending: true });

      console.log("📊 DEBUG: Search result:", { data, error });

      if (error) {
        console.error("Error fetching consumables:", error);
        throw error;
      }

      return data as unknown as NightlifeConsumable[];
    },
  });
};

export const useNightlifeVenues = () => {
  return useQuery({
    queryKey: ["nightlife-venues"],
    queryFn: async () => {
      console.log("🔍 DEBUG: Fetching nightlife venues...");

      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("available", true)
        .order("money_cost", { ascending: true });

      console.log("📊 DEBUG: Venues search result:", { data, error });

      if (error) {
        console.error("Error fetching venues:", error);
        throw error;
      }

      return data as unknown as NightlifeVenue[];
    },
  });
};

export const useNightlifeCharacters = (venueId?: string) => {
  return useQuery({
    queryKey: ["nightlife-characters", venueId],
    queryFn: async () => {
      console.log("🔍 DEBUG: Buscando characters do nightlife...");

      let query = supabase
        .from("prostitutes")
        .select("*")
        .eq("available", true);

      if (venueId) {
        query = query.eq("venue_id", venueId);
      }

      const { data, error } = await query.order("price", { ascending: true });

      console.log("📊 DEBUG: Characters search result:", { data, error });

      if (error) {
        console.error("Error fetching characters:", error);
        throw error;
      }

      return data as unknown as NightlifeCharacter[];
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
      console.log("🍺 DEBUG: Starting item consumption");
      console.log("Player ID:", playerId);
      console.log("Consumable ID:", consumableId);

      // 1. Fetch consumable information
      const { data: consumable, error: consumableError } = await supabase
        .from("consumables")
        .select("*")
        .eq("id", consumableId)
        .single();

      console.log("🔍 DEBUG: Buscando consumível...");
      console.log("Consumable encontrado:", consumable);
      console.log("Consumable error:", consumableError);

      if (consumableError) throw consumableError;
      if (!consumable) throw new Error("Consumível não encontrado");

      console.log(
        "📊 DEBUG: Effects do consumível:",
        consumable.effects
      );

      // 2. Verificar se o jogador tem dinheiro suficiente
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select(
          "money, health, energy, addiction, reputation, max_health, max_energy"
        )
        .eq("id", playerId)
        .single();

      console.log("👤 DEBUG: Searching for player...");
      console.log("Player found:", player);
      console.log("Player error:", playerError);

      if (playerError) {
        console.error("❌ Error fetching player:", playerError);
        throw playerError;
      }
      if (!player) throw new Error("Player not found");

      const playerData = player;

      console.log("💰 DEBUG: Verificando dinheiro...");
      console.log("Dinheiro atual:", playerData.money);
      console.log("Preço do item:", consumable.price);

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

      console.log("⚡ DEBUG: Checking energy...");
      console.log("Current energy:", playerData.energy);
      console.log("Max energy:", playerData.max_energy);
      console.log(
        "Item energy effect:",
        consumable.effects.energy
      );

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
        console.log("💊 DEBUG: OVERDOSE DETECTADA!");
        console.log("Vício atual:", newAddiction);
        console.log("Chance de overdose:", overdoseChance + "%");
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
          console.log("🍺 DEBUG: CIRROSE DETECTADA!");
        } else {
          diseaseType = "dst";
          console.log("💋 DEBUG: DST DETECTADA!");
        }
        console.log("Vício atual:", newAddiction);
        console.log("Chance de doença:", diseaseChance + "%");
      }

      console.log("📈 DEBUG: Calculando novos stats...");
      console.log("Stats antigos:", {
        money: playerData.money,
        health: playerData.health,
        energy: playerData.energy,
        addiction: playerData.addiction,
        reputation: playerData.reputation,
      });

      // Calcular vida final considerando overdose e doenças
      let finalHealth = newHealth;
      if (isOverdose) {
        finalHealth = Math.max(1, newHealth - 20);
      } else if (isDisease) {
        finalHealth = Math.max(1, newHealth - 15);
      }

      console.log("Stats novos:", {
        money: newMoney,
        health: finalHealth,
        energy: newEnergy,
        addiction: newAddiction,
        reputation: newReputation,
      });
      console.log("💊 DEBUG: Chance de overdose:", overdoseChance + "%");
      console.log("💊 DEBUG: Overdose aconteceu:", isOverdose);
      console.log("🦠 DEBUG: Chance de doença:", diseaseChance + "%");
      console.log("🦠 DEBUG: Doença aconteceu:", isDisease);
      console.log("🦠 DEBUG: Tipo de doença:", diseaseType);

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

      console.log("💾 DEBUG: Updating player...");
      console.log("isOverdose:", isOverdose);
      console.log("isDisease:", isDisease);
      console.log("is_hospitalized será:", isOverdose || isDisease);
      console.log("Update error:", updateError);

      if (updateError) throw updateError;

      console.log("✅ DEBUG: Jogador atualizado com sucesso!");

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
      console.log("🎉 DEBUG: onSuccess chamado!");
      console.log("Dados retornados:", data);

      // Atualizar o gameStore diretamente
      const { newStats, isOverdose, isDisease } = data;
      const updateGameStore = useGameStore.getState().updatePlayerStats;

      console.log("🔄 DEBUG: Atualizando gameStore com:", newStats);
      console.log("🏥 DEBUG: Status de hospitalização:", {
        isOverdose,
        isDisease,
      });

      updateGameStore({
        money: newStats.money,
        health: newStats.health,
        energy: newStats.energy,
        addiction: newStats.addiction,
        reputation: newStats.reputation,
        isHospitalized: isOverdose || isDisease, // Usar dados retornados
      });

      console.log(
        "✅ DEBUG: GameStore atualizado com isHospitalized:",
        isOverdose || isDisease
      );

      // Invalidar queries relacionadas ao jogador
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["game-data"] });

      console.log("🔄 DEBUG: Queries invalidadas");

      // Mostrar notificação de sucesso
      const { consumable } = data;
      const effects = consumable.effects;

      if (isOverdose) {
        toast.error(
          `💊 OVERDOSE! Você foi hospitalizado! Vício muito alto (${newStats.addiction}%) causou overdose`,
          { duration: 8000 }
        );
        return;
      }

      if (isDisease) {
        const diseaseMessage =
          consumable.type === "drink"
            ? `🍺 CIRROSE! Você foi hospitalizado! Muito álcool causou cirrose hepática`
            : `💋 DST! Você foi hospitalizado! Contratou uma doença sexualmente transmissível`;

        toast.error(`${diseaseMessage} (Vício: ${newStats.addiction}%)`, {
          duration: 8000,
        });
        return;
      }

      let message = `🍺 Você consumiu ${consumable.name}!`;
      if (effects.energy) {
        const energyText =
          effects.energy >= 0 ? `+${effects.energy}` : `${effects.energy}`;
        message += ` ${energyText} Energia`;
      }
      if (effects.addiction) {
        message += `, +${effects.addiction}% Vício`;
      }
      if (effects.health) {
        const healthText =
          effects.health >= 0 ? `+${effects.health}` : `${effects.health}`;
        message += `, ${healthText} Vida`;
      }
      if (effects.reputation) {
        const repText =
          effects.reputation >= 0
            ? `+${effects.reputation}`
            : `${effects.reputation}`;
        message += `, ${repText} Reputação`;
      }

      console.log("📢 DEBUG: Mensagem de toast:", message);
      toast.success(message);
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
        .from("venues")
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

      if (player.energy < venue.energy_cost) {
        throw new Error(
          `Insufficient energy! You have ${player.energy} but need ${venue.energy_cost}`
        );
      }

      // 3. Calcular novos valores dos stats
      const effects = venue.effects || {};
      const newMoney = player.money - venue.money_cost;
      const newEnergy = Math.max(0, player.energy - venue.energy_cost);
      const newHealth = Math.max(
        0,
        Math.min(player.max_health, player.health + (effects.health || 0))
      );
      const newEnergyGain = Math.max(
        0,
        Math.min(player.max_energy, newEnergy + (effects.energy || 0))
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
          console.log("💋 DEBUG: STD CONTRACTED!");
          console.log("Disease chance:", diseaseChance + "%");
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
          energy: newEnergyGain,
          health: finalHealth,
          addiction: newAddiction,
          reputation: newReputation,
          wanted_level: newWanted,
          is_hospitalized: isDisease, // Hospitalize if contracted disease
          updated_at: new Date().toISOString(),
        })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // 5. Retornar os dados atualizados
      return {
        venue,
        newStats: {
          money: newMoney,
          energy: newEnergyGain,
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
        toast.error(
          `💋 STD CONTRACTED! You were hospitalized! Visiting ${venue.name} caused a sexually transmitted disease (Addiction: ${newStats.addiction}%)`,
          { duration: 8000 }
        );
        return;
      }

      const effects = venue.effects || {};
      
      if (venue.type === "companion") {
        let message = `💋 You visited ${venue.name}!`;
        if (effects.energy && effects.energy > 0) {
          message += ` +${effects.energy} Energy`;
        }
        if (effects.addiction && effects.addiction > 0) {
          message += `, +${effects.addiction}% Addiction`;
        }
        if (wantedIncrease > 0) {
          message += `, +${wantedIncrease} Wanted Level`;
        }
        toast.success(message);
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
