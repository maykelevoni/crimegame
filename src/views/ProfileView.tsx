import React, { useState, useEffect } from "react";
import {
  Camera,
  Shirt,
  Sword,
  Backpack,
  Star,
  X,
  Brain,
  Dumbbell,
  Smile,
  Shield,
  Glasses,
  Pill,
  Briefcase,
  User,
  TrendingUp,
  Car,
  Zap,
  Heart,
  Edit,
} from "lucide-react";
import BaseView from "./BaseView";
import { useGameStore } from "../stores/gameStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AvatarSelector from "../components/AvatarSelector";
import { useShopItems } from "../hooks/useShop";
import type { Item } from "../types/game";

const STATUS_BASE = {
  intelligence: 50,
  strength: 30,
  charisma: 20,
  resistance: 15,
};

const ITEM_TYPES = {
  weapon: "Arma",
  armor: "Colete",
  consumable: "Uso",
};

const RARITY_ICONS: { [key: string]: JSX.Element } = {
  raro: <span className="w-2 h-2 bg-blue-500 rounded-full" />,
  lendario: <span className="w-2 h-2 bg-yellow-400 rounded-full" />,
};

const TYPE_ICONS = {
  weapon: <Sword className="w-4 h-4 text-red-400" />,
  armor: <Shield className="w-4 h-4 text-blue-400" />,
  style: <Shirt className="w-4 h-4 text-purple-400" />,
  accessory: <Glasses className="w-4 h-4 text-cyan-400" />,
  consumable: <Pill className="w-4 h-4 text-green-400" />,
  special: <Briefcase className="w-4 h-4 text-yellow-400" />,
};

const FILTER_OPTIONS = [
  { key: "all", label: "All Items", icon: <Backpack /> },
  { key: "weapon", label: "Weapons", icon: <Sword /> },
  { key: "protection", label: "Protection", icon: <Shield /> },
  { key: "vehicle", label: "Cars", icon: <Car /> },
  { key: "consumable", label: "Consumables", icon: <Pill /> },
];

