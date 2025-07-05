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
import { getReputationToNextLevel, getLevelInfo } from "../utils/levelSystem";

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
  
  // Calculate reputation progress to next level
  const reputationProgress = getReputationToNextLevel(reputation);
  
  // Get current level title
  const levelInfo = getLevelInfo(level);
  const levelTitle = levelInfo?.title.toUpperCase() || "STREET ROOKIE";

  if (isMobile) {
    return (
      <div className="bg-cyber-dark/95 border-b border-cyber-blue/20 p-3">
        {/* Player Info Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={playerName}
              className="w-10 h-10 rounded-full border-2 border-cyber-blue/50"
            />
            <div>
              <h3 className="text-white font-bold text-sm">{playerName}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-bold text-sm">${money.toLocaleString()}</span>
            {/* Logout Button */}
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
        
        {/* Rank Badge Style - Like GTA/Payday */}
        <div className="flex items-center gap-3 mb-3 bg-gradient-to-r from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-2">
          {/* Rank Badge */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full border-2 border-purple-400 flex items-center justify-center">
              <span className="text-white font-bold text-xs">{level}</span>
            </div>
            {/* Progress Ring */}
            <svg className="absolute -top-1 -left-1 w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="18" stroke="rgb(107 114 128)" strokeWidth="2" fill="none" />
              <circle 
                cx="20" cy="20" r="18" 
                stroke="rgb(168 85 247)" strokeWidth="2" fill="none"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - reputationProgress.progressPercent / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
          
          {/* Rank Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400 font-bold text-sm">{levelTitle}</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-white text-xs">{reputation.toLocaleString()} REP</span>
            </div>
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <div className="w-3/4 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-300 h-1.5 rounded-full transition-all duration-500 shadow-sm" 
                  style={{width: `${reputationProgress.progressPercent}%`}}
                />
              </div>
              <span className="text-purple-300 text-xs flex-1 text-right">
                {reputationProgress.reputationNeeded.toLocaleString()} to rank up
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress Bars Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Health Bar */}
          <div className="flex items-center gap-2">
            <HeartPulse size={14} className="text-red-400" />
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-red-400 h-1.5 rounded-full transition-all duration-300" 
                style={{width: `${(health / maxHealth) * 100}%`}}
              />
            </div>
            <span className="text-red-400 text-xs min-w-[35px]">{health}/{maxHealth}</span>
          </div>
          
          {/* Energy Bar */}
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-400" />
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300" 
                style={{width: `${(energy / maxEnergy) * 100}%`}}
              />
            </div>
            <span className="text-yellow-400 text-xs min-w-[35px]">{energy}/{maxEnergy}</span>
          </div>
          
          {/* Addiction Bar */}
          <div className="flex items-center gap-2">
            <Pill size={14} className="text-cyan-400" />
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300" 
                style={{width: `${addiction}%`}}
              />
            </div>
            <span className="text-cyan-400 text-xs min-w-[35px]">{addiction}%</span>
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
            <span className="text-orange-400 text-xs min-w-[35px]">{wantedLevel}</span>
          </div>
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
