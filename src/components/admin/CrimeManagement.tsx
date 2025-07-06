import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  Star,
  Lock,
  Eye,
  Database,
  Upload,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Crime {
  id: string;
  name: string;
  description: string;
  type: string;
  min_level: number;
  energy_cost: number;
  reward: number; // This maps to base_reward in UI
  risk: number; // This maps to risk_level in UI
  created_at: string;
  // Extended fields for admin UI
  power_required?: number;
  base_reward?: number;
  max_reward?: number;
  health_cost?: number;
  risk_level?: number;
  success_rate?: number;
  image_url?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Very Hard" | "Extreme";
  isActive?: boolean;
}

const CrimeManagement = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load crimes from database
  useEffect(() => {
    loadCrimes();
  }, []);

  const loadCrimes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crimes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading crimes:', error);
        toast.error('Failed to load crimes');
        // Fallback to mock data
        setCrimes([
    {
      id: "1",
      name: "Convenience Store",
      description: "Quick and easy target with minimal security",
      type: "store",
      min_level: 1,
      power_required: 10,
      base_reward: 25,
      max_reward: 75,
      energy_cost: 5,
      health_cost: 0,
      risk_level: 1,
      success_rate: 90,
      image_url: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center",
      difficulty: "Easy",
      isActive: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Gas Station",
      description: "Small heist with decent cash flow",
      type: "store",
      min_level: 2,
      power_required: 25,
      base_reward: 40,
      max_reward: 100,
      energy_cost: 8,
      health_cost: 0,
      risk_level: 2,
      success_rate: 90,
      image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      difficulty: "Easy",
      isActive: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Jewelry Store",
      description: "High-value target with alarm systems",
      type: "jewelry",
      min_level: 3,
      power_required: 50,
      base_reward: 75,
      max_reward: 200,
      energy_cost: 12,
      health_cost: 5,
      risk_level: 3,
      success_rate: 70,
      image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center",
      difficulty: "Medium",
      isActive: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Bank Branch",
      description: "Major heist with heavy security and high rewards",
      type: "bank",
      min_level: 10,
      power_required: 350,
      base_reward: 400,
      max_reward: 1000,
      energy_cost: 25,
      health_cost: 15,
      risk_level: 8,
      success_rate: 25,
      image_url: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&h=300&fit=crop&crop=center",
      difficulty: "Very Hard",
      isActive: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Federal Reserve",
      description: "Ultimate heist with maximum risk and reward",
      type: "bank",
      min_level: 20,
      power_required: 1200,
      base_reward: 1000,
      max_reward: 5000,
      energy_cost: 40,
      health_cost: 25,
      risk_level: 10,
      success_rate: 10,
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=center",
      difficulty: "Extreme",
      isActive: true,
      created_at: new Date().toISOString(),
    }]);
      } else {
        // Map database fields to our interface
        const mappedCrimes = (data || []).map(crime => ({
          ...crime,
          power_required: crime.risk * 20, // Calculate from risk
          base_reward: crime.reward,
          max_reward: crime.reward * 2,
          health_cost: 0,
          risk_level: crime.risk,
          success_rate: Math.max(10, 100 - (crime.risk * 8)),
          image_url: `https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center`,
          difficulty: crime.risk <= 2 ? 'Easy' : crime.risk <= 4 ? 'Medium' : crime.risk <= 6 ? 'Hard' : crime.risk <= 8 ? 'Very Hard' : 'Extreme',
          isActive: true
        }));
        setCrimes(mappedCrimes);
      }
    } catch (error) {
      console.error('Error loading crimes:', error);
      toast.error('Failed to load crimes');
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrime, setEditingCrime] = useState<Crime | null>(null);
  const [stats, setStats] = useState({
    totalCrimes: 0,
    activeCrimes: 0,
    totalAttempts: 0,
    averageSuccess: 0,
    totalRewards: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [crimes]);

  const calculateStats = () => {
    const totalCrimes = crimes.length;
    const activeCrimes = crimes.filter(c => c.isActive).length;
    const totalRewards = crimes.reduce((sum, c) => sum + c.max_reward, 0);
    const averageSuccess = crimes.reduce((sum, c) => sum + c.success_rate, 0) / totalCrimes;

    setStats({
      totalCrimes,
      activeCrimes,
      totalAttempts: 2156, // Mock data
      averageSuccess: averageSuccess || 0,
      totalRewards,
    });
  };

  const addCrime = async (newCrime: Omit<Crime, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('crimes')
        .insert([{
          name: newCrime.name,
          description: newCrime.description,
          type: newCrime.type,
          min_level: newCrime.min_level,
          energy_cost: newCrime.energy_cost,
          reward: newCrime.base_reward || newCrime.reward || 100,
          risk: newCrime.risk_level || newCrime.risk || 5
        }])
        .select();

      if (error) {
        console.error('Error adding crime:', error);
        toast.error('Failed to add crime');
        return;
      }

      await loadCrimes();
      toast.success("Crime added successfully");
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding crime:', error);
      toast.error('Failed to add crime');
    }
  };

  const updateCrime = async (id: string, updates: Partial<Crime>) => {
    try {
      const { error } = await supabase
        .from('crimes')
        .update({
          name: updates.name,
          description: updates.description,
          type: updates.type,
          min_level: updates.min_level,
          energy_cost: updates.energy_cost,
          reward: updates.base_reward || updates.reward,
          risk: updates.risk_level || updates.risk
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating crime:', error);
        toast.error('Failed to update crime');
        return;
      }

      await loadCrimes();
      toast.success("Crime updated successfully");
      setEditingCrime(null);
    } catch (error) {
      console.error('Error updating crime:', error);
      toast.error('Failed to update crime');
    }
  };

  const deleteCrime = async (id: string) => {
    if (!confirm("Are you sure you want to delete this crime?")) return;
    
    try {
      const { error } = await supabase
        .from('crimes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting crime:', error);
        toast.error('Failed to delete crime');
        return;
      }

      await loadCrimes();
      toast.success("Crime deleted successfully");
    } catch (error) {
      console.error('Error deleting crime:', error);
      toast.error('Failed to delete crime');
    }
  };

  const toggleCrimeStatus = (id: string) => {
    const crime = crimes.find(c => c.id === id);
    if (crime) {
      updateCrime(id, { isActive: !crime.isActive });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-100 text-green-800 border-green-300",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Hard: "bg-orange-100 text-orange-800 border-orange-300",
      "Very Hard": "bg-red-100 text-red-800 border-red-300",
      Extreme: "bg-purple-100 text-purple-800 border-purple-300"
    };
    return colors[difficulty as keyof typeof colors] || colors.Easy;
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return "text-green-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const CrimeForm = ({ crime, onSubmit, onCancel }: {
    crime?: Crime;
    onSubmit: (crime: Omit<Crime, "id" | "created_at">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: crime?.name || "",
      description: crime?.description || "",
      type: crime?.type || "store",
      min_level: crime?.min_level || 1,
      power_required: crime?.power_required || crime?.risk * 20 || 10,
      base_reward: crime?.base_reward || crime?.reward || 25,
      max_reward: crime?.max_reward || (crime?.reward || 25) * 2,
      energy_cost: crime?.energy_cost || 5,
      health_cost: crime?.health_cost || 0,
      risk_level: crime?.risk_level || crime?.risk || 1,
      success_rate: crime?.success_rate || Math.max(10, 100 - ((crime?.risk || 1) * 8)),
      image_url: crime?.image_url || "",
      difficulty: crime?.difficulty || (crime?.risk <= 2 ? 'Easy' : crime?.risk <= 4 ? 'Medium' : crime?.risk <= 6 ? 'Hard' : crime?.risk <= 8 ? 'Very Hard' : 'Extreme') || "Easy",
      isActive: crime?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {crime ? "Edit Crime" : "Add New Crime"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as Crime["type"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="store">Store</option>
                  <option value="bank">Bank</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="mansion">Mansion</option>
                  <option value="casino">Casino</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Level</label>
                <input
                  type="number"
                  value={formData.min_level}
                  onChange={(e) => setFormData({...formData, min_level: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Power Required</label>
                <input
                  type="number"
                  value={formData.power_required}
                  onChange={(e) => setFormData({...formData, power_required: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value as Crime["difficulty"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Very Hard">Very Hard</option>
                  <option value="Extreme">Extreme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Reward ($)</label>
                <input
                  type="number"
                  value={formData.base_reward}
                  onChange={(e) => setFormData({...formData, base_reward: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Reward ($)</label>
                <input
                  type="number"
                  value={formData.max_reward}
                  onChange={(e) => setFormData({...formData, max_reward: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Success Rate (%)</label>
                <input
                  type="number"
                  value={formData.success_rate}
                  onChange={(e) => setFormData({...formData, success_rate: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy Cost</label>
                <input
                  type="number"
                  value={formData.energy_cost}
                  onChange={(e) => setFormData({...formData, energy_cost: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Cost</label>
                <input
                  type="number"
                  value={formData.health_cost}
                  onChange={(e) => setFormData({...formData, health_cost: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level (1-10)</label>
                <input
                  type="number"
                  value={formData.risk_level}
                  onChange={(e) => setFormData({...formData, risk_level: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Crime Image</label>
                <div className="space-y-3">
                  {/* Current Image Preview */}
                  {formData.image_url && (
                    <div className="relative">
                      <img 
                        src={formData.image_url} 
                        alt="Crime preview" 
                        className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=100&fit=crop&crop=center`;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image_url: ""})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  {/* Image Upload Options */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        placeholder="https://example.com/image.jpg or paste image URL"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            // For now, we'll use a placeholder URL
                            // In production, you'd upload to Supabase Storage
                            const imageUrl = `https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center`;
                            setFormData({...formData, image_url: imageUrl});
                            toast.info(`Image selected: ${file.name}. In production, this would upload to storage.`);
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload size={16} />
                      Upload
                    </button>
                  </div>
                  
                  {/* Quick Image Options */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Store', url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&crop=center' },
                      { name: 'Bank', url: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&h=300&fit=crop&crop=center' },
                      { name: 'Jewelry', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center' },
                      { name: 'Casino', url: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop&crop=center' }
                    ].map(img => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setFormData({...formData, image_url: img.url})}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {crime ? "Update" : "Add"} Crime
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading crimes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Target className="text-red-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalCrimes}</h3>
              <p className="text-gray-600 font-medium">Total Crimes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeCrimes}</h3>
              <p className="text-gray-600 font-medium">Active Crimes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalAttempts.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Total Attempts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{Math.round(stats.averageSuccess)}%</h3>
              <p className="text-gray-600 font-medium">Avg Success Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${stats.totalRewards.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Max Rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Crime Types</h2>
          <p className="text-gray-600">Manage available crimes and their properties</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Crime
        </button>
      </div>

      {/* Crimes Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Crime</th>
                <th className="text-left p-4 font-medium text-gray-900">Difficulty</th>
                <th className="text-left p-4 font-medium text-gray-900">Level Req</th>
                <th className="text-left p-4 font-medium text-gray-900">Power Req</th>
                <th className="text-left p-4 font-medium text-gray-900">Rewards</th>
                <th className="text-left p-4 font-medium text-gray-900">Success Rate</th>
                <th className="text-left p-4 font-medium text-gray-900">Costs</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {crimes.map((crime) => (
                <tr key={crime.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {crime.image_url && (
                        <img 
                          src={crime.image_url} 
                          alt={crime.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=80&h=80&fit=crop&crop=center`;
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{crime.name}</div>
                        <div className="text-sm text-gray-500">{crime.description}</div>
                        <div className="text-xs text-gray-400 mt-1 capitalize">{crime.type}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(crime.difficulty || (crime.risk <= 2 ? 'Easy' : crime.risk <= 4 ? 'Medium' : crime.risk <= 6 ? 'Hard' : crime.risk <= 8 ? 'Very Hard' : 'Extreme'))}`}>
                      {crime.difficulty || (crime.risk <= 2 ? 'Easy' : crime.risk <= 4 ? 'Medium' : crime.risk <= 6 ? 'Hard' : crime.risk <= 8 ? 'Very Hard' : 'Extreme')}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Lock size={14} className="text-gray-400" />
                      <span className="font-medium">{crime.min_level}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Shield size={14} className="text-blue-500" />
                      <span className="font-medium">{crime.power_required || crime.risk * 20}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span>${crime.base_reward || crime.reward} - ${crime.max_reward || (crime.reward * 2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Risk: {crime.risk_level || crime.risk}/10</div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`font-medium ${getSuccessRateColor(crime.success_rate || Math.max(10, 100 - (crime.risk * 8)))}`}>
                      {crime.success_rate || Math.max(10, 100 - (crime.risk * 8))}%
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="text-sm space-y-1">
                      {(crime.energy_cost || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap size={12} className="text-blue-500" />
                          <span>{crime.energy_cost || 5} Energy</span>
                        </div>
                      )}
                      {(crime.health_cost || 0) > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={12} className="text-red-500" />
                          <span>{crime.health_cost} Health</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleCrimeStatus(crime.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        crime.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {crime.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingCrime(crime)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteCrime(crime.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Crime Modal */}
      {showAddModal && (
        <CrimeForm
          onSubmit={addCrime}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Crime Modal */}
      {editingCrime && (
        <CrimeForm
          crime={editingCrime}
          onSubmit={(updatedCrime) => updateCrime(editingCrime.id, updatedCrime)}
          onCancel={() => setEditingCrime(null)}
        />
      )}
    </div>
  );
};

export default CrimeManagement;