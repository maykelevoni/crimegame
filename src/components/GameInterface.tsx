import React, { useState } from "react";
import {
  Home,
  User,
  Eye,
  Wine,
  Hospital,
  Building2,
  BriefcaseBusiness,
  Building,
  Lock,
  UserCircle,
  Crosshair,
} from "lucide-react";
import HomeView from "../views/HomeView";
import RobberyView from "../views/RobberyView";
import ProfileView from "../views/ProfileView";
import NewsView from "../views/NewsView";
import { GameProvider } from "./GameProvider";
import NightlifeView from "../views/NightlifeView";
import HospitalView from "../views/HospitalView";
import BankView from "../views/BankView";
import CasinoView from "../views/CasinoView";
import LuckyWheelView from "../views/LuckyWheelView";

interface GameInterfaceProps {
  playerStats: {
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    addiction: number;
    reputation: number;
    money: number;
    wantedLevel: number;
  };
}

export function GameInterface({ playerStats }: GameInterfaceProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [activeView, setActiveView] = useState("home");

  const mainActions = [
    {
      id: "robbery",
      icon: Crosshair,
      label: "Robbery",
      description: "Engage in crimes",
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/50",
      glow: "shadow-red-500/30",
      onClick: () => {
        setActiveSection("robbery");
        setActiveView("robbery");
      },
    },
    {
      id: "nightlife",
      icon: Wine,
      label: "Nightlife",
      description: "Clubs & Prostitutes",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/50",
      glow: "shadow-purple-500/30",
      onClick: () => {
        setActiveSection("nightlife");
        setActiveView("nightlife");
      },
    },
    {
      id: "hospital",
      icon: Hospital,
      label: "Hospital",
      description: "Heal & recover",
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/50",
      glow: "shadow-green-500/30",
      onClick: () => {
        setActiveSection("hospital");
        setActiveView("hospital");
      },
    },
    {
      id: "bank",
      icon: Building,
      label: "Bank",
      description: "Manage money",
      color: "from-cyan-500/20 to-cyan-600/20",
      borderColor: "border-cyan-500/50",
      glow: "shadow-cyan-500/30",
      onClick: () => {
        setActiveSection("bank");
        setActiveView("bank");
      },
    },
  ];

  // Only show Prison if wanted level is high
  if (playerStats.wantedLevel >= 70) {
    mainActions.push({
      id: "prison",
      icon: Lock,
      label: "Prison",
      description: "Serve time",
      color: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/50",
      glow: "shadow-orange-500/30",
      onClick: () => {
        setActiveSection("prison");
        setActiveView("prison");
      },
    });
  }

  const bottomNav = [
    { id: "home", icon: Home, label: "Home" },
    { id: "robbery", icon: Crosshair, label: "Robbery" },
    { id: "nightlife", icon: Wine, label: "Nightlife" },
    { id: "hospital", icon: Hospital, label: "Hospital" },
    { id: "bank", icon: Building, label: "Bank" },
    { id: "character", icon: UserCircle, label: "Character" },
  ];

  const renderView = () => {
    switch (activeView) {
      case "home":
        return <HomeView onViewChange={(view) => setActiveView(view)} />;
      case "robbery":
        return <RobberyView />;
      case "nightlife":
        return <NightlifeView />;
      case "hospital":
        return <HospitalView />;
      case "bank":
        return <BankView />;
      case "casino":
        return <CasinoView />;
      case "prison":
        return <div>Prison View</div>; // TODO: Import and implement PrisonView
      case "news":
        return <NewsView onBack={() => setActiveView("home")} />;
      case "luckywheel":
        return <LuckyWheelView onBack={() => setActiveView("home")} />;
      case "character":
        return <ProfileView />;
      default:
        return (
          <div className="flex flex-col gap-3">
            {mainActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`relative group p-3 rounded-xl border ${action.borderColor} bg-gradient-to-br ${action.color} ${action.glow} hover:scale-[1.02] transition-all duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-sm">{action.label}</h3>
                      <p className="text-xs text-white/70">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <GameProvider>
      <div className="bg-cyber-dark text-white">
        {/* Main Content */}
        <div className="container mx-auto px-4 pt-4 flex flex-col justify-start">
          {renderView()}
        </div>
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-cyber-dark/95 backdrop-blur-sm border-t border-cyber-blue/20">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {bottomNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setActiveView(item.id);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                      activeSection === item.id
                        ? "text-white"
                        : "text-cyber-blue hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
}
