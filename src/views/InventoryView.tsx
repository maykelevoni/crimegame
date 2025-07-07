import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Package,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Star,
  Check,
  X,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { usePlayerInventory, useEquippedItems, InventoryItem } from "../hooks/useInventory";
import { useShopItems, ShopItem } from "../hooks/useShop";
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EquipItemMutation {
  playerId: string;
  inventoryId: string;
  equipped: boolean;
}

const InventoryView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { player } = useGameStore();
  const { data: inventory = [], isLoading: inventoryLoading } = usePlayerInventory(player?.id || "");
  const { data: equippedItems = [] } = useEquippedItems(player?.id || "");
  const { data: shopItems = [] } = useShopItems();
  const queryClient = useQueryClient();

  // Mutation for equipping/unequipping items using localStorage
  const equipItemMutation = useMutation({
    mutationFn: async ({ playerId, inventoryId, equipped }: EquipItemMutation) => {
      
      try {
        const localInventoryKey = `inventory_${playerId}`;
        const existingInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        // Find and update the item
        const itemIndex = existingInventory.findIndex((item: any) => item.id === inventoryId);
        
        if (itemIndex >= 0) {
          existingInventory[itemIndex].equipped = equipped;
          localStorage.setItem(localInventoryKey, JSON.stringify(existingInventory));
        } else {
          throw new Error("Item not found in inventory");
        }
        
        return { success: true };
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.playerId] });
      queryClient.invalidateQueries({ queryKey: ["equipped-items", variables.playerId] });
      
      const action = variables.equipped ? "equipped" : "unequipped";
      toast.success(`Item ${action} successfully!`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update item");
    },
  });

  const handleEquipItem = async (inventoryItem: InventoryItem) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    const shopItem = shopItems.find(item => item.id === inventoryItem.item_id);
    if (!shopItem) {
      toast.error("Item details not found");
      return;
    }

    // Check if item is already equipped
    const isCurrentlyEquipped = inventoryItem.equipped;
    
    // For non-consumable items, check if there's already an item of the same type equipped
    if (!isCurrentlyEquipped && shopItem.type !== "consumable") {
      const sameTypeEquipped = equippedItems.find(equipped => {
        const equippedShopItem = shopItems.find(shop => shop.id === equipped.item_id);
        return equippedShopItem?.type === shopItem.type;
      });

      if (sameTypeEquipped) {
        // Auto-unequip the previous item of the same type
        await equipItemMutation.mutateAsync({
          playerId: player.id,
          inventoryId: sameTypeEquipped.id,
          equipped: false,
        });
      }
    }

    // Equip/unequip the current item
    await equipItemMutation.mutateAsync({
      playerId: player.id,
      inventoryId: inventoryItem.id,
      equipped: !isCurrentlyEquipped,
    });
  };

  const getItemDetails = (inventoryItem: InventoryItem): ShopItem | null => {
    return shopItems.find(item => item.id === inventoryItem.item_id) || null;
  };

  const categories = [
    { id: "all", name: "All Items", icon: Package },
    { id: "weapon", name: "Weapons", icon: Target },
    { id: "vehicle", name: "Cars", icon: TrendingUp },
    { id: "protection", name: "Protection", icon: Shield },
    { id: "consumable", name: "Consumables", icon: Zap },
  ];

  const filteredInventory = inventory.filter(item => {
    if (selectedCategory === "all") return true;
    const shopItem = getItemDetails(item);
    return shopItem?.type === selectedCategory;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-400/10";
      case "rare":
        return "border-blue-400 bg-blue-400/10";
      case "epic":
        return "border-purple-400 bg-purple-400/10";
      case "legendary":
        return "border-yellow-400 bg-yellow-400/10";
      default:
        return "border-gray-400 bg-gray-400/10";
    }
  };

  if (inventoryLoading) {
    return (
      <BaseView title="Inventory">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-blue mx-auto mb-4"></div>
            <p>Loading inventory...</p>
          </div>
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView title="Inventory">
      <div className="space-y-6">
        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all ${
                  selectedCategory === category.id
                    ? "bg-cyber-blue/20 border-cyber-blue text-cyber-blue shadow-lg"
                    : "bg-cyber-dark-light border-cyber-blue/20 text-white/70 hover:border-cyber-blue/40 hover:bg-cyber-blue/10"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Equipped Items Summary */}
        {equippedItems.length > 0 && (
          <div className="bg-cyber-dark-light border border-cyber-blue/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-cyber-blue mb-3 flex items-center gap-2">
              <Check size={20} />
              Currently Equipped ({equippedItems.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {equippedItems.map((equipped) => {
                const shopItem = getItemDetails(equipped);
                if (!shopItem) return null;
                
                return (
                  <div
                    key={equipped.id}
                    className={`p-2 rounded-lg border text-center ${getRarityColor(shopItem.rarity)}`}
                  >
                    <img
                      src={shopItem.image}
                      alt={shopItem.name}
                      className="w-8 h-8 mx-auto mb-1 object-contain"
                    />
                    <p className="text-xs font-medium text-white truncate">
                      {shopItem.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inventory Items */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Package size={24} className="text-cyber-blue" />
            Your Items ({filteredInventory.length})
          </h3>
          
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Package size={48} className="mx-auto mb-4 text-cyber-blue/40" />
              <p>No items in this category</p>
              <p className="text-sm">Visit the shop to buy equipment!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInventory.map((inventoryItem) => {
                const shopItem = getItemDetails(inventoryItem);
                if (!shopItem) return null;

                const isEquipped = inventoryItem.equipped || false;
                const isConsumable = shopItem.type === "consumable";

                return (
                  <div
                    key={inventoryItem.id}
                    className={`p-4 rounded-xl border transition-all ${getRarityColor(shopItem.rarity)} ${
                      isEquipped ? "ring-2 ring-cyber-blue" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={shopItem.image}
                          alt={shopItem.name}
                          className="w-16 h-16 object-contain rounded-lg"
                        />
                        {isEquipped && (
                          <div className="absolute -top-1 -right-1 bg-cyber-blue rounded-full p-1">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">
                          {shopItem.name}
                        </h4>
                        <p className="text-xs text-white/60 mb-2">
                          {shopItem.description}
                        </p>
                        
                        {inventoryItem.quantity > 1 && (
                          <p className="text-sm text-cyber-blue font-bold mb-2">
                            Quantity: {inventoryItem.quantity}
                          </p>
                        )}

                        {/* Effects */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {Object.entries(shopItem.effects || {}).map(([effect, value]) => {
                            if (!value) return null;
                            return (
                              <span
                                key={effect}
                                className="text-xs px-2 py-1 bg-cyber-blue/10 border border-cyber-blue/20 rounded"
                              >
                                {effect === 'success_boost' ? 'Success' : 
                                 effect === 'escape_boost' ? 'Escape' : 
                                 effect === 'health_protection' ? 'Protection' : 
                                 effect.charAt(0).toUpperCase() + effect.slice(1)}: +{value}{effect.includes('boost') || effect.includes('protection') ? '%' : ''}
                              </span>
                            );
                          })}
                        </div>

                        {/* Action Button */}
                        {!isConsumable && (
                          <button
                            onClick={() => handleEquipItem(inventoryItem)}
                            disabled={equipItemMutation.isPending}
                            className={`w-full py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                              isEquipped
                                ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                                : "bg-cyber-blue/20 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/30"
                            } ${equipItemMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {equipItemMutation.isPending ? "..." : isEquipped ? "Unequip" : "Equip"}
                          </button>
                        )}
                        
                        {isConsumable && (
                          <div className="text-xs text-white/60 text-center py-2">
                            Use in Nightlife
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </BaseView>
  );
};

export default InventoryView;