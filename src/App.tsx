import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useGameStore } from "./stores/gameStore";
import GameStatusBar from "./components/GameStatusBar";
import { GameInterface } from "./components/GameInterface";
import { LoginModal } from "./components/auth/LoginModal";
import { RegisterModal } from "./components/auth/RegisterModal";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { Toaster } from "./components/ui/toaster";

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { user, signOut } = useAuth();
  const { player, userId, setUserId, loadGameData, syncStatus } =
    useGameStore();

  // Limpar dados antigos do localStorage na primeira execução
  useEffect(() => {
    const hasCleared = localStorage.getItem("urban-hustle-data-cleared");
    if (!hasCleared) {
      console.log("🧹 Limpando dados antigos do localStorage...");
      localStorage.removeItem("urban-hustle-game");
      localStorage.setItem("urban-hustle-data-cleared", "true");
    }
  }, []);

  // Sincronizar userId quando user mudar
  useEffect(() => {
    if (user?.id && user.id !== userId) {
      console.log("🔄 Sincronizando userId:", user.id);
      setUserId(user.id);
    } else if (!user && userId) {
      console.log("🔄 Limpando userId");
      setUserId(null);
    }
  }, [user, userId, setUserId]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Loading states
  const isLoading = !user && syncStatus === "syncing";
  const hasError = syncStatus === "error";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-cyber-blue mt-4">Carregando Urban Hustle...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erro</h1>
          <p className="text-white mb-4">Erro ao carregar dados do jogo</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyber-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-cyber-purple transition-all duration-300"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">Urban Hustle</h1>
          <p className="text-cyber-blue/80 mb-8">
            Entre no mundo do crime urbano e construa seu império
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-6 rounded-lg hover:from-cyber-purple hover:to-cyber-blue transition-all duration-300"
            >
              Entrar
            </button>

            <button
              onClick={() => setShowRegister(true)}
              className="w-full bg-transparent border border-cyber-blue text-cyber-blue font-bold py-3 px-6 rounded-lg hover:bg-cyber-blue/20 transition-all duration-300"
            >
              Criar Conta
            </button>
          </div>
        </div>

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />

        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </div>
    );
  }

  if (!player || !player.id) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-cyber-blue mt-4">Carregando dados do jogador...</p>
        </div>
      </div>
    );
  }

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
        onLogout={handleLogout}
      />
      <GameInterface />
      <Toaster
        position="bottom-right"
        duration={3000}
        closeButton={true}
        richColors={true}
      />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
