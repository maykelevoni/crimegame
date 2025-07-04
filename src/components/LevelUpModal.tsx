import React, { useEffect, useState } from "react";
import { Star, Gift, X, TrendingUp } from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { getLevelInfo } from "../utils/levelSystem";
import { toast } from "sonner";

export const LevelUpModal: React.FC = () => {
  const { player } = useGameStore();
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    oldLevel: number;
  } | null>(null);
  
  const [showModal, setShowModal] = useState(false);

  // Track level changes
  useEffect(() => {
    const currentLevel = player?.stats?.level || 1;
    const storedLevel = parseInt(localStorage.getItem("lastKnownLevel") || "1");
    
    if (currentLevel > storedLevel) {
      setLevelUpData({
        newLevel: currentLevel,
        oldLevel: storedLevel
      });
      setShowModal(true);
      localStorage.setItem("lastKnownLevel", currentLevel.toString());
    }
  }, [player?.stats?.level]);

  const handleClose = () => {
    setShowModal(false);
    setLevelUpData(null);
  };

  if (!showModal || !levelUpData || !player) return null;

  const levelInfo = getLevelInfo(levelUpData.newLevel);
  if (!levelInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border-2 border-purple-400 shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Celebration Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 animate-pulse"></div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Level Up Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-yellow-400 rounded-full p-4 animate-bounce">
                <Star size={40} className="text-purple-900" />
              </div>
              <div className="absolute -top-2 -right-2 bg-purple-400 rounded-full p-2">
                <TrendingUp size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Level Up Text */}
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            LEVEL UP!
          </h2>
          
          <div className="text-white mb-4">
            <p className="text-lg">
              Level {levelUpData.oldLevel} → <span className="text-yellow-400 font-bold">Level {levelUpData.newLevel}</span>
            </p>
            <p className="text-purple-300 text-lg font-bold">
              {levelInfo.title}
            </p>
          </div>

          {/* Rewards */}
          {levelInfo.rewards.length > 0 && (
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Gift size={20} className="text-yellow-400" />
                <h3 className="text-lg font-bold text-yellow-400">Rewards</h3>
              </div>
              
              <div className="space-y-2">
                {levelInfo.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{reward.description}</span>
                    <span className="text-green-400 font-bold">
                      {reward.type === "money" && `+$${reward.amount?.toLocaleString()}`}
                      {reward.type === "health" && `+${reward.amount} HP`}
                      {reward.type === "energy" && `+${reward.amount} Energy`}
                      {reward.type === "unlock" && "Unlocked!"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlocks */}
          {levelInfo.unlocks.length > 0 && (
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-cyan-400 mb-2">New Features Unlocked</h3>
              <div className="flex flex-wrap gap-2">
                {levelInfo.unlocks.map((unlock, index) => (
                  <span 
                    key={index}
                    className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm border border-cyan-400/30"
                  >
                    {unlock}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
};