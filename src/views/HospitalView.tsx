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
  console.log("🏥 DEBUG: HospitalView renderizado");
  console.log("isPlayerHospitalized:", isPlayerHospitalized);
  console.log("playerStatus:", playerStatus);

  const { player, updatePlayerStats } = useGameStore();
  const [health, setHealth] = useState(playerStatus.health);
  const maxHealth = 100;
  const [addiction, setAddiction] = useState(playerStatus.addiction);
  const [wanted, setWanted] = useState(15);
  const [energy, setEnergy] = useState(50);
  const maxEnergy = 100;
  const [money, setMoney] = useState(2500);
  const [cooldown, setCooldown] = useState(0);
  const [activeTreatment, setActiveTreatment] = useState("");
  const [recoveryTime, setRecoveryTime] = useState(0);
  const [hospitalizationReason, setHospitalizationReason] = useState("");
  const [history, setHistory] = useState([
    { type: "Heal", value: "+35 HP", date: "Today, 08:00" },
    { type: "Detox", value: "-10% Addiction", date: "Yesterday, 22:15" },
  ]);

  const healCost = 500;
  const detoxCost = 800;
  const surgeryCost = 1200;
  const energyCost = 400;
  const energyRecover = 40;
  const surgeryReduce = 5;
  const cooldownTime = 2;
  const detoxTime = 3;

  // Determinar razão da hospitalização e tempo de recuperação
  useEffect(() => {
    console.log(
      "🏥 DEBUG: useEffect - isPlayerHospitalized:",
      isPlayerHospitalized,
      "addiction:",
      addiction
    );

    if (isPlayerHospitalized) {
      console.log("🏥 DEBUG: Definindo tempo de recuperação...");
      // Determinar se foi overdose ou doença baseado no vício
      if (addiction >= 80) {
        console.log("🏥 DEBUG: Overdose detectada - 5 minutos");
        setHospitalizationReason("overdose");
        setRecoveryTime(5 * 60); // 5 minutos para overdose (em segundos)
      } else if (addiction >= 60) {
        console.log("🏥 DEBUG: Doença detectada - 3 minutos");
        setHospitalizationReason("disease");
        setRecoveryTime(3 * 60); // 3 minutos para doença (em segundos)
      } else {
        console.log("🏥 DEBUG: Ferimento detectado - 2 minutos");
        setHospitalizationReason("injury");
        setRecoveryTime(2 * 60); // 2 minutos para ferimento (em segundos)
      }
    } else {
      console.log("🏥 DEBUG: Jogador não está hospitalizado - resetando");
      setHospitalizationReason("");
      setRecoveryTime(0);
    }
  }, [isPlayerHospitalized, addiction]);

  // Timer de recuperação
  useEffect(() => {
    console.log(
      "⏰ DEBUG: Timer de recuperação - isPlayerHospitalized:",
      isPlayerHospitalized,
      "recoveryTime:",
      recoveryTime
    );

    if (recoveryTime > 0 && isPlayerHospitalized) {
      console.log("⏰ DEBUG: Iniciando timer de recuperação");
      const timer = setTimeout(() => {
        console.log(
          "⏰ DEBUG: Timer tick - reduzindo recoveryTime de",
          recoveryTime,
          "para",
          recoveryTime - 1
        );
        setRecoveryTime(recoveryTime - 1);
      }, 1000); // 1 segundo

      return () => {
        console.log("⏰ DEBUG: Limpando timer");
        clearTimeout(timer);
      };
    } else if (
      recoveryTime === 0 &&
      isPlayerHospitalized &&
      hospitalizationReason
    ) {
      console.log("🏥 DEBUG: Player recovered - calling handleRecovery");
      // Player recovered - only if already hospitalized and had a reason
      handleRecovery();
    }
  }, [recoveryTime, isPlayerHospitalized, hospitalizationReason, handleRecovery]);

  // Monitorar cooldown e aplicar efeitos quando acabar
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 60000); // 1 minuto

      return () => clearTimeout(timer);
    } else if (cooldown === 0 && activeTreatment) {
      // Aplicar efeitos quando o tratamento acabar
      switch (activeTreatment) {
        case "Heal": {
          const newHealth = maxHealth;
          setHealth(newHealth);
          updatePlayerStats({ health: newHealth });
          toast.success("💚 Treatment completed! Health restored.", {
            duration: 3000,
          });
          break;
        }

        case "Detox": {
          const newAddiction = Math.max(0, addiction - 20);
          setAddiction(newAddiction);
          updatePlayerStats({ addiction: newAddiction });
          toast.success("💊 Treatment completed! Addiction reduced by 20%.", {
            duration: 3000,
          });
          break;
        }

        case "Surgery": {
          const newWanted = Math.max(0, wanted - surgeryReduce);
          setWanted(newWanted);
          updatePlayerStats({ wantedLevel: newWanted });
          toast.success("🔪 Surgery completed! Wanted level reduced.", {
            duration: 3000,
          });
          break;
        }

        case "Energy": {
          const newEnergy = Math.min(maxEnergy, energy + energyRecover);
          setEnergy(newEnergy);
          updatePlayerStats({ energy: newEnergy });
          toast.success("⚡ Treatment completed! Energy restored.", {
            duration: 3000,
          });
          break;
        }
      }

      // Atualizar histórico com o resultado final
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

  // Função para obter o resultado do tratamento
  const getTreatmentResult = useCallback((treatment: string) => {
    switch (treatment) {
      case "Heal":
        return `+${maxHealth - health} HP`;
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

  // Função para formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRecovery = useCallback(() => {
    console.log("🏥 DEBUG: handleRecovery called");
    // Restore health and remove hospitalization
    const newHealth = Math.min(maxHealth, health + 30);
    const newAddiction = Math.max(0, addiction - 10);

    console.log("🏥 DEBUG: Updating player stats - isHospitalized: false");
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

  const startCooldown = (treatment: string) => {
    setActiveTreatment(treatment);
    setCooldown(cooldownTime);
  };

  const handleHeal = () => {
    if (money >= healCost && health < maxHealth && cooldown === 0) {
      const newMoney = money - healCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      // Speed up recovery immediately
      setRecoveryTime(Math.max(0, recoveryTime - 2 * 60)); // Reduces 2 minutes

      setHistory([
        { type: "Heal", value: "In treatment...", date: "Now" },
        ...history,
      ]);
      startCooldown("Heal");

      toast.success(
        "💚 Treatment started! Health will be restored in 2 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleDetox = () => {
    if (money >= detoxCost && addiction > 0 && cooldown === 0) {
      const newMoney = money - detoxCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      // Speed up recovery immediately
      setRecoveryTime(Math.max(0, recoveryTime - 3 * 60)); // Reduces 3 minutes

      setHistory([
        { type: "Detox", value: "In treatment...", date: "Now" },
        ...history,
      ]);
      startCooldown("Detox");

      toast.success(
        "💊 Treatment started! Addiction will be reduced in 3 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleSurgery = () => {
    if (money >= surgeryCost && wanted > 0 && cooldown === 0) {
      const newMoney = money - surgeryCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      setHistory([
        { type: "Surgery", value: "In treatment...", date: "Now" },
        ...history,
      ]);
      startCooldown("Surgery");

      toast.success(
        "🔪 Surgery started! Wanted level will be reduced in 2 minutes.",
        { duration: 3000 }
      );
    }
  };

  const handleEnergy = () => {
    if (money >= energyCost && energy < maxEnergy && cooldown === 0) {
      const newMoney = money - energyCost;

      // Update only money immediately
      setMoney(newMoney);
      updatePlayerStats({
        money: newMoney,
      });

      setHistory([
        {
          type: "Energy Serum",
          value: "In treatment...",
          date: "Now",
        },
        ...history,
      ]);
      startCooldown("Energy");

      toast.success(
        "⚡ Treatment started! Energy will be restored in 2 minutes.",
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

  // Tratamento de emergência para acelerar recuperação
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
          type: "Tratamento de Emergência",
          value: "-1 min recuperação",
          date: "Agora",
        },
        ...history,
      ]);

      toast.success(
        "🚑 Tratamento de emergência aplicado! Recuperação acelerada.",
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
          return "Você está internado por OVERDOSE!";
        case "disease":
          return "Você está internado por DOENÇA!";
        default:
          return "Você está internado!";
      }
    };

    const getHospitalizationDescription = () => {
      switch (hospitalizationReason) {
        case "overdose":
          return "Sua overdose foi grave. Você precisa de tratamento intensivo para se recuperar.";
        case "disease":
          return "Você contraiu uma doença. Precisa de tratamento médico especializado.";
        default:
          return "Sua saúde está muito baixa. Você precisa se tratar para poder sair.";
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

          {/* Tempo de recuperação */}
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer size={24} className="text-red-400" />
              <span className="text-red-400 font-bold text-lg">
                Tempo de Recuperação: {formatTime(recoveryTime)}
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

          {/* Tratamentos disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleTreatment("health")}
              disabled={money < healCost || health >= maxHealth || cooldown > 0}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                money >= healCost && health < maxHealth && cooldown === 0
                  ? "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
                  : "bg-gray-500/20 border border-gray-500/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <HeartPulse size={32} className="mb-2 text-green-400" />
              <span className="font-semibold">Heal Wounds</span>
              <span className="text-xs text-white/60">
                (${healCost} | {cooldownTime} min | -2 min recuperação)
              </span>
            </button>
            <button
              onClick={() => handleTreatment("detox")}
              disabled={money < detoxCost || addiction <= 0 || cooldown > 0}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                money >= detoxCost && addiction > 0 && cooldown === 0
                  ? "bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30"
                  : "bg-gray-500/20 border border-gray-500/30 opacity-50 cursor-not-allowed"
              }`}
            >
              <Pill size={32} className="mb-2 text-orange-400" />
              <span className="font-semibold">Detox Treatment</span>
              <span className="text-xs text-white/60">
                (${detoxCost} | {detoxTime} min | -3 min recuperação)
              </span>
            </button>
          </div>

          {/* Tratamento de emergência */}
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
                  Tratamento de Emergência
                </span>
              </div>
              <p className="text-sm text-white/60 mt-1">
                Acelera recuperação em 1 minuto (${2000})
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
      {/* Stats Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ambulance size={24} className="text-green-400" />
            <span className="text-xl font-bold text-green-400">
              Medical Center
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-green-400" />
            <span className="text-sm text-green-400">
              ${money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

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
              money >= healCost && health < maxHealth && cooldown === 0
                ? "border-green-500/30 bg-green-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < healCost || health >= maxHealth || cooldown > 0
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
                  Restaura saúde completa
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
              money >= detoxCost && addiction > 0 && cooldown === 0
                ? "border-orange-500/30 bg-orange-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < detoxCost || addiction <= 0 || cooldown > 0
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
                <p className="text-sm text-white/70 mb-3">Reduz vício em 20%</p>
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
              money >= surgeryCost && wanted > 0 && cooldown === 0
                ? "border-yellow-500/30 bg-yellow-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < surgeryCost || wanted <= 0 || cooldown > 0
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
                  Reduces wanted level by {surgeryReduce}
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
              money >= energyCost && energy < maxEnergy && cooldown === 0
                ? "border-blue-500/30 bg-blue-500/10"
                : "border-gray-600/30 bg-gray-800/20"
            } cursor-pointer hover:scale-[1.02] transition-transform ${
              money < energyCost || energy >= maxEnergy || cooldown > 0
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
                  Restores {energyRecover} energy points
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

      {/* Treatment History */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <History size={24} className="text-cyan-400" />
          Treatment History
        </h2>
        <div className="space-y-2">
          {history.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-800/20 border border-gray-600/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{item.type}</span>
                <span className="text-green-400 font-bold">{item.value}</span>
              </div>
              <span className="text-xs text-white/60">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseView>
  );
};

export default HospitalView;
