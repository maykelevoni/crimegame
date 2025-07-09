import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGameStore } from "@/stores/gameStore";

interface AvatarOption {
  id: string;
  name: string;
  image_url: string;
  category: "male" | "female" | "neutral";
  description: string;
}

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ isOpen, onClose, currentAvatar }) => {
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
        id: "avatar_1",
        name: "Street Fighter",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "male",
        description: "Tough street fighter with attitude"
      },
      {
        id: "avatar_2",
        name: "Gang Leader",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "male",
        description: "Experienced gang leader"
      },
      {
        id: "avatar_3",
        name: "Businessman",
        image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "male",
        description: "Legitimate business owner"
      },
      {
        id: "avatar_4",
        name: "Enforcer",
        image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "male",
        description: "Muscle for hire"
      },
      {
        id: "avatar_5",
        name: "Street Queen",
        image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "female",
        description: "Fierce street queen who rules the block"
      },
      {
        id: "avatar_6",
        name: "Crime Mastermind",
        image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "female",
        description: "Brilliant criminal mastermind"
      },
      {
        id: "avatar_7",
        name: "Businesswoman",
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "female",
        description: "Powerful businesswoman"
      },
      {
        id: "avatar_8",
        name: "Femme Fatale",
        image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "female",
        description: "Dangerous and seductive"
      },
      {
        id: "avatar_9",
        name: "Mysterious Figure",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "neutral",
        description: "Identity unknown"
      },
      {
        id: "avatar_10",
        name: "Hacker",
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        category: "neutral",
        description: "Digital underground expert"
      }
    ];

    try {
      const { data, error } = await supabase
        .from('avatar_options')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST301' || error.message?.includes('404')) {
          // Avatar options table does not exist yet, using fallback avatars
          setAvatarOptions(fallbackAvatars);
          return;
        } else {
          console.error('Error loading avatar options:', error);
          // Use fallback avatars on any error
          setAvatarOptions(fallbackAvatars);
          return;
        }
      }

      if (data && data.length > 0) {
        setAvatarOptions(data as AvatarOption[]);
      } else {
        // Fallback avatar options if database is empty
        setAvatarOptions(fallbackAvatars);
      }
    } catch (error) {
      console.error('Error loading avatar options:', error);
      // Use fallback avatars on any error
      setAvatarOptions(fallbackAvatars);
    }
  };

  const handleSaveAvatar = async () => {
    if (!player?.id || !selectedAvatar) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({ avatar_url: selectedAvatar })
        .eq('id', player.id);

      if (error) throw error;

      toast.success('🎭 Avatar updated successfully!');
      
      // Reload game data to update the UI
      await loadGameData(player.id);
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

        {/* Avatar Grid - Simple 4x4 with 16 images */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {avatarOptions.slice(0, 16).map((avatar, index) => (
              <div
                key={avatar.id || index}
                className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedAvatar === avatar.image_url
                    ? "border-cyber-blue border-4"
                    : "border-gray-600 hover:border-cyber-blue/50"
                }`}
                onClick={() => setSelectedAvatar(avatar.image_url)}
              >
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={avatar.image_url}
                    alt={avatar.name || "Avatar"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a placeholder when image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>
                
                {/* Selection Indicator */}
                {selectedAvatar === avatar.image_url && (
                  <div className="absolute inset-0 bg-cyber-blue/20 rounded-lg flex items-center justify-center">
                    <Check size={20} className="text-cyber-blue bg-white rounded-full p-1" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Fill empty slots if less than 16 avatars */}
            {Array.from({ length: Math.max(0, 16 - avatarOptions.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 flex items-center justify-center"
              >
                <span className="text-gray-500 text-xs">Empty</span>
              </div>
            ))}
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