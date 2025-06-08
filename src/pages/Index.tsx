import React, { useState } from "react";
import GameLayout from "../components/GameLayout";
import NeonTabs from "../components/ui/NeonTabs";
import NeonButton from "../components/ui/NeonButton";
import {
  Briefcase,
  Users,
  Trophy,
  Building2,
  Zap,
  Star,
  DollarSign,
  Heart,
} from "lucide-react";
import HomeView from "../views/HomeView";
import NewsView from "../views/NewsView";
import RobberyView from "../views/RobberyView";
import NightlifeView from "../views/NightlifeView";
import HospitalView from "../views/HospitalView";
import PrisonView from "../views/PrisonView";
import BankView from "../views/BankView";
import CasinoView from "../views/CasinoView";

const Index = () => {
  const [currentView, setCurrentView] = useState("home");
  const [tab, setTab] = useState("business");

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onViewChange={setCurrentView} />;
      case "news":
        return <NewsView />;
      case "robbery":
        return <RobberyView />;
      case "nightlife":
        return <NightlifeView />;
      case "hospital":
        return <HospitalView />;
      case "prison":
        return <PrisonView />;
      case "bank":
        return <BankView />;
      case "casino":
        return <CasinoView />;
      default:
        return <HomeView onViewChange={setCurrentView} />;
    }
  };

  return (
    <GameLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </GameLayout>
  );
};

export default Index;
