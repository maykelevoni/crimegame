import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  Ban,
  Crown,
  DollarSign,
  Heart,
  Zap,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Player {
  id: string;
  user_id: string;
  username: string;
  level: number;
  money: number;
  energy: number;
  experience: number;
  max_energy: number;
  reputation?: number; // Add reputation field
  created_at: string;
  updated_at: string;
}

const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setPlayers(data);
        toast.success(`Loaded ${data.length} players from database`);
      } else {
        // Add mock data for testing if no players exist
        const mockPlayers: Player[] = [
          {
            id: "1",
            user_id: "user1",
            username: "axiro",
            level: 5,
            money: 10000,
            energy: 80,
            experience: 1250,
            max_energy: 100,
            reputation: 50,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "user2", 
            username: "testuser",
            level: 3,
            money: 5000,
            energy: 60,
            experience: 750,
            max_energy: 100,
            reputation: 25,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        setPlayers(mockPlayers);
        toast.info("No players found in database - using mock data for testing");
      }
    } catch (error) {
      console.error("Error loading players:", error);
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (searchTerm.toLowerCase().startsWith('@') && player.username.toLowerCase().includes(searchTerm.substring(1).toLowerCase()))
  );

  const updatePlayerStats = async (playerId: string, updates: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from("players")
        .update(updates)
        .eq("id", playerId);

      if (error) throw error;
      
      toast.success("Player updated successfully");
      loadPlayers();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating player:", error);
      toast.error("Failed to update player");
    }
  };

  const deletePlayer = async (playerId: string) => {
    if (!confirm("Are you sure you want to delete this player? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (error) throw error;
      
      toast.success("Player deleted successfully");
      loadPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player");
    }
  };

  const EditPlayerModal = () => {
    if (!selectedPlayer) return null;

    const [formData, setFormData] = useState({
      id: "",
      username: "",
      money: 0,
      energy: 0,
      experience: 0,
      level: 0,
      max_energy: 0,
      reputation: 0,
    });

    // Update form data when selectedPlayer changes
    useEffect(() => {
      if (selectedPlayer) {
        setFormData({
          id: selectedPlayer.id,
          username: selectedPlayer.username,
          money: selectedPlayer.money,
          energy: selectedPlayer.energy,
          experience: selectedPlayer.experience,
          level: selectedPlayer.level,
          max_energy: selectedPlayer.max_energy,
          reputation: selectedPlayer.reputation || 0,
        });
      }
    }, [selectedPlayer]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updatePlayerStats(selectedPlayer.id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Edit Player: {selectedPlayer.username}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username/ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="username (no @)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <input
                  type="number"
                  min="1"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Money</label>
                <input
                  type="number"
                  min="0"
                  value={formData.money}
                  onChange={(e) => setFormData({...formData, money: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Energy</label>
                <input
                  type="number"
                  min="0"
                  value={formData.energy}
                  onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Energy</label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_energy}
                  onChange={(e) => setFormData({...formData, max_energy: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reputation</label>
                <input
                  type="number"
                  value={formData.reputation}
                  onChange={(e) => setFormData({...formData, reputation: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or @username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={16} />
          Add Player
        </button>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Player</th>
                <th className="text-left p-4 font-medium text-gray-900">Level</th>
                <th className="text-left p-4 font-medium text-gray-900">Reputation</th>
                <th className="text-left p-4 font-medium text-gray-900">Money</th>
                <th className="text-left p-4 font-medium text-gray-900">Status</th>
                <th className="text-left p-4 font-medium text-gray-900">Created</th>
                <th className="text-right p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div 
                          className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm"
                        >
                          {player.username ? player.username.charAt(0).toUpperCase() : player.id.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.username || 'No Username'}</div>
                        <div className="text-sm text-gray-500">ID: {player.id}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{player.level}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-gray-900">{player.reputation}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-gray-900">${player.money?.toLocaleString()}</div>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-500">
                    {new Date(player.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedPlayer(player);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <button
                        onClick={() => deletePlayer(player.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>

                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlayers.length === 0 && (
          <div className="p-8 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first player"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && <EditPlayerModal />}
    </div>
  );
};

export default PlayerManagement;