import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGameStore } from "@/stores/gameStore";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "weapon" | "armor" | "style" | "accessory" | "consumable" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  effects: {
    damage?: number;
    defense?: number;
    health?: number;
    energy?: number;
    addiction?: number;
    reputation?: number;
    success_boost?: number; // Crime success rate increase
    escape_boost?: number; // Escape chance increase
    health_protection?: number; // Health loss reduction
  };
  image: string;
  inStock: boolean;
  discount?: number;
}

// Mapping functions for rarity values
const rarityFromDb = (rarity: "comum" | "raro" | "epico" | "lendario" | null | undefined): "common" | "rare" | "epic" | "legendary" => {
  if (!rarity) return "common";
  const mapping = { comum: "common", raro: "rare", epico: "epic", lendario: "legendary" } as const;
  return mapping[rarity] || "common";
};

// Mock data removed - all items now loaded from database

export const useShopItems = () => {
  return useQuery({
    queryKey: ["shop-items"],
    queryFn: async () => {
      try {
        // Load items directly from database
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .order('price', { ascending: true });
        
        if (itemsData && itemsData.length > 0) {
          // Transform database items to ShopItem format
          return itemsData.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            type: item.type as ShopItem['type'],
            rarity: rarityFromDb(item.rarity),
            effects: item.bonus || {},
            image: item.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center',
            inStock: true,
            discount: 0,
          })) as ShopItem[];
        }
        
        // If table doesn't exist or is empty, return empty array
        // Migration should be run to populate the table
        return [];
      } catch (error) {
        console.error('Error loading shop items:', error);
        return [];
      }
    },
  });
};

// populateInitialItems function removed - items now managed via database migrations

export const useBuyItem = () => {
  const queryClient = useQueryClient();
  const { updatePlayerMoney } = useGameStore();

  return useMutation({
    mutationFn: async ({
      playerId,
      itemId,
      quantity = 1,
    }: {
      playerId: string;
      itemId: string;
      quantity?: number;
    }) => {
      // Em produção, isso seria uma transação no banco
      // Por enquanto, simulamos a compra


      // 1. Check if player has enough money
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("money")
        .eq("id", playerId)
        .single();


      if (playerError) {
        throw playerError;
      }

      // 2. Get item information from database
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();
      
      if (itemError) throw itemError;
      
      const item = {
        id: itemData.id,
        name: itemData.name,
        description: itemData.description || '',
        price: itemData.price,
        type: itemData.type,
        rarity: rarityFromDb(itemData.rarity),
        effects: itemData.bonus || {},
        image: itemData.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center',
        inStock: itemData.available,
        discount: 0,
      } as ShopItem;

      if (!item) throw new Error("Item not found");

      const totalCost =
        (item.discount ? item.price * (1 - item.discount / 100) : item.price) *
        quantity;

      if (player.money < totalCost) {
        throw new Error(
          `Not enough money! You have $${player.money.toLocaleString()} but need $${totalCost.toLocaleString()}`
        );
      }

      // 3. Update player money
      const newMoney = player.money - totalCost;
      
      const { data: updateData, error: updateError } = await supabase
        .from("players")
        .update({ money: newMoney })
        .eq("id", playerId)
        .select();


      if (updateError) {
        throw updateError;
      }

      // 4. For now, let's use a simple local storage approach for inventory
      // This will work immediately while we figure out the database schema
      
      try {
        const localInventoryKey = `inventory_${playerId}`;
        const existingInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        // Check if item already exists
        const existingItemIndex = existingInventory.findIndex((item: any) => item.item_id === itemId);
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          existingInventory[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          existingInventory.push({
            id: crypto.randomUUID(),
            player_id: playerId,
            item_id: itemId,
            weapon_id: itemId, // Keep both for compatibility
            quantity: quantity,
            equipped: false,
            created_at: new Date().toISOString()
          });
        }
        
        localStorage.setItem(localInventoryKey, JSON.stringify(existingInventory));
        
      } catch (error) {
      }

      // 5. Update local game store to reflect new money amount
      updatePlayerMoney(-totalCost); // This will subtract the cost from current money

      return { success: true, item, cost: totalCost };
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ["player", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventory", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gameStore"],
      });
    },
  });
};

export const useBuyMultipleItems = () => {
  const queryClient = useQueryClient();
  const { updatePlayerMoney } = useGameStore();

  return useMutation({
    mutationFn: async ({
      playerId,
      items,
    }: {
      playerId: string;
      items: { itemId: string; quantity: number }[];
    }) => {
      // Em produção, isso seria uma transação no banco

      // 1. Verificar dinheiro total necessário
      let totalCost = 0;

      for (const { itemId, quantity } of items) {
        const { data: itemData, error: itemError } = await supabase
          .from('items')
          .select('price')
          .eq('id', itemId)
          .single();
        
        if (itemError) throw new Error(`Item ${itemId} not found`);

        const itemCost = itemData.price * quantity;
        totalCost += itemCost;
      }

      // 2. Verificar se o jogador tem dinheiro suficiente
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("money")
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;

      if (player.money < totalCost) {
        throw new Error(
          `Not enough money! You have $${player.money.toLocaleString()} but need $${totalCost.toLocaleString()}`
        );
      }

      // 3. Atualizar dinheiro do jogador
      const { error: updateError } = await supabase
        .from("players")
        .update({ money: player.money - totalCost })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // 4. Add all items to local storage inventory
      
      try {
        const localInventoryKey = `inventory_${playerId}`;
        const existingInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        for (const { itemId, quantity } of items) {
          // Check if item already exists
          const existingItemIndex = existingInventory.findIndex((item: any) => item.item_id === itemId);
          
          if (existingItemIndex >= 0) {
            // Update existing item quantity
            existingInventory[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            existingInventory.push({
              id: crypto.randomUUID(),
              player_id: playerId,
              item_id: itemId,
              weapon_id: itemId, // Keep both for compatibility
              quantity: quantity,
              equipped: false,
              created_at: new Date().toISOString()
            });
          }
        }
        
        localStorage.setItem(localInventoryKey, JSON.stringify(existingInventory));
        
      } catch (error) {
      }

      // 5. Update local game store to reflect new money amount
      updatePlayerMoney(-totalCost); // This will subtract the total cost from current money

      return { success: true, totalCost };
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ["player", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["inventory", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gameStore"],
      });
    },
  });
};
