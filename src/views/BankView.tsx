import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Banknote,
  Landmark,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Shield,
  CreditCard,
  Building,
  AlertTriangle,
  Clock,
  FileText,
  Calculator,
} from "lucide-react";
import { useGameStore } from "../stores/gameStore";
import { toast } from "sonner";
import type { Loan, LoanApplication } from "../types/game";

const BankView = () => {
  const { 
    player, 
    depositMoney, 
    withdrawMoney, 
    addInterest, 
    updatePlayerMoney,
    applyForLoan,
    approveLoan,
    makePayment,
    calculateCreditScore,
    startInvestment,
    completeInvestment,
    processInvestments,
    loans
  } = useGameStore();
  
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState<"small" | "business" | "high_risk">("small");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [showInvestments, setShowInvestments] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState<"stocks" | "crypto" | "bonds">("stocks");
  const [isProcessing, setIsProcessing] = useState(false);

  const cashMoney = player?.stats?.money || 0;
  const bankBalance = player?.stats?.bankBalance || 0;
  const interestRate = 0.05; // 5% daily interest
  const activeLoans = player?.stats?.activeLoans || [];
  const totalDebt = player?.stats?.totalDebt || 0;
  const creditScore = calculateCreditScore();
  const activeInvestments = player?.stats?.activeInvestments || [];

  const playerLevel = player?.stats?.level || 1;
  const levelMultiplier = 1 + (playerLevel - 1) * 0.5; // 50% increase per level

  const loanTypes = {
    small: { 
      name: "Small Loan",
      minAmount: 1000, 
      maxAmount: Math.floor(25000 * levelMultiplier), 
      interestRate: 15,
      termDays: 30, 
      originationFee: 5,
      description: "Quick cash for immediate needs"
    },
    business: { 
      name: "Business Loan",
      minAmount: 25000, 
      maxAmount: Math.floor(100000 * levelMultiplier), 
      interestRate: 12,
      termDays: 90, 
      originationFee: 3,
      description: "Expand your criminal enterprise"
    },
    high_risk: { 
      name: "High-Risk Loan",
      minAmount: 50000, 
      maxAmount: Math.floor(500000 * levelMultiplier), 
      interestRate: 25,
      termDays: 60, 
      originationFee: 8,
      description: "High amounts with high risk"
    }
  };

  const investmentTypes = {
    stocks: {
      name: "Stock Market",
      minAmount: 1000,
      maxAmount: 100000,
      minReturn: -30,
      maxReturn: 50,
      duration: 24, // hours
      riskLevel: "High",
      description: "Volatile stocks with high potential returns"
    },
    crypto: {
      name: "Cryptocurrency",
      minAmount: 500,
      maxAmount: 50000,
      minReturn: -50,
      maxReturn: 100,
      duration: 12, // hours
      riskLevel: "Very High",
      description: "Extremely volatile digital assets"
    },
    bonds: {
      name: "Government Bonds",
      minAmount: 5000,
      maxAmount: 200000,
      minReturn: 3,
      maxReturn: 8,
      duration: 48, // hours
      riskLevel: "Low",
      description: "Safe but low-yield government securities"
    }
  };

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
    if (!lastClaim) return false;
    
    const lastClaimTime = new Date(lastClaim);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaimTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  };

  const getTimeUntilNextClaim = () => {
    const lastClaim = player?.stats?.lastInterestClaim;
    if (!lastClaim) return null;
    
    const lastClaimDate = new Date(lastClaim);
    const nextClaimTime = new Date(lastClaimDate.getTime() + 24 * 60 * 60 * 1000);
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
      toast.error("Must wait 24 hours after deposit/last claim!");
      return;
    }
    
    addInterest();
    toast.success(`Collected $${interest.toLocaleString()} in daily interest!`);
  };

  const handleLoanApplication = () => {
    const amount = parseInt(loanAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid loan amount");
      return;
    }

    const application = applyForLoan(selectedLoanType, amount);
    
    if (application.approved) {
      approveLoan(application);
      setShowLoanApplication(false);
      setLoanAmount("");
    } else {
      toast.error(`Loan denied: ${application.reason}`);
    }
  };

  const handleLoanPayment = () => {
    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (!selectedLoanId) {
      toast.error("Please select a loan");
      return;
    }

    makePayment(selectedLoanId, amount);
    setPaymentAmount("");
  };

  const handleInvestment = () => {
    const amount = parseInt(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    const investment = investmentTypes[selectedInvestment];
    if (amount < investment.minAmount || amount > investment.maxAmount) {
      toast.error(`Investment amount must be between $${investment.minAmount.toLocaleString()} and $${investment.maxAmount.toLocaleString()}`);
      return;
    }

    if (amount > cashMoney) {
      toast.error("Insufficient cash");
      return;
    }

    startInvestment(selectedInvestment, amount);
    setInvestmentAmount("");
    setShowInvestments(false);
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-400";
    if (score >= 650) return "text-yellow-400";
    if (score >= 550) return "text-orange-400";
    return "text-red-400";
  };

  const getCreditScoreText = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    if (score >= 550) return "Fair";
    return "Poor";
  };

  const getInvestmentTimeRemaining = (completesAt: string) => {
    const now = new Date();
    const completeTime = new Date(completesAt);
    const timeDiff = completeTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Ready to collect";
    
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m remaining`;
  };

  const canCollectInvestment = (completesAt: string) => {
    const now = new Date();
    const completeTime = new Date(completesAt);
    return now >= completeTime;
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

        {/* Credit Score & Debt */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <Shield size={24} className="text-blue-400" />
              <div>
                <p className="text-sm text-blue-400/70">Credit Score</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold ${getCreditScoreColor(creditScore)}`}>
                    {creditScore}
                  </span>
                  <span className={`text-sm ${getCreditScoreColor(creditScore)}`}>
                    {getCreditScoreText(creditScore)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle size={24} className="text-red-400" />
              <div>
                <p className="text-sm text-red-400/70">Total Debt</p>
                <span className="text-xl font-bold text-red-400">
                  ${totalDebt.toLocaleString()}
                </span>
              </div>
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

      {/* Collect Interest */}
      <div className="mb-6">
        <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              <div>
                <span className="font-bold text-green-400">Daily Interest</span>
                <p className="text-sm text-green-400/70">
                  Available: ${Math.floor(bankBalance * interestRate).toLocaleString()}
                </p>
                {!canClaimInterest() && bankBalance > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      Next claim: {getTimeUntilNextClaim() || "Available now"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleCollectInterest}
              disabled={!canClaimInterest() || bankBalance <= 0}
              className="py-2 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded font-bold text-sm transition-colors"
            >
              {canClaimInterest() ? "Collect Interest" : "Wait 24h"}
            </button>
          </div>
        </div>
      </div>

      {/* Investment Services */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-green-400" />
          High-Risk Investments
        </h2>
        
        <div className="mb-4">
          <button
            onClick={() => setShowInvestments(!showInvestments)}
            disabled={isProcessing}
            className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
          >
            {isProcessing ? "Processing Investment..." : showInvestments ? "Close Investments" : "View Investments"}
          </button>
        </div>

        {showInvestments && (
          <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl mb-4">
            <h3 className="text-lg font-bold text-green-400 mb-4">Investment Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Investment Type</label>
                <select
                  value={selectedInvestment}
                  onChange={(e) => setSelectedInvestment(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/20 border border-green-500/30 rounded text-white"
                >
                  {Object.entries(investmentTypes).map(([key, type]) => (
                    <option key={key} value={key} className="bg-gray-800">
                      {type.name} - {type.riskLevel} Risk
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Amount (${investmentTypes[selectedInvestment].minAmount.toLocaleString()} - ${investmentTypes[selectedInvestment].maxAmount.toLocaleString()})
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Investment amount"
                  min={investmentTypes[selectedInvestment].minAmount}
                  max={investmentTypes[selectedInvestment].maxAmount}
                  className="w-full px-3 py-2 bg-black/20 border border-green-500/30 rounded text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded border border-green-500/30">
                <p className="text-sm text-green-400">{investmentTypes[selectedInvestment].description}</p>
                <p className="text-sm text-white/70 mt-1">
                  Return: {investmentTypes[selectedInvestment].minReturn}% to {investmentTypes[selectedInvestment].maxReturn}% • 
                  Duration: {investmentTypes[selectedInvestment].duration}h
                </p>
                <p className="text-sm text-red-400 mt-1">⚠️ High risk of loss!</p>
              </div>

              <button
                onClick={handleInvestment}
                disabled={!investmentAmount || parseInt(investmentAmount) <= 0 || isProcessing}
                className="w-full py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded font-bold transition-colors"
              >
                {isProcessing ? "Processing..." : "Invest Now"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Investments */}
      {activeInvestments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-400" />
            Active Investments
          </h2>
          
          <div className="space-y-4">
            {activeInvestments.map((investment) => (
              <div key={investment.id} className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-blue-400">{investmentTypes[investment.type].name}</h3>
                    <p className="text-sm text-blue-400/70">
                      Expected: {investment.expectedReturn > 0 ? '+' : ''}{investment.expectedReturn.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-400">
                      ${investment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-400/70">
                      {getInvestmentTimeRemaining(investment.completesAt)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-white/60">Started</p>
                    <p className="text-sm text-green-400">{new Date(investment.startedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Completes</p>
                    <p className="text-sm text-yellow-400">{new Date(investment.completesAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-black/20 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, 
                            (Date.now() - new Date(investment.startedAt).getTime()) / 
                            (new Date(investment.completesAt).getTime() - new Date(investment.startedAt).getTime()) * 100
                          ))}%`
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => completeInvestment(investment.id)}
                    disabled={!canCollectInvestment(investment.completesAt)}
                    className="py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded font-bold text-sm transition-colors"
                  >
                    {canCollectInvestment(investment.completesAt) ? "Collect" : "Wait"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loan Services */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Landmark size={24} className="text-purple-400" />
          Loan Services
        </h2>
        
        {/* Loan Application */}
        <div className="mb-4">
          <button
            onClick={() => setShowLoanApplication(!showLoanApplication)}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-colors"
          >
            {showLoanApplication ? "Close Application" : "Apply for Loan"}
          </button>
        </div>

        {showLoanApplication && (
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl mb-4">
            <h3 className="text-lg font-bold text-purple-400 mb-4">Loan Application</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Loan Type</label>
                <select
                  value={selectedLoanType}
                  onChange={(e) => setSelectedLoanType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/20 border border-purple-500/30 rounded text-white"
                >
                  {Object.entries(loanTypes).map(([key, type]) => (
                    <option key={key} value={key} className="bg-gray-800">
                      {type.name} - {type.interestRate}% APR
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Amount (${loanTypes[selectedLoanType].minAmount.toLocaleString()} - ${loanTypes[selectedLoanType].maxAmount.toLocaleString()})
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Loan amount"
                  min={loanTypes[selectedLoanType].minAmount}
                  max={loanTypes[selectedLoanType].maxAmount}
                  className="w-full px-3 py-2 bg-black/20 border border-purple-500/30 rounded text-white"
                />
              </div>

              <div className="p-3 bg-black/20 rounded border border-purple-500/30">
                <p className="text-sm text-purple-400">{loanTypes[selectedLoanType].description}</p>
                <p className="text-sm text-white/70 mt-1">
                  Terms: {loanTypes[selectedLoanType].termDays} days • 
                  Origination Fee: {loanTypes[selectedLoanType].originationFee}%
                </p>
              </div>

              <button
                onClick={handleLoanApplication}
                disabled={!loanAmount || parseInt(loanAmount) <= 0}
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded font-bold transition-colors"
              >
                Apply for Loan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText size={24} className="text-orange-400" />
            Active Loans
          </h2>
          
          <div className="space-y-4">
            {activeLoans.map((loan: Loan) => (
              <div key={loan.id} className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-orange-400">{loanTypes[loan.type].name}</h3>
                    <p className="text-sm text-orange-400/70">
                      Due: {new Date(loan.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-400">
                      ${loan.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-orange-400/70">
                      Daily: ${loan.dailyPayment.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-white/60">Total Paid</p>
                    <p className="text-sm text-green-400">${loan.totalPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Late Payments</p>
                    <p className="text-sm text-red-400">{loan.latePayments}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={selectedLoanId === loan.id ? paymentAmount : ""}
                    onChange={(e) => {
                      setSelectedLoanId(loan.id);
                      setPaymentAmount(e.target.value);
                    }}
                    placeholder="Payment amount"
                    className="flex-1 px-3 py-2 bg-black/20 border border-orange-500/30 rounded text-white text-sm"
                  />
                  <button
                    onClick={handleLoanPayment}
                    disabled={!paymentAmount || parseInt(paymentAmount) <= 0 || selectedLoanId !== loan.id}
                    className="py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white rounded font-bold text-sm transition-colors"
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default BankView;