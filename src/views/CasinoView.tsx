import React from "react";
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
} from "lucide-react";

function ActionCard({
  difficulty = "Medium",
  difficultyColor = "bg-yellow-500",
  title,
  description,
  reward,
  energy,
  reputation,
  time,
  risk = null,
  onStart,
  buttonColor = "bg-cyber-blue",
  imageUrl = null,
  icon: Icon,
  iconColor = "#0A0E17",
}) {
  return (
    <div
      className={`cyber-card flex flex-row items-center p-4 gap-4 border-l-4 ${difficultyColor} bg-cyber-dark-medium`}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 bg-cyber-dark-lighter rounded-lg border border-cyber-blue">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cyber-blue/40">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1 px-2">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold text-white ${difficultyColor}`}
          >
            {difficulty}
          </span>
          <h4 className="font-bold text-lg text-cyber-blue">{title}</h4>
        </div>
        <p className="text-sm text-gray-300 mb-2">{description}</p>
        <div className="flex flex-wrap gap-3 text-xs mb-2">
          {reward && (
            <span className="flex items-center gap-1 text-cyber-green">
              <DollarSign size={14} /> {reward}
            </span>
          )}
          {energy && (
            <span className="flex items-center gap-1 text-cyber-blue">
              <Zap size={14} /> {energy}
            </span>
          )}
          {reputation && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Star size={14} /> {reputation}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1 text-cyber-pink">
              <Clock size={14} /> {time}
            </span>
          )}
          {risk && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertTriangle size={14} /> Risk: {risk}
            </span>
          )}
        </div>
        <button
          className={`font-bold px-6 py-2 rounded ${buttonColor} text-white hover:opacity-90 transition-all flex items-center gap-2`}
          onClick={onStart}
        >
          <Icon size={18} color={iconColor} /> PLAY
        </button>
      </div>
    </div>
  );
}

const CasinoView = () => {
  const games = [
    {
      id: "blackjack",
      name: "Blackjack",
      description: "Classic card game with high stakes",
      reward: "2x-3x bet",
      energy: "10",
      reputation: "+5",
      time: "5m",
      risk: "Medium",
      icon: Star,
      color: "#FF00C8",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-500",
      buttonColor: "bg-yellow-500",
    },
    {
      id: "roulette",
      name: "Roulette",
      description: "Spin the wheel for big wins",
      reward: "35x bet",
      energy: "5",
      reputation: "+10",
      time: "2m",
      risk: "High",
      icon: Dice3,
      color: "#FFD600",
      image:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=100&q=80",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
    {
      id: "slots",
      name: "Slots",
      description: "Easy to play, chance to win big",
      reward: "1000x bet",
      energy: "2",
      reputation: "+2",
      time: "1m",
      risk: "Very High",
      icon: Star,
      color: "#FF00C8",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-cyber-blue",
    },
    {
      id: "poker",
      name: "Poker",
      description: "High-stakes poker against other players",
      reward: "10x pot",
      energy: "20",
      reputation: "+50",
      time: "15m",
      risk: "Very High",
      icon: Landmark,
      color: "#00FF88",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
  ];

  return (
    <BaseView title="Casino">
      <div className="space-y-4">
        <div className="cyber-border p-4">
          <h3 className="text-xl font-semibold mb-4">Daily Spin</h3>
          <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-pink-600 text-lg mb-2">
              Spin for daily prizes!
            </div>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow transition-all">
              Spin Wheel
            </button>
          </div>
        </div>

        <div className="cyber-border p-4">
          <h3 className="text-xl font-semibold mb-4">Your Balance</h3>
          <div className="p-4 bg-cyber-dark-medium rounded-lg border border-cyber-blue">
            <div className="flex items-center gap-2">
              <DollarSign size={24} color="#FFD600" />
              <span className="text-2xl font-bold text-cyber-green">
                $50,000
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Available for betting</p>
          </div>
        </div>

        <div className="cyber-border p-4">
          <h3 className="text-xl font-semibold mb-4">Available Games</h3>
          <div className="space-y-4">
            {games.map((game) => (
              <ActionCard
                key={game.id}
                difficulty={game.difficulty}
                difficultyColor={game.difficultyColor}
                title={game.name}
                description={game.description}
                reward={game.reward}
                energy={game.energy}
                reputation={game.reputation}
                time={game.time}
                risk={game.risk}
                onStart={() => {}}
                buttonColor={game.buttonColor}
                imageUrl={game.image}
                icon={game.icon}
              />
            ))}
          </div>
        </div>

        <div className="cyber-border p-4">
          <h3 className="text-xl font-semibold mb-4">Recent Winners</h3>
          <div className="space-y-2">
            <div className="p-3 bg-cyber-dark-medium rounded">
              <p className="text-sm">Player123 won $25,000 at Blackjack</p>
              <span className="text-xs text-gray-500">5 minutes ago</span>
            </div>
            <div className="p-3 bg-cyber-dark-medium rounded">
              <p className="text-sm">
                Gangster456 hit the jackpot at Slots - $100,000
              </p>
              <span className="text-xs text-gray-500">15 minutes ago</span>
            </div>
            <div className="p-3 bg-cyber-dark-medium rounded">
              <p className="text-sm">Boss789 won $50,000 at Poker</p>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </BaseView>
  );
};

export default CasinoView;
