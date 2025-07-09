import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGameStore } from "@/stores/gameStore";
import { SupabaseService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useShopItems } from "./useShop";
import { useEquippedItems, calculateEquipmentBonuses } from "./useInventory";

export interface Crime {
  id: string;
  name: string;
  description: string;
  type: string;
  min_level: number;
  reward: number;
  energy_cost: number;
  risk: number;
  created_at: string;
  image_url?: string;
}

export const useCrimes = () => {
  const { player } = useGameStore();
  
  return useQuery({
    queryKey: ["crimes", player?.stats?.level],
    queryFn: async () => {
      try {
        // Fetch crimes from database
        const { data: crimes, error } = await supabase
          .from('crimes')
          .select('*')
          .order('min_level', { ascending: true });
        
        if (error) throw error;
        
        return crimes || [];
      } catch (error) {
        console.error('Error fetching crimes:', error);
        return [];
      }
    },
  });
};

export const useExecuteCrime = () => {
  const queryClient = useQueryClient();
  const { updatePlayerStats, updatePlayerMoney, addReputation, player } = useGameStore();
  const { user } = useAuth();
  const { data: shopItems = [] } = useShopItems();
  const { data: equippedItems = [] } = useEquippedItems(player?.id || "");

  return useMutation({
    mutationFn: async ({
      playerId,
      crimeId,
    }: {
      playerId: string;
      crimeId: string;
    }) => {
      if (!user?.id) {
        throw new Error("Authentication required");
      }

      // Calculate equipment bonuses before sending to server
      const equipmentBonuses = calculateEquipmentBonuses(equippedItems, shopItems);
      
      // Use the same server-side execution method but for crimes
      const result = await SupabaseService.executeRobbery(
        playerId,
        crimeId,
        user.id,
        equipmentBonuses
      );

      // Update local store with server-calculated values
      updatePlayerStats({
        energy: result.newStats.energy,
        health: result.newStats.health,
        reputation: result.newStats.reputation,
        wantedLevel: result.newStats.wantedLevel,
        money: result.newStats.money,
      });

      // Award reputation for crime (5-15 rep based on success and difficulty)
      const baseRep = result.success ? 10 : 5;
      const { data: crimeData } = await supabase
        .from('crimes')
        .select('risk')
        .eq('id', crimeId)
        .single();
      
      const repMultiplier = crimeData ? Math.floor(crimeData.risk / 10) : 1;
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