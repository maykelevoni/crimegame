import React from "react";
import {
  Home,
  Newspaper,
  Briefcase,
  Users,
  Crosshair,
  Pill,
  Factory,
  Music,
  Building2,
  Hospital,
  Lock,
  Landmark,
  Trophy,
  Store,
  ListTodo,
  MessageSquare,
  UserPlus,
  Users2,
  Dumbbell,
  Map,
  School,
  Shield,
  MapPin,
  Fish,
  Pickaxe,
  ChefHat,
  User,
} from "lucide-react";
import { useGame } from "../GameProvider";
import { usePlayer } from "../../hooks/usePlayer";
import TopStatusBar from "./TopStatusBar";

interface GameLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const GameLayout = ({
  children,
  currentView,
  onViewChange,
}: GameLayoutProps) => {
  const { currentPlayerId } = useGame();
  const { data: player, isLoading } = usePlayer(currentPlayerId);

  const navItems = [
    { id: "home", label: "HOME", icon: Home },
    { id: "news", label: "NEWS", icon: Newspaper },
    { id: "robbery", label: "ROBBERY", icon: Briefcase },
    { id: "prostitutes", label: "PROSTITUTES", icon: Users },
    { id: "weapons", label: "WEAPONS", icon: Crosshair },
    { id: "drugs", label: "DRUGS", icon: Pill },
    { id: "factories", label: "FACTORIES", icon: Factory },
    { id: "nightlife", label: "NIGHTLIFE", icon: Music },
    { id: "businesses", label: "BUSINESSES", icon: Building2 },
    { id: "hospital", label: "HOSPITAL", icon: Hospital },
    { id: "prison", label: "PRISON", icon: Lock },
    { id: "bank", label: "BANK", icon: Landmark },
    { id: "casino", label: "CASINO", icon: Trophy },
    { id: "alley", label: "ALLEY", icon: Store },
    { id: "tasks", label: "TASKS", icon: ListTodo },
    { id: "messages", label: "MESSAGES", icon: MessageSquare },
    { id: "friends", label: "FRIENDS", icon: UserPlus },
    { id: "gang", label: "GANG", icon: Users2 },
    { id: "gym", label: "GYM", icon: Dumbbell },
    { id: "plaza", label: "PLAZA", icon: Map },
    { id: "school", label: "SCHOOL", icon: School },
    { id: "territories", label: "TERRITORIES", icon: Shield },
    { id: "extortion", label: "EXTORTION", icon: MapPin },
    { id: "extras", label: "EXTRAS", icon: Fish },
    { id: "profile", label: "PROFILE", icon: User },
  ];

  if (isLoading || !player) {
    return (
      <div className="min-h-screen bg-cyber-dark text-white flex items-center justify-center">
        <div className="text-cyber-blue">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-dark text-white flex flex-col">
      {/* Header */}
      <TopStatusBar />

      {/* Main Content */}
      <div className="p-4 pb-20">{children}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-cyber-dark cyber-border border-t-2 border-l-0 border-r-0 border-b-0">
        <div className="flex justify-around p-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? "text-cyber-blue bg-cyber-blue/10 neon-glow"
                    : "text-gray-400 hover:text-cyber-blue"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
