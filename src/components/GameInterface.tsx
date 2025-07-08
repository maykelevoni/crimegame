import React from "react";
import {
  Home,
  User,
  Eye,
  Wine,
  Hospital,
  Ambulance,
  Building2,
  BriefcaseBusiness,
  Building,
  Landmark,
  Lock,
  UserCircle,
  Crosshair,
  LocateFixed,
  ShoppingBag,
  AlertTriangle,
  HeartPulse,
  Zap,
  Pill,
  Star,
  DollarSign,
  Siren,
  X,
  Archive,
} from "lucide-react";
import HomeView from "../views/HomeView";
import RobberyView from "../views/RobberyView";
import InventoryView from "../views/InventoryView";
import NewsView from "../views/NewsView";
import { GameProvider } from "./GameProvider";
import NightlifeView from "../views/NightlifeView";
import HospitalView from "../views/HospitalView";
import BankView from "../views/BankView";
import CasinoView from "../views/CasinoView";
import LuckyWheelView from "../views/LuckyWheelView";
import ShopView from "../views/ShopView";
import PrisonView from "../views/PrisonView";
import BusinessView from "../views/BusinessView";
import AdminView from "../views/AdminView";
import bgImage from "../assets/bg.png";
import { useGameStore } from "../stores/gameStore";
import { useResponsive } from "../hooks/useResponsive";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import type { Alert } from "@/types/game";

