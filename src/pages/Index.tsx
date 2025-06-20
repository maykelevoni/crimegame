import React from "react";
import { GameInterface } from "../components/GameInterface";

const Index = () => {
  // Mock player stats - em produção viria do banco de dados
  const playerStats = {
    health: 85,
    maxHealth: 100,
    energy: 60,
    maxEnergy: 100,
    addiction: 15,
    reputation: 45,
    money: 25000,
    wantedLevel: 25,
  };

  return <GameInterface playerStats={playerStats} />;
};

export default Index;
