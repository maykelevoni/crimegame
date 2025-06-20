import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Flame,
  Music,
  Star,
  Heart,
  KeyRound,
  Users,
  AlertTriangle,
  GlassWater,
  Gem,
  BadgeDollarSign,
  Wine,
  Beer,
  X,
  User,
  DollarSign,
  Zap,
  Pill,
  Sparkles,
  Brain,
  Eye,
} from "lucide-react";

// Consumíveis do Bar
const barDrinks = [
  {
    id: "beer",
    name: "Beer",
    icon: Beer,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100&h=100&fit=crop",
    price: 15,
    effects: {
      energy: 10,
      addiction: 5,
      health: -2,
    },
    description: "Classic beer, gives you energy but increases addiction",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
  },
  {
    id: "vodka",
    name: "Vodka",
    icon: Wine,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
    price: 25,
    effects: {
      energy: 15,
      addiction: 8,
      health: -3,
    },
    description: "Strong vodka, more energy but higher addiction risk",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "whiskey",
    name: "Whiskey",
    icon: Wine,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    price: 35,
    effects: {
      energy: 20,
      addiction: 12,
      health: -5,
    },
    description: "Premium whiskey, maximum energy boost",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
];

// Drogas da Rave
const raveDrugs = [
  {
    id: "ecstasy",
    name: "Ecstasy",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop",
    price: 50,
    effects: {
      energy: 40,
      addiction: 25,
      health: -10,
    },
    description: "Pure MDMA, intense euphoria and energy boost",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    risk: "High",
  },
  {
    id: "cocaine",
    name: "Cocaine",
    icon: Brain,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop",
    price: 80,
    effects: {
      energy: 60,
      addiction: 35,
      health: -15,
    },
    description: "Pure cocaine, extreme energy and focus",
    color: "text-white",
    bgColor: "bg-white/20",
    risk: "Very High",
  },
  {
    id: "lsd",
    name: "LSD",
    icon: Eye,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop",
    price: 30,
    effects: {
      energy: 20,
      addiction: 15,
      health: -5,
    },
    description: "Acid trip, visual hallucinations and creativity",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    risk: "Medium",
  },
  {
    id: "heroin",
    name: "Heroin",
    icon: Pill,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop",
    price: 120,
    effects: {
      energy: -20,
      addiction: 50,
      health: -25,
    },
    description: "Deadly heroin, extreme addiction risk",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    risk: "Extreme",
  },
];

// Prostitutas do Brothel
const prostitutes = [
  {
    id: "lisa",
    name: "Lisa",
    age: 23,
    price: 100,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    description: "Young and energetic",
    effects: {
      energy: 30,
      addiction: 15,
      health: -8,
    },
    rating: 4.5,
  },
  {
    id: "sarah",
    name: "Sarah",
    age: 28,
    price: 150,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "Experienced and skilled",
    effects: {
      energy: 40,
      addiction: 20,
      health: -10,
    },
    rating: 4.8,
  },
  {
    id: "jessica",
    name: "Jessica",
    age: 25,
    price: 200,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    description: "Premium service",
    effects: {
      energy: 50,
      addiction: 25,
      health: -12,
    },
    rating: 5.0,
  },
  {
    id: "maria",
    name: "Maria",
    age: 30,
    price: 300,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    description: "VIP experience",
    effects: {
      energy: 60,
      addiction: 30,
      health: -15,
    },
    rating: 5.0,
  },
];

// Componente de Notificação
const Notification = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-900" : "bg-red-900";
  const borderColor =
    type === "success" ? "border-green-500" : "border-red-500";
  const textColor = type === "success" ? "text-green-100" : "text-red-100";

  return (
    <div
      className={`fixed bottom-20 right-4 z-50 p-4 rounded-lg border-2 ${bgColor} ${borderColor} max-w-sm shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <p className={`font-semibold ${textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const NightlifeView = () => {
  const [activeTab, setActiveTab] = useState("bar");
  const [selectedConsumable, setSelectedConsumable] =
    useState<Consumable | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [notifications, setNotifications] = useState<string[]>([]);
  const [playerMoney, setPlayerMoney] = useState(1000); // Mock player money

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleDrink = (drink) => {
    if (playerMoney >= drink.price) {
      setPlayerMoney((prev) => prev - drink.price);
      addNotification(
        `🍺 You drank ${drink.name}! +${drink.effects.energy} Energy, +${drink.effects.addiction}% Addiction`,
        "success"
      );
    } else {
      addNotification("❌ Not enough money!", "error");
    }
  };

  const handleDrug = (drug) => {
    if (playerMoney >= drug.price) {
      setPlayerMoney((prev) => prev - drug.price);
      const energyText =
        drug.effects.energy >= 0
          ? `+${drug.effects.energy}`
          : `${drug.effects.energy}`;
      addNotification(
        `💊 You took ${drug.name}! ${energyText} Energy, +${drug.effects.addiction}% Addiction`,
        "success"
      );
    } else {
      addNotification("❌ Not enough money!", "error");
    }
  };

  const handleProstitute = (prostitute) => {
    if (playerMoney >= prostitute.price) {
      setPlayerMoney((prev) => prev - prostitute.price);
      addNotification(
        `💋 You spent time with ${prostitute.name}! +${prostitute.effects.energy} Energy, +${prostitute.effects.addiction}% Addiction`,
        "success"
      );
    } else {
      addNotification("❌ Not enough money!", "error");
    }
  };

  return (
    <BaseView title="Nightlife">
      <div className="cyber-border p-4">
        {/* Player Money */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-cyber-dark-medium rounded-lg">
          <DollarSign size={20} className="text-green-400" />
          <span className="font-bold text-green-400">${playerMoney}</span>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("bar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "bar"
                ? "bg-cyber-blue text-white"
                : "bg-cyber-dark-medium text-cyber-blue hover:bg-cyber-blue/20"
            }`}
          >
            <Beer size={20} />
            Bar
          </button>
          <button
            onClick={() => setActiveTab("rave")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "rave"
                ? "bg-purple-600 text-white"
                : "bg-cyber-dark-medium text-purple-400 hover:bg-purple-600/20"
            }`}
          >
            <Music size={20} />
            Rave
          </button>
          <button
            onClick={() => setActiveTab("brothel")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === "brothel"
                ? "bg-cyber-pink text-white"
                : "bg-cyber-dark-medium text-cyber-pink hover:bg-cyber-pink/20"
            }`}
          >
            <Users size={20} />
            Brothel
          </button>
        </div>

        {/* Bar Section */}
        {activeTab === "bar" && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-cyber-blue mb-2">
                City Bar
              </h3>
              <p className="text-cyber-blue/70">
                Drink and socialize to gain energy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {barDrinks.map((drink) => {
                const Icon = drink.icon;
                return (
                  <div
                    key={drink.id}
                    className={`cyber-border p-4 ${drink.bgColor} hover:scale-105 transition-transform cursor-pointer`}
                    onClick={() => handleDrink(drink)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src={drink.image}
                          alt={drink.name}
                          className="w-16 h-16 rounded-lg object-cover border border-white/20"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{drink.name}</h4>
                        <p className="text-sm text-white/60">${drink.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      {drink.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400" />
                        <span>+{drink.effects.energy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Pill size={14} className="text-red-400" />
                        <span>+{drink.effects.addiction}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rave Section */}
        {activeTab === "rave" && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                Underground Rave
              </h3>
              <p className="text-purple-400/70">
                Experience the dark side of nightlife
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {raveDrugs.map((drug) => {
                const Icon = drug.icon;
                return (
                  <div
                    key={drug.id}
                    className={`cyber-border p-4 ${
                      drug.bgColor
                    } hover:scale-105 transition-transform cursor-pointer border-l-4 ${
                      drug.risk === "Extreme"
                        ? "border-red-500"
                        : drug.risk === "Very High"
                        ? "border-orange-500"
                        : drug.risk === "High"
                        ? "border-yellow-500"
                        : "border-purple-500"
                    }`}
                    onClick={() => handleDrug(drug)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src={drug.image}
                          alt={drug.name}
                          className="w-16 h-16 rounded-lg object-cover border border-white/20"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{drug.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white/60">${drug.price}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              drug.risk === "Extreme"
                                ? "bg-red-500/20 text-red-400"
                                : drug.risk === "Very High"
                                ? "bg-orange-500/20 text-orange-400"
                                : drug.risk === "High"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {drug.risk} Risk
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      {drug.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400" />
                        <span>
                          {drug.effects.energy >= 0 ? "+" : ""}
                          {drug.effects.energy}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Pill size={14} className="text-red-400" />
                        <span>+{drug.effects.addiction}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="text-red-400" />
                        <span>{drug.effects.health}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Brothel Section */}
        {activeTab === "brothel" && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-cyber-pink mb-2">
                VIP Brothel
              </h3>
              <p className="text-cyber-pink/70">
                Choose your companion for the night
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prostitutes.map((prostitute) => (
                <div
                  key={prostitute.id}
                  className="cyber-border p-4 bg-cyber-dark-medium hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleProstitute(prostitute)}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={prostitute.image}
                      alt={prostitute.name}
                      className="w-20 h-20 rounded-lg object-cover border border-cyber-pink/50"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-cyber-pink">
                          {prostitute.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="text-sm text-yellow-400">
                            {prostitute.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-white/60 mb-2">
                        {prostitute.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-cyber-gold font-bold">
                          ${prostitute.price}
                        </span>
                        <span className="text-sm text-white/40">
                          {prostitute.age} years
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Zap size={14} className="text-yellow-400" />
                          <span>+{prostitute.effects.energy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Pill size={14} className="text-red-400" />
                          <span>+{prostitute.effects.addiction}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            )
          }
        />
      ))}
    </BaseView>
  );
};

export default NightlifeView;
