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
  Target,
  Play,
  Coins,
} from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";

interface CasinoGame {
  id: string;
  name: string;
  description: string;
  image: string;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  energyCost: number;
  reputationReward: number;
  maxMultiplier: number;
  icon: React.ElementType;
  color: string;
  difficulty: string;
  difficultyColor: string;
  buttonColor: string;
}

const CasinoView = () => {
  const { player, updatePlayerMoney, updatePlayerStats } = useGameStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [betAmount, setBetAmount] = useState("");
  const [gameResult, setGameResult] = useState<string | null>(null);

  const playerMoney = player?.stats?.money || 0;
  const playerEnergy = player?.stats?.energy || 0;

  const games: CasinoGame[] = [
    {
      id: "blackjack",
      name: "Blackjack",
      description: "Classic card game with strategy and skill",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      minBet: 100,
      maxBet: 10000,
      houseEdge: 0.02, // 2% house edge
      energyCost: 10,
      reputationReward: 5,
      maxMultiplier: 2.5,
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
      minBet: 50,
      maxBet: 25000,
      houseEdge: 0.027, // 2.7% house edge
      energyCost: 5,
      reputationReward: 10,
      maxMultiplier: 35,
      icon: Dice3,
      color: "#FFD600",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-green-500",
    },
    {
      id: "slots",
      name: "Slots",
      description: "Easy to play, chance to win massive jackpots",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop",
      minBet: 10,
      maxBet: 1000,
      houseEdge: 0.05, // 5% house edge
      energyCost: 2,
      reputationReward: 2,
      maxMultiplier: 1000,
      icon: Crown,
      color: "#FF00C8",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-green-500",
    },
    {
      id: "poker",
      name: "Poker",
      description: "High-stakes poker against other players",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
      minBet: 500,
      maxBet: 50000,
      houseEdge: 0.015, // 1.5% house edge
      energyCost: 20,
      reputationReward: 50,
      maxMultiplier: 10,
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
      minBet: 1000,
      maxBet: 100000,
      houseEdge: 0.012, // 1.2% house edge
      energyCost: 15,
      reputationReward: 25,
      maxMultiplier: 8,
      icon: Crown,
      color: "#FFD600",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
  ];

  const handleGame = (game: CasinoGame) => {
    if (playerEnergy < game.energyCost) {
      toast.error("Not enough energy to play this game");
      return;
    }
    setSelectedGame(game);
    setShowGameModal(true);
    setBetAmount(game.minBet.toString());
  };

  const handlePlacebet = () => {
    if (!selectedGame) return;
    
    const bet = parseInt(betAmount);
    if (isNaN(bet) || bet < selectedGame.minBet || bet > selectedGame.maxBet) {
      toast.error(`Bet must be between $${selectedGame.minBet} and $${selectedGame.maxBet}`);
      return;
    }
    
    if (bet > playerMoney) {
      toast.error("Insufficient funds");
      return;
    }
    
    if (playerEnergy < selectedGame.energyCost) {
      toast.error("Not enough energy");
      return;
    }
    
    setIsPlaying(true);
    
    // Deduct bet and energy
    updatePlayerMoney(-bet);
    updatePlayerStats({
      energy: playerEnergy - selectedGame.energyCost
    });
    
    // Calculate result based on house edge
    setTimeout(() => {
      const result = calculateGameResult(selectedGame, bet);
      setGameResult(result.message);
      
      if (result.winnings > 0) {
        updatePlayerMoney(result.winnings);
        updatePlayerStats({
          reputation: (player?.stats?.reputation || 0) + selectedGame.reputationReward
        });
        
        // Show success toast
        toast.success(result.message, {
          duration: 4000
        });
      } else {
        // Show loss toast
        toast.error(result.message, {
          duration: 3000
        });
      }
      
      setIsPlaying(false);
      setBetAmount("");
      setShowGameModal(false);
      setSelectedGame(null);
    }, 2000);
  };

  const calculateGameResult = (game: CasinoGame, bet: number) => {
    const random = Math.random();
    const houseEdge = game.houseEdge;
    
    // Basic win/loss calculation based on house edge
    let winChance = 0.5 - houseEdge;
    let winnings = 0;
    let message = "";
    
    switch (game.id) {
      case "blackjack":
        winChance = 0.48; // Slightly less than 50% due to house edge
        if (random < winChance) {
          winnings = bet * 2;
          message = `Blackjack! You won $${(bet * 2).toLocaleString()}`;
        } else {
          message = "Dealer wins. Better luck next time!";
        }
        break;
        
      case "roulette":
        if (random < 0.027) { // Single number hit
          winnings = bet * 35;
          message = `Lucky number! You won $${(bet * 35).toLocaleString()}`;
        } else if (random < 0.5) { // Color/even-odd bet
          winnings = bet * 2;
          message = `Good guess! You won $${(bet * 2).toLocaleString()}`;
        } else {
          message = "The wheel doesn't favor you this time.";
        }
        break;
        
      case "slots":
        if (random < 0.001) { // Jackpot
          winnings = bet * 1000;
          message = `JACKPOT! You won $${(bet * 1000).toLocaleString()}`;
        } else if (random < 0.05) { // Small win
          winnings = bet * 5;
          message = `Nice spin! You won $${(bet * 5).toLocaleString()}`;
        } else if (random < 0.15) { // Return bet
          winnings = bet;
          message = `Break even! You got your bet back.`;
        } else {
          message = "No match. Try again!";
        }
        break;
        
      case "poker":
        winChance = 0.485; // Poker with house edge
        if (random < winChance) {
          const multiplier = Math.random() * 9 + 1; // 1x to 10x
          winnings = bet * multiplier;
          message = `Great hand! You won $${(bet * multiplier).toLocaleString()}`;
        } else {
          message = "House wins this round.";
        }
        break;
        
      case "baccarat":
        winChance = 0.488; // Baccarat with house edge
        if (random < winChance) {
          winnings = bet * 2;
          message = `Baccarat! You won $${(bet * 2).toLocaleString()}`;
        } else {
          message = "Banker wins. Try again!";
        }
        break;
    }
    
    return { winnings, message };
  };

  return (
    <BaseView title="Casino">
      {/* Balance Overview */}
      <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
        {/* Cash Balance */}
        <div className="p-3 md:p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={24} className="text-yellow-400" />
              <div>
                <p className="text-xs md:text-sm text-yellow-400/70">Cash Available</p>
                <span className="text-lg md:text-xl font-bold text-yellow-400">
                  ${playerMoney.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" />
              <span className="text-xs md:text-sm text-yellow-400">
                Ready to bet
              </span>
            </div>
          </div>
        </div>
        
        {/* Energy Status */}
        <div className="p-3 md:p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={24} className="text-blue-400" />
              <div>
                <p className="text-xs md:text-sm text-blue-400/70">Energy</p>
                <span className="text-lg md:text-xl font-bold text-blue-400">
                  {playerEnergy}/{player?.stats?.maxEnergy || 100}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              <span className="text-xs md:text-sm text-blue-400">
                Required for games
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Games */}
      <div>
        <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
          <Target size={24} className="text-cyan-400" />
          Available Games
        </h2>
        <div className="grid gap-3 md:gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className={`p-3 md:p-4 rounded-xl border ${game.difficultyColor.replace(
                "bg-",
                "border-"
              )}/30 ${game.difficultyColor.replace(
                "bg-",
                "bg-"
              )}/10 cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleGame(game)}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold text-white ${game.difficultyColor}`}
                    >
                      {game.difficulty}
                    </span>
                    <h3 className="font-bold text-white text-sm md:text-base truncate">{game.name}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-white/70 mb-3 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                    <div className="min-w-0">
                      <span className="text-white/60 block sm:inline">Min Bet:</span>
                      <span className="text-green-400 font-bold ml-0 sm:ml-2 block sm:inline truncate">
                        ${game.minBet.toLocaleString()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white/60 block sm:inline">Max Bet:</span>
                      <span className="text-green-400 font-bold ml-0 sm:ml-2 block sm:inline truncate">
                        ${game.maxBet.toLocaleString()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white/60 block sm:inline">Energy:</span>
                      <span className="text-yellow-400 font-bold ml-0 sm:ml-2 block sm:inline">
                        {game.energyCost}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white/60 block sm:inline">House Edge:</span>
                      <span className="text-red-400 font-bold ml-0 sm:ml-2 block sm:inline">
                        {(game.houseEdge * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
                    <span className="text-cyan-400 font-bold text-xs md:text-sm">
                      💰 Max Win: {game.maxMultiplier}x bet
                    </span>
                  </div>
                  
                  {/* Play Button */}
                  <div className="mt-3 md:mt-4">
                    <button
                      onClick={() => handleGame(game)}
                      disabled={playerEnergy < game.energyCost || playerMoney < game.minBet}
                      className={`w-full py-2 px-4 rounded-lg font-bold text-white transition-all hover:scale-[1.02] text-sm md:text-base ${
                        game.buttonColor
                      } ${
                        playerEnergy < game.energyCost || playerMoney < game.minBet
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:brightness-110"
                      }`}
                    >
                      {playerEnergy < game.energyCost ? "Not Enough Energy" : 
                       playerMoney < game.minBet ? "Insufficient Funds" : 
                       "Play Game"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Betting Modal */}
      {showGameModal && selectedGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-600 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold text-white truncate">{selectedGame.name}</h3>
              <button
                onClick={() => setShowGameModal(false)}
                className="text-gray-400 hover:text-white text-xl leading-none flex-shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-3 text-sm md:text-base line-clamp-3">{selectedGame.description}</p>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <div className="min-w-0">
                  <span className="text-gray-400 block md:inline">Min Bet:</span>
                  <span className="text-green-400 font-bold ml-0 md:ml-2 block md:inline truncate">
                    ${selectedGame.minBet.toLocaleString()}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-gray-400 block md:inline">Max Bet:</span>
                  <span className="text-green-400 font-bold ml-0 md:ml-2 block md:inline truncate">
                    ${selectedGame.maxBet.toLocaleString()}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-gray-400 block md:inline">Energy Cost:</span>
                  <span className="text-yellow-400 font-bold ml-0 md:ml-2 block md:inline">
                    {selectedGame.energyCost}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-gray-400 block md:inline">Max Win:</span>
                  <span className="text-cyan-400 font-bold ml-0 md:ml-2 block md:inline">
                    {selectedGame.maxMultiplier}x
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Bet Amount
              </label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter bet amount"
                min={selectedGame.minBet}
                max={Math.min(selectedGame.maxBet, playerMoney)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => setShowGameModal(false)}
                className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handlePlacebet}
                disabled={isPlaying || !betAmount || parseInt(betAmount) < selectedGame.minBet}
                className={`py-2 px-4 rounded font-bold text-white transition-colors text-sm md:text-base ${
                  isPlaying || !betAmount || parseInt(betAmount) < selectedGame.minBet
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isPlaying ? "Playing..." : "Place Bet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default CasinoView;
