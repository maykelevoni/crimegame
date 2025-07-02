import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShopItem } from "./useShop";

export interface InventoryItem {
  id: string;
  player_id: string;
  weapon_id: string | null; // Using weapon_id from database
  quantity: number;
  equipped?: boolean; // Optional since it's not in database yet
  created_at: string;
  item?: ShopItem; // Joined item details
}

export const usePlayerInventory = (playerId: string) => {
  return useQuery({
    queryKey: ["inventory", playerId],
    queryFn: async () => {
      console.log("🎒 DEBUG: Fetching inventory for player:", playerId);

      // For now, use localStorage instead of database
      try {
        const localInventoryKey = `inventory_${playerId}`;
        const localInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        console.log("📦 DEBUG: Local inventory result:", localInventory);
        
        // Convert to InventoryItem format
        const inventoryItems: InventoryItem[] = localInventory.map((item: any) => ({
          id: item.id,
          player_id: item.player_id,
          weapon_id: item.item_id || item.weapon_id,
          quantity: item.quantity,
          equipped: item.equipped || false,
          created_at: item.created_at
        }));
        
        return inventoryItems;
      } catch (error) {
        console.error("Error fetching local inventory:", error);
        return [];
      }
    },
    enabled: !!playerId,
  });
};

// Get equipped items for calculating bonuses
export const useEquippedItems = (playerId: string) => {
  return useQuery({
    queryKey: ["equipped-items", playerId],
    queryFn: async () => {
      console.log("🎒 DEBUG: Fetching equipped items for player:", playerId);

      try {
        const localInventoryKey = `inventory_${playerId}`;
        const localInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        // Filter only equipped items
        const equippedItems = localInventory.filter((item: any) => item.equipped === true);
        
        console.log("⚔️ DEBUG: Equipped items found:", equippedItems);
        
        // Convert to InventoryItem format
        const inventoryItems: InventoryItem[] = equippedItems.map((item: any) => ({
          id: item.id,
          player_id: item.player_id,
          weapon_id: item.item_id || item.weapon_id,
          quantity: item.quantity,
          equipped: item.equipped,
          created_at: item.created_at
        }));
        
        return inventoryItems;
      } catch (error) {
        console.error("Error fetching equipped items:", error);
        return [];
      }
    },
    enabled: !!playerId,
  });
};

// Calculate total bonuses from equipped items
export const calculateEquipmentBonuses = (equippedItems: InventoryItem[], shopItems: ShopItem[]) => {
  let totalBonuses = {
    success_boost: 0,
    escape_boost: 0,
    health_protection: 0,
    damage: 0,
  };

  equippedItems.forEach((inventoryItem) => {
    const shopItem = shopItems.find(item => item.id === inventoryItem.weapon_id);
    if (shopItem && shopItem.effects) {
      totalBonuses.success_boost += shopItem.effects.success_boost || 0;
      totalBonuses.escape_boost += shopItem.effects.escape_boost || 0;
      totalBonuses.health_protection += shopItem.effects.health_protection || 0;
      totalBonuses.damage += shopItem.effects.damage || 0;
    }
  });

  return totalBonuses;
};