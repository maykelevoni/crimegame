import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Wallet,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle,
  Crosshair,
  Skull,
  TrendingUp,
} from "lucide-react";

interface Robbery {
  id: string;
  name: string;
  description: string;
  image: string;
  risk: number;
  rewardMin: number;
  rewardMax: number;
  exp: number;
  energy: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  difficultyColor: string;
}

const robberies: Robbery[] = [
  {
    id: "beach",
    name: "Beach House",
    description: "Uma casa de praia pequena, alvo fácil para iniciantes.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop",
    risk: 10,
    rewardMin: 1100,
    rewardMax: 1200,
    exp: 18,
    energy: 20,
    difficulty: "Easy",
    difficultyColor: "bg-green-500",
  },
  {
    id: "desert",
    name: "Desert Villa",
    description: "Uma mansão isolada no deserto, segurança moderada.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150&h=150&fit=crop",
    risk: 45,
    rewardMin: 1900,
    rewardMax: 2100,
    exp: 25,
    energy: 30,
    difficulty: "Medium",
    difficultyColor: "bg-yellow-500",
  },
  {
    id: "city",
    name: "City Penthouse",
    description: "Cobertura luxuosa na cidade, alto risco e alta recompensa.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&h=150&fit=crop",
    risk: 65,
    rewardMin: 3400,
    rewardMax: 3600,
    exp: 40,
    energy: 50,
    difficulty: "Hard",
    difficultyColor: "bg-red-500",
  },
  {
    id: "jewelry",
    name: "Jewelry Store",
    description: "Loja de joias no centro da cidade, muito bem protegida.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
    risk: 75,
    rewardMin: 5000,
    rewardMax: 8000,
    exp: 60,
    energy: 70,
    difficulty: "Hard",
    difficultyColor: "bg-red-500",
  },
  {
    id: "bank",
    name: "Local Bank",
    description: "Banco local com sistema de segurança avançado.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    risk: 85,
    rewardMin: 10000,
    rewardMax: 20000,
    exp: 100,
    energy: 100,
    difficulty: "Extreme",
    difficultyColor: "bg-purple-500",
  },
  {
    id: "casino",
    name: "Casino Vault",
    description: "Cofre do cassino, o maior desafio para ladrões experientes.",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
    risk: 95,
    rewardMin: 25000,
    rewardMax: 50000,
    exp: 200,
    energy: 150,
    difficulty: "Extreme",
    difficultyColor: "bg-purple-500",
  },
];

const RobberyView = () => {
  const [modal, setModal] = useState<null | Robbery>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleStart = (robbery: Robbery) => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setModal(robbery);
    }, 1200);
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 25) return "text-green-400";
    if (risk <= 50) return "text-yellow-400";
    if (risk <= 75) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <BaseView title="Robbery & Heists">
      {/* Stats Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair size={24} className="text-red-400" />
            <span className="text-xl font-bold text-red-400">
              Available Heists
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-red-400" />
            <span className="text-sm text-red-400">
              {robberies.length} targets available
            </span>
          </div>
        </div>
      </div>

      {/* Available Heists */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Skull size={24} className="text-red-400" />
          Available Heists
        </h2>
        <div className="grid gap-4">
          {robberies.map((robbery) => (
            <div
              key={robbery.id}
              className={`p-4 rounded-xl border ${robbery.difficultyColor.replace(
                "bg-",
                "border-"
              )}/30 ${robbery.difficultyColor.replace(
                "bg-",
                "bg-"
              )}/10 cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleStart(robbery)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={robbery.image}
                  alt={robbery.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold text-white ${robbery.difficultyColor}`}
                    >
                      {robbery.difficulty}
                    </span>
                    <h3 className="font-bold text-white truncate">
                      {robbery.name}
                    </h3>
                    <span
                      className={`text-xs font-bold ${getRiskColor(
                        robbery.risk
                      )} flex-shrink-0`}
                    >
                      ⚠️ {robbery.risk}%
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {robbery.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Wallet size={14} className="text-green-400" />
                      <span className="text-white/60">Reward:</span>
                      <span className="text-green-400 font-bold">
                        ${robbery.rewardMin.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-purple-400" />
                      <span className="text-white/60">XP:</span>
                      <span className="text-purple-400 font-bold">
                        +{robbery.exp}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={14} className="text-yellow-400" />
                      <span className="text-white/60">Energy:</span>
                      <span className="text-yellow-400 font-bold">
                        -{robbery.energy}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={14} className="text-red-400" />
                      <span className="text-white/60">Risk:</span>
                      <span className="text-red-400 font-bold">
                        {robbery.risk}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de sucesso */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                SUCCESS!
              </h2>
              <p className="text-cyber-blue font-semibold mb-2">
                {modal.name} Robbery Successful
              </p>
              <p className="text-gray-300 mb-4 text-sm">
                You barely escaped! The loot is yours.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-2 bg-green-500/10 border border-green-500/30 rounded">
                  <span className="text-white/60">Loot:</span>
                  <span className="text-green-400 font-bold">
                    ${modal.rewardMin.toLocaleString()} - $
                    {modal.rewardMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-500/10 border border-purple-500/30 rounded">
                  <span className="text-white/60">Experience:</span>
                  <span className="text-purple-400 font-bold">
                    +{modal.exp} XP
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <span className="text-white/60">Energy Used:</span>
                  <span className="text-yellow-400 font-bold">
                    -{modal.energy}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-cyber-blue hover:bg-cyber-blue/80 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default RobberyView;
