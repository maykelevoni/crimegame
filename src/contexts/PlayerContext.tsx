import React, { ReactNode } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import { PlayerContext } from "./PlayerContextTypes";

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const playerData = usePlayerData();

  return (
    <PlayerContext.Provider value={playerData}>
      {children}
    </PlayerContext.Provider>
  );
};
