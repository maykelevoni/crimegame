import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image,
  Search,
  Filter,
  Eye,
  Settings,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AvatarOption {
  id: string;
  name: string;
  image_url: string;
  category: "male" | "female" | "neutral";
  description: string;
  available: boolean;
  created_at: string;
}

const AvatarManagement = () => {
  const [avatars, setAvatars] = useState<AvatarOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<AvatarOption | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [newAvatar, setNewAvatar] = useState({
    name: "",
    image_url: "",
    category: "male" as "male" | "female" | "neutral",
    description: "",
    available: true,
  });

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('avatar_options')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        throw error;
      }

      if (data && data.length > 0) {
        setAvatars(data);
      } else {
        // Create table with initial data if empty
        await createInitialAvatars();
      }
    } catch (error) {
      console.error('Error loading avatars:', error);
      toast.error('Failed to load avatars');
    } finally {
      setLoading(false);
    }
  };

  const createInitialAvatars = async () => {
    const initialAvatars = [
      {
        name: "Street Fighter",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        category: "male",
        description: "Tough street fighter with attitude",
        available: true,
      },
      {
        name: "Gang Leader", 
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        category: "male",
        description: "Experienced gang leader",
        available: true,
      },
      {
        name: "Street Queen",
        image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        category: "female", 
        description: "Fierce street queen who rules the block",
        available: true,
      },
      {
        name: "Crime Mastermind",
        image_url: "https://images.unsplash.com/photo-1494790108755-2616b2e31b89?w=400&h=400&fit=crop&crop=face",
        category: "female",
        description: "Brilliant criminal mastermind", 
        available: true,
      },
    ];

    try {
      const { data, error } = await supabase
        .from('avatar_options')
        .insert(initialAvatars)
        .select();

      if (error) throw error;
      
      if (data) {
        setAvatars(data);
        toast.success('Initial avatars created!');
      }
    } catch (error) {
      console.error('Error creating initial avatars:', error);
    }
  };

  const handleAddAvatar = async () => {
    if (!newAvatar.name || !newAvatar.image_url) {
      toast.error('Name and image URL are required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('avatar_options')
        .insert([newAvatar])
        .select()
        .single();

      if (error) throw error;

      setAvatars(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewAvatar({
        name: "",
        image_url: "",
        category: "male",
        description: "",
        available: true,
      });
      toast.success('Avatar added successfully!');
    } catch (error) {
      console.error('Error adding avatar:', error);
      toast.error('Failed to add avatar');
    }
  };

  const handleUpdateAvatar = async () => {
    if (!editingAvatar) return;

    try {
      const { data, error } = await supabase
        .from('avatar_options')
        .update({
          name: editingAvatar.name,
          image_url: editingAvatar.image_url,
          category: editingAvatar.category,
          description: editingAvatar.description,
          available: editingAvatar.available,
        })
        .eq('id', editingAvatar.id)
        .select()
        .single();

      if (error) throw error;

      setAvatars(prev => prev.map(avatar => avatar.id === data.id ? data : avatar));
      setEditingAvatar(null);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    }
  };

  const handleDeleteAvatar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this avatar?')) return;

    try {
      const { error } = await supabase
        .from('avatar_options')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAvatars(prev => prev.filter(avatar => avatar.id !== id));
      toast.success('Avatar deleted successfully!');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error('Failed to delete avatar');
    }
  };

  const handleToggleAvailable = async (avatar: AvatarOption) => {
    try {
      const { data, error } = await supabase
        .from('avatar_options')
        .update({ available: !avatar.available })
        .eq('id', avatar.id)
        .select()
        .single();

      if (error) throw error;

      setAvatars(prev => prev.map(a => a.id === data.id ? data : a));
      toast.success(`Avatar ${data.available ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling avatar availability:', error);
      toast.error('Failed to update avatar');
    }
  };

  const filteredAvatars = avatars.filter(avatar => {
    const matchesSearch = avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avatar.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || avatar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const quickImageOptions = [
    { name: "Professional Male", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
    { name: "Business Woman", url: "https://images.unsplash.com/photo-1494790108755-2616b2e31b89?w=400&h=400&fit=crop&crop=face" },
    { name: "Casual Male", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
    { name: "Young Woman", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
        <p className="mt-2 text-white/60">Loading avatars...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="text-purple-400" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-white">Avatar Management</h1>
            <p className="text-white/60">Manage available player avatars</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Avatar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <div>
              <p className="text-white/60 text-sm">Total Avatars</p>
              <p className="text-xl font-bold text-white">{avatars.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <Eye className="text-green-400" size={24} />
            <div>
              <p className="text-white/60 text-sm">Available</p>
              <p className="text-xl font-bold text-white">{avatars.filter(a => a.available).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <div>
              <p className="text-white/60 text-sm">Male</p>
              <p className="text-xl font-bold text-white">{avatars.filter(a => a.category === 'male').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="text-pink-400" size={24} />
            <div>
              <p className="text-white/60 text-sm">Female</p>
              <p className="text-xl font-bold text-white">{avatars.filter(a => a.category === 'female').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search avatars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="neutral">Neutral</option>
        </select>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAvatars.map((avatar) => (
          <div key={avatar.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="aspect-square">
              <img
                src={avatar.image_url}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white">{avatar.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  avatar.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {avatar.available ? 'Available' : 'Disabled'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{avatar.description}</p>
              <span className={`inline-block px-2 py-1 rounded text-xs mb-3 ${
                avatar.category === "male" ? "bg-blue-500/20 text-blue-400" :
                avatar.category === "female" ? "bg-pink-500/20 text-pink-400" :
                "bg-gray-500/20 text-gray-400"
              }`}>
                {avatar.category}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingAvatar(avatar)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  <Edit size={14} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleAvailable(avatar)}
                  className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                    avatar.available 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {avatar.available ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDeleteAvatar(avatar.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Avatar Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-500/30 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-400">Add New Avatar</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={newAvatar.name}
                  onChange={(e) => setNewAvatar(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="Avatar name"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Image URL</label>
                <input
                  type="url"
                  value={newAvatar.image_url}
                  onChange={(e) => setNewAvatar(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  placeholder="https://..."
                />
                
                {/* Quick Options */}
                <div className="mt-2">
                  <p className="text-sm text-gray-400 mb-2">Quick options:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickImageOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setNewAvatar(prev => ({ ...prev, image_url: option.url }))}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Category</label>
                <select
                  value={newAvatar.category}
                  onChange={(e) => setNewAvatar(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={newAvatar.description}
                  onChange={(e) => setNewAvatar(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  rows={3}
                  placeholder="Avatar description"
                />
              </div>

              {/* Preview */}
              {newAvatar.image_url && (
                <div>
                  <label className="block text-white mb-2">Preview</label>
                  <img
                    src={newAvatar.image_url}
                    alt="Preview"
                    className="w-20 h-20 rounded object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 px-4 border border-gray-600 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAvatar}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Add Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Avatar Modal */}
      {editingAvatar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-blue-500/30 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-400">Edit Avatar</h3>
              <button
                onClick={() => setEditingAvatar(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={editingAvatar.name}
                  onChange={(e) => setEditingAvatar(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Image URL</label>
                <input
                  type="url"
                  value={editingAvatar.image_url}
                  onChange={(e) => setEditingAvatar(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Category</label>
                <select
                  value={editingAvatar.category}
                  onChange={(e) => setEditingAvatar(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={editingAvatar.description}
                  onChange={(e) => setEditingAvatar(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingAvatar.available}
                  onChange={(e) => setEditingAvatar(prev => prev ? { ...prev, available: e.target.checked } : null)}
                  className="rounded"
                />
                <label className="text-white">Available for players</label>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-white mb-2">Preview</label>
                <img
                  src={editingAvatar.image_url}
                  alt="Preview"
                  className="w-20 h-20 rounded object-cover"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingAvatar(null)}
                className="flex-1 py-2 px-4 border border-gray-600 rounded text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAvatar}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarManagement;