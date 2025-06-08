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
} from "lucide-react";

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

const EQUIPPED_BORDER = "border-yellow-400";
const INVENTORY_BORDER = "border-gray-700";

// Ícones de raridade (apenas para raros e lendários)
const RARITY_ICONS = {
  raro: <span className="w-2 h-2 bg-blue-500 rounded-full" />,
  lendario: <span className="w-2 h-2 bg-yellow-400 rounded-full" />,
};

// Borda padrão para todos os slots
const SLOT_BORDER = "border-gray-500";
const SLOT_BG = "bg-gray-900";

// Mini-ícones de tipo (maior, com fundo branco e sombra)
const TYPE_ICONS = {
  weapon: <Sword className="w-4 h-4 text-red-400" />,
  armor: <Shield className="w-4 h-4 text-blue-400" />,
  style: <Shirt className="w-4 h-4 text-purple-400" />,
  accessory: <Glasses className="w-4 h-4 text-cyan-400" />,
  consumable: <Pill className="w-4 h-4 text-green-400" />,
  special: <Briefcase className="w-4 h-4 text-yellow-400" />,
};

// Mini-ícone de arma
const MiniGunIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill="none"
    className="text-gray-300"
    style={{ display: "block" }}
  >
    <rect x="2" y="8" width="12" height="4" rx="1" fill="currentColor" />
    <rect x="14" y="9" width="4" height="2" rx="1" fill="currentColor" />
    <rect x="4" y="12" width="2" height="4" rx="1" fill="currentColor" />
  </svg>
);

const ITEMS = [
  // Armas
  {
    id: "pistol",
    name: "Pistola",
    image: "https://placehold.co/48x48/ff0000/fff?text=Pistol",
    type: "weapon",
    desc: "Arma confiável para roubos e proteção.",
    bonus: { strength: 25 },
    rarity: "raro",
  },
  {
    id: "tactical-knife",
    name: "Faca Tática",
    image: "https://placehold.co/48x48/ff3333/fff?text=Knife",
    type: "weapon",
    desc: "Faca especial para combate corpo a corpo.",
    bonus: { strength: 10, agility: 5 },
    rarity: "comum",
  },
  {
    id: "uzi",
    name: "Metralhadora UZI",
    image: "https://placehold.co/48x48/ff6666/fff?text=UZI",
    type: "weapon",
    desc: "Arma poderosa para situações extremas.",
    bonus: { strength: 50 },
    rarity: "lendario",
  },
  {
    id: "baseball-bat",
    name: "Taco de Baseball com pregos",
    image: "https://placehold.co/48x48/ff9999/fff?text=Bat",
    type: "weapon",
    desc: "Arma intimidadora e eficiente.",
    bonus: { strength: 15, intimidation: 5 },
    rarity: "comum",
  },

  // Coletes / Proteção
  {
    id: "light-vest",
    name: "Colete Leve",
    image: "https://placehold.co/48x48/0066ff/fff?text=Vest",
    type: "armor",
    desc: "Proteção básica para situações de risco.",
    bonus: { resistance: 20 },
    rarity: "comum",
  },
  {
    id: "military-vest",
    name: "Colete Militar",
    image: "https://placehold.co/48x48/3399ff/fff?text=Military",
    type: "armor",
    desc: "Proteção avançada para missões perigosas.",
    bonus: { resistance: 50, agility: -5 },
    rarity: "raro",
  },
  {
    id: "leather-jacket",
    name: "Jaqueta de Couro Reforçada",
    image: "https://placehold.co/48x48/66ccff/fff?text=Jacket",
    type: "armor",
    desc: "Estilo e proteção em um só item.",
    bonus: { resistance: 15, charisma: 5 },
    rarity: "comum",
  },

  // Roupas / Estilo
  {
    id: "designer-suit",
    name: "Terno de Marca",
    image: "https://placehold.co/48x48/9900ff/fff?text=Suit",
    type: "style",
    desc: "Elegancia e sofisticação para negociações.",
    bonus: { charisma: 30 },
    rarity: "raro",
  },
  {
    id: "neon-jacket",
    name: "Jaqueta Neon",
    image: "https://placehold.co/48x48/cc66ff/fff?text=Neon",
    type: "style",
    desc: "Estilo cyberpunk para festas e baladas.",
    bonus: { charisma: 10, reputation: 5 },
    rarity: "comum",
  },
  {
    id: "gold-chain",
    name: "Corrente de Ouro",
    image: "https://placehold.co/48x48/ffcc00/fff?text=Chain",
    type: "style",
    desc: "Símbolo de status e poder nas ruas.",
    bonus: { charisma: 20 },
    rarity: "comum",
  },

  // Acessórios / Inteligência
  {
    id: "hacker-glasses",
    name: "Óculos de Sol Hacker",
    image: "https://placehold.co/48x48/00ccff/fff?text=Glasses",
    type: "accessory",
    desc: "Acesso a sistemas e informações privilegiadas.",
    bonus: { intelligence: 20 },
    rarity: "raro",
  },
  {
    id: "spy-watch",
    name: "Relógio Digital Espião",
    image: "https://placehold.co/48x48/33ddff/fff?text=Watch",
    type: "accessory",
    desc: "Ferramenta essencial para missões de espionagem.",
    bonus: { intelligence: 10, reputation: 5 },
    rarity: "comum",
  },
  {
    id: "cloned-tablet",
    name: "Tablet Clonado",
    image: "https://placehold.co/48x48/66eeff/fff?text=Tablet",
    type: "accessory",
    desc: "Acesso a dados e sistemas restritos.",
    bonus: { intelligence: 25 },
    rarity: "raro",
  },

  // Consumíveis
  {
    id: "energy-drink",
    name: "Energético",
    image: "https://placehold.co/48x48/00ff00/fff?text=Energy",
    type: "consumable",
    desc: "Recupera energia rapidamente.",
    bonus: { energy: 50 },
    rarity: "comum",
  },
  {
    id: "anti-addiction",
    name: "Pílula Anti-vício",
    image: "https://placehold.co/48x48/33ff33/fff?text=Pill",
    type: "consumable",
    desc: "Reduz o vício temporariamente.",
    bonus: { addiction: -30 },
    rarity: "raro",
  },
  {
    id: "medical-dose",
    name: "Dose Médica",
    image: "https://placehold.co/48x48/66ff66/fff?text=Medical",
    type: "consumable",
    desc: "Recupera saúde rapidamente.",
    bonus: { health: 30 },
    rarity: "comum",
  },
  {
    id: "sweet-bullet",
    name: "Bala Doce",
    image: "https://placehold.co/48x48/99ff99/fff?text=Sweet",
    type: "consumable",
    desc: "Energia e vício em um só.",
    bonus: { energy: 10, addiction: 10 },
    rarity: "comum",
  },
];

