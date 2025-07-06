import React, { useEffect, useState } from "react";
import { 
  Users, 
  ShoppingCart, 
  Building2, 
  Target, 
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalPlayers: number;
  totalItems: number;
  totalBusinesses: number;
  totalCrimes: number;
  totalRevenue: number;
  activeToday: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPlayers: 0,
    totalItems: 0,
    totalBusinesses: 0,
    totalCrimes: 0,
    totalRevenue: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get player count
      const { count: playerCount } = await supabase
        .from("players")
        .select("*", { count: "exact", head: true });

      // Get total revenue (sum of all player money)
      const { data: revenueData } = await supabase
        .from("players")
        .select("money")
        .not("money", "is", null);

      const totalRevenue = revenueData?.reduce((sum, player) => sum + (player.money || 0), 0) || 0;

      // Get active players today (updated today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: activeCount } = await supabase
        .from("players")
        .select("*", { count: "exact", head: true })
        .gte("updated_at", today.toISOString());

      setStats({
        totalPlayers: playerCount || 0,
        totalItems: 45, // Mock data for now
        totalBusinesses: 5,
        totalCrimes: 10,
        totalRevenue,
        activeToday: activeCount || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Players",
      value: stats.totalPlayers.toLocaleString(),
      icon: Users,
      color: "blue",
      trend: "+12% this week"
    },
    {
      title: "Shop Items",
      value: stats.totalItems.toLocaleString(),
      icon: ShoppingCart,
      color: "green",
      trend: "+5 new items"
    },
    {
      title: "Business Types",
      value: stats.totalBusinesses.toLocaleString(),
      icon: Building2,
      color: "purple",
      trend: "2 pending review"
    },
    {
      title: "Crime Types",
      value: stats.totalCrimes.toLocaleString(),
      icon: Target,
      color: "red",
      trend: "All active"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "yellow",
      trend: "+8% this month"
    },
    {
      title: "Active Today",
      value: stats.activeToday.toLocaleString(),
      icon: Activity,
      color: "indigo",
      trend: `${Math.round((stats.activeToday / stats.totalPlayers) * 100)}% of total`
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-blue-600 border-purple-200",
      red: "bg-red-50 text-red-600 border-red-200",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Urban Hustle Admin Panel</h1>
        <p className="opacity-90">
          Manage your game content, monitor player activity, and maintain the urban empire.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(card.color)}`}>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-blue-600" />
                <div>
                  <div className="font-medium">Add New Player</div>
                  <div className="text-sm text-gray-500">Create a new player account</div>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-green-600" />
                <div>
                  <div className="font-medium">Add Shop Item</div>
                  <div className="text-sm text-gray-500">Create new inventory item</div>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-red-600" />
                <div>
                  <div className="font-medium">Add Crime Type</div>
                  <div className="text-sm text-gray-500">Define new criminal activity</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Realtime</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Storage</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-600">85% Used</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backup</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Last: 2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <AlertCircle size={16} className="text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">New player registered: Player_123</div>
              <div className="text-sm text-gray-500">2 minutes ago</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <AlertCircle size={16} className="text-green-600" />
            <div className="flex-1">
              <div className="font-medium">Shop item "AK-47" purchased</div>
              <div className="text-sm text-gray-500">5 minutes ago</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <AlertCircle size={16} className="text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">Business "Nightclub" upgraded to level 3</div>
              <div className="text-sm text-gray-500">12 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;