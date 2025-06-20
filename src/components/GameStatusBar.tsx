import React from "react";
import {
  HeartPulse,
  Zap,
  Star,
  Pill,
  Skull,
  DollarSign,
  Wallet,
  Siren,
} from "lucide-react";

interface GameStatusBarProps {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  reputation: number;
  addiction: number;
  wantedLevel: number;
  money: number;
  playerName?: string;
  avatarUrl?: string;
}

const GameStatusBar: React.FC<GameStatusBarProps> = ({
  health,
  maxHealth,
  energy,
  maxEnergy,
  reputation,
  addiction,
  wantedLevel,
  money,
  playerName = "Urban Player",
  avatarUrl = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
}) => (
  <div className="w-full bg-cyber-dark flex items-center px-4 py-2 gap-4 border-b border-cyber-blue/30 sticky top-0 z-50 shadow-lg">
    {/* Avatar and Player Name below */}
    <div className="flex flex-col items-center gap-1 mr-2">
      <div className="w-10 h-10 rounded-full border-2 border-cyber-blue flex items-center justify-center bg-cyber-dark-light overflow-hidden">
        <img
          src={avatarUrl}
          alt={playerName}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <span className="text-sm font-medium text-cyber-blue/90 tracking-wide select-none mt-1 text-center">
        {playerName}
      </span>
    </div>
    {/* Status em 3 colunas e 2 linhas */}
    <div className="flex flex-col flex-1 items-center justify-center">
      {/* Primeira linha: Health, Energy, Reputation */}
      <div className="flex gap-4 justify-center items-end">
        {/* Health */}
        <div className="flex flex-col items-center min-w-[90px]">
          <span className="flex items-center gap-1 text-xs text-cyber-blue/70 mb-1">
            <HeartPulse size={14} className="text-cyber-blue" /> Health
          </span>
          <span className="font-bold text-cyber-blue text-sm">
            {health}/{maxHealth}
          </span>
        </div>
        {/* Energy */}
        <div className="flex flex-col items-center min-w-[90px]">
          <span className="flex items-center gap-1 text-xs text-cyber-purple/70 mb-1">
            <Zap size={14} className="text-cyber-purple" /> Energy
          </span>
          <span className="font-bold text-cyber-purple text-sm">
            {energy}/{maxEnergy}
          </span>
        </div>
        {/* Reputation */}
        <div className="flex flex-col items-center min-w-[90px]">
          <span className="flex items-center gap-1 text-xs text-cyber-pink/70 mb-1">
            <Star size={14} className="text-cyber-pink" /> Reputation
          </span>
          <span className="font-bold text-cyber-pink text-sm">
            {reputation}
          </span>
        </div>
      </div>
      {/* Segunda linha: Addiction, Wanted, Money */}
      <div className="flex gap-4 justify-center items-end mt-1">
        {/* Addiction */}
        <div className="flex flex-col items-center min-w-[90px]">
          <span className="flex items-center gap-1 text-xs text-cyber-orange/70 mb-1">
            <Pill size={14} className="text-cyber-orange" /> Addiction
          </span>
          <span className="font-bold text-cyber-orange text-sm">
            {addiction}%
          </span>
        </div>
        {/* Wanted */}
        <div className="flex flex-col items-center min-w-[90px]">
          <span className="flex items-center gap-1 text-xs text-red-500/70 mb-1">
            <Siren size={14} className="text-red-500" /> Wanted
          </span>
          <span className="font-bold text-red-500 text-sm">{wantedLevel}</span>
        </div>
        {/* Money */}
        <div className="flex flex-col items-center min-w-[90px]">
          <span className="flex items-center gap-1 text-xs text-cyber-green/70 mb-1">
            <Wallet size={14} className="text-cyber-green" /> Money
          </span>
          <span className="font-bold text-cyber-green text-sm">
            ${money.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default GameStatusBar;