export default function InventoryView() {
  const { player } = useGameStore();

  // Import shop items hook
  const { data: shopItems = [] } = useShopItems();

  // Fetch inventory from localStorage (now works with our shop system)
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["inventory", player?.id],
    queryFn: async () => {
      if (!player?.id) return [];

      try {
        // Get from localStorage
        const localInventoryKey = `inventory_${player.id}`;
        const localInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        
        // Convert localStorage items to ProfileView format using shop items data
        return localInventory.map((invItem: any) => {
          const shopItem = shopItems.find(shop => shop.id === invItem.item_id);
          
          if (shopItem) {
            // Map shop item types to ProfileView types
            const profileType = shopItem.type === "weapon" ? "weapon" :
                              shopItem.type === "protection" ? "armor" :
                              shopItem.type === "vehicle" ? "style" : // vehicles go to style for now
                              "consumable";
            
            return {
              id: invItem.id,
              name: shopItem.name,
              description: shopItem.description,
              type: profileType,
              rarity: shopItem.rarity === "common" ? "comum" : 
                     shopItem.rarity === "rare" ? "raro" : 
                     shopItem.rarity === "epic" ? "épico" : 
                     shopItem.rarity === "legendary" ? "lendário" : "comum",
              price: shopItem.price,
              image: shopItem.image,
              bonus: shopItem.effects || {},
              quantity: invItem.quantity,
              equipped: invItem.equipped || false,
            };
          }
          
          // Fallback for unknown items
          return {
            id: invItem.id,
            name: `Item ${invItem.item_id?.slice(0, 8) || 'Unknown'}`,
            description: "Shop item",
            type: "consumable" as const,
            rarity: "comum" as const,
            price: 0,
            image: "",
            bonus: {},
            quantity: invItem.quantity,
            equipped: invItem.equipped || false,
          };
        });
      } catch (error) {
        return [];
      }
    },
    enabled: !!player?.id && shopItems.length > 0, // Wait for shop items to load first
  });

  const [avatar, setAvatar] = useState(player?.avatar || "");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [equipped, setEquipped] = useState<{
    weapon: Item | null;
    armor: Item | null;
    style: Item | null;
    accessory: Item | null;
  }>({
    weapon: null,
    armor: null,
    style: null,
    accessory: null,
  });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState("all");
  const [usedMessage, setUsedMessage] = useState("");
  const [usedItemId, setUsedItemId] = useState<string | null>(null);
  const [consumedIds, setConsumedIds] = useState<string[]>([]);

  // Load equipped items from localStorage when inventory changes
  useEffect(() => {
    if (player?.id && inventory.length > 0 && shopItems.length > 0) {
      const localInventoryKey = `inventory_${player.id}`;
      const localInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
      
      const equippedFromStorage = {
        weapon: null as Item | null,
        armor: null as Item | null,
        style: null as Item | null,
        accessory: null as Item | null,
      };
      
      localInventory.forEach((invItem: any) => {
        if (invItem.equipped) {
          const shopItem = shopItems.find(shop => shop.id === invItem.item_id);
          if (shopItem) {
            const profileType = shopItem.type === "weapon" ? "weapon" :
                              shopItem.type === "protection" ? "armor" :
                              shopItem.type === "vehicle" ? "style" : 
                              null;
            
            if (profileType) {
              equippedFromStorage[profileType as keyof typeof equippedFromStorage] = {
                id: invItem.id,
                name: shopItem.name,
                description: shopItem.description,
                type: profileType,
                rarity: shopItem.rarity === "common" ? "comum" : 
                       shopItem.rarity === "rare" ? "raro" : 
                       shopItem.rarity === "epic" ? "épico" : 
                       shopItem.rarity === "legendary" ? "lendário" : "comum",
                price: shopItem.price,
                image: shopItem.image,
                bonus: shopItem.effects || {},
                quantity: invItem.quantity,
                equipped: true,
              };
            }
          }
        }
      });
      
      setEquipped(equippedFromStorage);
    }
  }, [inventory, shopItems, player?.id]);

  // Verificação de segurança
  if (!player) {
    return (
      <BaseView title="Inventory">
        <div className="text-center py-8">
          <p className="text-white/60">Loading player data...</p>
        </div>
      </BaseView>
    );
  }

  // Calcula status com bônus dos itens equipados
  const status: { [key: string]: number } = { ...STATUS_BASE };
  Object.values(equipped).forEach((item) => {
    if (item && item.bonus) {
      Object.entries(item.bonus).forEach(([key, value]) => {
        status[key] = (status[key] || 0) + value;
      });
    }
  });

  // Filter inventory items by category, matching shop item types
  const itemsToShow = inventory.filter((item) => {
    if (consumedIds.includes(item.id)) return false;
    if (filter === "all") return true;
    
    // Find the shop item to get the correct type
    const shopItem = shopItems.find(shop => shop.id === item.weapon_id);
    if (!shopItem) return false;
    
    // Match shop item type to filter
    return shopItem.type === filter;
  });

  function handleEquip(item: Item) {
    if (["weapon", "armor", "style", "accessory"].includes(item.type)) {
      // Update localStorage
      if (player?.id) {
        const localInventoryKey = `inventory_${player.id}`;
        const existingInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
        
        // Unequip any item of the same type
        existingInventory.forEach((invItem: any) => {
          if (invItem.equipped) {
            const shopItem = shopItems.find(shop => shop.id === invItem.item_id);
            const itemType = shopItem?.type === "weapon" ? "weapon" :
                            shopItem?.type === "protection" ? "armor" :
                            shopItem?.type === "vehicle" ? "style" : "consumable";
            if (itemType === item.type) {
              invItem.equipped = false;
            }
          }
        });
        
        // Equip the selected item
        const itemToEquip = existingInventory.find((invItem: any) => invItem.id === item.id);
        if (itemToEquip) {
          itemToEquip.equipped = true;
        }
        
        localStorage.setItem(localInventoryKey, JSON.stringify(existingInventory));
      }
      
      setEquipped((prev) => ({ ...prev, [item.type]: item }));
      setSelectedItem(null);
    }
  }

  function handleUnequip(type: string) {
    // Update localStorage
    if (player?.id && equipped[type as keyof typeof equipped]) {
      const localInventoryKey = `inventory_${player.id}`;
      const existingInventory = JSON.parse(localStorage.getItem(localInventoryKey) || '[]');
      
      const itemToUnequip = existingInventory.find((invItem: any) => invItem.id === equipped[type as keyof typeof equipped]?.id);
      if (itemToUnequip) {
        itemToUnequip.equipped = false;
        localStorage.setItem(localInventoryKey, JSON.stringify(existingInventory));
      }
    }
    
    setEquipped((prev) => ({ ...prev, [type]: null }));
    setSelectedItem(null);
  }

  const isEquippedSelected =
    selectedItem &&
    equipped[selectedItem.type as keyof typeof equipped] &&
    equipped[selectedItem.type as keyof typeof equipped]?.id ===
      selectedItem.id;

  function handleUse(item: Item) {
    setUsedMessage(`You used: ${item.name}!`);
    setUsedItemId(item.id);
    setConsumedIds((prev) => [...prev, item.id]);
  }

  return (
    <BaseView title="Inventory">
      {/* Player Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={player.avatarUrl || avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-cyan-400">{player.name}</h2>
              <button 
                onClick={() => setShowAvatarSelector(true)}
                className="text-sm text-cyan-400 flex items-center gap-1 hover:underline transition-colors hover:text-cyan-300"
              >
                <Edit size={14} /> Choose Avatar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Equipped Items */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star size={24} className="text-yellow-400" />
          Equipped Items
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sword size={16} className="text-red-400" />
              <span className="text-sm text-white/60">Weapon:</span>
            </div>
            {equipped.weapon ? (
              <div className="flex items-center gap-2">
                <img
                  src={equipped.weapon.image}
                  alt={equipped.weapon.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-red-400 font-bold text-sm">
                  {equipped.weapon.name}
                </span>
              </div>
            ) : (
              <span className="text-white/40 text-sm">None equipped</span>
            )}
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-blue-400" />
              <span className="text-sm text-white/60">Protection:</span>
            </div>
            {equipped.armor ? (
              <div className="flex items-center gap-2">
                <img
                  src={equipped.armor.image}
                  alt={equipped.armor.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-blue-400 font-bold text-sm">
                  {equipped.armor.name}
                </span>
              </div>
            ) : (
              <span className="text-white/40 text-sm">None equipped</span>
            )}
          </div>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Car size={16} className="text-purple-400" />
              <span className="text-sm text-white/60">Car:</span>
            </div>
            {equipped.style ? (
              <div className="flex items-center gap-2">
                <img
                  src={equipped.style.image}
                  alt={equipped.style.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-purple-400 font-bold text-sm">
                  {equipped.style.name}
                </span>
              </div>
            ) : (
              <span className="text-white/40 text-sm">None equipped</span>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Backpack size={24} className="text-white" />
          Inventory
        </h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all border-2 ${
                filter === f.key
                  ? "bg-cyan-500 border-cyan-400 text-gray-900"
                  : "bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
              }`}
              onClick={() => setFilter(f.key)}
            >
              <span className="flex items-center justify-center w-5 h-5">
                {f.icon}
              </span>
              <span className="text-xs">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 18 }, (_, idx) => {
          const item = itemsToShow[idx];
          const isEquipped =
            item &&
            equipped[item.type as keyof typeof equipped] &&
            equipped[item.type as keyof typeof equipped]?.id === item.id;
          return (
            <div
              key={idx}
              className={`relative w-12 h-12 flex items-center justify-center rounded-lg border-2 transition cursor-pointer ${
                item
                  ? isEquipped
                    ? "border-yellow-400 bg-yellow-500/20"
                    : "border-gray-600 bg-gray-800/50 hover:scale-105"
                  : "border-gray-700 bg-gray-900/50 opacity-40 cursor-default"
              }`}
              onClick={() => item && setSelectedItem(item)}
            >
              {item ? (
                <>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  {isEquipped && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[8px] font-bold px-1 rounded">
                      E
                    </span>
                  )}
                  {item.rarity !== "comum" && (
                    <span className="absolute bottom-1 right-1">
                      {RARITY_ICONS[item.rarity]}
                    </span>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-cyan-500/30 shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-cyan-400">
                {selectedItem.name}
              </h3>
              <button
                className="text-cyan-400 hover:text-white"
                onClick={() => {
                  setSelectedItem(null);
                  setUsedMessage("");
                  setUsedItemId(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm text-white/70 mb-2">
                  {selectedItem.description}
                </p>
                {selectedItem.bonus && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selectedItem.bonus).map(([key, val]) => (
                      <span
                        key={key}
                        className="bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded text-xs"
                      >
                        {key}: {String(val)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {["weapon", "armor", "style", "accessory"].includes(
                selectedItem.type as string
              ) ? (
                isEquippedSelected ? (
                  <button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded font-bold text-sm"
                    onClick={() => handleUnequip(selectedItem.type as string)}
                  >
                    Unequip
                  </button>
                ) : (
                  <button
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-bold text-sm"
                    onClick={() => handleEquip(selectedItem)}
                  >
                    Equip
                  </button>
                )
              ) : selectedItem.type === "consumable" ? (
                <button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold text-sm"
                  onClick={() => handleUse(selectedItem)}
                >
                  Use
                </button>
              ) : null}
            </div>

            {usedMessage && usedItemId === selectedItem.id && (
              <div className="mt-4 p-3 bg-green-700/20 border border-green-500/30 rounded text-center text-green-400 font-bold text-sm">
                {usedMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        currentAvatar={player?.avatarUrl}
      />
    </BaseView>
  );
}
