import React from "react";
import { Heart, Zap, Star, DollarSign } from "lucide-react";

interface Player {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  level: number;
  experience: number;
  money: number;
}

interface StatsBarProps {
  player: Player;
}

export function StatsBar({ player }: StatsBarProps) {
  return (
    <div className="bg-gray-900 pt-10 pb-2 border-b border-gray-800">
      <div className="px-4 flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
            alt="Avatar"
            className="w-10 h-10 rounded-full mr-2"
          />
          <h1 className="text-xl font-bold text-cyan-400">URBAN HUSTLE</h1>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between mb-2">
          <div className="flex items-center min-w-[80px]">
            <Heart size={18} className="text-purple-500" />
            <span className="text-white font-bold ml-2">
              {player.health}/{player.maxHealth}
            </span>
          </div>

          <div className="flex items-center min-w-[80px]">
            <Zap size={18} className="text-cyan-400" />
            <span className="text-white font-bold ml-2">
              {player.energy}/{player.maxEnergy}
            </span>
          </div>

          <div className="flex items-center min-w-[80px]">
            <Star size={18} className="text-orange-400" />
            <span className="text-white font-bold ml-2">
              Lvl {player.level}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center min-w-[80px]">
            <Star size={18} className="text-orange-400" />
            <span className="text-white font-bold ml-2">
              {player.experience} XP
            </span>
          </div>

          <div className="flex items-center min-w-[80px]">
            <DollarSign size={18} className="text-cyan-400" />
            <span className="text-white font-bold ml-2">
              ${player.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
