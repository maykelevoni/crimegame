import React, { useState } from "react";
import { GameContext } from "./GameContext";

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  // Using the first sample player ID as default
  const [currentPlayerId, setCurrentPlayerId] = useState(
    "550e8400-e29b-41d4-a716-446655440000"
  );

  return (
    <GameContext.Provider value={{ currentPlayerId, setCurrentPlayerId }}>
      {children}
    </GameContext.Provider>
  );
};
