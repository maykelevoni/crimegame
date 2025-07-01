import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "weapon" | "armor" | "consumable" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  stats: {
    damage?: number;
    defense?: number;
    health?: number;
    energy?: number;
    addiction?: number;
    reputation?: number;
  };
  image: string;
  inStock: boolean;
  discount?: number;
}

// Dados mock movidos para fora dos hooks
const mockShopItems: ShopItem[] = [
  // Armas
  {
    id: "300335fa-d6f9-40a5-8c8c-bb349a5e47ad", // UUID que existe na tabela items
    name: "Pistola Desert Eagle",
    description: "Arma de fogo poderosa e confiável",
    price: 2500,
    type: "weapon",
    rarity: "rare",
    stats: { damage: 45 },
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "857d73d2-cce7-46f0-ab13-86167604f13f", // UUID válido
    name: "Metralhadora UZI",
    description: "Arma automática devastadora",
    price: 8500,
    type: "weapon",
    rarity: "epic",
    stats: { damage: 75 },
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=150&h=150&fit=crop",
    inStock: true,
    discount: 15,
  },
  {
    id: "0abdc550-bef1-426b-aa5b-e9e375eadf8c", // UUID real da faca
    name: "Faca Tática",
    description: "Arma branca para combate corpo a corpo",
    price: 800,
    type: "weapon",
    rarity: "common",
    stats: { damage: 25 },
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "fbaa0d5c-57d7-4c36-9734-c20c1d276eb6", // UUID válido
    name: "Taco de Baseball com pregos",
    description: "Arma intimidadora e eficiente",
    price: 600,
    type: "weapon",
    rarity: "common",
    stats: { damage: 18 },
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=150&h=150&fit=crop",
    inStock: true,
  },
  // Armaduras
  {
    id: "0c4ffa62-4fed-4491-bee7-6e6c868e20b0", // UUID válido
    name: "Colete Leve",
    description: "Proteção básica contra tiros",
    price: 1200,
    type: "armor",
    rarity: "common",
    stats: { defense: 30 },
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "d63e3c2c-7fcc-473f-ab38-011b4fa5da01", // UUID válido
    name: "Military Vest",
    description: "Advanced protection for dangerous missions",
    price: 3500,
    type: "armor",
    rarity: "rare",
    stats: { defense: 60 },
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
    inStock: true,
  },
  // Consumíveis
  {
    id: "2a5b55fc-1cf9-4b76-aeeb-6daf2ac7ac4f", // UUID válido
    name: "Poção de Vida",
    description: "Restaura 50 pontos de vida",
    price: 300,
    type: "consumable",
    rarity: "common",
    stats: { health: 50 },
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "42ac8a5d-c8e4-4a15-b7dc-501c815212fc", // UUID válido
    name: "Bebida Energética",
    description: "Restaura 40 pontos de energia",
    price: 200,
    type: "consumable",
    rarity: "common",
    stats: { energy: 40 },
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    inStock: true,
  },
  {
    id: "666c108d-0cac-4191-80bf-866a369e4f02", // UUID válido
    name: "Cocaína Premium",
    description: "Aumenta temporariamente força e velocidade",
    price: 500,
    type: "consumable",
    rarity: "rare",
    stats: { addiction: 10 },
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    inStock: true,
  },
  // Especiais
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // UUID válido
    name: "Arma Dourada",
    description: "Arma lendária com poder devastador",
    price: 25000,
    type: "weapon",
    rarity: "legendary",
    stats: { damage: 150, reputation: 50 },
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
    inStock: true,
    discount: 20,
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

      // 1. Verificar se o jogador tem dinheiro suficiente
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("money")
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;

      // 2. Buscar informações do item
      const item = mockShopItems.find((i) => i.id === itemId);

      if (!item) throw new Error("Item não encontrado");

      const totalCost =
        (item.discount ? item.price * (1 - item.discount / 100) : item.price) *
        quantity;

      if (player.money < totalCost) {
        throw new Error(
          `Insufficient money! You have $${player.money.toLocaleString()} but need $${totalCost.toLocaleString()}`
        );
      }

      // 3. Atualizar dinheiro do jogador
      const { error: updateError } = await supabase
        .from("players")
        .update({ money: player.money - totalCost })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // 4. Adicionar item ao inventário
      const { error: inventoryError } = await supabase
        .from("inventory")
        .insert({
          id: crypto.randomUUID(),
          player_id: playerId,
          item_id: itemId,
          quantity: quantity,
          equipped: false,
          created_at: new Date().toISOString(),
        });

      if (inventoryError) throw inventoryError;

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
        if (!item) throw new Error(`Item ${itemId} não encontrado`);

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
          `Insufficient money! You have $${player.money.toLocaleString()} but need $${totalCost.toLocaleString()}`
        );
      }

      // 3. Atualizar dinheiro do jogador
      const { error: updateError } = await supabase
        .from("players")
        .update({ money: player.money - totalCost })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // 4. Adicionar todos os itens ao inventário
      for (const { itemId, quantity } of items) {
        const item = mockShopItems.find((i) => i.id === itemId);
        if (!item) continue;

        const inventoryData = {
          id: crypto.randomUUID(),
          player_id: playerId,
          item_id: itemId,
          quantity: quantity,
          equipped: false,
          created_at: new Date().toISOString(),
        };

        const { error: inventoryError } = await supabase
          .from("inventory")
          .insert(inventoryData);

        if (inventoryError) throw inventoryError;
      }

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
