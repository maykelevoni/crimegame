import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGameStore } from "@/stores/gameStore";

export interface Robbery {
  id: string;
  name: string;
  description: string;
  type: "store" | "bank" | "jewelry" | "warehouse" | "mansion" | "casino";
  min_level: number;
  energy_cost: number;
  health_cost: number;
  success_rate: number;
  base_reward: number;
  max_reward: number;
  risk_level: number;
  required_equipment: string[];
  location: string;
  available: boolean;
  cooldown_minutes: number;
  created_at: string;
}

// Mock data for robberies until database is properly set up
const mockRobberies: Robbery[] = [
  {
    id: "1",
    name: "Convenience Store",
    description: "A small convenience store with basic security",
    type: "store",
    min_level: 0,
    energy_cost: 10,
    health_cost: 0,
    success_rate: 70,
    base_reward: 50,
    max_reward: 200,
    risk_level: 1,
    required_equipment: ["lockpick"],
    location: "Downtown",
    available: true,
    cooldown_minutes: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Gas Station",
    description: "A gas station with minimal security",
    type: "store",
    min_level: 2,
    energy_cost: 15,
    health_cost: 5,
    success_rate: 65,
    base_reward: 75,
    max_reward: 300,
    risk_level: 1,
    required_equipment: ["lockpick"],
    location: "Suburbs",
    available: true,
    cooldown_minutes: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Jewelry Store",
    description: "A jewelry store with better security",
    type: "jewelry",
    min_level: 5,
    energy_cost: 25,
    health_cost: 20,
    success_rate: 50,
    base_reward: 200,
    max_reward: 800,
    risk_level: 2,
    required_equipment: ["lockpick", "crowbar"],
    location: "Mall District",
    available: true,
    cooldown_minutes: 30,
    created_at: new Date().toISOString(),
  },
];

export const useRobberies = () => {
  return useQuery({
    queryKey: ["robberies"],
    queryFn: async () => {
      return mockRobberies;
    },
  });
};

export const useExecuteRobbery = () => {
  const queryClient = useQueryClient();
  const { updatePlayerStats, updatePlayerMoney } = useGameStore();

  return useMutation({
    mutationFn: async ({
      playerId,
      robberyId,
    }: {
      playerId: string;
      robberyId: string;
    }) => {
      // Find the robbery from mock data
      const robbery = mockRobberies.find((r) => r.id === robberyId);
      if (!robbery) {
        throw new Error("Robbery not found");
      }

      // Get current player data from store
      const store = useGameStore.getState();
      const currentPlayer = store.player;

      // Check requirements
      if (currentPlayer.stats.reputation < robbery.min_level) {
        throw new Error(`Required reputation: ${robbery.min_level}`);
      }

      if (currentPlayer.stats.energy < robbery.energy_cost) {
        throw new Error("Not enough energy");
      }

      // Calculate success and reward
      const success = Math.random() * 100 < robbery.success_rate;
      const reward = success
        ? Math.floor(
            Math.random() * (robbery.max_reward - robbery.base_reward) +
              robbery.base_reward
          )
        : 0;

      // Calculate reputation gain (success = +1, failure = +0)
      const reputationGain = success ? 1 : 0;

      // Calculate wanted level increase
      const wantedIncrease = robbery.risk_level + 1;
      const currentWanted = currentPlayer.stats.wantedLevel;
      const newWanted = Math.min(10, currentWanted + wantedIncrease);

      // Calculate new values
      const newEnergy = Math.max(
        0,
        currentPlayer.stats.energy - robbery.energy_cost
      );
      const newHealth = Math.max(
        0,
        currentPlayer.stats.health -
          Math.floor(Math.random() * (robbery.health_cost + 1))
      );
      const newReputation = currentPlayer.stats.reputation + reputationGain;
      const newMoney = currentPlayer.stats.money + reward;

      console.log("🔍 Debug - Executando roubo:", {
        robbery: robbery.name,
        currentEnergy: currentPlayer.stats.energy,
        newEnergy,
        currentHealth: currentPlayer.stats.health,
        newHealth,
        currentReputation: currentPlayer.stats.reputation,
        newReputation,
        currentWanted,
        newWanted,
        reward,
        success,
      });

      // Update database
      const updateData = {
        energy: newEnergy,
        health: newHealth,
        money: newMoney,
        reputation: newReputation,
        updated_at: new Date().toISOString(),
      };

      console.log("🔍 Debug - Dados para atualizar:", updateData);

      const { error: updateError } = await supabase
        .from("players")
        .update(updateData)
        .eq("id", playerId);

      if (updateError) {
        console.error("❌ Erro ao atualizar player:", updateError);
        console.error("❌ Dados que tentou atualizar:", updateData);
        throw updateError;
      }

      console.log("✅ Player atualizado no banco!");

      // Update local store
      updatePlayerStats({
        energy: newEnergy,
        health: newHealth,
        reputation: newReputation,
        wantedLevel: newWanted,
      });

      if (reward > 0) {
        updatePlayerMoney(reward);
      }

      console.log("✅ Store local atualizado!");

      return {
        success,
        reward,
        reputation_gained: reputationGain,
        wanted_increase: wantedIncrease,
        energy_spent: robbery.energy_cost,
        health_spent: Math.floor(Math.random() * (robbery.health_cost + 1)),
        robbery,
      };
    },
    onSuccess: () => {
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["playerData"] });
    },
  });
};
