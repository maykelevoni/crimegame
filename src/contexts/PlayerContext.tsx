import React, { createContext, useContext, ReactNode } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { Player, Item, Business } from "@/types/game";

interface PlayerContextType {
  player: Player | null;
  inventory: Item[];
  businesses: Business[];
  loading: boolean;
  error: string | null;
  updatePlayer: (updates: Partial<Player>) => Promise<void>;
  addWeaponToInventory: (weaponId: string, quantity?: number) => Promise<void>;
  buyBusiness: (
    business: Omit<Business, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  addCrimeHistory: (
    crimeId: string,
    reward: number,
    success: boolean
  ) => Promise<void>;
  getShopWeapons: () => Promise<Item[]>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};

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
