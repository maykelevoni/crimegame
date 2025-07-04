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
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";

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
  const { player, depositMoney, withdrawMoney, addInterest, updatePlayerMoney } = useGameStore();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedService, setSelectedService] = useState<BankingService | null>(
    null
  );

  const cashMoney = player?.stats?.money || 0;
  const bankBalance = player?.stats?.bankBalance || 0;
  const interestRate = 0.05; // 5% daily interest

  const bankingServices: BankingService[] = [
    {
      id: "savings",
      name: "Savings Account",
      description: "Your money is already earning 5% daily interest in the bank",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop",
      reward: `Daily Interest: $${Math.floor(bankBalance * interestRate).toLocaleString()}`,
      energy: "No cost",
      reputation: "Passive income",
      time: "Daily",
      icon: Shield,
      color: "#00FF88",
      difficulty: "Active",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-green-500",
    },
    {
      id: "loan",
      name: "Business Loan",
      description: "Get capital to expand your criminal empire",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
      reward: "Available: $50,000",
      energy: "Cost: 20",
      reputation: "Credit check required",
      time: "Instant",
      icon: Landmark,
      color: "#00FF88",
      difficulty: "Medium",
      difficultyColor: "bg-yellow-500",
      buttonColor: "bg-yellow-500",
    },
    {
      id: "investment",
      name: "Investment Portfolio",
      description: "Invest in volatile stocks for higher returns",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop",
      reward: "Return: 15-25% (risky)",
      energy: "Cost: 50",
      reputation: "Market dependent",
      time: "24h",
      risk: "High Risk",
      icon: TrendingUp,
      color: "#FFD600",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      buttonColor: "bg-red-500",
    },
    {
      id: "insurance",
      name: "Crime Insurance",
      description: "Protect your assets from police seizure",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=150&h=150&fit=crop",
      reward: "Coverage: 80% of losses",
      energy: "Cost: 10",
      reputation: "Premium: 2% monthly",
      time: "Instant",
      icon: Shield,
      color: "#30E3DF",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      buttonColor: "bg-cyan-500",
    },
  ];

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > cashMoney) {
      toast.error("Insufficient cash");
      return;
    }
    
    depositMoney(amount);
    setDepositAmount("");
    toast.success(`Deposited $${amount.toLocaleString()}`);
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > bankBalance) {
      toast.error("Insufficient bank balance");
      return;
    }
    
    withdrawMoney(amount);
    setWithdrawAmount("");
    toast.success(`Withdrawn $${amount.toLocaleString()}`);
  };

  const canClaimInterest = () => {
    const lastClaim = player?.stats?.lastInterestClaim;
    if (!lastClaim) return false; // No deposit yet
    
    const lastClaimTime = new Date(lastClaim);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaimTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24; // Can claim if 24+ hours have passed
  };

  const getTimeUntilNextClaim = () => {
    const lastClaim = player?.stats?.lastInterestClaim;
    if (!lastClaim) return null;
    
    const lastClaimDate = new Date(lastClaim);
    const nextClaimTime = new Date(lastClaimDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    const now = new Date();
    
    if (now >= nextClaimTime) return null;
    
    const timeDiff = nextClaimTime.getTime() - now.getTime();
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  const handleCollectInterest = () => {
    if (bankBalance <= 0) {
      toast.error("Deposit money first to start earning interest!");
      return;
    }
    
    const interest = Math.floor(bankBalance * interestRate);
    if (interest <= 0) {
      toast.error("Bank balance too low to earn interest");
      return;
    }
    
    if (!canClaimInterest()) {
      const lastClaim = player?.stats?.lastInterestClaim;
      if (!lastClaim) {
        toast.error("Deposit money first to start the 24-hour timer!");
      } else {
        const timeLeft = getTimeUntilNextClaim();
        toast.error(`Must wait 24 hours after deposit/last claim! Time left: ${timeLeft || '0h 0m'}`);
      }
      return;
    }
    
    addInterest();
    toast.success(`Collected $${interest.toLocaleString()} in daily interest!`);
  };

  const handleStartService = (service: BankingService) => {
    switch (service.id) {
      case 'savings':
        handleCollectInterest();
        break;
      case 'loan':
        if (cashMoney < 50000) {
          const loanAmount = 50000;
          updatePlayerMoney(loanAmount); // Add loan money to cash
          toast.success(`Loan approved! $${loanAmount.toLocaleString()} added to cash`);
        } else {
          toast.error("You already have sufficient funds");
        }
        break;
      case 'investment':
        toast.info("Investment feature coming soon!");
        break;
      case 'insurance':
        toast.info("Insurance feature coming soon!");
        break;
      default:
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setSelectedService(service);
        }, 1500);
    }
  };

  return (
    <BaseView title="Bank">
      {/* Account Overview */}
      <div className="mb-6 space-y-4">
        {/* Cash Balance */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={24} className="text-yellow-400" />
              <div>
                <p className="text-sm text-yellow-400/70">Cash on Hand</p>
                <span className="text-xl font-bold text-yellow-400">
                  ${cashMoney.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Balance */}
        <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Banknote size={24} className="text-green-400" />
              <div>
                <p className="text-sm text-green-400/70">Bank Balance</p>
                <span className="text-xl font-bold text-green-400">
                  ${bankBalance.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              <span className="text-sm text-green-400">
                +{(interestRate * 100).toFixed(1)}% daily interest
              </span>
            </div>
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
          {/* Deposit */}
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft size={20} className="text-blue-400" />
              <span className="font-bold text-blue-400">Deposit</span>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-3 py-2 bg-black/20 border border-blue-500/30 rounded text-white text-sm"
                max={cashMoney}
              />
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || parseInt(depositAmount) <= 0}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded font-bold text-sm transition-colors"
              >
                Deposit
              </button>
            </div>
          </div>

          {/* Withdraw */}
          <div className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={20} className="text-red-400" />
              <span className="font-bold text-red-400">Withdraw</span>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-3 py-2 bg-black/20 border border-red-500/30 rounded text-white text-sm"
                max={bankBalance}
              />
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseInt(withdrawAmount) <= 0}
                className="w-full py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded font-bold text-sm transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
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
              onClick={() => handleStartService(service)}
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
                  
                  {/* Action Button */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleStartService(service)}
                      disabled={isProcessing || (service.id === 'savings' && (!canClaimInterest() || bankBalance <= 0))}
                      className={`w-full py-2 px-4 rounded-lg font-bold text-white transition-all hover:scale-[1.02] ${
                        service.buttonColor
                      } ${
                        isProcessing || (service.id === 'savings' && (!canClaimInterest() || bankBalance <= 0)) 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:brightness-110"
                      }`}
                    >
                      {service.id === 'savings' ? 
                        (bankBalance <= 0 ? 
                          'Deposit Money First' :
                          !canClaimInterest() ? 
                            (player?.stats?.lastInterestClaim ? 
                              `Wait: ${getTimeUntilNextClaim() || '0h 0m'}` : 
                              'Deposit to Start Timer'
                            ) : 
                            'Collect Interest'
                        ) : 
                       service.id === 'loan' ? 'Apply for Loan' :
                       service.id === 'investment' ? 'Invest' :
                       service.id === 'insurance' ? 'Buy Insurance' :
                       'Start Service'}
                    </button>
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

export default BankView;
