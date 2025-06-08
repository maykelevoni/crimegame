
import React, { createContext, useContext, useState } from 'react';

interface GameContextType {
  currentPlayerId: string;
  setCurrentPlayerId: (id: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  // Using the first sample player ID as default
  const [currentPlayerId, setCurrentPlayerId] = useState('550e8400-e29b-41d4-a716-446655440000');

  return (
    <GameContext.Provider value={{ currentPlayerId, setCurrentPlayerId }}>
      {children}
    </GameContext.Provider>
  );
};
