import { createContext } from "react";

interface GameContextType {
  currentPlayerId: string;
  setCurrentPlayerId: (id: string) => void;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);