const FILTERS = [
  { key: "all", label: "Tudo", icon: <Backpack /> },
  { key: "weapon", label: "Armas", icon: <Sword /> },
  { key: "armor", label: "Coletes", icon: <Shield /> },
  { key: "style", label: "Roupas", icon: <Shirt /> },
  { key: "accessory", label: "Acessórios", icon: <Glasses /> },
  { key: "consumable", label: "Consumíveis", icon: <Pill /> },
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [usedMessage, setUsedMessage] = useState("");
  const [usedItemId, setUsedItemId] = useState(null);
  const [consumedIds, setConsumedIds] = useState([]);

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

  // Grade 6x3
  const gridItems = [];
  for (let i = 0; i < 18; i++) {
    gridItems.push(itemsToShow[i] || null);
  }

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

  // Verifica se o item selecionado está equipado (para qualquer tipo equipável)
  const isEquippedSelected =
    selectedItem &&
    equipped[selectedItem.type] &&
    equipped[selectedItem.type].id === selectedItem.id;

  // Handler para consumir item
  function handleUse(item) {
    setUsedMessage(`Você usou: ${item.name}!`);
    setUsedItemId(item.id);
    setConsumedIds((prev) => [...prev, item.id]);
    // Não fecha o modal imediatamente
  }

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-900 text-white p-4 gap-4">
      {/* TOPO: Avatar/nome à esquerda, status à direita */}
      <div className="flex flex-row items-center justify-between w-full max-w-2xl mb-4 gap-4">
        {/* Avatar e nome */}
        <div className="flex items-center gap-4 min-w-[180px]">
          <img
            src={avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
          />
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-cyan-400">Urban Player</h2>
            <button className="text-xs text-cyan-400 flex items-center gap-1 hover:underline mt-1">
              <Camera size={14} /> Alterar imagem
            </button>
          </div>
        </div>
        {/* Status */}
        <div className="flex flex-row gap-6 flex-1 justify-end">
          <div className="flex flex-col items-center">
            <Brain className="text-cyan-400 mb-1" size={22} />
            <span className="font-bold text-cyan-300 text-base">
              {status.intelligence || 0}
            </span>
            <span className="text-xs text-cyan-200">Inteligência</span>
          </div>
          <div className="flex flex-col items-center">
            <Dumbbell className="text-green-400 mb-1" size={22} />
            <span className="font-bold text-green-300 text-base">
              {status.strength || 0}
            </span>
            <span className="text-xs text-green-200">Força</span>
          </div>
          <div className="flex flex-col items-center">
            <Smile className="text-pink-400 mb-1" size={22} />
            <span className="font-bold text-pink-300 text-base">
              {status.charisma || 0}
            </span>
            <span className="text-xs text-pink-200">Carisma</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="text-yellow-400 mb-1" size={22} />
            <span className="font-bold text-yellow-300 text-base">
              {status.resistance || 0}
            </span>
            <span className="text-xs text-yellow-200">Resistência</span>
          </div>
        </div>
      </div>

      {/* MEIO: Grade de Inventário */}
      <div className="bg-gray-800 rounded-xl p-4 w-full max-w-2xl flex flex-col items-center">
        <div className="grid grid-cols-6 grid-rows-3 gap-2 mb-4 w-full">
          {gridItems.map((item, idx) => {
            // Se o item está equipado
            const isEquipped =
              item && equipped[item.type] && equipped[item.type].id === item.id;
            return (
              <div
                key={idx}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 transition cursor-pointer ${
                  item
                    ? SLOT_BORDER + " hover:scale-105 " + SLOT_BG
                    : "border-gray-700 bg-gray-900 opacity-40 cursor-default"
                }`}
                onClick={() => item && setSelectedItem(item)}
              >
                {item ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain"
                    />
                    {/* Selo de equipado */}
                    {isEquipped && (
                      <span className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-gray-900 text-[10px] font-bold px-1 py-0.5 rounded-b shadow">
                        EQUIPPED
                      </span>
                    )}
                    {/* Ícone de raridade (apenas raro/lendário) */}
                    {item && item.rarity !== "comum" && (
                      <span className="absolute right-1 top-1">
                        {RARITY_ICONS[item.rarity]}
                      </span>
                    )}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
        {/* Equipados (apenas 1 arma e 1 colete) */}
        <div className="w-full flex flex-col items-start mb-4">
          <span className="text-sm font-bold text-cyan-400 mb-2">
            Equipados
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {/* Arma */}
            <div className="flex flex-col items-center">
              <span className="text-xs mb-1">Arma</span>
              <div
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 ${
                  equipped.weapon ? SLOT_BORDER : "border-gray-700"
                } ${SLOT_BG} cursor-pointer`}
                onClick={() =>
                  equipped.weapon &&
                  setSelectedItem({
                    ...equipped.weapon,
                    equippedType: "weapon",
                  })
                }
              >
                {equipped.weapon ? (
                  <img
                    src={equipped.weapon.image}
                    alt={equipped.weapon.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Sword />
                )}
              </div>
              <span className="text-xs mt-1 text-cyan-300 font-bold">
                {equipped.weapon ? equipped.weapon.name : "Nenhuma"}
              </span>
            </div>
            {/* Armadura */}
            <div className="flex flex-col items-center">
              <span className="text-xs mb-1">Colete</span>
              <div
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 ${
                  equipped.armor ? SLOT_BORDER : "border-gray-700"
                } ${SLOT_BG} cursor-pointer`}
                onClick={() =>
                  equipped.armor &&
                  setSelectedItem({ ...equipped.armor, equippedType: "armor" })
                }
              >
                {equipped.armor ? (
                  <img
                    src={equipped.armor.image}
                    alt={equipped.armor.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Shield />
                )}
              </div>
              <span className="text-xs mt-1 text-cyan-300 font-bold">
                {equipped.armor ? equipped.armor.name : "Nenhum"}
              </span>
            </div>
            {/* Estilo */}
            <div className="flex flex-col items-center">
              <span className="text-xs mb-1">Estilo</span>
              <div
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 ${
                  equipped.style ? SLOT_BORDER : "border-gray-700"
                } ${SLOT_BG} cursor-pointer`}
                onClick={() =>
                  equipped.style &&
                  setSelectedItem({ ...equipped.style, equippedType: "style" })
                }
              >
                {equipped.style ? (
                  <img
                    src={equipped.style.image}
                    alt={equipped.style.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Shirt />
                )}
              </div>
              <span className="text-xs mt-1 text-cyan-300 font-bold">
                {equipped.style ? equipped.style.name : "Nenhum"}
              </span>
            </div>
            {/* Acessório */}
            <div className="flex flex-col items-center">
              <span className="text-xs mb-1">Acessório</span>
              <div
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 ${
                  equipped.accessory ? SLOT_BORDER : "border-gray-700"
                } ${SLOT_BG} cursor-pointer`}
                onClick={() =>
                  equipped.accessory &&
                  setSelectedItem({
                    ...equipped.accessory,
                    equippedType: "accessory",
                  })
                }
              >
                {equipped.accessory ? (
                  <img
                    src={equipped.accessory.image}
                    alt={equipped.accessory.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Glasses />
                )}
              </div>
              <span className="text-xs mt-1 text-cyan-300 font-bold">
                {equipped.accessory ? equipped.accessory.name : "Nenhum"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BASE: Filtros */}
      <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2 mt-4 mb-2">
        {FILTERS.map((f, idx) => (
          <button
            key={f.key}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all border-2 w-full ${
              filter === f.key
                ? "bg-cyan-500 border-cyan-400 text-cyber-dark"
                : "bg-gray-800 border-cyan-700 text-cyan-300 hover:bg-cyan-900/30"
            }`}
            onClick={() => setFilter(f.key)}
          >
            <span className="flex items-center justify-center w-6 h-6 mb-1">
              {f.icon}
            </span>
            <span className="text-xs">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Modal de detalhes do item */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 rounded-xl p-8 border-2 border-cyan-400 shadow-xl min-w-[320px] max-w-[90vw] relative">
            <button
              className="absolute top-2 right-2 text-cyan-400 hover:text-white"
              onClick={() => {
                setSelectedItem(null);
                setUsedMessage("");
                setUsedItemId(null);
              }}
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center gap-3">
              <span className="text-cyan-400 text-4xl">
                {selectedItem.icon}
              </span>
              <h4 className="text-xl font-bold text-cyan-400 mb-2">
                {selectedItem.name}
              </h4>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                {ITEM_TYPES[selectedItem.type] || selectedItem.type}
              </span>
              <p className="text-gray-300 mb-2 text-center">
                {selectedItem.desc}
              </p>
              {/* Bônus */}
              {selectedItem.bonus && (
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {Object.entries(selectedItem.bonus).map(([key, val]) => (
                    <span
                      key={key}
                      className="bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded text-xs font-semibold"
                    >
                      {key}: {String(val)}
                    </span>
                  ))}
                </div>
              )}
              {/* Botões de ação */}
              {["weapon", "armor", "style", "accessory"].includes(
                selectedItem.type
              ) ? (
                isEquippedSelected ? (
                  <button
                    className="bg-yellow-400 text-gray-900 px-3 py-1 rounded font-bold text-xs"
                    onClick={() => handleUnequip(selectedItem.type)}
                  >
                    Desequipar
                  </button>
                ) : (
                  <button
                    className="bg-cyan-500 text-white px-3 py-1 rounded font-bold text-xs"
                    onClick={() => handleEquip(selectedItem)}
                  >
                    Equipar
                  </button>
                )
              ) : selectedItem.type === "consumable" ? (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded font-bold text-xs"
                  onClick={() => handleUse(selectedItem)}
                >
                  Usar
                </button>
              ) : (
                <span className="text-gray-400 text-xs mt-2">
                  Ação não disponível
                </span>
              )}
              {/* Mensagem de uso flutuante */}
              {usedMessage && usedItemId === selectedItem.id && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-green-700 text-white px-4 py-2 rounded shadow-lg text-sm font-bold z-10 animate-fade-in">
                  {usedMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
