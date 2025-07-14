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
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

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
  difficulty: "easy" | "medium" | "hard";
  jackpotEnabled: boolean;
  jackpotAmount: number;
  requiredLevel: number;
  bonusRounds: boolean;
  theme: string;
  category: string;
  rules: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CasinoStats {
  totalGames: number;
  activeGames: number;
  totalRevenue: number;
  totalPayouts: number;
  activePlayersToday: number;
  mostPopularGame: string;
  jackpotTotal: number;
  profitMargin: number;
}

const CasinoManagement = () => {
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [stats, setStats] = useState<CasinoStats>({
    totalGames: 0,
    activeGames: 0,
    totalRevenue: 0,
    totalPayouts: 0,
    activePlayersToday: 0,
    mostPopularGame: "",
    jackpotTotal: 0,
    profitMargin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const gameTypes = [
    { value: "slots", label: "Slot Machines", icon: Star },
    { value: "blackjack", label: "Blackjack", icon: Spade },
    { value: "poker", label: "Poker", icon: Heart },
    { value: "roulette", label: "Roulette", icon: Target },
    { value: "baccarat", label: "Baccarat", icon: Coins },
    { value: "dice", label: "Dice Games", icon: Dice1 },
    { value: "wheel", label: "Wheel of Fortune", icon: Target },
    { value: "lottery", label: "Lottery", icon: Trophy },
    { value: "bingo", label: "Bingo", icon: PlayCircle },
  ];

  const difficulties = [
    { value: "easy", label: "Easy", color: "green" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "hard", label: "Hard", color: "red" },
  ];

  const mockGames: CasinoGame[] = [
    {
      id: "blackjack-classic",
      name: "Classic Blackjack",
      type: "blackjack",
      description: "Traditional 21 card game with dealer",
      minBet: 100,
      maxBet: 10000,
      houseEdge: 2.0,
      payoutRatio: 98.0,
      isActive: true,
      popularity: 92,
      totalPlayed: 8750,
      totalWinnings: 875000,
      totalLosses: 892000,
      difficulty: "medium",
      jackpotEnabled: false,
      jackpotAmount: 0,
      requiredLevel: 1,
      bonusRounds: false,
      theme: "Classic Casino",
      category: "Card Games",
      rules: "Get as close to 21 as possible without going over. Face cards = 10, Ace = 1 or 11",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T14:45:00Z",
    },
    {
      id: "european-roulette",
      name: "European Roulette",
      type: "roulette",
      description: "Single zero roulette with better odds",
      minBet: 50,
      maxBet: 25000,
      houseEdge: 2.7,
      payoutRatio: 97.3,
      isActive: true,
      popularity: 85,
      totalPlayed: 9850,
      totalWinnings: 492500,
      totalLosses: 506000,
      difficulty: "easy",
      jackpotEnabled: true,
      jackpotAmount: 875000,
      requiredLevel: 1,
      bonusRounds: false,
      theme: "European Casino",
      category: "Table Games",
      rules: "Bet on numbers, colors, or groups. Single zero gives house edge of 2.7%",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&h=150&fit=crop",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T12:15:00Z",
    },
    {
      id: "mega-slots",
      name: "Mega Fortune Slots",
      type: "slots",
      description: "Progressive jackpot slot machine",
      minBet: 10,
      maxBet: 1000,
      houseEdge: 5.0,
      payoutRatio: 95.0,
      isActive: true,
      popularity: 95,
      totalPlayed: 25420,
      totalWinnings: 1250000,
      totalLosses: 1315000,
      difficulty: "easy",
      jackpotEnabled: true,
      jackpotAmount: 2500000,
      requiredLevel: 1,
      bonusRounds: true,
      theme: "Fortune & Luck",
      category: "Slots",
      rules: "Match 3+ symbols on paylines. Special symbols trigger bonus rounds and jackpots",
      imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=150&h=150&fit=crop",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "texas-holdem",
      name: "Texas Hold'em Poker",
      type: "poker",
      description: "Professional poker tournament style",
      minBet: 500,
      maxBet: 50000,
      houseEdge: 1.5,
      payoutRatio: 98.5,
      isActive: true,
      popularity: 78,
      totalPlayed: 4300,
      totalWinnings: 2150000,
      totalLosses: 2180000,
      difficulty: "hard",
      jackpotEnabled: true,
      jackpotAmount: 1000000,
      requiredLevel: 5,
      bonusRounds: false,
      theme: "Wild West",
      category: "Card Games",
      rules: "Make the best 5-card hand using 2 hole cards and 5 community cards",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&h=150&fit=crop",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T16:20:00Z",
    },
    {
      id: "high-roller-baccarat",
      name: "High Roller Baccarat",
      type: "baccarat",
      description: "Elegant card game for VIP players",
      minBet: 1000,
      maxBet: 100000,
      houseEdge: 1.2,
      payoutRatio: 98.8,
      isActive: true,
      popularity: 65,
      totalPlayed: 1850,
      totalWinnings: 925000,
      totalLosses: 936000,
      difficulty: "hard",
      jackpotEnabled: false,
      jackpotAmount: 0,
      requiredLevel: 10,
      bonusRounds: false,
      theme: "Luxury Casino",
      category: "Card Games",
      rules: "Bet on Player, Banker, or Tie. Hand closest to 9 wins. Cards 10+ count as 0",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T18:30:00Z",
    },
    {
      id: "craps-table",
      name: "Craps",
      type: "dice",
      description: "Exciting dice game with multiple betting options",
      minBet: 25,
      maxBet: 5000,
      houseEdge: 1.4,
      payoutRatio: 98.6,
      isActive: true,
      popularity: 70,
      totalPlayed: 3200,
      totalWinnings: 160000,
      totalLosses: 162000,
      difficulty: "medium",
      jackpotEnabled: false,
      jackpotAmount: 0,
      requiredLevel: 3,
      bonusRounds: false,
      theme: "Las Vegas",
      category: "Dice Games",
      rules: "Bet on dice outcomes. Pass line bet has lowest house edge at 1.4%",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&h=150&fit=crop",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T20:15:00Z",
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
      toast.success('Casino games loaded successfully');
    } catch (error) {
      console.error("Error loading casino games:", error);
      toast.error('Failed to load casino games');
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
      const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalPayouts) / totalRevenue) * 100 : 0;

      setStats({
        totalGames,
        activeGames,
        totalRevenue,
        totalPayouts,
        activePlayersToday: 127,
        mostPopularGame: mostPopularGame?.name || "N/A",
        jackpotTotal,
        profitMargin,
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
        difficulty: gameData.difficulty || "easy",
        jackpotEnabled: gameData.jackpotEnabled ?? false,
        jackpotAmount: gameData.jackpotAmount || 0,
        requiredLevel: gameData.requiredLevel || 1,
        bonusRounds: gameData.bonusRounds ?? false,
        theme: gameData.theme || "Classic",
        category: gameData.category || "Casino",
        rules: gameData.rules || "",
        imageUrl: gameData.imageUrl || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGames([...games, newGame]);
      setIsAddModalOpen(false);
      loadStats();
      toast.success("Casino game added successfully");
    } catch (error) {
      console.error("Error adding game:", error);
      toast.error("Failed to add casino game");
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
      toast.success("Casino game updated successfully");
    } catch (error) {
      console.error("Error updating game:", error);
      toast.error("Failed to update casino game");
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this casino game? This action cannot be undone.")) return;

    try {
      setGames(games.filter(g => g.id !== gameId));
      loadStats();
      toast.success("Casino game deleted successfully");
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete casino game");
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
      toast.success(`Game ${updatedGame.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error toggling game status:", error);
      toast.error("Failed to update game status");
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || game.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || game.difficulty === selectedDifficulty;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getGameIcon = (type: string) => {
    const iconMap = {
      slots: Star,
      blackjack: Spade,
      poker: Heart,
      roulette: Target,
      baccarat: Coins,
      dice: Dice1,
      wheel: Target,
      lottery: Trophy,
      bingo: PlayCircle,
    };
    return iconMap[type as keyof typeof iconMap] || Gamepad2;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "text-green-600 bg-green-100",
      medium: "text-yellow-600 bg-yellow-100",
      hard: "text-red-600 bg-red-100",
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

  const statCards = [
    {
      title: "Total Games",
      value: stats.totalGames,
      icon: Gamepad2,
      color: "blue",
      trend: `${stats.activeGames} active`,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "green",
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
      title: "Profit Margin",
      value: `${stats.profitMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: "purple",
      trend: "House advantage",
    },
    {
      title: "Players Today",
      value: stats.activePlayersToday,
      icon: Users,
      color: "indigo",
      trend: "+12% from yesterday",
    },
    {
      title: "Total Jackpots",
      value: formatCurrency(stats.jackpotTotal),
      icon: Trophy,
      color: "red",
      trend: "Available prizes",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading casino games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  card.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                  card.color === 'green' ? 'bg-green-100 text-green-600' :
                  card.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  card.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                  card.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                  <p className="text-gray-600 font-medium">{card.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{card.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Casino Games</h2>
          <p className="text-gray-600">Manage casino games and their settings</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Game
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search casino games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="all">All Types</option>
            {gameTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="all">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Game</th>
                <th className="text-left p-4 font-medium text-gray-900">Type</th>
                <th className="text-left p-4 font-medium text-gray-900">Difficulty</th>
                <th className="text-left p-4 font-medium text-gray-900">Betting Range</th>
                <th className="text-left p-4 font-medium text-gray-900">House Edge</th>
                <th className="text-left p-4 font-medium text-gray-900">Popularity</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGames.map((game) => {
                const GameIcon = getGameIcon(game.type);
                return (
                  <tr key={game.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <GameIcon size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{game.name}</div>
                          <div className="text-sm text-gray-500">{game.description}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {game.type}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-medium">{game.minBet} - {game.maxBet}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-gray-900">{game.houseEdge}%</span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${game.popularity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{game.popularity}%</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(game.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {game.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedGame(game);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
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
      </div>

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
    requiredLevel: initialData?.requiredLevel || 1,
    bonusRounds: initialData?.bonusRounds ?? false,
    theme: initialData?.theme || "Classic",
    category: initialData?.category || "Casino",
    rules: initialData?.rules || "",
    imageUrl: initialData?.imageUrl || "",
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            {initialData ? "Edit Casino Game" : "Add New Casino Game"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {gameTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Bet ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minBet}
                onChange={(e) => handleInputChange("minBet", parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Bet ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.maxBet}
                onChange={(e) => handleInputChange("maxBet", parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">House Edge (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.houseEdge}
                onChange={(e) => handleInputChange("houseEdge", parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange("difficulty", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Level</label>
              <input
                type="number"
                min="1"
                value={formData.requiredLevel}
                onChange={(e) => handleInputChange("requiredLevel", parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => handleInputChange("theme", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
              <textarea
                value={formData.rules}
                onChange={(e) => handleInputChange("rules", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.jackpotEnabled}
                    onChange={(e) => handleInputChange("jackpotEnabled", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Jackpot</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.bonusRounds}
                    onChange={(e) => handleInputChange("bonusRounds", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Bonus Rounds</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>

            {formData.jackpotEnabled && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jackpot Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.jackpotAmount}
                  onChange={(e) => handleInputChange("jackpotAmount", parseFloat(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {initialData ? "Update" : "Add"} Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CasinoManagement;