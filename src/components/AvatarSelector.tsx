import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGameStore } from "@/stores/gameStore";

interface AvatarOption {
  id: string;
  image_url: string;
  category: "male" | "female" | "neutral";
  available: boolean;
  created_at: string;
}

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  playerId?: string; // Optional player ID for registration flow
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ isOpen, onClose, currentAvatar, playerId }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || "");
  const [loading, setLoading] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "male" | "female" | "neutral">("all");
  const { player, loadGameData } = useGameStore();

  // Load avatar options when component opens
  React.useEffect(() => {
    if (isOpen) {
      loadAvatarOptions();
    }
  }, [isOpen]);

  const loadAvatarOptions = async () => {
    // Use fallback avatars by default to avoid 404 errors
    const fallbackAvatars = [
      {
        id: "1",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        category: "male" as const,
        available: true,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        category: "male" as const,
        available: true,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        category: "female" as const,
        available: true,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "4",
        image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
        category: "female" as const,
        available: true,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "5",
        image_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        category: "male" as const,
        available: true,
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "6",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        category: "female" as const,
        available: true,
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    try {
      const { data, error } = await supabase
        .from('avatar_options')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error loading avatar options:', error);
        setAvatarOptions(fallbackAvatars);
        return;
      }

      if (data && data.length > 0) {
        setAvatarOptions(data as AvatarOption[]);
      } else {
        setAvatarOptions(fallbackAvatars);
      }
    } catch (error) {
      console.error('Error loading avatar options:', error);
      setAvatarOptions(fallbackAvatars);
    }
  };

  const handleSaveAvatar = async () => {
    const currentPlayerId = playerId || player?.id;
    if (!currentPlayerId || !selectedAvatar) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({ avatar_url: selectedAvatar })
        .eq('id', currentPlayerId);

      if (error) throw error;

      toast.success('🎭 Avatar updated successfully!');
      
      // Reload game data to update the UI - only if not in registration flow
      if (player?.id && !playerId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await loadGameData(user.id);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  const filteredAvatars = avatarOptions.filter(avatar => 
    selectedCategory === "all" || avatar.category === selectedCategory
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyber-blue/30">
          <h2 className="text-2xl font-bold text-cyber-blue">Choose Your Avatar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Avatar Grid - 4x5 with 20 images */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {Array.from({ length: 20 }).map((_, index) => {
              const avatar = avatarOptions[index];
              return (
                <div
                  key={avatar?.id || `slot-${index}`}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-110 ${
                    avatar && selectedAvatar === avatar.image_url
                      ? "border-cyber-blue border-4"
                      : avatar
                      ? "border-gray-600 hover:border-cyber-blue/50"
                      : "border-dashed border-gray-600 bg-gray-800/50"
                  }`}
                  onClick={() => avatar && setSelectedAvatar(avatar.image_url)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden">
                    {avatar ? (
                      <>
                        <img
                          src={avatar.image_url}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to a placeholder when image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;
                            target.onerror = null; // Prevent infinite loop
                          }}
                        />
                        
                        {/* Selection Indicator */}
                        {selectedAvatar === avatar.image_url && (
                          <div className="absolute inset-0 bg-cyber-blue/20 rounded-lg flex items-center justify-center">
                            <Check size={20} className="text-cyber-blue bg-white rounded-full p-1" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-cyber-blue/30">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAvatar}
            disabled={!selectedAvatar || loading}
            className={`px-6 py-3 rounded-lg font-bold transition-colors ${
              selectedAvatar && !loading
                ? "bg-cyber-blue hover:bg-cyber-blue/80 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;