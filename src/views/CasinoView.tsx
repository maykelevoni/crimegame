import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  DollarSign,
  Dice3,
  Star,
  Landmark,
  Zap,
  Clock,
  AlertTriangle,
  Sword,
  Trophy,
  Crown,
  Sparkles,
  Target,
} from "lucide-react";

interface CasinoGame {
  id: string;
  name: string;
  description: string;
  image: string;
  reward: string;
  energy: string;
  reputation: string;
  time: string;
  risk: string;
  icon: React.ElementType;
  color: string;
  difficulty: string;
  difficultyColor: string;
  buttonColor: string;
}

const CasinoView = () => {
  const [balance, setBalance] = useState(50000);
  const [dailySpinAvailable, setDailySpinAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);

  const games: CasinoGame[] = [
    {
      id: "blackjack",
      name: "Blackjack",
      description: "Classic card game with high stakes and strategy",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      reward: "2x-3x bet",
      energy: "10",
      reputation: "+5",
      time: "5m",
      risk: "Medium",
      icon: Star,
      color: "#FF00C8",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-500",
      buttonColor: "bg-yellow-500",
    },
    {
      id: "roulette",
      name: "Roulette",
      description: "Spin the wheel for big wins and excitement",
      image:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&h=150&fit=crop",
      reward: "35x bet",
      energy: "5",
      reputation: "+10",
      time: "2m",
      risk: "High",
      icon: Dice3,
      color: "#FFD600",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
    {
      id: "slots",
      name: "Slots",
      description: "Easy to play, chance to win massive jackpots",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop",
      reward: "1000x bet",
      energy: "2",
      reputation: "+2",
      time: "1m",
      risk: "Very High",
      icon: Star,
      color: "#FF00C8",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-cyber-blue",
    },
    {
      id: "poker",
      name: "Poker",
      description: "High-stakes poker against other players",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
      reward: "10x pot",
      energy: "20",
      reputation: "+50",
      time: "15m",
      risk: "Very High",
      icon: Landmark,
      color: "#00FF88",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
    {
      id: "baccarat",
      name: "Baccarat",
      description: "Elegant card game for high rollers",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      reward: "8x bet",
      energy: "15",
      reputation: "+25",
      time: "8m",
      risk: "High",
      icon: Crown,
      color: "#FFD600",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
  ];

  const handleGame = (game: CasinoGame) => {
    // Aqui você pode implementar a lógica específica de cada jogo
  };

  const handleStartGame = (game: CasinoGame) => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setSelectedGame(game);
    }, 1200);
  };

  const handleDailySpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setShowDailyReward(true);
    }, 2000);
  };

  return (
    <BaseView title="Casino">
      {/* Balance Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={24} className="text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">
              ${balance.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" />
            <span className="text-sm text-yellow-400">
              Available for betting
            </span>
          </div>
        </div>
      </div>

      {/* Daily Spin */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles size={24} className="text-pink-400" />
          Daily Spin
        </h2>
        <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-pink-400 text-lg mb-1">
                Spin for daily prizes!
              </h3>
              <p className="text-sm text-white/70">
                Get exclusive rewards and bonuses
              </p>
            </div>
            <button
              onClick={handleDailySpin}
              disabled={!dailySpinAvailable}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                dailySpinAvailable
                  ? "bg-pink-500 hover:bg-pink-600 text-white hover:scale-105"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              {dailySpinAvailable ? "Spin Wheel" : "Already Spun"}
            </button>
          </div>
        </div>
      </div>

      {/* Available Games */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target size={24} className="text-cyan-400" />
          Available Games
        </h2>
        <div className="grid gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className={`p-4 rounded-xl border ${game.difficultyColor.replace(
                "bg-",
                "border-"
              )}/30 ${game.difficultyColor.replace(
                "bg-",
                "bg-"
              )}/10 cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleGame(game)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold text-white ${game.difficultyColor}`}
                    >
                      {game.difficulty}
                    </span>
                    <h3 className="font-bold text-white">{game.name}</h3>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    {game.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Reward:</span>
                      <span className="text-green-400 font-bold ml-2">
                        {game.reward}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">Energy:</span>
                      <span className="text-yellow-400 font-bold ml-2">
                        {game.energy}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">Reputation:</span>
                      <span className="text-purple-400 font-bold ml-2">
                        {game.reputation}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">Time:</span>
                      <span className="text-cyan-400 font-bold ml-2">
                        {game.time}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <span className="text-red-400 font-bold">
                      ⚠️ Risk: {game.risk}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseView>
  );
};

export default CasinoView;
