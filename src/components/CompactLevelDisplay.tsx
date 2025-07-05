import React from "react";
import { Star } from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { getLevelInfo, getReputationToNextLevel } from "../utils/levelSystem";
import { toast } from "sonner";

export const CompactLevelDisplay: React.FC = () => {
  const { player } = useGameStore();
  
  if (!player) return null;

  const currentLevel = player.stats.level;
  const totalReputation = player.stats.reputation;
  
  const levelInfo = getLevelInfo(currentLevel);
  const progressInfo = getReputationToNextLevel(totalReputation);
  
  if (!levelInfo) return null;

  const handleLevelClick = () => {
    // Debug level calculations
    
    toast.info(
      `Level ${currentLevel}: ${levelInfo.title}\nReputation: ${totalReputation.toLocaleString()}\nNext Level: ${progressInfo.reputationNeeded} rep needed`,
      { duration: 3000 }
    );
  };

  return (
    <div 
      onClick={handleLevelClick}
      className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-purple-500/30 transition-colors"
    >
      <Star size={16} className="text-purple-400" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-purple-400">Lv.{currentLevel}</span>
          <span className="text-xs text-purple-300">{levelInfo.title}</span>
        </div>
        <div className="w-20 bg-gray-700 rounded-full h-1">
          <div
            className="bg-purple-400 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressInfo.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};