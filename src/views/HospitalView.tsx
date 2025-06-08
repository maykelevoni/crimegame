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
  PillBottle,
  CupSoda,
} from "lucide-react";

const HospitalView = () => {
  // Mock de dados do player
  const [health, setHealth] = useState(65);
  const maxHealth = 100;
  const [addiction, setAddiction] = useState(40);
  const [wanted, setWanted] = useState(15);
  const [energy, setEnergy] = useState(50);
  const maxEnergy = 100;
  const [money, setMoney] = useState(2500);
  const [cooldown, setCooldown] = useState(0); // minutos
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
  const surgeryReduce = 5; // quanto reduz o wanted
  const cooldownTime = 30; // minutos

  const startCooldown = (treatment) => {
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
        { type: "Cirurgia", value: `- ${surgeryReduce} Wanted`, date: "Agora" },
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

  // Simula o cooldown diminuindo a cada minuto (mock)
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 60000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0 && activeTreatment) {
      setActiveTreatment("");
    }
  }, [cooldown, activeTreatment]);

  return (
    <div className="max-w-2xl mx-auto py-4 px-2">
      {/* Topo compacto em inglês */}
      <div className="flex items-center gap-2 mb-4">
        <Ambulance size={28} className="text-cyber-green" />
        <h1 className="text-xl font-bold text-cyber-green">Hospital</h1>
        <span className="text-cyber-green/70 text-xs ml-2">
          Restore your health, energy and clear your record
        </span>
      </div>

      {/* Card de status de tratamento mais compacto em inglês */}
      <div className="w-full mb-6 bg-cyber-dark-light rounded-xl border-2 border-cyber-blue/40 p-4 flex flex-col items-center justify-center shadow col-span-2 min-h-[80px]">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={22} className="text-cyber-blue animate-spin-slow" />
          <span className="text-lg font-bold text-cyber-blue">
            Ongoing Treatment
          </span>
        </div>
        <div className="text-cyber-blue/80 text-sm mb-1">
          {cooldown > 0
            ? activeTreatment || "Recovery"
            : "No treatment in progress"}
        </div>
        <div className="flex items-center gap-1 text-cyber-blue/70 text-xs">
          <Clock size={14} />
          {cooldown > 0 ? (
            <span>
              Time left: <span className="font-bold">{cooldown} min</span>
            </span>
          ) : (
            <span>Ready for new treatment</span>
          )}
        </div>
      </div>

      {/* Grid de tratamentos 2x2 - layout anterior, só fontes menores */}
      <div className="grid grid-cols-2 gap-6">
        {/* Card Medkit */}
        <div className="bg-cyber-dark-light rounded-xl border border-cyber-green/30 p-8 min-h-[220px] shadow flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-3">
            <BriefcaseMedical size={28} className="text-cyber-green" />
            <span className="text-base font-bold text-cyber-green">Medkit</span>
          </div>
          <div className="w-full bg-cyber-dark-medium rounded-full h-5 mb-3 overflow-hidden">
            <div
              className="bg-cyber-green h-5 rounded-full transition-all"
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
          </div>
          <div className="mb-3 text-white text-xs">
            {health} / {maxHealth} HP
          </div>
          <button
            className="bg-cyber-green hover:bg-cyber-green/80 text-cyber-dark font-bold px-8 py-3 rounded shadow mb-2 transition-all text-xs disabled:opacity-50"
            onClick={handleHeal}
            disabled={health === maxHealth || money < healCost || cooldown > 0}
          >
            Use Medkit ({healCost.toLocaleString()}$)
          </button>
          <div className="text-xs text-cyber-green/70">
            Instantly restore your health.
          </div>
        </div>

        {/* Card Detox */}
        <div className="bg-cyber-dark-light rounded-xl border border-cyber-orange/30 p-8 min-h-[220px] shadow flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-3">
            <PillBottle size={28} className="text-cyber-orange" />
            <span className="text-base font-bold text-cyber-orange">Detox</span>
          </div>
          <div className="w-full bg-cyber-dark-medium rounded-full h-5 mb-3 overflow-hidden">
            <div
              className="bg-cyber-orange h-5 rounded-full transition-all"
              style={{ width: `${addiction}%` }}
            />
          </div>
          <div className="mb-3 text-white text-xs">{addiction}% Addiction</div>
          <button
            className="bg-cyber-orange hover:bg-cyber-orange/80 text-cyber-dark font-bold px-8 py-3 rounded shadow mb-2 transition-all text-xs disabled:opacity-50"
            onClick={handleDetox}
            disabled={addiction === 0 || money < detoxCost || cooldown > 0}
          >
            Detox ({detoxCost.toLocaleString()}$)
          </button>
          <div className="text-xs text-cyber-orange/70">
            Reduce your addiction level.
          </div>
        </div>

        {/* Card Surgery (reduce Wanted) */}
        <div className="bg-cyber-dark-light rounded-xl border border-red-500/30 p-8 min-h-[220px] shadow flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-3">
            <Scissors size={28} className="text-red-500" />
            <span className="text-base font-bold text-red-500">Surgery</span>
          </div>
          <div className="w-full bg-cyber-dark-medium rounded-full h-5 mb-3 overflow-hidden">
            <div
              className="bg-red-500 h-5 rounded-full transition-all"
              style={{ width: `${wanted}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Siren size={20} className="text-red-500" />
            <span className="text-xs text-white">
              Wanted: <span className="font-bold text-red-500">{wanted}</span>
            </span>
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-cyber-dark font-bold px-8 py-3 rounded shadow mb-2 transition-all text-xs disabled:opacity-50"
            onClick={handleSurgery}
            disabled={wanted === 0 || money < surgeryCost || cooldown > 0}
          >
            Surgery ({surgeryCost.toLocaleString()}$)
          </button>
          <div className="text-xs text-red-500/70">
            Reduce your wanted level.
          </div>
        </div>

        {/* Card Energy Drink */}
        <div className="bg-cyber-dark-light rounded-xl border border-cyber-blue/30 p-8 min-h-[220px] shadow flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-3">
            <CupSoda size={28} className="text-cyber-blue" />
            <span className="text-base font-bold text-cyber-blue">
              Energy Drink
            </span>
          </div>
          <div className="w-full bg-cyber-dark-medium rounded-full h-5 mb-3 overflow-hidden">
            <div
              className="bg-cyber-blue h-5 rounded-full transition-all"
              style={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
          </div>
          <div className="mb-3 text-white text-xs">
            {energy} / {maxEnergy} Energy
          </div>
          <button
            className="bg-cyber-blue hover:bg-cyber-blue/80 text-cyber-dark font-bold px-8 py-3 rounded shadow mb-2 transition-all text-xs disabled:opacity-50"
            onClick={handleEnergy}
            disabled={
              energy === maxEnergy || money < energyCost || cooldown > 0
            }
          >
            Use Energy Drink ({energyCost.toLocaleString()}$)
          </button>
          <div className="text-xs text-cyber-blue/70">
            Quickly restore your energy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalView;
