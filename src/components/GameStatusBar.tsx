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
import ProgressBar from "./ProgressBar";
import { useResponsive } from "../hooks/useResponsive";

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
}) => {
  const { isMobile, isTablet } = useResponsive();

  if (isMobile) {
    return (
      <div className="bg-cyber-dark/95 border-b border-cyber-blue/20 p-2">
        {/* Header com avatar e nome */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img
              src={avatarUrl}
              alt={playerName}
              className="w-8 h-8 rounded-full border-2 border-cyber-blue/50"
            />
            <div>
              <h3 className="text-sm font-bold text-white">{playerName}</h3>
              <p className="text-xs text-cyber-blue">Level 15</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-400">
              ${money.toLocaleString()}
            </p>
            <p className="text-xs text-cyber-blue">Money</p>
          </div>
        </div>

        {/* Stats em grid 2x2 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-red-400">Health</span>
              <span className="text-xs text-white">
                {health}/{maxHealth}
              </span>
            </div>
            <ProgressBar
              current={health}
              max={maxHealth}
              color="cyber-blue"
              showText={false}
            />
          </div>

          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-yellow-400">Energy</span>
              <span className="text-xs text-white">
                {energy}/{maxEnergy}
              </span>
            </div>
            <ProgressBar
              current={energy}
              max={maxEnergy}
              color="cyber-purple"
              showText={false}
            />
          </div>

          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cyan-400">Addiction</span>
              <span className="text-xs text-white">{addiction}%</span>
            </div>
            <ProgressBar
              current={addiction}
              max={100}
              color="cyber-orange"
              showText={false}
            />
          </div>

          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-orange-400">Wanted</span>
              <span className="text-xs text-white">{wantedLevel}%</span>
            </div>
            <ProgressBar
              current={wantedLevel}
              max={100}
              color="cyber-orange"
              showText={false}
            />
          </div>
        </div>

        {/* Reputation */}
        <div className="mt-2 bg-black/20 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-purple-400">Reputation</span>
            <span className="text-xs text-white">{reputation}</span>
          </div>
          <ProgressBar
            current={reputation}
            max={100}
            color="cyber-purple"
            showText={false}
          />
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="bg-cyber-dark/95 border-b border-cyber-blue/20 p-3">
        <div className="flex items-center justify-between">
          {/* Player Info */}
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-cyber-blue/50"
            />
            <div>
              <h3 className="font-bold text-white">{playerName}</h3>
              <p className="text-sm text-cyber-blue">Level 15</p>
            </div>
          </div>

          {/* Stats em 3 colunas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-red-400">Health</span>
                <span className="text-sm text-white">
                  {health}/{maxHealth}
                </span>
              </div>
              <ProgressBar
                current={health}
                max={maxHealth}
                color="cyber-blue"
                showText={false}
              />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-yellow-400">Energy</span>
                <span className="text-sm text-white">
                  {energy}/{maxEnergy}
                </span>
              </div>
              <ProgressBar
                current={energy}
                max={maxEnergy}
                color="cyber-purple"
                showText={false}
              />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-green-400">Money</span>
                <span className="text-sm text-white">
                  ${money.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-cyan-400">Addiction</span>
                <span className="text-sm text-white">{addiction}%</span>
              </div>
              <ProgressBar
                current={addiction}
                max={100}
                color="cyber-orange"
                showText={false}
              />
            </div>

            <div className="text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-orange-400">Wanted</span>
                <span className="text-sm text-white">{wantedLevel}%</span>
              </div>
              <ProgressBar
                current={wantedLevel}
                max={100}
                color="cyber-orange"
                showText={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout original
  return (
    <div className="bg-cyber-dark/95 border-b border-cyber-blue/20 p-4">
      <div className="flex items-center justify-between">
        {/* Player Info */}
        <div className="flex items-center gap-4">
          <img
            src={avatarUrl}
            alt={playerName}
            className="w-12 h-12 rounded-full border-2 border-cyber-blue/50"
          />
          <div>
            <h3 className="font-bold text-white text-lg">{playerName}</h3>
            <p className="text-cyber-blue">Level 15</p>
          </div>
        </div>

        {/* Stats em 3 colunas e 2 linhas */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 font-medium">Health</span>
              <span className="text-white">
                {health}/{maxHealth}
              </span>
            </div>
            <ProgressBar
              current={health}
              max={maxHealth}
              color="cyber-blue"
              showText={false}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 font-medium">Energy</span>
              <span className="text-white">
                {energy}/{maxEnergy}
              </span>
            </div>
            <ProgressBar
              current={energy}
              max={maxEnergy}
              color="cyber-purple"
              showText={false}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-medium">Money</span>
              <span className="text-white">${money.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-medium">Addiction</span>
              <span className="text-white">{addiction}%</span>
            </div>
            <ProgressBar
              current={addiction}
              max={100}
              color="cyber-orange"
              showText={false}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-400 font-medium">Wanted</span>
              <span className="text-white">{wantedLevel}%</span>
            </div>
            <ProgressBar
              current={wantedLevel}
              max={100}
              color="cyber-orange"
              showText={false}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-medium">Reputation</span>
              <span className="text-white">{reputation}</span>
            </div>
            <ProgressBar
              current={reputation}
              max={100}
              color="cyber-purple"
              showText={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatusBar;
