import GameStatusBar from "./components/GameStatusBar";
import { GameInterface } from "./components/GameInterface";

function App() {
  const mockPlayerStats = {
    health: 100,
    maxHealth: 100,
    energy: 65,
    maxEnergy: 100,
    addiction: 40,
    reputation: 25,
    money: 2500,
    wantedLevel: 15,
  };

  return (
    <div className="min-h-screen w-full">
      <GameStatusBar
        health={mockPlayerStats.health}
        maxHealth={mockPlayerStats.maxHealth}
        energy={mockPlayerStats.energy}
        maxEnergy={mockPlayerStats.maxEnergy}
        reputation={mockPlayerStats.reputation}
        addiction={mockPlayerStats.addiction}
        wantedLevel={mockPlayerStats.wantedLevel}
        money={mockPlayerStats.money}
      />
      <GameInterface playerStats={mockPlayerStats} />
    </div>
  );
}

export default App;
