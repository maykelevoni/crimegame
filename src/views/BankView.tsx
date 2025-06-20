import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Banknote,
  Landmark,
  ArrowRightLeft,
  PiggyBank,
  DollarSign,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  Shield,
  CreditCard,
  Building,
} from "lucide-react";

interface BankingService {
  id: string;
  name: string;
  description: string;
  image: string;
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

const BankView = () => {
  const [balance, setBalance] = useState(100000);
  const [interestRate] = useState(0.1);

  const bankingServices: BankingService[] = [
    {
      id: "transfer",
      name: "Transfer Money",
      description: "Send money to other players securely",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop",
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
      description: "Get a loan with daily interest rates",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop",
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
    {
      id: "savings",
      name: "Savings Account",
      description: "Safe and secure money storage",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop",
      reward: "Interest: 5% daily",
      energy: "Cost: 5",
      reputation: "+10",
      time: "24h",
      icon: Shield,
      color: "#00FF88",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-green-500",
    },
  ];

  const handleService = (service: BankingService) => {
    console.log(`Iniciando serviço: ${service.name}`);
    // Aqui você pode implementar a lógica específica de cada serviço
  };

  return (
    <BaseView title="Bank">
      {/* Account Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote size={24} className="text-green-400" />
            <span className="text-xl font-bold text-green-400">
              ${balance.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-sm text-green-400">
              +{interestRate}% daily interest
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard size={24} className="text-blue-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft size={20} className="text-blue-400" />
              <span className="font-bold text-blue-400">Deposit</span>
            </div>
            <p className="text-xs text-white/70">Add money to your account</p>
          </button>
          <button className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-red-400" />
              <span className="font-bold text-red-400">Withdraw</span>
            </div>
            <p className="text-xs text-white/70">
              Take money from your account
            </p>
          </button>
        </div>
      </div>

      {/* Banking Services */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Building size={24} className="text-cyan-400" />
          Banking Services
        </h2>
        <div className="grid gap-4">
          {bankingServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 rounded-xl border ${service.difficultyColor.replace(
                "bg-",
                "border-"
              )}/30 ${service.difficultyColor.replace(
                "bg-",
                "bg-"
              )}/10 cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleService(service)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold text-white ${service.difficultyColor}`}
                    >
                      {service.difficulty}
                    </span>
                    <h3 className="font-bold text-white">{service.name}</h3>
                  </div>
                  <p className="text-sm text-white/70 mb-3">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Reward:</span>
                      <span className="text-green-400 font-bold ml-2">
                        {service.reward}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">Energy:</span>
                      <span className="text-yellow-400 font-bold ml-2">
                        {service.energy}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">Reputation:</span>
                      <span className="text-purple-400 font-bold ml-2">
                        {service.reputation}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/60">Time:</span>
                      <span className="text-cyan-400 font-bold ml-2">
                        {service.time}
                      </span>
                    </div>
                  </div>
                  {service.risk && (
                    <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                      <span className="text-red-400 font-bold">
                        ⚠️ {service.risk}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseView>
  );
};

export default BankView;
