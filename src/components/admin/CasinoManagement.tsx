import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Dice1,
  Spade,
  Heart,
  TrendingUp,
  Users,
  Star,
  Clock,
  Trophy,
  X,
  Target,
  Gamepad2,
  Coins,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CasinoGame {
  id: string;
  name: string;
  type: "slots" | "blackjack" | "poker" | "roulette" | "baccarat" | "dice" | "wheel" | "lottery" | "bingo";
  description: string;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  payoutRatio: number;
  isActive: boolean;
  popularity: number;
  totalPlayed: number;
  totalWinnings: number;
  totalLosses: number;
  averageSessionTime: number;
  lastPlayed: string;
  imageUrl?: string;
  rules: string;
  difficulty: "easy" | "medium" | "hard";
  jackpotEnabled: boolean;
  jackpotAmount: number;
  maxPlayers: number;
  requiredLevel: number;
  specialEvents: string[];
  bonusRounds: boolean;
  autoPlay: boolean;
  soundEnabled: boolean;
  animations: boolean;
  theme: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CasinoStats {
  totalGames: number;
  activeGames: number;
  totalRevenue: number;
  totalPayouts: number;
  activePlayersToday: number;
  averageSessionTime: number;
  mostPopularGame: string;
  jackpotTotal: number;
}

const CasinoManagement = () => {
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [stats, setStats] = useState<CasinoStats>({
    totalGames: 0,
    activeGames: 0,
    totalRevenue: 0,
    totalPayouts: 0,
    activePlayersToday: 0,
    averageSessionTime: 0,
    mostPopularGame: "",
    jackpotTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showInactive, setShowInactive] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const gameTypes = [
    { value: "slots", label: "Slot Machines", icon: Star },
    { value: "blackjack", label: "Blackjack", icon: Spade },
    { value: "poker", label: "Poker", icon: Heart },
    { value: "roulette", label: "Roulette", icon: Target },
    { value: "baccarat", label: "Baccarat", icon: Coins },
    { value: "dice", label: "Dice Games", icon: Dice1 },
    { value: "wheel", label: "Wheel of Fortune", icon: RefreshCw },
    { value: "lottery", label: "Lottery", icon: Trophy },
    { value: "bingo", label: "Bingo", icon: Grid },
  ];

  const difficulties = [
    { value: "easy", label: "Easy", color: "green" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "hard", label: "Hard", color: "red" },
  ];

  const mockGames: CasinoGame[] = [
    {
      id: "blackjack",
      name: "Blackjack",
      type: "blackjack",
      description: "Classic card game with strategy and skill",
      minBet: 100,
      maxBet: 10000,
      houseEdge: 2.0,
      payoutRatio: 98.0,
      isActive: true,
      popularity: 92,
      totalPlayed: 8750,
      totalWinnings: 875000,
      totalLosses: 880000,
      averageSessionTime: 1800,
      lastPlayed: "2024-01-15T14:45:00Z",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      rules: "Get as close to 21 as possible without going over. Dealer must hit on 16 and stand on 17.",
      difficulty: "medium",
      jackpotEnabled: false,
      jackpotAmount: 0,
      maxPlayers: 1,
      requiredLevel: 1,
      specialEvents: ["VIP Tournament", "Double Down Monday"],
      bonusRounds: false,
      autoPlay: false,
      soundEnabled: true,
      animations: true,
      theme: "Classic Casino",
      category: "Card Games",
      tags: ["strategy", "skill", "medium-stakes"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T14:45:00Z",
    },
    {
      id: "roulette",
      name: "Roulette",
      type: "roulette",
      description: "Spin the wheel for big wins and excitement",
      minBet: 50,
      maxBet: 25000,
      houseEdge: 2.7,
      payoutRatio: 97.3,
      isActive: true,
      popularity: 85,
      totalPlayed: 9850,
      totalWinnings: 492500,
      totalLosses: 505000,
      averageSessionTime: 900,
      lastPlayed: "2024-01-15T12:15:00Z",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&h=150&fit=crop",
      rules: "Place bets on numbers, colors, or groups. Single zero gives better odds than American roulette.",
      difficulty: "easy",
      jackpotEnabled: true,
      jackpotAmount: 875000,
      maxPlayers: 1,
      requiredLevel: 1,
      specialEvents: ["Lucky Number", "Color Rush"],
      bonusRounds: false,
      autoPlay: false,
      soundEnabled: true,
      animations: true,
      theme: "European Casino",
      category: "Table Games",
      tags: ["classic", "luck", "high-payout"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T12:15:00Z",
    },
    {
      id: "slots",
      name: "Slots",
      type: "slots",
      description: "Easy to play, chance to win massive jackpots",
      minBet: 10,
      maxBet: 1000,
      houseEdge: 5.0,
      payoutRatio: 95.0,
      isActive: true,
      popularity: 95,
      totalPlayed: 25420,
      totalWinnings: 1250000,
      totalLosses: 1315000,
      averageSessionTime: 450,
      lastPlayed: "2024-01-15T10:30:00Z",
      imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop",
      rules: "Match symbols on paylines to win. Special combinations trigger jackpots and bonus rounds.",
      difficulty: "easy",
      jackpotEnabled: true,
      jackpotAmount: 1000000,
      maxPlayers: 1,
      requiredLevel: 1,
      specialEvents: ["Happy Hour", "Weekend Bonus", "Mega Jackpot"],
      bonusRounds: true,
      autoPlay: true,
      soundEnabled: true,
      animations: true,
      theme: "Classic Fruits",
      category: "Slots",
      tags: ["classic", "jackpot", "bonus", "easy"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "poker",
      name: "Poker",
      type: "poker",
      description: "High-stakes poker against other players",
      minBet: 500,
      maxBet: 50000,
      houseEdge: 1.5,
      payoutRatio: 98.5,
      isActive: true,
      popularity: 78,
      totalPlayed: 4300,
      totalWinnings: 2150000,
      totalLosses: 2185000,
      averageSessionTime: 2700,
      lastPlayed: "2024-01-15T16:20:00Z",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
      rules: "Make the best 5-card hand. Variable multipliers based on hand strength and skill.",
      difficulty: "hard",
      jackpotEnabled: true,
      jackpotAmount: 500000,
      maxPlayers: 1,
      requiredLevel: 1,
      specialEvents: ["Poker Night", "Royal Flush Bonus", "High Roller Tournament"],
      bonusRounds: false,
      autoPlay: false,
      soundEnabled: true,
      animations: true,
      theme: "Wild West",
      category: "Card Games",
      tags: ["multiplayer", "tournament", "strategy", "high-stakes"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T16:20:00Z",
    },
    {
      id: "baccarat",
      name: "Baccarat",
      type: "baccarat",
      description: "Elegant card game for high rollers",
      minBet: 1000,
      maxBet: 100000,
      houseEdge: 1.2,
      payoutRatio: 98.8,
      isActive: true,
      popularity: 65,
      totalPlayed: 1850,
      totalWinnings: 925000,
      totalLosses: 936000,
      averageSessionTime: 1500,
      lastPlayed: "2024-01-15T18:30:00Z",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      rules: "Bet on Player, Banker, or Tie. Closest to 9 wins. Banker bets have lowest house edge.",
      difficulty: "hard",
      jackpotEnabled: false,
      jackpotAmount: 0,
      maxPlayers: 1,
      requiredLevel: 1,
      specialEvents: ["VIP Baccarat", "High Roller Night"],
      bonusRounds: false,
      autoPlay: false,
      soundEnabled: true,
      animations: true,
      theme: "Luxury Casino",
      category: "Card Games",
      tags: ["elegant", "high-roller", "luxury", "low-edge"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T18:30:00Z",
    },
  ];

  useEffect(() => {
    loadGames();
    loadStats();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setGames(mockGames);
    } catch (error) {
      console.error("Error loading casino games:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const totalGames = mockGames.length;
      const activeGames = mockGames.filter(g => g.isActive).length;
      const totalRevenue = mockGames.reduce((sum, g) => sum + g.totalLosses, 0);
      const totalPayouts = mockGames.reduce((sum, g) => sum + g.totalWinnings, 0);
      const mostPopularGame = mockGames.reduce((max, g) => g.popularity > max.popularity ? g : max, mockGames[0]);
      const jackpotTotal = mockGames.reduce((sum, g) => sum + (g.jackpotEnabled ? g.jackpotAmount : 0), 0);

      setStats({
        totalGames,
        activeGames,
        totalRevenue,
        totalPayouts,
        activePlayersToday: 45,
        averageSessionTime: 1350,
        mostPopularGame: mostPopularGame?.name || "N/A",
        jackpotTotal,
      });
    } catch (error) {
      console.error("Error loading casino stats:", error);
    }
  };

  const handleAddGame = async (gameData: Partial<CasinoGame>) => {
    try {
      const newGame: CasinoGame = {
        id: Date.now().toString(),
        name: gameData.name || "",
        type: gameData.type || "slots",
        description: gameData.description || "",
        minBet: gameData.minBet || 1,
        maxBet: gameData.maxBet || 100,
        houseEdge: gameData.houseEdge || 5.0,
        payoutRatio: gameData.payoutRatio || 95.0,
        isActive: gameData.isActive ?? true,
        popularity: 0,
        totalPlayed: 0,
        totalWinnings: 0,
        totalLosses: 0,
        averageSessionTime: 0,
        lastPlayed: new Date().toISOString(),
        imageUrl: gameData.imageUrl || "",
        rules: gameData.rules || "",
        difficulty: gameData.difficulty || "easy",
        jackpotEnabled: gameData.jackpotEnabled ?? false,
        jackpotAmount: gameData.jackpotAmount || 0,
        maxPlayers: gameData.maxPlayers || 1,
        requiredLevel: gameData.requiredLevel || 1,
        specialEvents: gameData.specialEvents || [],
        bonusRounds: gameData.bonusRounds ?? false,
        autoPlay: gameData.autoPlay ?? false,
        soundEnabled: gameData.soundEnabled ?? true,
        animations: gameData.animations ?? true,
        theme: gameData.theme || "Classic",
        category: gameData.category || "Casino",
        tags: gameData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGames([...games, newGame]);
      setIsAddModalOpen(false);
      loadStats();
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  const handleEditGame = async (gameData: Partial<CasinoGame>) => {
    try {
      if (!selectedGame) return;

      const updatedGame = {
        ...selectedGame,
        ...gameData,
        updatedAt: new Date().toISOString(),
      };

      setGames(games.map(g => g.id === selectedGame.id ? updatedGame : g));
      setIsEditModalOpen(false);
      setSelectedGame(null);
      loadStats();
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      setGames(games.filter(g => g.id !== gameId));
      loadStats();
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleToggleActive = async (gameId: string) => {
    try {
      const game = games.find(g => g.id === gameId);
      if (!game) return;

      const updatedGame = {
        ...game,
        isActive: !game.isActive,
        updatedAt: new Date().toISOString(),
      };

      setGames(games.map(g => g.id === gameId ? updatedGame : g));
      loadStats();
    } catch (error) {
      console.error("Error toggling game status:", error);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || game.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || game.difficulty === selectedDifficulty;
    const matchesActive = showInactive || game.isActive;

    return matchesSearch && matchesType && matchesDifficulty && matchesActive;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    let aValue = a[sortBy as keyof CasinoGame];
    let bValue = b[sortBy as keyof CasinoGame];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedGames = sortedGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedGames.length / itemsPerPage);

  const getGameIcon = (type: string) => {
    const iconMap = {
      slots: Star,
      blackjack: Spade,
      poker: Heart,
      roulette: Target,
      baccarat: Coins,
      dice: Dice1,
      wheel: RefreshCw,
      lottery: Trophy,
      bingo: Grid,
    };
    return iconMap[type as keyof typeof iconMap] || Gamepad2;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "text-green-600 bg-green-50",
      medium: "text-yellow-600 bg-yellow-50",
      hard: "text-red-600 bg-red-50",
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const statCards = [
    {
      title: "Total Games",
      value: stats.totalGames,
      icon: Gamepad2,
      color: "blue",
      trend: "+2 this week",
    },
    {
      title: "Active Games",
      value: stats.activeGames,
      icon: PlayCircle,
      color: "green",
      trend: `${Math.round((stats.activeGames / stats.totalGames) * 100)}% active`,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "purple",
      trend: "+15% this month",
    },
    {
      title: "Total Payouts",
      value: formatCurrency(stats.totalPayouts),
      icon: Coins,
      color: "yellow",
      trend: `${Math.round((stats.totalPayouts / stats.totalRevenue) * 100)}% RTP`,
    },
    {
      title: "Players Today",
      value: stats.activePlayersToday,
      icon: Users,
      color: "indigo",
      trend: "+8% from yesterday",
    },
    {
      title: "Avg Session",
      value: formatTime(stats.averageSessionTime),
      icon: Clock,
      color: "red",
      trend: "+5 min today",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                  card.color === 'green' ? 'bg-green-50 text-green-600' :
                  card.color === 'purple' ? 'bg-purple-50 text-blue-600' :
                  card.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                  card.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  'bg-red-50 text-red-600'}`}>
                  <Icon size={24} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-gray-600 font-medium mb-2">{card.title}</p>
                <p className="text-sm text-green-600">{card.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">All Types</option>
              {gameTypes.map(type => (
                <option key={type.value} value={type.value} className="text-gray-900">{type.label}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all" className="text-gray-900">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value} className="text-gray-900">{diff.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="name" className="text-gray-900">Sort by Name</option>
              <option value="popularity" className="text-gray-900">Sort by Popularity</option>
              <option value="totalPlayed" className="text-gray-900">Sort by Total Played</option>
              <option value="houseEdge" className="text-gray-900">Sort by House Edge</option>
              <option value="updatedAt" className="text-gray-900">Sort by Last Updated</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show inactive</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-purple-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-purple-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid size={20} />
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Game
            </button>
          </div>
        </div>
      </div>

      {/* Games List/Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Betting Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House Edge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedGames.map((game) => {
                  const GameIcon = getGameIcon(game.type);
                  return (
                    <tr key={game.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <GameIcon size={20} className="text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{game.name}</div>
                            <div className="text-sm text-gray-500">{game.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {game.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                          {game.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${game.minBet} - ${game.maxBet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {game.houseEdge}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${game.popularity}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{game.popularity}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(game.id)}
                          className="flex items-center gap-1 text-sm font-medium"
                        >
                          {game.isActive ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-600">Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedGame(game);
                              setIsEditModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-purple-900 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {paginatedGames.map((game) => {
              const GameIcon = getGameIcon(game.type);
              return (
                <div key={game.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <GameIcon size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                        <p className="text-sm text-gray-500">{game.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(game.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          game.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {game.isActive ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGame(game);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-purple-100 text-blue-600 hover:bg-purple-200 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Betting Range</p>
                      <p className="text-sm font-medium">${game.minBet} - ${game.maxBet}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">House Edge</p>
                      <p className="text-sm font-medium">{game.houseEdge}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Popularity</p>
                      <p className="text-sm font-medium">{game.popularity}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Played</p>
                      <p className="text-sm font-medium">{formatNumber(game.totalPlayed)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                    {game.jackpotEnabled && (
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Trophy size={14} />
                        <span>{formatCurrency(game.jackpotAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-3">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedGames.length)} of {sortedGames.length} games
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-purple-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Game Modal */}
      {isAddModalOpen && (
        <GameModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddGame}
          gameTypes={gameTypes}
          difficulties={difficulties}
        />
      )}

      {/* Edit Game Modal */}
      {isEditModalOpen && selectedGame && (
        <GameModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGame(null);
          }}
          onSave={handleEditGame}
          gameTypes={gameTypes}
          difficulties={difficulties}
          initialData={selectedGame}
        />
      )}
    </div>
  );
};

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CasinoGame>) => void;
  gameTypes: { value: string; label: string; icon: any }[];
  difficulties: { value: string; label: string; color: string }[];
  initialData?: CasinoGame;
}

const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  onSave,
  gameTypes,
  difficulties,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<CasinoGame>>({
    name: initialData?.name || "",
    type: initialData?.type || "slots",
    description: initialData?.description || "",
    minBet: initialData?.minBet || 1,
    maxBet: initialData?.maxBet || 100,
    houseEdge: initialData?.houseEdge || 5.0,
    payoutRatio: initialData?.payoutRatio || 95.0,
    isActive: initialData?.isActive ?? true,
    difficulty: initialData?.difficulty || "easy",
    jackpotEnabled: initialData?.jackpotEnabled ?? false,
    jackpotAmount: initialData?.jackpotAmount || 0,
    maxPlayers: initialData?.maxPlayers || 1,
    requiredLevel: initialData?.requiredLevel || 1,
    bonusRounds: initialData?.bonusRounds ?? false,
    autoPlay: initialData?.autoPlay ?? false,
    soundEnabled: initialData?.soundEnabled ?? true,
    animations: initialData?.animations ?? true,
    theme: initialData?.theme || "Classic",
    category: initialData?.category || "Casino",
    rules: initialData?.rules || "",
    imageUrl: initialData?.imageUrl || "",
    specialEvents: initialData?.specialEvents || [],
    tags: initialData?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Game" : "Add New Game"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  required
                >
                  {gameTypes.map(type => (
                    <option key={type.value} value={type.value} className="text-gray-900">{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange("difficulty", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value} className="text-gray-900">{diff.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Rules
                </label>
                <textarea
                  value={formData.rules}
                  onChange={(e) => handleInputChange("rules", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Game Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Game Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Bet ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minBet}
                    onChange={(e) => handleInputChange("minBet", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Bet ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxBet}
                    onChange={(e) => handleInputChange("maxBet", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Edge (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.houseEdge}
                    onChange={(e) => handleInputChange("houseEdge", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payout Ratio (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.payoutRatio}
                    onChange={(e) => handleInputChange("payoutRatio", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Players
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxPlayers}
                    onChange={(e) => handleInputChange("maxPlayers", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.requiredLevel}
                    onChange={(e) => handleInputChange("requiredLevel", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Jackpot Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="jackpotEnabled"
                    checked={formData.jackpotEnabled}
                    onChange={(e) => handleInputChange("jackpotEnabled", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="jackpotEnabled" className="text-sm font-medium text-gray-700">
                    Enable Jackpot
                  </label>
                </div>

                {formData.jackpotEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jackpot Amount ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.jackpotAmount}
                      onChange={(e) => handleInputChange("jackpotAmount", parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                )}
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Features</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="bonusRounds"
                      checked={formData.bonusRounds}
                      onChange={(e) => handleInputChange("bonusRounds", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="bonusRounds" className="text-sm text-gray-700">
                      Bonus Rounds
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoPlay"
                      checked={formData.autoPlay}
                      onChange={(e) => handleInputChange("autoPlay", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="autoPlay" className="text-sm text-gray-700">
                      Auto Play
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="soundEnabled"
                      checked={formData.soundEnabled}
                      onChange={(e) => handleInputChange("soundEnabled", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="soundEnabled" className="text-sm text-gray-700">
                      Sound Effects
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="animations"
                      checked={formData.animations}
                      onChange={(e) => handleInputChange("animations", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="animations" className="text-sm text-gray-700">
                      Animations
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange("isActive", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initialData ? "Update Game" : "Add Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CasinoManagement;