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
  Bed,
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
  const [cooldown, setCooldown] = useState(0); // minutos
  const [activeTreatment, setActiveTreatment] = useState("");
  const [history, setHistory] = useState([
    { type: "Cura", value: "+35 HP", date: "Hoje, 08:00" },
    { type: "Detox", value: "-10% Addiction", date: "Ontem, 22:15" },
  ]);
  const [feedback, setFeedback] = useState("");
  const treatmentCost = 500;
  const treatmentTime = 5; // minutos

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

  const handleTreatment = (type: "health" | "detox") => {
    onStartTreatment(type);
    setFeedback(
      `Iniciando tratamento de ${type === "health" ? "saúde" : "detox"}.`
    );
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

  if (isPlayerHospitalized) {
    return (
      <BaseView title="Hospital">
        <div className="cyber-border p-4 text-center">
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
                (${treatmentCost} | {treatmentTime} min)
              </span>
            </button>
            <button
              onClick={() => handleTreatment("detox")}
              className="flex flex-col items-center justify-center p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors"
            >
              <Pill size={32} className="mb-2 text-orange-400" />
              <span className="font-semibold">Fazer Detox</span>
              <span className="text-xs text-white/60">
                (${treatmentCost} | {treatmentTime} min)
              </span>
            </button>
          </div>
          {feedback && (
            <div className="mt-6 p-3 bg-cyber-dark-medium rounded-lg text-center font-semibold">
              {feedback}
            </div>
          )}
        </div>
      </BaseView>
    );
  }

  // Tela de visita voluntária com design completo
  return (
    <BaseView title="Hospital">
      <div className="cyber-border p-4">
        <div className="flex items-center gap-3 mb-6">
          <Ambulance size={32} className="text-green-400" />
          <h2 className="text-2xl font-bold">Centro Médico</h2>
        </div>

        {/* Status do Jogador */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse size={20} className="text-red-400" />
              <span className="font-semibold">Saúde</span>
            </div>
            <div className="w-full bg-cyber-dark-medium rounded-full h-3 mb-2">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(health / maxHealth) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>
                {health}/{maxHealth}
              </span>
              <span className="text-white/60">${healCost}</span>
            </div>
          </div>

          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill size={20} className="text-orange-400" />
              <span className="font-semibold">Vício</span>
            </div>
            <div className="w-full bg-cyber-dark-medium rounded-full h-3 mb-2">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${addiction}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>{addiction}%</span>
              <span className="text-white/60">${detoxCost}</span>
            </div>
          </div>

          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Siren size={20} className="text-yellow-400" />
              <span className="font-semibold">Wanted Level</span>
            </div>
            <div className="w-full bg-cyber-dark-medium rounded-full h-3 mb-2">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(wanted / 100) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>{wanted}/100</span>
              <span className="text-white/60">${surgeryCost}</span>
            </div>
          </div>

          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={20} className="text-blue-400" />
              <span className="font-semibold">Energia</span>
            </div>
            <div className="w-full bg-cyber-dark-medium rounded-full h-3 mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>
                {energy}/{maxEnergy}
              </span>
              <span className="text-white/60">${energyCost}</span>
            </div>
          </div>
        </div>

        {/* Dinheiro e Cooldown */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BriefcaseMedical size={20} className="text-green-400" />
            <span className="font-semibold">Dinheiro: ${money}</span>
          </div>
          {cooldown > 0 && (
            <div className="flex items-center gap-2 text-orange-400">
              <Clock size={20} />
              <span>Cooldown: {cooldown}min</span>
            </div>
          )}
        </div>

        {/* Tratamentos Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={handleHeal}
            disabled={money < healCost || health >= maxHealth || cooldown > 0}
            className="cyber-border p-4 text-center hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HeartPulse size={32} className="mx-auto mb-2 text-green-400" />
            <h3 className="font-semibold mb-1">Curar Ferimentos</h3>
            <p className="text-sm text-white/60 mb-2">
              Restaura saúde completa
            </p>
            <div className="text-xs">
              <div>Custo: ${healCost}</div>
              <div>Tempo: {cooldownTime}min</div>
            </div>
          </button>

          <button
            onClick={handleDetox}
            disabled={money < detoxCost || addiction <= 0 || cooldown > 0}
            className="cyber-border p-4 text-center hover:bg-orange-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pill size={32} className="mx-auto mb-2 text-orange-400" />
            <h3 className="font-semibold mb-1">Fazer Detox</h3>
            <p className="text-sm text-white/60 mb-2">Reduz vício em 20%</p>
            <div className="text-xs">
              <div>Custo: ${detoxCost}</div>
              <div>Tempo: {cooldownTime}min</div>
            </div>
          </button>

          <button
            onClick={handleSurgery}
            disabled={money < surgeryCost || wanted <= 0 || cooldown > 0}
            className="cyber-border p-4 text-center hover:bg-yellow-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Scissors size={32} className="mx-auto mb-2 text-yellow-400" />
            <h3 className="font-semibold mb-1">Cirurgia Plástica</h3>
            <p className="text-sm text-white/60 mb-2">Reduz wanted level</p>
            <div className="text-xs">
              <div>Custo: ${surgeryCost}</div>
              <div>Tempo: {cooldownTime}min</div>
            </div>
          </button>

          <button
            onClick={handleEnergy}
            disabled={money < energyCost || energy >= maxEnergy || cooldown > 0}
            className="cyber-border p-4 text-center hover:bg-blue-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CupSoda size={32} className="mx-auto mb-2 text-blue-400" />
            <h3 className="font-semibold mb-1">Soro Energético</h3>
            <p className="text-sm text-white/60 mb-2">Restaura energia</p>
            <div className="text-xs">
              <div>Custo: ${energyCost}</div>
              <div>Tempo: {cooldownTime}min</div>
            </div>
          </button>
        </div>

        {/* Histórico de Tratamentos */}
        <div className="cyber-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-cyan-400" />
            <h3 className="font-semibold">Histórico de Tratamentos</h3>
          </div>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-cyber-dark-medium rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-green-400">{item.value}</span>
                </div>
                <span className="text-xs text-white/60">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {feedback && (
          <div className="mt-4 p-3 bg-cyber-dark-medium rounded-lg text-center font-semibold text-green-400">
            {feedback}
          </div>
        )}
      </div>
    </BaseView>
  );
};

export default HospitalView;
