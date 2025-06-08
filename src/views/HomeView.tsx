import React from "react";
import {
  MapPin,
  Users,
  Trophy,
  Briefcase,
  Shield,
  ShoppingBag,
  Pill,
  Users2,
  Sword,
  HeartPulse,
  Moon,
  Wine,
  BarChart3,
  ListChecks,
  Hospital,
  Ambulance,
  MessageSquare,
  Map,
  Link,
  UserCircle,
  Building2,
  Zap,
  Skull,
  DollarSign,
  Star,
  ChevronRight,
  AlertTriangle,
  Target,
  Flame,
  Award,
  Landmark,
  Crosshair,
  Gift,
  Newspaper,
  Dices,
  LocateFixed,
  Warehouse,
} from "lucide-react";

interface HomeViewProps {
  onViewChange: (view: string) => void;
}

const HomeView = ({ onViewChange }: HomeViewProps) => {
  const districts = [
    {
      name: "DOWNTOWN",
      icon: Briefcase,
      color: "cyber-blue",
      description: "Office jobs, business opportunities",
    },
    {
      name: "ENTERTAINMENT",
      icon: Users,
      color: "cyber-purple",
      description: "Nightlife and social events",
    },
    {
      name: "RESIDENTIAL",
      icon: MapPin,
      color: "cyber-orange",
      description: "Quiet neighborhood jobs",
    },
    {
      name: "INDUSTRIAL",
      icon: Trophy,
      color: "cyber-green",
      description: "Heavy work and competition",
    },
  ];

  const quickActions = [
    {
      title: "MISSIONS",
      icon: ListChecks,
      color: "cyber-blue",
      onClick: () => onViewChange("missions"),
    },
    {
      title: "GANG",
      icon: Users2,
      color: "cyber-purple",
      onClick: () => onViewChange("gang"),
    },
    {
      title: "STATS",
      icon: BarChart3,
      color: "cyber-green",
      onClick: () => onViewChange("stats"),
    },
    {
      title: "MESSAGES",
      icon: MessageSquare,
      color: "cyber-pink",
      onClick: () => onViewChange("messages"),
    },
  ];

  return (
    <>
      {/* Conteúdo principal */}
      <div className="space-y-3 mt-0 pt-0 overflow-x-hidden pb-16">
        {/* Mini Jogo: Roleta de Prêmios Diários */}
        <div
          className="lucky-box flex flex-col justify-between items-center"
          style={{
            background: "linear-gradient(to bottom, #2c1c2c, #1b0f1b)",
            border: "1px solid #ff69b4",
            borderRadius: "12px",
            boxShadow: "inset 0 0 8px #ff69b4",
            padding: "16px",
            color: "#ff69b4",
            height: "180px",
            minHeight: "180px",
            maxHeight: "180px",
          }}
        >
          <div
            className="flex flex-col items-center justify-center w-full mb-2"
            style={{
              fontWeight: "bold",
              fontSize: "1.15rem",
              letterSpacing: "0.5px",
            }}
          >
            <span className="flex items-center gap-2 justify-center">
              <Gift size={22} className="text-pink-400" />
              Lucky Wheel
              <span className="text-yellow-300 animate-pulse">✨</span>
            </span>
          </div>
          {/* Mini roleta horizontal */}
          <div
            className="flex items-center justify-center w-full rounded bg-black/30 px-3 py-2 mb-2"
            style={{
              fontSize: "1.5rem",
              letterSpacing: "0.2em",
              fontWeight: 500,
              border: "1px solid #ff69b4",
              boxShadow: "0 0 6px #ff69b4aa",
              minHeight: "2.5rem",
            }}
          >
            💰💊⭐🔋❓💰⭐💊
          </div>
          <button
            className="spin-btn flex items-center justify-center mx-auto"
            style={{
              background: "radial-gradient(circle at center, #ff69b4, #d62b87)",
              border: "none",
              padding: "12px 32px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "30px",
              color: "white",
              boxShadow: "0 0 10px #ff69b4aa",
              cursor: "pointer",
              marginTop: "0",
            }}
            onClick={() => onViewChange("luckywheel")}
          >
            <Gift size={18} className="mr-2" />
            Spin
          </button>
        </div>

        {/* Feed de Notícias do Mundo */}
        <div className="rounded-xl bg-gradient-to-br from-cyber-dark-light to-cyber-dark-medium p-4 border border-cyber-blue/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-cyber-blue text-base">
              <Newspaper size={20} className="text-cyber-blue" />
              News Feed
            </div>
            <a
              href="#"
              className="text-xs text-cyber-blue/70 hover:underline font-semibold"
              onClick={(e) => {
                e.preventDefault();
                onViewChange("news");
              }}
            >
              More
            </a>
          </div>
          <ul className="divide-y divide-cyber-blue/20">
            <li className="py-2 flex items-start gap-2">
              <span className="text-cyber-blue/80 text-lg">📰</span>
              <div>
                <span className="font-semibold text-cyber-blue">
                  Cobras gang takes over industrial district
                </span>
                <div className="text-xs text-cyber-blue/60">5 min ago</div>
              </div>
            </li>
            <li className="py-2 flex items-start gap-2">
              <span className="text-cyber-blue/80 text-lg">🎰</span>
              <div>
                <span className="font-semibold text-cyber-blue">
                  Player X wins $100k at the casino
                </span>
                <div className="text-xs text-cyber-blue/60">12 min ago</div>
              </div>
            </li>
            <li className="py-2 flex items-start gap-2">
              <span className="text-cyber-blue/80 text-lg">🚓</span>
              <div>
                <span className="font-semibold text-cyber-blue">
                  Police increase patrols downtown
                </span>
                <div className="text-xs text-cyber-blue/60">30 min ago</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        {/* Removido os botões de atalho para missions, gang, stats e messages */}

        {/* Main Actions */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-0">
          <button
            onClick={() => onViewChange("robbery")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500/20">
                <LocateFixed size={24} className="text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-red-500">ROBBERY</h3>
                <p className="text-xs text-red-500/70">Engage in crimes</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-red-500/50" />
            </div>
          </button>

          <button
            onClick={() => onViewChange("nightlife")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Wine size={24} className="text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-purple-500">NIGHTLIFE</h3>
                <p className="text-xs text-purple-500/70">
                  Clubs & Prostitutes
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-purple-500/50" />
            </div>
          </button>

          <button
            onClick={() => onViewChange("hospital")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Ambulance size={24} className="text-green-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-green-500">HOSPITAL</h3>
                <p className="text-xs text-green-500/70">Heal & recover</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-green-500/50" />
            </div>
          </button>

          <button
            onClick={() => onViewChange("business")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Warehouse size={24} className="text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-blue-500">BUSINESS</h3>
                <p className="text-xs text-blue-500/70">Manage empire</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-blue-500/50" />
            </div>
          </button>

          {/* Novo botão: BANK */}
          <button
            onClick={() => onViewChange("bank")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-400/20">
                <Landmark size={24} className="text-yellow-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-yellow-600">BANK</h3>
                <p className="text-xs text-yellow-600/70">Banking & heists</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-yellow-500/50" />
            </div>
          </button>

          {/* Novo botão: CASINO */}
          <button
            onClick={() => onViewChange("casino")}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-400/20 to-pink-600/20 p-4 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-400/20">
                <Dices size={24} className="text-pink-500" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-sm text-pink-600">CASINO</h3>
                <p className="text-xs text-pink-600/70">Gamble & win</p>
              </div>
            </div>
            <div className="absolute bottom-2 right-2">
              <ChevronRight size={16} className="text-pink-500/50" />
            </div>
          </button>
        </div>

        {/* City Map */}
        {/* ... código removido até o fechamento do último </div> dessa seção ... */}
      </div>
    </>
  );
};

export default HomeView;
