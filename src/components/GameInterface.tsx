import React, { useState } from "react";
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
import ShopView from "../views/ShopView";
import PrisonView from "../views/PrisonView";
import BusinessView from "../views/BusinessView";
import bgImage from "../assets/bg.png";

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
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const [player, setPlayer] = useState({
    ...playerStats,
    isImprisoned: false,
    isHospitalized: false,
  });

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
    { id: "robbery", icon: LocateFixed, label: "Robbery" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "character", icon: UserCircle, label: "Profile" },
  ];

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  // Sistema de alertas com tom de zoeira
  const getAlerts = () => {
    const alerts = [];

    // Saúde baixa
    if (player.health < 30 && !dismissedAlerts.includes("health")) {
      alerts.push({
        id: "health",
        type: "warning",
        icon: HeartPulse,
        message:
          "Tá quase morto, seu zumbi! Vai pro hospital antes que vire pó!",
        action: "Ir ao Hospital",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/50",
        onClick: () => setActiveView("hospital"),
      });
    }

    // Energia baixa
    if (player.energy < 20 && !dismissedAlerts.includes("energy")) {
      alerts.push({
        id: "energy",
        type: "warning",
        icon: Zap,
        message:
          "Tá mais lento que lesma na areia! Vai curtir na nightlife pra pegar energia!",
        action: "Ir à Nightlife",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50",
        onClick: () => setActiveView("nightlife"),
      });
    }

    // Vício alto
    if (player.addiction > 70 && !dismissedAlerts.includes("addiction")) {
      alerts.push({
        id: "addiction",
        type: "warning",
        icon: Pill,
        message:
          "Tá viciado que nem rato em laboratório! Vai pro hospital se tratar!",
        action: "Ir ao Hospital",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/20",
        borderColor: "border-cyan-500/50",
        onClick: () => setActiveView("hospital"),
      });
    }

    // Procurado alto
    if (player.wantedLevel > 80 && !dismissedAlerts.includes("wanted")) {
      alerts.push({
        id: "wanted",
        type: "warning",
        icon: Siren,
        message:
          "A polícia tá te caçando que nem cachorro atrás de osso! Vai se esconder!",
        action: "Ir à Prisão",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/50",
        onClick: () => setActiveView("prison"),
      });
    }

    return alerts;
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const renderView = () => {
    if (player.isImprisoned) {
      return (
        <PrisonView
          isPlayerImprisoned={true}
          onAttemptBribe={() => {
            const success = Math.random() < 0.1;
            if (success) {
              setPlayer({ ...player, isImprisoned: false, wantedLevel: 0 });
            }
            return success;
          }}
          onAttemptRiot={() => {
            const success = Math.random() < 0.3;
            if (success) {
              setPlayer({ ...player, isImprisoned: false });
            }
            return success;
          }}
        />
      );
    }

    if (player.isHospitalized) {
      return (
        <HospitalView
          isPlayerHospitalized={true}
          playerStatus={player}
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
            playerStatus={player}
            onStartTreatment={() => {
              /* Ação de tratamento não é chamada na visita */
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
            onAttemptBribe={() => false /* Não pode subornar ao visitar */}
            onAttemptRiot={() => false /* Não pode iniciar motim ao visitar */}
          />
        );
      case "news":
        return <NewsView onBack={() => setActiveView("home")} />;
      case "luckywheel":
        return <LuckyWheelView onBack={() => setActiveView("home")} />;
      case "character":
        return <ProfileView />;
      case "business":
        return <BusinessView />;
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
        {/* Overlay escuro para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

        {/* Conteúdo principal com z-index para ficar sobre o overlay */}
        <div className="relative z-10">
          {/* Sistema de Alertas */}
          {getAlerts().map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className={`${alert.bgColor} ${alert.borderColor} border-l-4 p-4 mb-2 mx-2 mt-2 rounded-r-lg relative bg-black/80`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon size={20} className={`${alert.color} mt-0.5`} />
                    <div className="flex-1">
                      <p className={`font-semibold ${alert.color} text-sm`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-white/10 rounded ml-2"
                  >
                    <X size={16} className="text-white/60" />
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={alert.onClick}
                    className={`px-4 py-2 text-sm font-semibold ${alert.bgColor} ${alert.borderColor} border rounded hover:scale-105 transition-transform`}
                  >
                    {alert.action}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Main Content */}
          <div className="container mx-auto px-4 pt-4 flex flex-col justify-start">
            {renderView()}
          </div>
          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-cyber-dark/95 border-t border-cyber-blue/20">
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
      </div>
    </GameProvider>
  );
}
