import React, { useState } from "react";
import BaseView from "./BaseView";
import CyberCard from "../components/ui/CyberCard";
import NeonButton from "../components/ui/NeonButton";
import {
  Banknote,
  Landmark,
  ArrowRightLeft,
  PiggyBank,
  DollarSign,
  Clock,
  AlertTriangle,
  Star,
} from "lucide-react";

interface BankingService {
  id: string;
  name: string;
  description: string;
  reward: string;
  energy: string;
  reputation: string;
  time: string;
  risk?: string;
  icon: React.ElementType;
  color: string;
  difficulty: string;
  difficultyColor: string;
  buttonColor: string;
}

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
  icon: Icon,
  iconColor = "#0A0E17",
}) {
  return (
    <div
      className={`cyber-card flex flex-col p-4 gap-3 border-l-4 ${difficultyColor} bg-cyber-dark-medium`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold text-white ${difficultyColor}`}
          >
            {difficulty}
          </span>
          <h4 className="font-bold text-lg text-cyber-blue">{title}</h4>
        </div>
        <Icon size={24} style={{ color: iconColor }} />
      </div>

      <p className="text-sm text-gray-300">{description}</p>

      <div className="flex flex-wrap gap-3 text-xs">
        {reward && (
          <span className="flex items-center gap-1 text-cyber-green">
            <DollarSign size={14} /> {reward}
          </span>
        )}
        {energy && (
          <span className="flex items-center gap-1 text-cyber-pink">
            <DollarSign size={14} /> {energy}
          </span>
        )}
        {reputation && (
          <span className="flex items-center gap-1 text-cyber-pink">
            <DollarSign size={14} /> {reputation}
          </span>
        )}
        {time && (
          <span className="flex items-center gap-1 text-cyber-pink">
            <Clock size={14} /> {time}
          </span>
        )}
        {risk && (
          <span className="flex items-center gap-1 text-red-500">
            <AlertTriangle size={14} /> {risk}
          </span>
        )}
      </div>

      <button
        className={`w-full font-bold px-6 py-2 rounded ${buttonColor} text-white hover:opacity-90 transition-all flex items-center justify-center gap-2`}
        onClick={onStart}
      >
        <Icon size={18} color={iconColor} /> {onStart ? "START" : "CONFIRM"}
      </button>
    </div>
  );
}

const BankView = () => {
  const [balance, setBalance] = useState(100000);
  const [interestRate] = useState(0.1);

  const bankingServices: BankingService[] = [
    {
      id: "transfer",
      name: "Transfer Money",
      description: "Send money to other players",
      reward: "Fee: $100",
      energy: "Cost: 10",
      reputation: "+5",
      time: "Instant",
      icon: ArrowRightLeft,
      color: "#30E3DF",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-cyber-blue",
    },
    {
      id: "loan",
      name: "Take Loan",
      description: "Get a loan with daily interest",
      reward: "Amount: $500,000",
      energy: "Cost: 50",
      reputation: "+20",
      time: "24h",
      icon: Landmark,
      color: "#00FF88",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-500",
      buttonColor: "bg-yellow-500",
    },
    {
      id: "investment",
      name: "Investment Account",
      description: "High-risk, high-reward investment options",
      reward: "Return: 20% daily",
      energy: "Cost: 100",
      reputation: "+50",
      time: "24h",
      risk: "High Risk",
      icon: PiggyBank,
      color: "#FFD600",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
  ];

  return (
    <BaseView title="Bank">
      {/* Account Overview Section */}
      <div className="cyber-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Banknote size={24} className="text-yellow-400" />
          <h3 className="text-xl font-semibold">Account Overview</h3>
        </div>

        <div className="cyber-card p-4 border-l-4 bg-green-500 bg-cyber-dark-medium">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-green-500">
                Account
              </span>
              <h4 className="font-bold text-lg text-cyber-blue">Balance</h4>
            </div>
            <Banknote size={24} className="text-yellow-400" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Available funds:</span>
              <span className="text-cyber-green font-medium">
                ${balance.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily interest:</span>
              <span className="text-cyber-blue">{interestRate}%</span>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button className="w-full font-bold px-6 py-2 rounded bg-cyber-blue text-white hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Banknote size={18} color="#0A0E17" /> DEPOSIT
              </button>
              <button className="w-full font-bold px-6 py-2 rounded bg-yellow-500 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Banknote size={18} color="#0A0E17" /> WITHDRAW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banking Services Section */}
      <div className="cyber-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Landmark size={24} className="text-cyan-400" />
          <h3 className="text-xl font-semibold">Banking Services</h3>
        </div>

        <div className="space-y-4">
          {bankingServices.map((service) => (
            <ActionCard
              key={service.id}
              difficulty={service.difficulty}
              difficultyColor={service.difficultyColor}
              title={service.name}
              description={service.description}
              reward={service.reward}
              energy={service.energy}
              reputation={service.reputation}
              time={service.time}
              risk={service.risk}
              onStart={() => {}}
              buttonColor={service.buttonColor}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </BaseView>
  );
};

export default BankView;
