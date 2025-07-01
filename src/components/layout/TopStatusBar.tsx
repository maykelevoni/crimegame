import React from "react";
import {
  Heart,
  Zap,
  Pill,
  Star,
  DollarSign,
  AlertTriangle,
  User,
} from "lucide-react";

interface TopStatusBarProps {
  playerName: string;
  avatarUrl?: string;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  addiction: number;
  reputation: number;
  money: number;
  wantedLevel: number;
}

const TopStatusBar: React.FC<TopStatusBarProps> = ({
  playerName,
  avatarUrl,
  health,
  maxHealth,
  energy,
  maxEnergy,
  addiction,
  reputation,
  money,
  wantedLevel,
}) => {
  const status = [
    {
      icon: <Heart size={18} color="#FF4D4F" />,
      label: "Health",
      value: `${health}/${maxHealth}`,
    },
    {
      icon: <Zap size={18} color="#FFD600" />,
      label: "Energy",
      value: `${energy}/${maxEnergy}`,
    },
    {
      icon: <Pill size={18} color="#00fff7" />,
      label: "Addiction",
      value: `${addiction}%`,
    },
    {
      icon: <Star size={18} color="#9945ff" />,
      label: "Reputation",
      value: `${reputation}`,
    },
    {
      icon: <DollarSign size={18} color="#30E3DF" />,
      label: "Money",
      value: `$${money.toLocaleString()}`,
    },
    {
      icon: <AlertTriangle size={18} color="#FF8800" />,
      label: "Wanted",
      value: `${wantedLevel}`,
    },
  ];

  return (
    <header className="w-full bg-cyber-dark border-b-2 border-cyber-blue/40 shadow-cyber-glow z-30 relative">
      {/* Game Name Section */}
      <div className="w-full py-3 border-b border-cyber-blue/20">
        <h1 className="text-cyber-blue text-2xl font-extrabold tracking-widest font-nunito glow-text text-center">
          URBAN HUSTLE
        </h1>
      </div>

      {/* Player Info and Status Section */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Player Info - Left Side */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-cyber-blue bg-cyber-dark-lighter flex items-center justify-center shadow-cyber-glow overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={playerName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={28} color="#30E3DF" />
              )}
            </div>
            <span className="text-cyber-blue font-bold text-lg truncate max-w-[120px]">
              {playerName}
            </span>
          </div>

          {/* Status - Right Side */}
          <div className="flex flex-col gap-2">
            {/* First Row of Status */}
            <div className="flex gap-2">
              {status.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-3 py-1.5 rounded cyber-border bg-cyber-dark-lighter/80 min-w-[80px]"
                >
                  {s.icon}
                  <div className="flex flex-col">
                    <span className="text-xs text-cyber-blue font-bold">
                      {s.label}
                    </span>
                    <span className="text-sm text-white font-mono">
                      {s.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row of Status */}
            <div className="flex gap-2">
              {status.slice(3).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-3 py-1.5 rounded cyber-border bg-cyber-dark-lighter/80 min-w-[80px]"
                >
                  {s.icon}
                  <div className="flex flex-col">
                    <span className="text-xs text-cyber-blue font-bold">
                      {s.label}
                    </span>
                    <span className="text-sm text-white font-mono">
                      {s.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopStatusBar;
