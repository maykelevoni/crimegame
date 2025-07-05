import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGameStore } from "@/stores/gameStore";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "weapon" | "vehicle" | "protection" | "consumable";
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

// MVP Shop Items - Simple but effective
const mockShopItems: ShopItem[] = [
  // WEAPONS - Affect crime success and damage
  {
    id: "knife-001",
    name: "Knife",
    description: "Basic blade for intimidation +10% success, +5% damage",
    price: 500,
    type: "weapon",
    rarity: "common",
    effects: { success_boost: 10, damage: 5 },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "pistol-001", 
    name: "Pistol",
    description: "Reliable firearm +20% success, +10% damage",
    price: 2000,
    type: "weapon",
    rarity: "rare",
    effects: { success_boost: 20, damage: 10 },
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "shotgun-001",
    name: "Shotgun", 
    description: "Devastating close-range weapon +30% success, +15% damage",
    price: 5000,
    type: "weapon",
    rarity: "epic",
    effects: { success_boost: 30, damage: 15 },
    image: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=150&h=150&fit=crop",
    inStock: true,
  },

  // VEHICLES - Affect escape chance
  {
    id: "motorcycle-001",
    name: "Motorcycle",
    description: "Fast bike for quick escapes +15% escape chance",
    price: 3000,
    type: "vehicle", 
    rarity: "common",
    effects: { escape_boost: 15 },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "car-001",
    name: "Car",
    description: "Reliable getaway vehicle +25% escape chance", 
    price: 8000,
    type: "vehicle",
    rarity: "rare", 
    effects: { escape_boost: 25 },
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "sportscar-001",
    name: "Sports Car",
    description: "High-speed escape machine +40% escape chance",
    price: 20000,
    type: "vehicle",
    rarity: "epic",
    effects: { escape_boost: 40 },
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&h=150&fit=crop", 
    inStock: true,
  },

  // PROTECTION - Reduce health loss
  {
    id: "vest-001",
    name: "Bulletproof Vest",
    description: "Basic protection -20% health loss in crimes",
    price: 1500,
    type: "protection",
    rarity: "common",
    effects: { health_protection: 20 },
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "armor-001", 
    name: "Body Armor",
    description: "Military-grade protection -40% health loss in crimes",
    price: 4000,
    type: "protection",
    rarity: "rare",
    effects: { health_protection: 40 },
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
    inStock: true,
  },

  // CONSUMABLES - Recovery items
  {
    id: "medkit-001",
    name: "Medical Kit",
    description: "Emergency health restoration +50 Health",
    price: 300,
    type: "consumable", 
    rarity: "common",
    effects: { health: 50 },
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "energy-001",
    name: "Energy Drink",
    description: "Quick energy boost +40 Energy",
    price: 200,
    type: "consumable",
    rarity: "common", 
    effects: { energy: 40 },
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    inStock: true,
  },
];

export const useShopItems = () => {
  return useQuery({
    queryKey: ["shop-items"],
    queryFn: async () => {
      // Por enquanto, retornamos dados mock com UUIDs válidos
      return mockShopItems;
    },
  });
};

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

      // 2. Get item information
      const item = mockShopItems.find((i) => i.id === itemId);

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
        const item = mockShopItems.find((i) => i.id === itemId);
        if (!item) throw new Error(`Item ${itemId} not found`);

        const itemCost =
          (item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price) * quantity;
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
