import React, { useState } from "react";
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
} from "lucide-react";
import BaseView from "./BaseView";

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
  const [health, setHealth] = useState(playerStatus.health);
  const maxHealth = 100;
  const [addiction, setAddiction] = useState(playerStatus.addiction);
  const [wanted, setWanted] = useState(15);
  const [energy, setEnergy] = useState(50);
  const maxEnergy = 100;
  const [money, setMoney] = useState(2500);
  const [cooldown, setCooldown] = useState(0);
  const [activeTreatment, setActiveTreatment] = useState("");
  const [history, setHistory] = useState([
    { type: "Cura", value: "+35 HP", date: "Hoje, 08:00" },
    { type: "Detox", value: "-10% Addiction", date: "Ontem, 22:15" },
  ]);

  const healCost = 500;
  const detoxCost = 800;
  const surgeryCost = 1200;
  const energyCost = 400;
  const energyRecover = 40;
  const surgeryReduce = 5;
  const cooldownTime = 30;

  const startCooldown = (treatment: string) => {
    setActiveTreatment(treatment);
    setCooldown(cooldownTime);
  };

  const handleHeal = () => {
    if (money >= healCost && health < maxHealth && cooldown === 0) {
      setMoney(money - healCost);
      setHealth(maxHealth);
      setHistory([
        { type: "Cura", value: `+${maxHealth - health} HP`, date: "Agora" },
        ...history,
      ]);
      startCooldown("Cura");
    }
  };

  const handleDetox = () => {
    if (money >= detoxCost && addiction > 0 && cooldown === 0) {
      setMoney(money - detoxCost);
      setAddiction(Math.max(0, addiction - 20));
      setHistory([
        { type: "Detox", value: "-20% Addiction", date: "Agora" },
        ...history,
      ]);
      startCooldown("Detox");
    }
  };

  const handleSurgery = () => {
    if (money >= surgeryCost && wanted > 0 && cooldown === 0) {
      setMoney(money - surgeryCost);
      setWanted(Math.max(0, wanted - surgeryReduce));
      setHistory([
        { type: "Cirurgia", value: `-${surgeryReduce} Wanted`, date: "Agora" },
        ...history,
      ]);
      startCooldown("Cirurgia");
    }
  };

  const handleEnergy = () => {
    if (money >= energyCost && energy < maxEnergy && cooldown === 0) {
      setMoney(money - energyCost);
      setEnergy(Math.min(maxEnergy, energy + energyRecover));
      setHistory([
        {
          type: "Soro Energético",
          value: `+${energyRecover} Energia`,
          date: "Agora",
        },
        ...history,
      ]);
      startCooldown("Energia");
    }
  };

  const handleTreatment = (type: "health" | "detox") => {
    onStartTreatment(type);
  };

  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 60000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0 && activeTreatment) {
      setActiveTreatment("");
    }
  }, [cooldown, activeTreatment]);

  if (isPlayerHospitalized) {
    return (
      <BaseView title="Hospital">
        <div className="p-4 text-center">
          <Bed size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Você está internado!</h3>
          <p className="text-white/70 mb-6">
            Sua saúde está muito baixa. Você precisa se tratar para poder sair.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleTreatment("health")}
              className="flex flex-col items-center justify-center p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
            >
              <HeartPulse size={32} className="mb-2 text-green-400" />
              <span className="font-semibold">Curar Ferimentos</span>
              <span className="text-xs text-white/60">
                (${healCost} | {cooldownTime} min)
              </span>
            </button>
            <button
              onClick={() => handleTreatment("detox")}
              className="flex flex-col items-center justify-center p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors"
            >
              <Pill size={32} className="mb-2 text-orange-400" />
              <span className="font-semibold">Fazer Detox</span>
              <span className="text-xs text-white/60">
                (${detoxCost} | {cooldownTime} min)
              </span>
            </button>
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
                  <h3 className="font-bold text-white">Cirurgia Plástica</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Reduz wanted level em {surgeryReduce}
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
                  <h3 className="font-bold text-white">Soro Energético</h3>
                </div>
                <p className="text-sm text-white/70 mb-3">
                  Restaura {energyRecover} pontos de energia
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
