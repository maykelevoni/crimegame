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
}

const ProgressBar = ({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string | number;
}) => (
  <div className="w-28 flex flex-col items-center">
    <div className="relative w-full h-3 bg-cyber-dark-light rounded-full overflow-hidden flex items-center">
      <div
        className={`absolute left-0 top-0 h-3 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${value}%` }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow select-none"
        style={{ zIndex: 2 }}
      >
        {label}
      </span>
    </div>
  </div>
);

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
}) => (
  <div className="w-full bg-cyber-dark flex items-center px-4 py-2 gap-8 border-b border-cyber-blue/30 sticky top-0 z-50 shadow-lg">
    {/* Avatar and Player Name below */}
    <div className="flex flex-col items-center gap-1 mr-4">
      <div className="w-10 h-10 rounded-full border-2 border-cyber-blue flex items-center justify-center bg-cyber-dark-light">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#30E3DF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
      </div>
      <span className="text-sm font-medium text-cyber-blue/90 tracking-wide select-none mt-1">
        {playerName}
      </span>
    </div>
    {/* Status em duas linhas, centralizado e sem duplicidade */}
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="flex gap-8 justify-center items-end">
        {/* Health */}
        <div className="flex flex-col items-center min-w-[110px]">
          <span className="flex items-center gap-1 text-xs text-cyber-blue/70 mb-1">
            <HeartPulse size={14} className="text-cyber-blue" /> Health
          </span>
          <ProgressBar
            value={Math.round((health / maxHealth) * 100)}
            color="bg-cyber-blue"
            label={health}
          />
        </div>
        {/* Energy */}
        <div className="flex flex-col items-center min-w-[110px]">
          <span className="flex items-center gap-1 text-xs text-cyber-purple/70 mb-1">
            <Zap size={14} className="text-cyber-purple" /> Energy
          </span>
          <ProgressBar
            value={Math.round((energy / maxEnergy) * 100)}
            color="bg-cyber-purple"
            label={energy}
          />
        </div>
        {/* Reputation */}
        <div className="flex flex-col items-center min-w-[80px]">
          <span className="flex items-center gap-1 text-xs text-cyber-pink/70 mb-1">
            <Star size={14} className="text-cyber-pink" /> Reputation
          </span>
          <span className="font-bold text-cyber-pink text-sm">
            {reputation}
          </span>
        </div>
      </div>
      <div className="flex gap-8 justify-center items-end mt-1">
        {/* Addiction */}
        <div className="flex flex-col items-center min-w-[110px]">
          <span className="flex items-center gap-1 text-xs text-cyber-orange/70 mb-1">
            <Pill size={14} className="text-cyber-orange" /> Addiction
          </span>
          <ProgressBar
            value={addiction}
            color="bg-cyber-orange"
            label={addiction + "%"}
          />
        </div>
        {/* Wanted */}
        <div className="flex flex-col items-center min-w-[110px]">
          <span className="flex items-center gap-1 text-xs text-red-500/70 mb-1">
            <Siren size={14} className="text-red-500" /> Wanted
          </span>
          <ProgressBar
            value={wantedLevel}
            color="bg-red-500"
            label={wantedLevel}
          />
        </div>
        {/* Money */}
        <div className="flex flex-col items-center min-w-[80px]">
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
