import React from "react";
import {
  Heart,
  Zap,
  Pill,
  Star,
  DollarSign,
  Shield,
  Wallet,
  Siren,
} from "lucide-react";

interface StatusBarProps {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  addiction: number;
  reputation: number;
  money: number;
  wantedLevel: number;
}

export function StatusBar({
  health,
  maxHealth,
  energy,
  maxEnergy,
  addiction,
  reputation,
  money,
  wantedLevel,
}: StatusBarProps) {
  const stats = [
    {
      icon: Heart,
      value: `${health}/${maxHealth}`,
      color: "text-red-400",
      glow: "shadow-red-500/50",
      label: "Health",
    },
    {
      icon: Zap,
      value: `${energy}/${maxEnergy}`,
      color: "text-yellow-400",
      glow: "shadow-yellow-500/50",
      label: "Energy",
    },
    {
      icon: Pill,
      value: `${addiction}%`,
      color: "text-purple-400",
      glow: "shadow-purple-500/50",
      label: "Addiction",
    },
    {
      icon: Star,
      value: reputation.toString(),
      color: "text-blue-400",
      glow: "shadow-blue-500/50",
      label: "Reputation",
    },
    {
      icon: Wallet,
      value: `$${money.toLocaleString()}`,
      color: "text-green-400",
      glow: "shadow-green-500/50",
      label: "Money",
    },
    {
      icon: Shield,
      value: wantedLevel.toString(),
      color: "text-orange-400",
      glow: "shadow-orange-500/50",
      label: "Wanted",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-cyber-dark/95 backdrop-blur-sm border-b border-cyber-blue/20 z-50">
      <div className="container mx-auto px-2 py-1">
        {/* Main Stats */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-0.5 min-w-fit"
              >
                <div className="flex items-center gap-1">
                  <Icon
                    size={14}
                    className={`${stat.color} ${stat.glow} drop-shadow-glow`}
                  />
                  <span className="text-[10px] font-medium text-white">
                    {stat.value}
                  </span>
                </div>
                <span className="text-[8px] text-white/60">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
