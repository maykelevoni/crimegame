import React, { useState } from "react";
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
  Zap,
  Heart,
} from "lucide-react";
import BaseView from "./BaseView";
import { useGameStore } from "../stores/gameStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  { key: "armor", label: "Armor", icon: <Shield /> },
  { key: "style", label: "Style", icon: <Shirt /> },
  { key: "accessory", label: "Accessories", icon: <Glasses /> },
  { key: "consumable", label: "Consumables", icon: <Pill /> },
];

export default function ProfileView() {
  const { player } = useGameStore();

  // Buscar inventário do banco
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["inventory", player?.id],
    queryFn: async () => {
      if (!player?.id) return [];

      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select("*")
        .eq("player_id", player.id);

      if (inventoryError) throw inventoryError;

      // Mapear nomes conhecidos baseado nos UUIDs dos itens mock
      const itemNames: { [key: string]: string } = {
        "0abdc550-bef1-426b-aa5b-e9e375eadf8c": "Faca Tática",
        "300335fa-d6f9-40a5-8c8c-bb349a5e47ad": "Pistola Desert Eagle",
        "857d73d2-cce7-46f0-ab13-86167604f13f": "Metralhadora UZI",
        "6267bd2d-ef3c-4c1c-afca-c698402d9af8": "Faca Tática",
        "fbaa0d5c-57d7-4c36-9734-c20c1d276eb6": "Taco de Baseball",
        "0c4ffa62-4fed-4491-bee7-6e6c868e20b0": "Colete Leve",
        "d63e3c2c-7fcc-473f-ab38-011b4fa5da01": "Colete Militar",
        "2a5b55fc-1cf9-4b76-aeeb-6daf2ac7ac4f": "Poção de Vida",
        "42ac8a5d-c8e4-4a15-b7dc-501c815212fc": "Bebida Energética",
        "666c108d-0cac-4191-80bf-866a369e4f02": "Cocaína Premium",
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890": "Arma Dourada",
      };

      const itemImages: { [key: string]: string } = {
        "0abdc550-bef1-426b-aa5b-e9e375eadf8c":
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
        "300335fa-d6f9-40a5-8c8c-bb349a5e47ad":
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
        "857d73d2-cce7-46f0-ab13-86167604f13f":
          "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=150&h=150&fit=crop",
        "6267bd2d-ef3c-4c1c-afca-c698402d9af8":
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
        "fbaa0d5c-57d7-4c36-9734-c20c1d276eb6":
          "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=150&h=150&fit=crop",
        "0c4ffa62-4fed-4491-bee7-6e6c868e20b0":
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
        "d63e3c2c-7fcc-473f-ab38-011b4fa5da01":
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
        "2a5b55fc-1cf9-4b76-aeeb-6daf2ac7ac4f":
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
        "42ac8a5d-c8e4-4a15-b7dc-501c815212fc":
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
        "666c108d-0cac-4191-80bf-866a369e4f02":
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
        "a1b2c3d4-e5f6-7890-abcd-ef1234567890":
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
      };

      interface InventoryItem {
        id: string;
        player_id: string;
        quantity: number;
        weapon_id: string | null;
        created_at: string;
        updated_at: string;
      }

      return inventoryData.map((invItem: InventoryItem) => ({
        id: invItem.id,
        name:
          itemNames[invItem.id] || `Item ${invItem.id.slice(0, 8)}`,
        description: "Item do inventário",
        type: "consumable" as const,
        rarity: "comum" as const,
        price: 0,
        image:
          itemImages[invItem.item_id] ||
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
        bonus: {},
        quantity: invItem.quantity,
        equipped: invItem.equipped,
      }));
    },
    enabled: !!player?.id,
  });

  const [avatar, setAvatar] = useState(
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  );
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

  // Verificação de segurança
  if (!player) {
    return (
      <BaseView title="Profile & Inventory">
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

  // Filtra itens do inventário real, removendo os consumidos
  const itemsToShow = inventory.filter(
    (item) =>
      (filter === "all" || item.type === filter) &&
      !consumedIds.includes(item.id)
  );

  function handleEquip(item: Item) {
    if (["weapon", "armor", "style", "accessory"].includes(item.type)) {
      setEquipped((prev) => ({ ...prev, [item.type]: item }));
      setSelectedItem(null);
    }
  }

  function handleUnequip(type: string) {
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
    <BaseView title="Profile & Inventory">
      {/* Player Info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-cyan-400">{player.name}</h2>
              <button className="text-sm text-cyan-400 flex items-center gap-1 hover:underline">
                <Camera size={14} /> Change photo
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
        <div className="grid grid-cols-2 gap-4">
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
              <span className="text-sm text-white/60">Armor:</span>
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
              <Shirt size={16} className="text-purple-400" />
              <span className="text-sm text-white/60">Style:</span>
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
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Glasses size={16} className="text-cyan-400" />
              <span className="text-sm text-white/60">Accessory:</span>
            </div>
            {equipped.accessory ? (
              <div className="flex items-center gap-2">
                <img
                  src={equipped.accessory.image}
                  alt={equipped.accessory.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-cyan-400 font-bold text-sm">
                  {equipped.accessory.name}
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
    </BaseView>
  );
}
