import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Wallet,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle,
  Crosshair,
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
}

const robberies: Robbery[] = [
  {
    id: "beach",
    name: "Beach House",
    description: "Uma casa de praia pequena, alvo fácil para iniciantes.",
    image: "https://placehold.co/96x96?text=Beach",
    risk: 10,
    rewardMin: 1100,
    rewardMax: 1200,
    exp: 18,
    energy: 20,
  },
  {
    id: "desert",
    name: "Desert Villa",
    description: "Uma mansão isolada no deserto, segurança moderada.",
    image: "https://placehold.co/96x96?text=Desert",
    risk: 45,
    rewardMin: 1900,
    rewardMax: 2100,
    exp: 25,
    energy: 30,
  },
  {
    id: "city",
    name: "City Penthouse",
    description: "Cobertura luxuosa na cidade, alto risco e alta recompensa.",
    image: "https://placehold.co/96x96?text=City",
    risk: 65,
    rewardMin: 3400,
    rewardMax: 3600,
    exp: 40,
    energy: 50,
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

  return (
    <BaseView title="Robbery & Heists">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-2">Solo Heists</h2>
        <div className="space-y-6">
          {robberies.map((robbery) => (
            <div
              key={robbery.id}
              className="bg-cyber-dark-medium rounded-xl overflow-hidden shadow border border-cyber-blue/20 p-4 flex items-center gap-4"
            >
              <img
                src={robbery.image}
                alt={robbery.name}
                className="w-24 h-24 object-cover object-center rounded-lg border border-cyber-blue/30 bg-cyber-dark"
              />
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-cyber-blue">
                      {robbery.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {robbery.description}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Wallet size={16} />
                      <span className="font-semibold">
                        Aprox. ${robbery.rewardMin.toLocaleString()} ~ $
                        {robbery.rewardMax.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <Star size={16} />
                      <span className="font-semibold">+{robbery.exp}</span>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Zap size={16} />
                      <span className="font-semibold">-{robbery.energy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-xs text-red-500 font-bold">
                      Risk: {robbery.risk}%
                    </span>
                  </div>
                  <button
                    className="font-bold px-8 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white uppercase hover:opacity-90 transition-all flex items-center gap-2 shadow"
                    onClick={() => handleStart(robbery)}
                    disabled={isExecuting}
                  >
                    <Crosshair size={18} className="text-white" />
                    START JOB
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de sucesso */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-cyber-dark border-2 border-cyber-blue rounded-xl p-8 min-w-[320px] max-w-[90vw] text-center relative">
            <CheckCircle size={48} className="mx-auto text-green-400 mb-2" />
            <h2 className="text-2xl font-bold text-green-400 mb-1">SUCCESS!</h2>
            <p className="text-cyber-blue font-semibold mb-2">
              Robbery Successful
            </p>
            <p className="text-gray-300 mb-2 text-sm">
              You barely escaped! The loot is yours.
              <br />
              You escaped with the loot!
            </p>
            <div className="flex justify-center gap-6 my-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <Wallet size={20} />
                <span className="font-bold">
                  Aprox. ${modal.rewardMin.toLocaleString()} ~ $
                  {modal.rewardMax.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <Star size={20} />
                <span className="font-bold">+{modal.exp}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Zap size={20} />
                <span className="font-bold">-{modal.energy}</span>
              </div>
            </div>
            <button
              className="bg-cyber-blue hover:bg-cyber-blue/80 text-white font-bold px-8 py-2 rounded mt-2 shadow"
              onClick={() => setModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default RobberyView;
