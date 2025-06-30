import React from "react";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { useGameStore } from "../stores/gameStore";

export function GameInterface() {
  const { player } = useGameStore();

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

  return (
    <div className="bg-cyber-dark text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Game Interface</h1>
        <p>Player: {player.name}</p>
      </div>
    </div>
  );
}