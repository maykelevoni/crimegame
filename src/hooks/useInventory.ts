import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShopItem } from "./useShop";

export interface InventoryItem {
  id: string;
  player_id: string;
  item_id: string | null; // Generic item_id for all types
  quantity: number;
  equipped?: boolean; // Optional since it's not in database yet
  created_at: string;
  item?: ShopItem; // Joined item details
}

export const usePlayerInventory = (playerId: string) => {
  return useQuery({
    queryKey: ["inventory", playerId],
    queryFn: async () => {
      // Load inventory from localStorage
      try {
        const localInventoryKey = `inventory_${playerId}`;
        let localInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        
        // Clean up corrupted inventory items (ones without valid item_id)
        const originalLength = localInventory.length;
        localInventory = localInventory.filter((item: any) => 
          item.item_id && typeof item.item_id === 'string' && item.item_id.length > 0
        );
        
        // Save cleaned inventory back if we removed items
        if (localInventory.length !== originalLength) {
          localStorage.setItem(localInventoryKey, JSON.stringify(localInventory));
        }
        
        if (localInventory.length === 0) {
          return [];
        }

        // Get item IDs to fetch details
        const itemIds = localInventory.map((item: any) => item.item_id || item.weapon_id).filter(Boolean);
        
        if (itemIds.length === 0) {
          return [];
        }

        // Fetch item details from database
        const { data: itemsData, error } = await supabase
          .from('items')
          .select('*')
          .in('id', itemIds);
        
        if (error) {
          console.error('Error fetching item details:', error);
          return [];
        }

        // Convert to InventoryItem format with item details
        const inventoryItems: InventoryItem[] = localInventory.map((item: any) => {
          const itemDetails = itemsData?.find(dbItem => dbItem.id === (item.item_id || item.weapon_id));
          
          return {
            id: item.id,
            player_id: item.player_id,
            item_id: item.item_id || item.weapon_id,
            quantity: item.quantity,
            equipped: item.equipped || false,
            created_at: item.created_at,
            item: itemDetails ? {
              id: itemDetails.id,
              name: itemDetails.name,
              description: itemDetails.description,
              price: itemDetails.price,
              type: itemDetails.type as any,
              rarity: itemDetails.rarity as any,
              effects: itemDetails.bonus || {},
              image: itemDetails.image || itemDetails.image_url || '',
              inStock: itemDetails.available || true,
              discount: 0,
            } : undefined
          };
        }).filter(item => item.item); // Only return items that have valid item details
        
        return inventoryItems;
      } catch (error) {
        console.error('Error loading inventory:', error);
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

      try {
        const localInventoryKey = `inventory_${playerId}`;
        const localInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        // Filter only equipped items
        const equippedItems = localInventory.filter((item: any) => item.equipped === true);
        
        
        // Convert to InventoryItem format
        const inventoryItems: InventoryItem[] = equippedItems.map((item: any) => ({
          id: item.id,
          player_id: item.player_id,
          item_id: item.item_id || item.weapon_id,
          quantity: item.quantity,
          equipped: item.equipped,
          created_at: item.created_at
        }));
        
        return inventoryItems;
      } catch (error) {
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
    const shopItem = shopItems.find(item => item.id === inventoryItem.item_id);
    if (shopItem && shopItem.effects) {
      totalBonuses.success_boost += shopItem.effects.success_boost || 0;
      totalBonuses.escape_boost += shopItem.effects.escape_boost || 0;
      totalBonuses.health_protection += shopItem.effects.health_protection || 0;
      totalBonuses.damage += shopItem.effects.damage || 0;
    }
  });

  return totalBonuses;
};