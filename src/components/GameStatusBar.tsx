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
  level: number;
  addiction: number;
  wantedLevel: number;
  money: number;
  playerName?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

const GameStatusBar: React.FC<GameStatusBarProps> = ({
  health,
  maxHealth,
  energy,
  maxEnergy,
  reputation,
  level,
  addiction,
  wantedLevel,
  money,
  playerName = "Urban Player",
  avatarUrl = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  onLogout,
}) => {
  const { isMobile, isTablet } = useResponsive();

  if (isMobile) {
    return (
      <div className="bg-cyber-dark/95 border-b border-cyber-blue/20 p-2">
        {/* Player Info */}
        <div className="flex items-start gap-3 mb-2">
          <img
            src={avatarUrl}
            alt={playerName}
            className="w-12 h-12 rounded-full border-2 border-cyber-blue/50"
          />
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{playerName} - Level {level}</h3>
            
            {/* Health Bar with Progress */}
            <div className="flex items-center gap-2 mb-1">
              <HeartPulse size={16} className="text-red-400" />
              <div className="w-1/2 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${(health / maxHealth) * 100}%`}}
                />
              </div>
              <span className="text-red-400 font-medium text-sm min-w-[50px]">{health}/{maxHealth}</span>
              <span className="text-green-400 font-bold text-sm min-w-[80px]">${(money / 1000000).toFixed(1)}M</span>
            </div>
            
            {/* Energy Bar with Progress */}
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <div className="w-1/2 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${(energy / maxEnergy) * 100}%`}}
                />
              </div>
              <span className="text-yellow-400 font-medium text-sm min-w-[50px]">{energy}/{maxEnergy}</span>
              <span className="text-purple-400 font-bold text-sm min-w-[80px]">{reputation} Rep</span>
            </div>
          </div>
        </div>
        
        {/* Additional Bars */}
        <div className="space-y-1">
          {/* Addiction Bar */}
          <div className="flex items-center gap-2">
            <Pill size={14} className="text-cyan-400" />
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300" 
                style={{width: `${addiction}%`}}
              />
            </div>
            <span className="text-cyan-400 text-xs min-w-[30px]">{addiction}%</span>
          </div>
          
          {/* Wanted Bar */}
          <div className="flex items-center gap-2">
            <Siren size={14} className="text-orange-400" />
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-orange-400 h-1.5 rounded-full transition-all duration-300" 
                style={{width: `${Math.min(wantedLevel * 10, 100)}%`}}
              />
            </div>
            <span className="text-orange-400 text-xs min-w-[30px]">{wantedLevel}</span>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="flex justify-center pt-2">
          {onLogout && (
              <button
                onClick={onLogout}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Sair"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="bg-cyber-dark/95 border-b border-cyber-blue/20 p-3">
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
              color="red"
              showText={false}
            />
          </div>

          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-400">Energy</span>
              <span className="text-xs text-white">
                {energy}/{maxEnergy}
              </span>
            </div>
            <ProgressBar
              current={energy}
              max={maxEnergy}
              color="blue"
              showText={false}
            />
          </div>

          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-orange-400">Addiction</span>
              <span className="text-xs text-white">{addiction}%</span>
            </div>
            <ProgressBar
              current={addiction}
              max={100}
              color="orange"
              showText={false}
            />
          </div>

          <div className="bg-black/20 rounded p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-yellow-400">Wanted</span>
              <span className="text-xs text-white">{wantedLevel}%</span>
            </div>
            <ProgressBar
              current={wantedLevel}
              max={100}
              color="yellow"
              showText={false}
            />
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
            <h3 className="font-bold text-white text-lg">{playerName} - Level {level}</h3>
            <p className="text-purple-400">Reputation {reputation}</p>
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
              color="red"
              showText={false}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-medium">Energy</span>
              <span className="text-white">
                {energy}/{maxEnergy}
              </span>
            </div>
            <ProgressBar
              current={energy}
              max={maxEnergy}
              color="blue"
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
              <span className="text-orange-400 font-medium">Addiction</span>
              <span className="text-white">{addiction}%</span>
            </div>
            <ProgressBar
              current={addiction}
              max={100}
              color="orange"
              showText={false}
            />
          </div>

          <div className="text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 font-medium">Wanted</span>
              <span className="text-white">{wantedLevel}%</span>
            </div>
            <ProgressBar
              current={wantedLevel}
              max={100}
              color="yellow"
              showText={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatusBar;
