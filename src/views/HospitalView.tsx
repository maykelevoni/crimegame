import React, { useState, useEffect, useCallback } from "react";
import {
  Ambulance,
  HeartPulse,
  Pill,
  History,
  Siren,
  Scissors,
  Clock,
  Zap,
  BriefcaseMedical,
  CupSoda,
  Bed,
  DollarSign,
  Timer,
  TrendingUp,
  AlertTriangle,
  Skull,
  Bug,
} from "lucide-react";
import BaseView from "./BaseView";
import { useGameStore } from "@/stores/gameStore";
import { toast } from "sonner";

interface HospitalViewProps {
  isPlayerHospitalized: boolean;
  playerStatus: { health: number; addiction: number };
  onStartTreatment: (type: "health" | "detox") => void;
}

const HospitalView = ({
  isPlayerHospitalized,
  playerStatus,
  onStartTreatment,
}: HospitalViewProps) => {

  const { player, updatePlayerStats } = useGameStore();
  const [health, setHealth] = useState(playerStatus.health);
  const maxHealth = player?.stats?.maxHealth || 100;
  const [addiction, setAddiction] = useState(playerStatus.addiction);
  const [wanted, setWanted] = useState(15);
  const [energy, setEnergy] = useState(50);
  const maxEnergy = player?.stats?.maxEnergy || 100;
  const [money, setMoney] = useState(2500);
  const [cooldown, setCooldown] = useState(0);
  const [activeTreatment, setActiveTreatment] = useState("");
  const [recoveryTime, setRecoveryTime] = useState(0);
  const [hospitalizationReason, setHospitalizationReason] = useState("");
  const [dailyUsage, setDailyUsage] = useState({
    heal: 0,
    detox: 0,
    surgery: 0,
    energy: 0,
    lastReset: new Date().toDateString()
  });

  const healCost = 1000;
  const detoxCost = 1500;
  const surgeryCost = 2500;
  const energyCost = 700;
  const energyRecover = 50;
  const surgeryReduce = 5;
  const cooldownTime = 2;
  const detoxTime = 3;
  const dailyLimit = 1; // Each treatment can only be used once per day

  // Load and manage daily usage from localStorage
  useEffect(() => {
    if (player?.id) {
      const key = `hospital_usage_${player.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        
        // Reset if it's a new day
        if (parsed.lastReset !== today) {
          const reset = {
            heal: 0,
            detox: 0,
            surgery: 0,
            energy: 0,
            lastReset: today
          };
          setDailyUsage(reset);
          localStorage.setItem(key, JSON.stringify(reset));
        } else {
          setDailyUsage(parsed);
        }
      }
    }
  }, [player?.id]);

  // Determine hospitalization reason and recovery time
  useEffect(() => {
    if (isPlayerHospitalized) {
      // Determine if it was overdose or disease based on addiction
      if (addiction >= 80) {
        setHospitalizationReason("overdose");
        setRecoveryTime(5 * 60); // 5 minutos para overdose (em segundos)
      } else if (addiction >= 60) {
        setHospitalizationReason("disease");
        setRecoveryTime(3 * 60); // 3 minutes for disease (in seconds)
      } else {
        setHospitalizationReason("injury");
        setRecoveryTime(2 * 60); // 2 minutos para ferimento (em segundos)
      }
    } else {
      setHospitalizationReason("");
      setRecoveryTime(0);
    }
  }, [isPlayerHospitalized, addiction]);

  const handleRecovery = useCallback(() => {
    // Restore health and remove hospitalization
    const newHealth = 100;
    const newAddiction = Math.max(0, addiction - 10);

    updatePlayerStats({
      health: newHealth,
      addiction: newAddiction,
      isHospitalized: false,
    });

    setHealth(newHealth);
    setAddiction(newAddiction);
    setHospitalizationReason("");
    setRecoveryTime(0); // Reset the timer

    toast.success("🏥 You have recovered and been discharged from the hospital!", {
      duration: 5000,
    });
  }, [maxHealth, health, addiction, updatePlayerStats]);

  // Recovery timer
  useEffect(() => {
    if (recoveryTime > 0 && isPlayerHospitalized) {
      const timer = setTimeout(() => {
        setRecoveryTime(recoveryTime - 1);
      }, 1000); // 1 segundo

      return () => {
        clearTimeout(timer);
      };
    } else if (
      recoveryTime === 0 &&
      isPlayerHospitalized &&
      hospitalizationReason
    ) {
      // Player recovered - only if already hospitalized and had a reason
      handleRecovery();
    }
  }, [recoveryTime, isPlayerHospitalized, hospitalizationReason, handleRecovery]);

  const getTreatmentResult = useCallback((treatment: string) => {
    switch (treatment) {
      case "Heal":
        return `+${100 - health} HP`;
      case "Detox":
        return "-20% Addiction";
      case "Surgery":
        return `-${surgeryReduce} Wanted`;
      case "Energy":
        return `+${energyRecover} Energy`;
      default:
        return "Completed";
    }
  }, [maxHealth, health, surgeryReduce, energyRecover]);

  // Monitor cooldown and apply effects when finished
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 60000); // 1 minuto

      return () => clearTimeout(timer);
    } else if (cooldown === 0 && activeTreatment) {
      // Apply effects when treatment finishes
      switch (activeTreatment) {
        case "Heal": {
          const newHealth = maxHealth; // Full health restore to player's max
          setHealth(newHealth);
          updatePlayerStats({ health: newHealth });
          toast.success("💚 Treatment completed! Health fully restored.", {
            duration: 3000,
          });
          break;
        }

        case "Detox": {
          const newAddiction = Math.max(0, addiction - 25);
          setAddiction(newAddiction);
          updatePlayerStats({ addiction: newAddiction });
          toast.success("💊 Treatment completed! Addiction reduced by 25%.", {
            duration: 3000,
          });
          break;
        }

        case "Surgery": {
          const newWanted = Math.max(0, wanted - surgeryReduce);
          setWanted(newWanted);
          updatePlayerStats({ wantedLevel: newWanted });
          toast.success("🔪 Surgery completed! Wanted level reduced by 5.", {
            duration: 3000,
          });
          break;
        }

        case "Energy": {
          const newEnergy = Math.min(maxEnergy, energy + energyRecover);
          setEnergy(newEnergy);
          updatePlayerStats({ energy: newEnergy });
          toast.success("⚡ Treatment completed! Energy restored by 50 points.", {
            duration: 3000,
          });
          break;
        }
      }

      // Update history with final result
      setHistory((prev) =>
        prev.map((item, index) =>
          index === 0
            ? {
                ...item,
                value: getTreatmentResult(activeTreatment),
              }
            : item
        )
      );

      setActiveTreatment("");
    }
  }, [
    cooldown,
    activeTreatment,
    health,
    maxHealth,
    addiction,
    wanted,
    surgeryReduce,
    energy,
    maxEnergy,
    energyRecover,
    updatePlayerStats,
    getTreatmentResult,
  ]);

  // Function to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startCooldown = (treatment: string) => {
    setActiveTreatment(treatment);
    setCooldown(cooldownTime);
  };

  const handleHeal = () => {
    if (money >= healCost && health < maxHealth && cooldown === 0 && dailyUsage.heal < dailyLimit) {
      const newMoney = money - healCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      // Speed up recovery immediately
      setRecoveryTime(Math.max(0, recoveryTime - 2 * 60)); // Reduces 2 minutes

      // Update daily usage
      const newUsage = { ...dailyUsage, heal: dailyUsage.heal + 1 };
      setDailyUsage(newUsage);
      if (player?.id) {
        localStorage.setItem(`hospital_usage_${player.id}`, JSON.stringify(newUsage));
      }

      startCooldown("Heal");

      toast.success(
        "💚 Treatment started! Health will be fully restored in 2 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleDetox = () => {
    if (money >= detoxCost && addiction > 0 && cooldown === 0 && dailyUsage.detox < dailyLimit) {
      const newMoney = money - detoxCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      // Speed up recovery immediately
      setRecoveryTime(Math.max(0, recoveryTime - 3 * 60)); // Reduces 3 minutes

      // Update daily usage
      const newUsage = { ...dailyUsage, detox: dailyUsage.detox + 1 };
      setDailyUsage(newUsage);
      if (player?.id) {
        localStorage.setItem(`hospital_usage_${player.id}`, JSON.stringify(newUsage));
      }

      startCooldown("Detox");

      toast.success(
        "💊 Treatment started! Addiction will be reduced by 25% in 3 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleSurgery = () => {
    if (money >= surgeryCost && wanted > 0 && cooldown === 0 && dailyUsage.surgery < dailyLimit) {
      const newMoney = money - surgeryCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      // Update daily usage
      const newUsage = { ...dailyUsage, surgery: dailyUsage.surgery + 1 };
      setDailyUsage(newUsage);
      if (player?.id) {
        localStorage.setItem(`hospital_usage_${player.id}`, JSON.stringify(newUsage));
      }

      startCooldown("Surgery");

      toast.success(
        "🔪 Surgery started! Wanted level will be reduced by 5 in 2 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleEnergy = () => {
    if (money >= energyCost && energy < maxEnergy && cooldown === 0 && dailyUsage.energy < dailyLimit) {
      const newMoney = money - energyCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      // Update daily usage
      const newUsage = { ...dailyUsage, energy: dailyUsage.energy + 1 };
      setDailyUsage(newUsage);
      if (player?.id) {
        localStorage.setItem(`hospital_usage_${player.id}`, JSON.stringify(newUsage));
      }

      startCooldown("Energy");

      toast.success(
        "⚡ Treatment started! Energy will be restored by 50 points in 2 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleTreatment = (type: "health" | "detox") => {
    if (type === "health") {
      handleHeal();
    } else if (type === "detox") {
      handleDetox();
    }
  };

  // Emergency treatment to accelerate recovery
  const handleEmergencyTreatment = () => {
    const cost = 2000;
    if (money >= cost) {
      const newMoney = money - cost;
      const newRecoveryTime = Math.max(0, recoveryTime - 60); // Reduz 1 minuto

      // Atualizar estado local
      setMoney(newMoney);
      setRecoveryTime(newRecoveryTime);

      // Atualizar gameStore
      updatePlayerStats({
        money: newMoney,
      });

      setHistory([
        {
          type: "Emergency Treatment",
          value: "-1 min recovery",
          date: "Agora",
        },
        ...history,
      ]);

      toast.success(
        "🚑 Emergency treatment applied! Recovery accelerated.",
        {
          duration: 4000,
        }
      );
    }
  };

  if (isPlayerHospitalized) {
    const getHospitalizationIcon = () => {
      switch (hospitalizationReason) {
        case "overdose":
          return <Skull size={48} className="mx-auto text-red-500 mb-4" />;
        case "disease":
          return <Bug size={48} className="mx-auto text-orange-500 mb-4" />;
        default:
          return <Bed size={48} className="mx-auto text-green-500 mb-4" />;
      }
    };

    const getHospitalizationTitle = () => {
      switch (hospitalizationReason) {
        case "overdose":
          return "You are hospitalized for OVERDOSE!";
        case "disease":
          return "You are hospitalized for DISEASE!";
        default:
          return "You are hospitalized!";
      }
    };

    const getHospitalizationDescription = () => {
      switch (hospitalizationReason) {
        case "overdose":
          return "Your overdose was severe. You need intensive treatment to recover.";
        case "disease":
          return "You contracted a disease. You need specialized medical treatment.";
        default:
          return "Your health is very low. You need treatment to be able to leave.";
      }
    };

    return (
      <BaseView title="Hospital">
        <div className="p-4 text-center">
          {/* Imagem do Hospital */}
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=400&fit=crop"
                alt="Hospital"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {getHospitalizationIcon()}
          <h3 className="text-2xl font-bold mb-2">
            {getHospitalizationTitle()}
          </h3>
          <p className="text-white/70 mb-4">
            {getHospitalizationDescription()}
          </p>

          {/* Recovery time */}
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer size={24} className="text-red-400" />
              <span className="text-red-400 font-bold text-lg">
                Recovery Time: {formatTime(recoveryTime)}
              </span>
            </div>
            {activeTreatment && (
              <div className="mb-2 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-blue-400 font-semibold">
                    🏥 Tratamento Ativo: {activeTreatment}
                  </span>
                  <span className="text-blue-400 text-sm">
                    ({cooldown} min restante)
                  </span>
                </div>
              </div>
            )}
            <div className="w-full bg-red-500/30 rounded-full h-3">
              <div
                className="bg-red-400 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(() => {
                    const maxTime =
                      hospitalizationReason === "overdose"
                        ? 5 * 60
                        : hospitalizationReason === "disease"
                        ? 3 * 60
                        : 2 * 60;
                    return ((maxTime - recoveryTime) / maxTime) * 100;
                  })()}%`,
                  maxWidth: "100%",
                }}
              ></div>
            </div>
          </div>

          {/* Available treatments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleTreatment("health")}
              disabled={money < healCost || health >= maxHealth || cooldown > 0 || dailyUsage.heal >= dailyLimit}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                money >= healCost && health < maxHealth && cooldown === 0 && dailyUsage.heal < dailyLimit
                  ? "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
                  : "bg-gray-500/20 border border-gray-500/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <HeartPulse size={32} className="mb-2 text-green-400" />
              <span className="font-semibold">Heal Wounds</span>
              <span className="text-xs text-white/60">
                (${healCost} | {cooldownTime} min | -2 min recovery)
              </span>
            </button>
            <button
              onClick={() => handleTreatment("detox")}
              disabled={money < detoxCost || addiction <= 0 || cooldown > 0 || dailyUsage.detox >= dailyLimit}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                money >= detoxCost && addiction > 0 && cooldown === 0 && dailyUsage.detox < dailyLimit
                  ? "bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30"
                  : "bg-gray-500/20 border border-gray-500/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <Pill size={32} className="mb-2 text-orange-400" />
              <span className="font-semibold">Detox Treatment</span>
              <span className="text-xs text-white/60">
                (${detoxCost} | {detoxTime} min | -3 min recovery)
              </span>
            </button>
          </div>

          {/* Emergency treatment */}
          <div className="mb-4">
            <button
              onClick={handleEmergencyTreatment}
              disabled={money < 2000}
              className={`w-full p-4 rounded-lg transition-colors ${
                money >= 2000
                  ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
                  : "bg-gray-500/20 border border-gray-500/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle size={24} className="text-red-400" />
                <span className="font-bold text-red-400">
                  Emergency Treatment
                </span>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Accelerate recovery by 1 minute (${2000})
              </p>
            </button>
          </div>

          {/* Status atual */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-800/20 border border-gray-600/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <HeartPulse size={16} className="text-red-400" />
                <span className="text-white/60">Saúde:</span>
              </div>
              <span className="text-red-400 font-bold">
                {health}/{maxHealth}
              </span>
            </div>
            <div className="p-3 bg-gray-800/20 border border-gray-600/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Pill size={16} className="text-orange-400" />
                <span className="text-white/60">Addiction:</span>
              </div>
              <span className="text-orange-400 font-bold">{addiction}%</span>
            </div>
          </div>
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView title="Hospital">

      {/* Player Status */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-green-400" />
          Player Status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <HeartPulse size={16} className="text-red-400" />
              <span className="text-sm text-white/60">Health:</span>
              <span className="text-red-400 font-bold">
                {health}/{maxHealth}
              </span>
            </div>
          </div>
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Pill size={16} className="text-orange-400" />
              <span className="text-sm text-white/60">Addiction:</span>
              <span className="text-orange-400 font-bold">{addiction}%</span>
            </div>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Siren size={16} className="text-yellow-400" />
              <span className="text-sm text-white/60">Wanted:</span>
              <span className="text-yellow-400 font-bold">{wanted}/100</span>
            </div>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-blue-400" />
              <span className="text-sm text-white/60">Energy:</span>
              <span className="text-blue-400 font-bold">
                {energy}/{maxEnergy}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cooldown Status */}
      {cooldown > 0 && (
        <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <Timer size={20} className="text-orange-400" />
            <span className="text-orange-400 font-bold">
              Treatment in progress: {cooldown}min remaining
            </span>
          </div>
        </div>
      )}

      {/* Available Treatments */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BriefcaseMedical size={24} className="text-green-400" />
          Available Treatments
        </h2>
        <div className="grid gap-4">
          <div
            className={`p-4 rounded-xl border ${
              money >= healCost && health < maxHealth && cooldown === 0 && dailyUsage.heal < dailyLimit
                ? "border-green-500/30 bg-green-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < healCost || health >= maxHealth || cooldown > 0 || dailyUsage.heal >= dailyLimit
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleHeal}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center">
                <HeartPulse size={24} className="text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-green-500">
                    Healing
                  </span>
                  <h3 className="font-bold text-white">Curar Ferimentos</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Fully restores health
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-green-400" />
                    <span className="text-white/60">Cost:</span>
                    <span className="text-green-400 font-bold">
                      ${healCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer size={14} className="text-orange-400" />
                    <span className="text-white/60">Time:</span>
                    <span className="text-orange-400 font-bold">
                      {cooldownTime}min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              money >= detoxCost && addiction > 0 && cooldown === 0 && dailyUsage.detox < dailyLimit
                ? "border-orange-500/30 bg-orange-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < detoxCost || addiction <= 0 || cooldown > 0 || dailyUsage.detox >= dailyLimit
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleDetox}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Pill size={24} className="text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-orange-500">
                    Detox
                  </span>
                  <h3 className="font-bold text-white">Fazer Detox</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">Reduces addiction by 25%</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-green-400" />
                    <span className="text-white/60">Cost:</span>
                    <span className="text-green-400 font-bold">
                      ${detoxCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer size={14} className="text-orange-400" />
                    <span className="text-white/60">Time:</span>
                    <span className="text-orange-400 font-bold">
                      {cooldownTime}min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              money >= surgeryCost && wanted > 0 && cooldown === 0 && dailyUsage.surgery < dailyLimit
                ? "border-yellow-500/30 bg-yellow-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < surgeryCost || wanted <= 0 || cooldown > 0 || dailyUsage.surgery >= dailyLimit
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleSurgery}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Scissors size={24} className="text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-yellow-500">
                    Surgery
                  </span>
                  <h3 className="font-bold text-white">Plastic Surgery</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Reduces wanted level by 5
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-green-400" />
                    <span className="text-white/60">Cost:</span>
                    <span className="text-green-400 font-bold">
                      ${surgeryCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer size={14} className="text-orange-400" />
                    <span className="text-white/60">Time:</span>
                    <span className="text-orange-400 font-bold">
                      {cooldownTime}min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              money >= energyCost && energy < maxEnergy && cooldown === 0 && dailyUsage.energy < dailyLimit
                ? "border-blue-500/30 bg-blue-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < energyCost || energy >= maxEnergy || cooldown > 0 || dailyUsage.energy >= dailyLimit
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleEnergy}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CupSoda size={24} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-blue-500">
                    Energy
                  </span>
                  <h3 className="font-bold text-white">Energy Serum</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Restores 50 energy points
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-green-400" />
                    <span className="text-white/60">Cost:</span>
                    <span className="text-green-400 font-bold">
                      ${energyCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer size={14} className="text-orange-400" />
                    <span className="text-white/60">Time:</span>
                    <span className="text-orange-400 font-bold">
                      {cooldownTime}min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </BaseView>
  );
};

export default HospitalView;
