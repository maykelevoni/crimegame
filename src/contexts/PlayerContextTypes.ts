import { createContext } from "react";
import type { Player, Item, Business } from "@/types/game";

interface PlayerContextType {
  player: Player | null;
  inventory: Item[];
  businesses: Business[];
  loading: boolean;
  error: string | null;
  updatePlayer: (updates: Partial<Player>) => Promise<void>;
  addItemToInventory: (itemId: string, quantity?: number) => Promise<void>;
  buyBusiness: (
    business: Omit<Business, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  addCrimeHistory: (
    crimeId: string,
    reward: number,
    success: boolean
  ) => Promise<void>;
  getShopItems: () => Promise<Item[]>;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);
