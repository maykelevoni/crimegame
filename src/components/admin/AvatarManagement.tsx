import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

interface AvatarOption {
  id: string;
  image_url: string;
  category: "male" | "female" | "neutral";
  available: boolean;
  created_at: string;
}

const AvatarManagement = () => {
  const [avatars, setAvatars] = useState<AvatarOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [newAvatar, setNewAvatar] = useState({
    image_url: "",
    category: "male" as "male" | "female" | "neutral",
    available: true,
  });

  // Mock data for demonstration
  const mockAvatars: AvatarOption[] = [
    {
      id: "1",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      category: "male",
      available: true,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2", 
      image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      category: "male",
      available: true,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      category: "female",
      available: true,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "4",
      image_url: "https://images.unsplash.com/photo-1494790108755-2616b2e31b89?w=100&h=100&fit=crop&crop=face",
      category: "female",
      available: false,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "5",
      image_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      category: "male",
      available: true,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "6",
      image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      category: "female",
      available: true,
      created_at: "2024-01-01T00:00:00Z",
    },
  ];

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      // Using mock data for now
      setAvatars(mockAvatars);
      toast.success('Avatars loaded successfully');
    } catch (error) {
      console.error('Error loading avatars:', error);
      toast.error('Failed to load avatars');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvatar = async () => {
    if (!newAvatar.image_url) {
      toast.error('Image URL is required');
      return;
    }

    try {
      const newAvatarData: AvatarOption = {
        id: Date.now().toString(),
        image_url: newAvatar.image_url,
        category: newAvatar.category,
        available: newAvatar.available,
        created_at: new Date().toISOString(),
      };

      setAvatars(prev => [newAvatarData, ...prev]);
      setShowAddModal(false);
      setNewAvatar({
        image_url: "",
        category: "male",
        available: true,
      });
      toast.success('Avatar added successfully!');
    } catch (error) {
      console.error('Error adding avatar:', error);
      toast.error('Failed to add avatar');
    }
  };

  const handleDeleteAvatar = async (id: string) => {
    try {
      setAvatars(prev => prev.filter(avatar => avatar.id !== id));
      toast.success('Avatar deleted successfully!');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error('Failed to delete avatar');
    }
  };

  const handleToggleAvailable = async (avatar: AvatarOption) => {
    try {
      const updatedAvatar = { ...avatar, available: !avatar.available };
      setAvatars(prev => prev.map(a => a.id === avatar.id ? updatedAvatar : a));
      toast.success(`Avatar ${updatedAvatar.available ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling avatar availability:', error);
      toast.error('Failed to update avatar');
    }
  };

  const filteredAvatars = avatars.filter(avatar => {
    const matchesCategory = selectedCategory === "all" || avatar.category === selectedCategory;
    return matchesCategory;
  });

  const quickImageOptions = [
    { name: "Male 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Female 1", url: "https://images.unsplash.com/photo-1494790108755-2616b2e31b89?w=100&h=100&fit=crop&crop=face" },
    { name: "Male 2", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Female 2", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading avatars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{avatars.length}</h3>
              <p className="text-gray-600 font-medium">Total Avatars</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{avatars.filter(a => a.available).length}</h3>
              <p className="text-gray-600 font-medium">Available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{avatars.filter(a => a.category === 'male').length}</h3>
              <p className="text-gray-600 font-medium">Male</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{avatars.filter(a => a.category === 'female').length}</h3>
              <p className="text-gray-600 font-medium">Female</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Avatar Management</h2>
          <p className="text-gray-600">Manage available player avatars</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Avatar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {filteredAvatars.map((avatar, index) => (
            <div key={avatar.id} className="space-y-2">
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={avatar.image_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80`;
                      target.onerror = null;
                    }}
                  />
                </div>
                
                {/* Avatar number */}
                <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                  #{index + 1}
                </div>
                
                {/* Status indicator */}
                <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
                  avatar.available ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>

              {/* Actions buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleToggleAvailable(avatar)}
                  className={`p-2 rounded-lg ${
                    avatar.available 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  title={avatar.available ? 'Disable' : 'Enable'}
                >
                  {avatar.available ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={() => handleDeleteAvatar(avatar.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Avatar Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Avatar</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newAvatar.image_url}
                  onChange={(e) => setNewAvatar(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://..."
                  required
                />
                
                {/* Quick Options */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Quick options:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickImageOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setNewAvatar(prev => ({ ...prev, image_url: option.url }))}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newAvatar.category}
                  onChange={(e) => setNewAvatar(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              {/* Preview */}
              {newAvatar.image_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <img
                    src={newAvatar.image_url}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAvatar}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarManagement;