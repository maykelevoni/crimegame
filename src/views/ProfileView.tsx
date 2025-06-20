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

const RARITY_ICONS = {
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

const ITEMS = [
  // Armas
  {
    id: "pistol",
    name: "Pistola",
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&h=150&fit=crop",
    type: "weapon",
    desc: "Arma confiável para roubos e proteção.",
    bonus: { strength: 25 },
    rarity: "raro",
  },
  {
    id: "tactical-knife",
    name: "Faca Tática",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
    type: "weapon",
    desc: "Faca especial para combate corpo a corpo.",
    bonus: { strength: 10, agility: 5 },
    rarity: "comum",
  },
  {
    id: "uzi",
    name: "Metralhadora UZI",
    image:
      "https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=150&h=150&fit=crop",
    type: "weapon",
    desc: "Arma poderosa para situações extremas.",
    bonus: { strength: 50 },
    rarity: "lendario",
  },
  {
    id: "baseball-bat",
    name: "Taco de Baseball com pregos",
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=150&h=150&fit=crop",
    type: "weapon",
    desc: "Arma intimidadora e eficiente.",
    bonus: { strength: 15, intimidation: 5 },
    rarity: "comum",
  },

  // Coletes / Proteção
  {
    id: "light-vest",
    name: "Colete Leve",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    type: "armor",
    desc: "Proteção básica para situações de risco.",
    bonus: { resistance: 20 },
    rarity: "comum",
  },
  {
    id: "military-vest",
    name: "Colete Militar",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
    type: "armor",
    desc: "Proteção avançada para missões perigosas.",
    bonus: { resistance: 50, agility: -5 },
    rarity: "raro",
  },
  {
    id: "leather-jacket",
    name: "Jaqueta de Couro Reforçada",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150&h=150&fit=crop",
    type: "armor",
    desc: "Estilo e proteção em um só item.",
    bonus: { resistance: 15, charisma: 5 },
    rarity: "comum",
  },

  // Roupas / Estilo
  {
    id: "designer-suit",
    name: "Terno de Marca",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    type: "style",
    desc: "Elegancia e sofisticação para negociações.",
    bonus: { charisma: 30 },
    rarity: "raro",
  },
  {
    id: "neon-jacket",
    name: "Jaqueta Neon",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=150&h=150&fit=crop",
    type: "style",
    desc: "Estilo cyberpunk para festas e baladas.",
    bonus: { charisma: 10, reputation: 5 },
    rarity: "comum",
  },
  {
    id: "gold-chain",
    name: "Corrente de Ouro",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop",
    type: "style",
    desc: "Símbolo de status e poder nas ruas.",
    bonus: { charisma: 20 },
    rarity: "comum",
  },

  // Acessórios / Inteligência
  {
    id: "hacker-glasses",
    name: "Óculos de Sol Hacker",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop",
    type: "accessory",
    desc: "Acesso a sistemas e informações privilegiadas.",
    bonus: { intelligence: 20 },
    rarity: "raro",
  },
  {
    id: "spy-watch",
    name: "Relógio Digital Espião",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=150&h=150&fit=crop",
    type: "accessory",
    desc: "Ferramenta essencial para missões de espionagem.",
    bonus: { intelligence: 10, reputation: 5 },
    rarity: "comum",
  },
  {
    id: "cloned-tablet",
    name: "Tablet Clonado",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop",
    type: "accessory",
    desc: "Acesso a dados e sistemas restritos.",
    bonus: { intelligence: 25 },
    rarity: "raro",
  },

  // Consumíveis
  {
    id: "energy-drink",
    name: "Energético",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    type: "consumable",
    desc: "Recupera energia rapidamente.",
    bonus: { energy: 50 },
    rarity: "comum",
  },
  {
    id: "anti-addiction",
    name: "Pílula Anti-vício",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    type: "consumable",
    desc: "Reduz o vício temporariamente.",
    bonus: { addiction: -30 },
    rarity: "raro",
  },
  {
    id: "medical-dose",
    name: "Dose Médica",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop",
    type: "consumable",
    desc: "Recupera saúde rapidamente.",
    bonus: { health: 30 },
    rarity: "comum",
  },
  {
    id: "sweet-bullet",
    name: "Bala Doce",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop",
    type: "consumable",
    desc: "Energia e vício em um só.",
    bonus: { energy: 10, addiction: 10 },
    rarity: "comum",
  },
];

const FILTERS = [
  { key: "all", label: "All", icon: <Backpack /> },
  { key: "weapon", label: "Weapons", icon: <Sword /> },
  { key: "armor", label: "Armor", icon: <Shield /> },
  { key: "style", label: "Style", icon: <Shirt /> },
  { key: "accessory", label: "Accessories", icon: <Glasses /> },
  { key: "consumable", label: "Consumables", icon: <Pill /> },
];

export default function ProfileView() {
  const [avatar, setAvatar] = useState(
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  );
  const [equipped, setEquipped] = useState({
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

  // Calcula status com bônus dos itens equipados
  const status = { ...STATUS_BASE };
  Object.values(equipped).forEach((item) => {
    if (item && item.bonus) {
      Object.entries(item.bonus).forEach(([key, value]) => {
        status[key] = (status[key] || 0) + value;
      });
    }
  });

  // Filtra itens para grade, removendo os consumidos
  const itemsToShow = ITEMS.filter(
    (item) =>
      (filter === "all" || item.type === filter) &&
      !consumedIds.includes(item.id)
  );

  function handleEquip(item) {
    if (["weapon", "armor", "style", "accessory"].includes(item.type)) {
      setEquipped((prev) => ({ ...prev, [item.type]: item }));
      setSelectedItem(null);
    }
  }

  function handleUnequip(type) {
    setEquipped((prev) => ({ ...prev, [type]: null }));
    setSelectedItem(null);
  }

  const isEquippedSelected =
    selectedItem &&
    equipped[selectedItem.type] &&
    equipped[selectedItem.type].id === selectedItem.id;

  function handleUse(item) {
    setUsedMessage(`Você usou: ${item.name}!`);
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
              <h2 className="text-xl font-bold text-cyan-400">Paidrew</h2>
              <button className="text-sm text-cyan-400 flex items-center gap-1 hover:underline">
                <Camera size={14} /> Change photo
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={20} className="text-cyan-400" />
            <span className="text-sm text-cyan-400">Level 15</span>
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-cyan-400" />
          Player Stats
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={16} className="text-cyan-400" />
              <span className="text-sm text-white/60">Intelligence:</span>
              <span className="text-cyan-400 font-bold">
                {status.intelligence || 0}
              </span>
            </div>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell size={16} className="text-green-400" />
              <span className="text-sm text-white/60">Strength:</span>
              <span className="text-green-400 font-bold">
                {status.strength || 0}
              </span>
            </div>
          </div>
          <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Smile size={16} className="text-pink-400" />
              <span className="text-sm text-white/60">Charisma:</span>
              <span className="text-pink-400 font-bold">
                {status.charisma || 0}
              </span>
            </div>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-yellow-400" />
              <span className="text-sm text-white/60">Resistance:</span>
              <span className="text-yellow-400 font-bold">
                {status.resistance || 0}
              </span>
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
          {FILTERS.map((f) => (
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
        {itemsToShow.slice(0, 18).map((item, idx) => {
          const isEquipped =
            item && equipped[item.type] && equipped[item.type].id === item.id;
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
                  {selectedItem.desc}
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
                selectedItem.type
              ) ? (
                isEquippedSelected ? (
                  <button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded font-bold text-sm"
                    onClick={() => handleUnequip(selectedItem.type)}
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
