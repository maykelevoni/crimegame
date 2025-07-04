import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGameStore } from "@/stores/gameStore";
import { SupabaseService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useShopItems } from "./useShop";
import { useEquippedItems, calculateEquipmentBonuses } from "./useInventory";

export interface Robbery {
  id: string;
  name: string;
  description: string;
  type: "store" | "bank" | "jewelry" | "warehouse" | "mansion" | "casino";
  min_level: number;
  power_required: number; // NEW: Power requirement to beat this crime
  base_reward: number;
  max_reward: number;
  energy_cost: number;
  health_cost: number;
  risk_level: number;
  success_rate: number; // Base success percentage
  image_url: string;
}

// Mock data for robbery types - Now with power requirements
const mockRobberies: Robbery[] = [
  {
    id: "1",
    name: "Convenience Store",
    description: "A quick and easy robbery with low risk",
    type: "store",
    min_level: 1,
    power_required: 10, // Very easy - new players can beat this
    base_reward: 25,
    max_reward: 75,
    energy_cost: 5,
    health_cost: 10,
    risk_level: 1,
    success_rate: 90, // 100 - 10 = 90% success (risk_level 1 = 10% risk)
    image_url: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=150&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Gas Station",
    description: "Hit a gas station at night",
    type: "store",
    min_level: 2,
    power_required: 25, // Need some reputation + equipment
    base_reward: 40,
    max_reward: 100,
    energy_cost: 8,
    health_cost: 12,
    risk_level: 1,
    success_rate: 90, // Same as convenience store (risk_level 1 = 10% risk)
    image_url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=150&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Jewelry Store",
    description: "Steal valuable diamonds and gold",
    type: "jewelry",
    min_level: 3,
    power_required: 50, // Medium difficulty
    base_reward: 75,
    max_reward: 200,
    energy_cost: 10,
    health_cost: 15,
    risk_level: 3,
    success_rate: 70, // 100 - 30 = 70% success (risk_level 3 = 30% risk)
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
  },
  {
    id: "4",
    name: "ATM Heist",
    description: "Break into an ATM machine",
    type: "bank",
    min_level: 4,
    power_required: 80, // Requires good equipment
    base_reward: 120,
    max_reward: 300,
    energy_cost: 12,
    health_cost: 18,
    risk_level: 2,
    success_rate: 80, // 100 - 20 = 80% success (risk_level 2 = 20% risk)
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop",
  },
  {
    id: "5",
    name: "Warehouse",
    description: "Loot valuable cargo from a warehouse",
    type: "warehouse",
    min_level: 5,
    power_required: 120, // Need reputation + good gear
    base_reward: 100,
    max_reward: 300,
    energy_cost: 15,
    health_cost: 20,
    risk_level: 2,
    success_rate: 80, // 100 - 20 = 80% success (risk_level 2 = 20% risk)
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&h=150&fit=crop",
  },
  {
    id: "6",
    name: "Armored Truck",
    description: "Rob an armored money transport",
    type: "bank",
    min_level: 7,
    power_required: 200, // High difficulty
    base_reward: 250,
    max_reward: 600,
    energy_cost: 20,
    health_cost: 25,
    risk_level: 4,
    success_rate: 60, // 100 - 40 = 60% success (risk_level 4 = 40% risk)
    image_url: "https://images.unsplash.com/photo-1494515843206-f3117ffc2c15?w=150&h=150&fit=crop",
  },
  {
    id: "7",
    name: "Bank Branch",
    description: "High stakes bank robbery",
    type: "bank",
    min_level: 10,
    power_required: 350, // Very high difficulty
    base_reward: 400,
    max_reward: 1000,
    energy_cost: 25,
    health_cost: 30,
    risk_level: 5,
    success_rate: 25, // Low success rate
    image_url: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=150&h=150&fit=crop",
  },
  {
    id: "8",
    name: "Mansion",
    description: "Rob a wealthy mansion with luxury items",
    type: "mansion",
    min_level: 12,
    power_required: 500, // Elite level required
    base_reward: 300,
    max_reward: 800,
    energy_cost: 25,
    health_cost: 30,
    risk_level: 4,
    success_rate: 30, // Low success rate
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=150&h=150&fit=crop",
  },
  {
    id: "9",
    name: "Casino Vault",
    description: "The ultimate heist - rob the casino vault",
    type: "casino",
    min_level: 15,
    power_required: 750, // Master criminal level
    base_reward: 600,
    max_reward: 2000,
    energy_cost: 35,
    health_cost: 40,
    risk_level: 6,
    success_rate: 15, // Very low success rate
    image_url: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=150&h=150&fit=crop",
  },
  {
    id: "10",
    name: "Federal Reserve",
    description: "The most dangerous heist possible",
    type: "bank",
    min_level: 20,
    power_required: 1200, // Legendary difficulty
    base_reward: 1000,
    max_reward: 5000,
    energy_cost: 50,
    health_cost: 50,
    risk_level: 8,
    success_rate: 10, // Extremely low success rate
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop",
  },
];

export const useRobberies = () => {
  const { player } = useGameStore();
  
  return useQuery({
    queryKey: ["robberies", player?.stats?.level],
    queryFn: async () => {
      const playerLevel = player?.stats?.level || 1;
      
      console.log(`🎯 ROBBERIES: Player level ${playerLevel}, showing all crimes...`);
      
      // Show all robberies sorted by min_level (they'll be disabled in UI if level requirement not met)
      const availableRobberies = mockRobberies
        .sort((a, b) => a.min_level - b.min_level);
        
      availableRobberies.forEach(robbery => {
        const canAccess = robbery.min_level <= playerLevel;
        console.log(`🎯 Crime "${robbery.name}" (req level ${robbery.min_level}): ${canAccess ? 'AVAILABLE' : 'LOCKED'}`);
      });
      
      console.log(`🎯 Total crimes shown: ${availableRobberies.length}`);
      return availableRobberies;
    },
  });
};

export const useExecuteRobbery = () => {
  const queryClient = useQueryClient();
  const { updatePlayerStats, updatePlayerMoney, addReputation, player } = useGameStore();
  const { user } = useAuth();
  const { data: shopItems = [] } = useShopItems();
  const { data: equippedItems = [] } = useEquippedItems(player?.id || "");

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

      // Calculate equipment bonuses before sending to server
      const equipmentBonuses = calculateEquipmentBonuses(equippedItems, shopItems);
      
      console.log('🎒 Equipment bonuses for robbery:', equipmentBonuses);
      console.log('🎒 Equipped items:', equippedItems);
      console.log('🎒 Shop items:', shopItems);

      // SECURITY: All calculations now happen server-side
      // This prevents client-side manipulation of game logic
      const result = await SupabaseService.executeRobbery(
        playerId,
        robberyId,
        user.id,
        equipmentBonuses
      );

      // Update local store with server-calculated values
      updatePlayerStats({
        energy: result.newStats.energy,
        health: result.newStats.health,
        reputation: result.newStats.reputation,
        wantedLevel: result.newStats.wantedLevel,
        money: result.newStats.money, // Set total money from database
      });

      // Award reputation for robbery (5-15 rep based on success and difficulty)
      const baseRep = result.success ? 10 : 5;
      const robberyData = mockRobberies.find(r => r.id === robberyId);
      const repMultiplier = robberyData ? robberyData.risk_level : 1;
      const totalRep = baseRep * repMultiplier;
      
      addReputation(totalRep);

      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["playerData"] });
    },
  });
};