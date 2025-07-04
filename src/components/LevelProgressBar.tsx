import React from "react";
import { Star, TrendingUp } from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { getLevelInfo, getReputationToNextLevel } from "../utils/levelSystem";

export const LevelProgressBar: React.FC = () => {
  const { player } = useGameStore();
  
  if (!player) return null;

  const currentLevel = player.stats.level;
  const totalReputation = player.stats.reputation;
  
  const levelInfo = getLevelInfo(currentLevel);
  const progressInfo = getReputationToNextLevel(totalReputation);
  
  if (!levelInfo) return null;

  const isMaxLevel = currentLevel >= 10; // Maximum level

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star size={20} className="text-purple-400" />
          <div>
            <h3 className="text-lg font-bold text-purple-400">
              Level {currentLevel}
            </h3>
            <p className="text-sm text-purple-300">{levelInfo.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">Reputation</p>
          <p className="text-lg font-bold text-white">
            {totalReputation.toLocaleString()}
          </p>
        </div>
      </div>

      {!isMaxLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">
              Progress to Level {progressInfo.nextLevel}
            </span>
            <span className="text-purple-400 font-bold">
              {progressInfo.reputationNeeded} rep needed
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressInfo.progressPercent}%` }}
            >
              <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-purple-300">
              {progressInfo.progressPercent.toFixed(1)}% complete
            </span>
          </div>
        </div>
      )}

      {isMaxLevel && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">MAX LEVEL REACHED!</span>
          </div>
        </div>
      )}
    </div>
  );
};