import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGameStore } from "@/stores/gameStore";
import { SupabaseService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Robbery {
  id: string;
  name: string;
  description: string;
  type: "store" | "bank" | "jewelry" | "warehouse" | "mansion" | "casino";
  min_level: number;
  success_rate: number;
  base_reward: number;
  max_reward: number;
  energy_cost: number;
  health_cost: number;
  risk_level: number;
  image_url: string;
}

// Mock data for robbery types (to be replaced with database queries)
const mockRobberies: Robbery[] = [
  {
    id: "1",
    name: "Convenience Store",
    description: "A quick and easy robbery with low risk",
    type: "store",
    min_level: 0,
    success_rate: 70,
    base_reward: 50,
    max_reward: 150,
    energy_cost: 5,
    health_cost: 10,
    risk_level: 1,
    image_url: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=150&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Bank",
    description: "High stakes robbery with massive rewards",
    type: "bank",
    min_level: 10,
    success_rate: 25,
    base_reward: 500,
    max_reward: 2000,
    energy_cost: 20,
    health_cost: 25,
    risk_level: 5,
    image_url: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Jewelry Store",
    description: "Steal valuable diamonds and gold",
    type: "jewelry",
    min_level: 5,
    success_rate: 50,
    base_reward: 200,
    max_reward: 800,
    energy_cost: 10,
    health_cost: 15,
    risk_level: 3,
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
  },
  {
    id: "4",
    name: "Warehouse",
    description: "Loot valuable cargo from a warehouse",
    type: "warehouse",
    min_level: 8,
    success_rate: 60,
    base_reward: 300,
    max_reward: 1000,
    energy_cost: 15,
    health_cost: 20,
    risk_level: 2,
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&h=150&fit=crop",
  },
  {
    id: "5",
    name: "Mansion",
    description: "Rob a wealthy mansion with luxury items",
    type: "mansion",
    min_level: 15,
    success_rate: 35,
    base_reward: 800,
    max_reward: 3000,
    energy_cost: 25,
    health_cost: 30,
    risk_level: 4,
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=150&h=150&fit=crop",
  },
  {
    id: "6",
    name: "Casino",
    description: "The ultimate heist - rob the casino vault",
    type: "casino",
    min_level: 25,
    success_rate: 15,
    base_reward: 2000,
    max_reward: 10000,
    energy_cost: 35,
    health_cost: 40,
    risk_level: 6,
    image_url: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=150&h=150&fit=crop",
  },
];

export const useRobberies = () => {
  return useQuery({
    queryKey: ["robberies"],
    queryFn: async () => {
      // TODO: Replace with actual database query
      // Sort by reputation required (min_level)
      return mockRobberies.sort((a, b) => a.min_level - b.min_level);
    },
  });
};

export const useExecuteRobbery = () => {
  const queryClient = useQueryClient();
  const { updatePlayerStats, updatePlayerMoney } = useGameStore();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      playerId,
      robberyId,
    }: {
      playerId: string;
      robberyId: string;
    }) => {
      if (!user?.id) {
        throw new Error("Authentication required");
      }

      // SECURITY: All calculations now happen server-side
      // This prevents client-side manipulation of game logic
      const result = await SupabaseService.executeRobbery(
        playerId,
        robberyId,
        user.id
      );

      // Update local store with server-calculated values
      updatePlayerStats({
        energy: result.newStats.energy,
        health: result.newStats.health,
        reputation: result.newStats.reputation,
        wantedLevel: result.newStats.wantedLevel,
      });

      updatePlayerMoney(result.reward);

      // Show result to user
      if (result.success) {
        toast.success(
          `🎯 Robbery successful! Gained $${result.reward.toLocaleString()}`,
          { duration: 5000 }
        );
      } else {
        toast.error("💥 Robbery failed! You escaped empty-handed.", {
          duration: 5000,
        });
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["playerData"] });
    },
  });
};