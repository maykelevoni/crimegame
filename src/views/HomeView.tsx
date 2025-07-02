import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGameStore } from "../stores/gameStore";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Users,
  Trophy,
  Briefcase,
  Shield,
  ShoppingBag,
  Pill,
  Users2,
  Sword,
  HeartPulse,
  Moon,
  Wine,
  BarChart3,
  ListChecks,
  Hospital,
  Ambulance,
  MessageSquare,
  Map,
  Link,
  UserCircle,
  Building2,
  Zap,
  Skull,
  DollarSign,
  Star,
  ChevronRight,
  AlertTriangle,
  Target,
  Flame,
  Award,
  Landmark,
  Crosshair,
  Gift,
  Newspaper,
  Dices,
  LocateFixed,
  Warehouse,
  Lock,
  Calendar,
} from "lucide-react";

interface HomeViewProps {
  onViewChange: (view: string) => void;
}

const HomeView = ({ onViewChange }: HomeViewProps) => {
  const [lastRewardTime, setLastRewardTime] = useState<number | null>(null);
  const { player, updatePlayerMoney } = useGameStore();

  const handleAddMoney = async () => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    const moneyToAdd = 10000;
    
    try {
      // Update database
      const { error } = await supabase
        .from("players")
        .update({ money: (player.stats.money || 0) + moneyToAdd })
        .eq("id", player.id);

      if (error) {
        console.error("Error adding money:", error);
        toast.error("Failed to add money to database");
        return;
      }

      // Update local store
      updatePlayerMoney(moneyToAdd);
      toast.success(`💰 Added $${moneyToAdd.toLocaleString()} for testing!`);
    } catch (error) {
      console.error("Error adding test money:", error);
      toast.error("Failed to add test money");
    }
  };
  const [timeUntilNextReward, setTimeUntilNextReward] = useState<number>(0);
  const [canCollectReward, setCanCollectReward] = useState<boolean>(true);

  const districts = [
    {
      name: "DOWNTOWN",
      icon: Briefcase,
      color: "cyber-blue",
      description: "Office jobs, business opportunities",
    },
    {
      name: "ENTERTAINMENT",
      icon: Users,
      color: "cyber-purple",
      description: "Nightlife and social events",
    },
    {
      name: "RESIDENTIAL",
      icon: MapPin,
      color: "cyber-orange",
      description: "Quiet neighborhood jobs",
    },
    {
      name: "INDUSTRIAL",
      icon: Trophy,
      color: "cyber-green",
      description: "Heavy work and competition",
    },
  ];

  const quickActions = [
    {
      title: "MISSIONS",
      icon: ListChecks,
      color: "cyber-blue",
      onClick: () => onViewChange("missions"),
    },
    {
      title: "SHOP",
      icon: ShoppingBag,
      color: "cyber-yellow",
      onClick: () => onViewChange("shop"),
    },
    {
      title: "GANG",
      icon: Users2,
      color: "cyber-purple",
      onClick: () => onViewChange("gang"),
    },
    {
      title: "STATS",
      icon: BarChart3,
      color: "cyber-green",
      onClick: () => onViewChange("stats"),
    },
    {
      title: "MESSAGES",
      icon: MessageSquare,
      color: "cyber-pink",
      onClick: () => onViewChange("messages"),
    },
  ];

  const handleDailyReward = () => {
    if (!canCollectReward) return;

    // Simular recompensa diária
    toast.success("🎉 Daily Reward Collected! 💰 +$500, 💊 +20 HP, ⚡ +30 Energy", {
      duration: 3000
    });

    // Salvar timestamp da última coleta
    const now = Date.now();
    setLastRewardTime(now);
    localStorage.setItem("lastDailyReward", now.toString());
    setCanCollectReward(false);
  };

  // Verificar se pode coletar recompensa
  useEffect(() => {
    const lastReward = localStorage.getItem("lastDailyReward");
    if (lastReward) {
      const lastTime = parseInt(lastReward);
      setLastRewardTime(lastTime);

      const now = Date.now();
      const timeDiff = now - lastTime;
      const dayInMs = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

      if (timeDiff < dayInMs) {
        setCanCollectReward(false);
        setTimeUntilNextReward(dayInMs - timeDiff);
      } else {
        setCanCollectReward(true);
        setTimeUntilNextReward(0);
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!canCollectReward && timeUntilNextReward > 0) {
      const timer = setInterval(() => {
        setTimeUntilNextReward((prev) => {
          if (prev <= 1000) {
            setCanCollectReward(true);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [canCollectReward, timeUntilNextReward]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Conteúdo principal */}
      <div className="space-y-3 mt-0 pt-0 overflow-x-hidden pb-16">
        {/* Daily Reward */}
        <div
          className="daily-reward-box flex flex-col justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #1a1a2e, #16213e)",
            border: "1px solid #4f46e5",
            borderRadius: "12px",
            boxShadow: "inset 0 0 8px #4f46e5",
            padding: "20px",
            color: "#4f46e5",
            height: "160px",
            minHeight: "160px",
            maxHeight: "160px",
          }}
        >
          <div
            className="flex flex-col items-center justify-center w-full"
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            <span className="flex items-center gap-2 justify-center mb-2">
              <Calendar size={24} className="text-indigo-400" />
              Daily Reward
              <span className="text-yellow-300 animate-pulse">✨</span>
            </span>
            <div className="text-center text-sm text-indigo-300 mb-3">
              {canCollectReward ? (
                <div>🎁 Mystery rewards await!</div>
              ) : (
                <div>⏰ Come back in: {formatTime(timeUntilNextReward)}</div>
              )}
            </div>
            <button
              className={`reward-btn flex items-center justify-center mx-auto ${
                !canCollectReward ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                background: canCollectReward
                  ? "radial-gradient(circle at center, #4f46e5, #3730a3)"
                  : "radial-gradient(circle at center, #6b7280, #4b5563)",
                border: "none",
                padding: "10px 24px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                borderRadius: "25px",
                color: "white",
                boxShadow: canCollectReward ? "0 0 10px #4f46e5aa" : "none",
                cursor: canCollectReward ? "pointer" : "not-allowed",
              }}
              onClick={handleDailyReward}
              disabled={!canCollectReward}
            >
              <Gift size={16} className="mr-2" />
              {canCollectReward ? "Collect Reward" : "Already Collected"}
            </button>
          </div>
        </div>

        {/* Espaçamento entre Daily Reward e Main Actions */}
        <div className="h-4"></div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-0">
          <button
            onClick={() => onViewChange("robbery")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500/20">
                <LocateFixed size={24} className="text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-red-500">ROBBERY</h3>
                <p className="text-xs text-red-500/70">Engage in crimes</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-red-500/50" />
            </div>
          </button>

          <button
            onClick={() => onViewChange("nightlife")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Wine size={24} className="text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-purple-500">NIGHTLIFE</h3>
                <p className="text-xs text-purple-500/70">
                  Clubs & Prostitutes
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-purple-500/50" />
            </div>
          </button>

          <button
            onClick={() => onViewChange("hospital")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Ambulance size={24} className="text-green-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-green-500">HOSPITAL</h3>
                <p className="text-xs text-green-500/70">Heal & recover</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-green-500/50" />
            </div>
          </button>

          <button
            onClick={() => onViewChange("business")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Building2 size={24} className="text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-blue-500">BUSINESS</h3>
                <p className="text-xs text-blue-500/70">Manage empire</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-blue-500/50" />
            </div>
          </button>

          {/* Novo botão: BANK */}
          <button
            onClick={() => onViewChange("bank")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-400/20">
                <Landmark size={24} className="text-yellow-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-yellow-600">BANK</h3>
                <p className="text-xs text-yellow-600/70">Banking & heists</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-yellow-500/50" />
            </div>
          </button>

          {/* Novo botão: CASINO */}
          <button
            onClick={() => onViewChange("casino")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-400/20 to-pink-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-400/20">
                <Dices size={24} className="text-pink-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-pink-600">CASINO</h3>
                <p className="text-xs text-pink-600/70">Gamble & win</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-pink-500/50" />
            </div>
          </button>

          {/* Novo botão: SHOP */}
          <button
            onClick={() => onViewChange("shop")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan-400/20">
                <ShoppingBag size={24} className="text-cyan-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-cyan-600">SHOP</h3>
                <p className="text-xs text-cyan-600/70">Buy items</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-cyan-500/50" />
            </div>
          </button>

          {/* Novo botão: PRISON */}
          <button
            onClick={() => onViewChange("prison")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/20">
                <Lock size={24} className="text-orange-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-orange-500">PRISON</h3>
                <p className="text-xs text-orange-500/70">Visit prison</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-orange-500/50" />
            </div>
          </button>

        </div>

        {/* City Map */}
        {/* ... código removido até o fechamento do último </div> dessa seção ... */}
      </div>
    </>
  );
};

export default HomeView;