export function GameInterface() {
  const {
    player,
    activeView,
    activeSection,
    dismissedAlerts,
    setActiveView,
    setActiveSection,
    dismissAlert,
  } = useGameStore();

  const { isMobile, isTablet } = useResponsive();

  // Early return if player is not loaded yet
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyber-dark text-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-cyber-blue mt-4">Loading player data...</p>
        </div>
      </div>
    );
  }

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
      id: "shop",
      icon: ShoppingBag,
      label: "Shop",
      description: "Buy weapons & items",
      color: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/50",
      glow: "shadow-yellow-500/30",
      onClick: () => {
        setActiveSection("shop");
        setActiveView("shop");
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
  if (player && player.stats && player.stats.wantedLevel >= 70) {
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
    { id: "robbery", icon: LocateFixed, label: "Robbery" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "nightlife", icon: Wine, label: "Nightlife" },
    { id: "business", icon: Building2, label: "Business" },
    { id: "character", icon: Archive, label: "Inventory" },
  ];

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  // Alert system
  const getAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    if (!player || !player.stats) return alerts;

    // Low health
    if (player.stats.health < 30 && !dismissedAlerts.includes("health")) {
      alerts.push({
        id: "health",
        type: "warning",
        icon: HeartPulse,
        message: isMobile
          ? "Almost dead! Go to hospital!"
          : "Almost dead, you zombie! Go to hospital before you turn to dust!",
        action: "Go to Hospital",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/50",
        onClick: () => setActiveView("hospital"),
      });
    }

    // Low energy
    if (player.stats.energy < 20 && !dismissedAlerts.includes("energy")) {
      alerts.push({
        id: "energy",
        type: "warning",
        icon: Zap,
        message: isMobile
          ? "Out of energy! Go party!"
          : "Slower than a snail in sand! Go to nightlife to get energy!",
        action: "Go to Nightlife",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50",
        onClick: () => setActiveView("nightlife"),
      });
    }

    // High addiction
    if (player.stats.addiction > 70 && !dismissedAlerts.includes("addiction")) {
      alerts.push({
        id: "addiction",
        type: "warning",
        icon: Pill,
        message: isMobile
          ? "You're addicted! Get treatment!"
          : "Addicted like a lab rat! Go to hospital for treatment!",
        action: "Go to Hospital",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/20",
        borderColor: "border-cyan-500/50",
        onClick: () => setActiveView("hospital"),
      });
    }

    // High wanted level
    if (player.stats.wantedLevel > 80 && !dismissedAlerts.includes("wanted")) {
      alerts.push({
        id: "wanted",
        type: "warning",
        icon: Siren,
        message: isMobile
          ? "Police are hunting you! Go hide!"
          : "Police are hunting you like a dog after a bone! Go hide!",
        action: "Go to Prison",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/50",
        onClick: () => setActiveView("prison"),
      });
    }

    return alerts;
  };

  const renderView = () => {

    if (player?.stats?.isImprisoned) {
      return (
        <PrisonView
          isPlayerImprisoned={true}
          onAttemptBribe={() => {
            const success = Math.random() < 0.1;
            if (success) {
              useGameStore.getState().setPlayerImprisoned(false);
              useGameStore.getState().updatePlayerStats({ wantedLevel: 0 });
            }
            return success;
          }}
          onAttemptRiot={() => {
            const success = Math.random() < 0.3;
            if (success) {
              useGameStore.getState().setPlayerImprisoned(false);
            }
            return success;
          }}
        />
      );
    }

    if (player?.stats?.isHospitalized) {
      return (
        <HospitalView
          isPlayerHospitalized={true}
          playerStatus={player?.stats}
          onStartTreatment={(type) => {
            // Treatment logic will be handled by the hospital view
          }}
        />
      );
    }


    switch (activeView) {
      case "home":
        return <HomeView onViewChange={handleViewChange} />;
      case "robbery":
        return <RobberyView />;
      case "shop":
        return <ShopView onBack={() => setActiveView("home")} />;
      case "nightlife":
        return <NightlifeView />;
      case "hospital":
        return (
          <HospitalView
            isPlayerHospitalized={false}
            playerStatus={player?.stats}
            onStartTreatment={() => {
              /* Treatment action is not called on visit */
            }}
          />
        );
      case "bank":
        return <BankView />;
      case "casino":
        return <CasinoView />;
      case "prison":
        return (
          <PrisonView
            isPlayerImprisoned={false}
            onAttemptBribe={() => false /* Cannot bribe when visiting */}
            onAttemptRiot={() => false /* Cannot start riot when visiting */}
          />
        );
      case "news":
        return <NewsView onBack={() => setActiveView("home")} />;
      case "luckywheel":
        return <LuckyWheelView onBack={() => setActiveView("home")} />;
      case "character":
        return <InventoryView />;
      case "business":
        return <BusinessView />;
      case "admin":
        // Check if user has admin privileges (for now, allow axiro)
        if (player?.name === "axiro" || player?.user_id === "axiro") {
          return <AdminView />;
        } else {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-500 mb-2">Access Denied</h3>
                <p className="text-gray-600">You don't have admin privileges.</p>
              </div>
            </div>
          );
        }
      default:
        return (
          <div className={`flex flex-col gap-3 ${isMobile ? "px-2" : "px-4"}`}>
            {mainActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`relative group p-3 rounded-xl border ${
                    action.borderColor
                  } bg-gradient-to-br ${action.color} ${
                    action.glow
                  } hover:scale-[1.02] transition-all duration-200 ${
                    isMobile ? "p-4" : "p-3"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-white/5 ${
                        isMobile ? "p-3" : "p-2"
                      }`}
                    >
                      <Icon size={isMobile ? 28 : 24} className="text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3
                        className={`font-bold ${
                          isMobile ? "text-base" : "text-sm"
                        }`}
                      >
                        {action.label}
                      </h3>
                      <p
                        className={`text-white/70 ${
                          isMobile ? "text-sm" : "text-xs"
                        }`}
                      >
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
      <div
        className="bg-cyber-dark text-white min-h-screen relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay to improve readability */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

        {/* Main content with z-index to stay above overlay */}
        <div className="relative z-10">
          {/* Alert System */}
          {getAlerts().map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className={`${alert.bgColor} ${
                  alert.borderColor
                } border-l-4 p-4 mb-2 mx-2 mt-2 rounded-r-lg relative bg-black/80 ${
                  isMobile ? "mx-1 p-3" : "mx-2 p-4"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon
                      size={isMobile ? 18 : 20}
                      className={`${alert.color} mt-0.5`}
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${alert.color} ${
                          isMobile ? "text-sm" : "text-sm"
                        }`}
                      >
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-white/10 rounded ml-2"
                  >
                    <X size={isMobile ? 14 : 16} className="text-white/60" />
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={alert.onClick}
                    className={`px-4 py-2 text-sm font-semibold ${
                      alert.bgColor
                    } ${
                      alert.borderColor
                    } border rounded hover:scale-105 transition-transform ${
                      isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"
                    }`}
                  >
                    {alert.action}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Main Content */}
          <div
            className={`container mx-auto ${
              isMobile ? "px-2" : "px-4"
            } pt-4 flex flex-col justify-start pb-20`}
          >
            {renderView()}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-cyber-dark/95 border-t border-cyber-blue/20 z-40">
            <div
              className={`container mx-auto ${isMobile ? "px-2" : "px-4"} py-2`}
            >
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
                      } ${isMobile ? "p-1" : "p-2"}`}
                    >
                      <Icon size={isMobile ? 18 : 20} />
                      <span
                        className={`${isMobile ? "text-[9px]" : "text-[10px]"}`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
}