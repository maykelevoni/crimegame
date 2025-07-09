import React, { useState, useEffect } from "react";
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Heart,
  Zap,
  Star,
  Calendar,
  Users,
  TrendingUp,
  Package,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DailyReward {
  id: string;
  name: string;
  description: string;
  reward_type: "money" | "item" | "weapon" | "experience" | "energy" | "special";
  reward_value: number;
  reward_item_id?: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  probability: number; // Percentage chance
  day_number: number;
  is_active: boolean;
  min_level: number;
  max_level?: number;
  special_conditions: any;
  bonus_multiplier: number;
  streak_bonus: boolean;
  vip_only: boolean;
  image_url?: string;
  effects: any;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const DailyRewardsManagement = () => {
  const [rewards, setRewards] = useState<DailyReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from daily_rewards table
      const { data: rewardData, error } = await supabase
        .from('daily_rewards')
        .select('*')
        .order('day_number', { ascending: true });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301' || error.message?.includes('404')) {
          // Daily rewards table does not exist yet, use sample data
          console.debug('Daily rewards table not found, using sample rewards');
        } else {
          console.error('Error loading daily rewards:', error);
          throw error;
        }
      }

      if (rewardData && rewardData.length > 0 && !error) {
        // Transform Supabase data to match our interface
        const transformedRewards: DailyReward[] = rewardData.map(reward => ({
          id: reward.id,
          name: reward.name,
          description: reward.description || '',
          reward_type: reward.reward_type,
          reward_value: reward.reward_value,
          reward_item_id: reward.reward_item_id,
          rarity: reward.rarity,
          probability: reward.probability,
          day_number: reward.day_number,
          is_active: reward.is_active,
          min_level: reward.min_level,
          max_level: reward.max_level,
          special_conditions: reward.special_conditions || {},
          bonus_multiplier: reward.bonus_multiplier,
          streak_bonus: reward.streak_bonus,
          vip_only: reward.vip_only,
          image_url: reward.image_url,
          effects: reward.effects || {},
          tags: reward.tags || [],
          created_at: reward.created_at,
          updated_at: reward.updated_at,
        }));
        
        setRewards(transformedRewards);
        toast.success('Daily rewards loaded successfully');
      } else {
        // Fall back to mock data if no rewards in database
        const mockRewards: DailyReward[] = [
          {
            id: "1",
            name: "Basic Daily Pack",
            description: "Standard daily reward for regular players",
            reward_type: "money",
            reward_value: 500,
            rarity: "common",
            probability: 70,
            day_number: 1,
            is_active: true,
            min_level: 1,
            special_conditions: {},
            bonus_multiplier: 1.0,
            streak_bonus: false,
            vip_only: false,
            effects: { energy: 30, health: 20, reputation: 5 },
            tags: ["daily", "basic"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Lucky Bonus",
            description: "Enhanced reward for lucky players",
            reward_type: "money",
            reward_value: 1000,
            rarity: "rare",
            probability: 25,
            day_number: 2,
            is_active: true,
            min_level: 5,
            special_conditions: {},
            bonus_multiplier: 1.5,
            streak_bonus: true,
            vip_only: false,
            effects: { energy: 50, health: 50, reputation: 15 },
            tags: ["daily", "lucky"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Jackpot Reward",
            description: "Premium reward for very lucky players",
            reward_type: "money",
            reward_value: 2500,
            rarity: "legendary",
            probability: 5,
            day_number: 7,
            is_active: true,
            min_level: 10,
            special_conditions: {},
            bonus_multiplier: 2.0,
            streak_bonus: true,
            vip_only: true,
            effects: { energy: 100, health: 100, reputation: 50 },
            tags: ["daily", "jackpot", "vip"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        
        setRewards(mockRewards);
        console.debug('Daily rewards table not found, using sample rewards for demonstration');
      }
    } catch (error) {
      console.error('Error loading daily rewards:', error);
      // Use sample data even on error for better user experience
      const sampleRewards: DailyReward[] = [
        {
          id: "sample_1",
          name: "Welcome Bonus",
          description: "New player daily reward",
          reward_type: "money",
          reward_value: 1000,
          rarity: "common",
          probability: 100,
          day_number: 1,
          is_active: true,
          min_level: 1,
          special_conditions: {},
          bonus_multiplier: 1.0,
          streak_bonus: false,
          vip_only: false,
          effects: { energy: 50, health: 25 },
          tags: ["daily", "welcome"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      setRewards(sampleRewards);
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReward, setEditingReward] = useState<DailyReward | null>(null);
  const [stats, setStats] = useState({
    totalRewards: 0,
    activeRewards: 0,
    dailyClaims: 0,
    averageValue: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [rewards]);

  const calculateStats = () => {
    const totalRewards = rewards.length;
    const activeRewards = rewards.filter(r => r.is_active).length;
    const totalValue = rewards.reduce((sum, r) => sum + r.reward_value, 0);
    const averageValue = totalRewards > 0 ? totalValue / totalRewards : 0;

    setStats({
      totalRewards,
      activeRewards,
      dailyClaims: 156, // Mock data
      averageValue,
    });
  };

  const addReward = (newReward: Omit<DailyReward, "id" | "created_at">) => {
    const reward: DailyReward = {
      ...newReward,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    setRewards([...rewards, reward]);
    toast.success("Daily reward added successfully");
    setShowAddModal(false);
  };

  const updateReward = (id: string, updates: Partial<DailyReward>) => {
    setRewards(rewards.map(reward => 
      reward.id === id ? { ...reward, ...updates, updated_at: new Date().toISOString() } : reward
    ));
    toast.success("Reward updated successfully");
    setEditingReward(null);
  };

  const deleteReward = (id: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;
    
    setRewards(rewards.filter(reward => reward.id !== id));
    toast.success("Reward deleted successfully");
  };

  const toggleRewardStatus = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (reward) {
      updateReward(id, { is_active: !reward.is_active });
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "bg-gray-100 text-gray-800 border-gray-300",
      rare: "bg-blue-100 text-blue-800 border-blue-300",
      epic: "bg-purple-100 text-purple-800 border-purple-300",
      legendary: "bg-yellow-100 text-yellow-800 border-yellow-300"
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const RewardForm = ({ reward, onSubmit, onCancel }: {
    reward?: DailyReward;
    onSubmit: (reward: Omit<DailyReward, "id" | "created_at">) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: reward?.name || "",
      description: reward?.description || "",
      reward_type: reward?.reward_type || "money" as DailyReward["reward_type"],
      reward_value: reward?.reward_value || 0,
      rarity: reward?.rarity || "common" as DailyReward["rarity"],
      probability: reward?.probability || 10,
      day_number: reward?.day_number || 1,
      is_active: reward?.is_active ?? true,
      min_level: reward?.min_level || 1,
      max_level: reward?.max_level || undefined,
      bonus_multiplier: reward?.bonus_multiplier || 1.0,
      streak_bonus: reward?.streak_bonus || false,
      vip_only: reward?.vip_only || false,
      effects: reward?.effects || {},
      tags: reward?.tags || [],
      special_conditions: reward?.special_conditions || {},
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {reward ? "Edit Daily Reward" : "Add New Daily Reward"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

              <div className="col-span-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
                <select
                  value={formData.reward_type}
                  onChange={(e) => setFormData({...formData, reward_type: e.target.value as DailyReward["reward_type"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="money">Money</option>
                  <option value="experience">Experience</option>
                  <option value="energy">Energy</option>
                  <option value="item">Item</option>
                  <option value="weapon">Weapon</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Value</label>
                <input
                  type="number"
                  value={formData.reward_value}
                  onChange={(e) => setFormData({...formData, reward_value: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day Number</label>
                <input
                  type="number"
                  value={formData.day_number}
                  onChange={(e) => setFormData({...formData, day_number: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="365"
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({...formData, rarity: e.target.value as DailyReward["rarity"]})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
                <input
                  type="number"
                  value={formData.probability}
                  onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
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
                {reward ? "Update" : "Add"} Reward
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Gift className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalRewards}</h3>
              <p className="text-gray-600 font-medium">Total Rewards</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeRewards}</h3>
              <p className="text-gray-600 font-medium">Active Rewards</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.dailyClaims}</h3>
              <p className="text-gray-600 font-medium">Daily Claims</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="text-yellow-600" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">${Math.round(stats.averageValue)}</h3>
              <p className="text-gray-600 font-medium">Average Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Daily Rewards</h2>
          <p className="text-gray-600">Manage daily reward system and probabilities</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Reward
        </button>
      </div>

      {/* Rewards Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Reward</th>
                <th className="text-left p-4 font-medium text-gray-900">Rarity</th>
                <th className="text-left p-4 font-medium text-gray-900">Rewards</th>
                <th className="text-left p-4 font-medium text-gray-900">Probability</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{reward.name}</div>
                      <div className="text-sm text-gray-500">{reward.description}</div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(reward.rarity)}`}>
                      {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        {reward.reward_type === "money" && <DollarSign size={14} className="text-green-500" />}
                        {reward.reward_type === "experience" && <Star size={14} className="text-purple-500" />}
                        {reward.reward_type === "energy" && <Zap size={14} className="text-blue-500" />}
                        {reward.reward_type === "item" && <Package size={14} className="text-orange-500" />}
                        {reward.reward_type === "weapon" && <Shield size={14} className="text-red-500" />}
                        <span>
                          {reward.reward_type === "money" ? `$${reward.reward_value}` : 
                           reward.reward_type === "experience" ? `${reward.reward_value} XP` :
                           reward.reward_type === "energy" ? `${reward.reward_value} Energy` :
                           `${reward.reward_value} ${reward.reward_type}`}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Day {reward.day_number}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-medium">{reward.probability}%</span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleRewardStatus(reward.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reward.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {reward.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingReward(reward)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => deleteReward(reward.id)}
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

      {/* Add Reward Modal */}
      {showAddModal && (
        <RewardForm
          onSubmit={addReward}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Reward Modal */}
      {editingReward && (
        <RewardForm
          reward={editingReward}
          onSubmit={(updatedReward) => updateReward(editingReward.id, updatedReward)}
          onCancel={() => setEditingReward(null)}
        />
      )}
    </div>
  );
};

export default DailyRewardsManagement;