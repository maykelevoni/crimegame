import React from "react";
import {
  Home,
  Map,
  Briefcase,
  User,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { useGame } from "./GameProvider";

interface GameLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const navColors = {
  home: "#30E3DF",
  map: "#FFD600",
  jobs: "#FF00C8",
  profile: "#00FF88",
  messages: "#FF6B6B",
  more: "#30E3DF",
};

const GameLayout = ({
  children,
  currentView,
  onViewChange,
}: GameLayoutProps) => {
  const { currentPlayerId } = useGame();

  const navItems = [
    { id: "home", label: "HOME", icon: Home },
    { id: "map", label: "MAP", icon: Map },
    { id: "jobs", label: "JOBS", icon: Briefcase },
    { id: "profile", label: "PROFILE", icon: User },
    { id: "messages", label: "MESSAGES", icon: MessageSquare },
    { id: "more", label: "MORE", icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-32 overflow-y-auto">{children}</div>

      {/* Bottom Navigation */}
      <div
        className="cyber-nav"
        style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50 }}
      >
        <div className="flex justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const color =
              navColors[item.id as keyof typeof navColors] || "#30E3DF";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={`cyber-nav-item flex flex-col items-center space-y-1 px-4 py-2 rounded-lg font-bold ${
                  isActive ? "active neon-nav-active" : ""
                }`}
                style={{ fontFamily: "Nunito, Arial, Helvetica, sans-serif" }}
              >
                <Icon size={24} color={color} />
                <span
                  style={{
                    color,
                    fontSize: "0.75rem",
                    fontFamily: "Nunito, Arial, Helvetica, sans-serif",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
