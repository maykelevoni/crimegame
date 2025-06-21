import GameStatusBar from "./components/GameStatusBar";
import { GameInterface } from "./components/GameInterface";
import { useGameStore } from "./stores/gameStore";

function App() {
  const player = useGameStore((state) => state.player);

  return (
    <div className="min-h-screen w-full">
      <GameStatusBar
        health={player.stats.health}
        maxHealth={player.stats.maxHealth}
        energy={player.stats.energy}
        maxEnergy={player.stats.maxEnergy}
        reputation={player.stats.reputation}
        addiction={player.stats.addiction}
        wantedLevel={player.stats.wantedLevel}
        money={player.stats.money}
        playerName={player.name}
        avatarUrl={player.avatarUrl}
      />
      <GameInterface />
    </div>
  );
}

export default App;
