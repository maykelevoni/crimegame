import React, { useState } from "react";
import BaseView from "./BaseView";
import {
  Wallet,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle,
  Crosshair,
  Skull,
  TrendingUp,
} from "lucide-react";
import {
  useRobberies,
  useExecuteRobbery,
  type Robbery,
} from "@/hooks/useRobberies";
import { useGameStore } from "@/stores/gameStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RobberyView = () => {
  const [isExecuting, setIsExecuting] = useState(false);

  const { data: robberies = [], isLoading, error } = useRobberies();
  const executeRobbery = useExecuteRobbery();
  const { player } = useGameStore();

  // Funções para mensagens aleatórias
  const getRandomSuccessMessage = () => {
    const messages = [
      "Foi mais fácil que tirar doce de criança! 🍭",
      "Smooth como seda! Ninguém viu nada... 😎",
      "Perfeito! Agora você é uma lenda nas ruas! 👑",
      "Mission accomplished! Dinheiro no bolso! 💰",
      "Como um ninja na noite! Silencioso e eficiente! 🥷",
      "Boom! Mais um golpe perfeito! 🎯",
      "Os policiais ainda estão procurando... 😂",
      "Você nasceu para isso! Talento natural! ⭐",
      "Clean getaway! Ninguém vai te pegar! 🏃‍♂️",
      "A arte do roubo em sua forma mais pura! 🎨",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomFailureMessage = () => {
    const messages = [
      "Ops! Alguém esqueceu de desligar o alarme... 🚨",
      "Parece que a sorte não estava do seu lado hoje! 🍀",
      "O segurança estava mais atento que o normal! 👮‍♂️",
      "Melhor sorte na próxima vez, parceiro! 🤞",
      "Alguém deve ter visto você chegando... 👀",
      "O timing estava um pouco off! ⏰",
      "Nem sempre dá certo, faz parte do jogo! 🎲",
      "A polícia chegou mais rápido que esperado! 🚔",
      "Alguém ligou para a polícia! Traidor! 😤",
      "Melhor treinar mais antes da próxima tentativa! 💪",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleStart = async (robbery: Robbery) => {
    if (!player?.id) {
      toast.error("Player not found");
      return;
    }

    setIsExecuting(true);

    try {
      const result = await executeRobbery.mutateAsync({
        playerId: player.id,
        robberyId: robbery.id,
      });

      setTimeout(() => {
        setIsExecuting(false);

        // Show detailed result notifications with delay
        if (result.success) {
          // Success notification with detailed info
          toast.success(
            <div className="space-y-1">
              <div className="text-green-400">
                💰 Stolen: ${result.reward.toLocaleString()}
              </div>
              <div className="text-yellow-400">
                ⚡ Energy spent: {result.energy_spent}
              </div>
              <div className="text-red-400">
                ❤️ Health lost: {result.health_spent}
              </div>
              <div className="text-blue-400">
                ⭐ Reputation gained: +{result.reputation_gained}
              </div>
              <div className="text-red-400">
                🚨 Wanted level: +{result.wanted_increase}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {getRandomSuccessMessage()}
              </div>
            </div>,
            {
              duration: 6000, // 6 seconds
            }
          );
        } else {
          // Failure notification with costs
          toast.error(
            <div className="space-y-1">
              <div className="text-red-400">💸 No money gained</div>
              <div className="text-yellow-400">
                ⚡ Energy spent: {result.energy_spent}
              </div>
              <div className="text-red-400">
                ❤️ Health lost: {result.health_spent}
              </div>
              <div className="text-gray-400">⭐ No reputation gained</div>
              <div className="text-red-400">
                🚨 Wanted level: +{result.wanted_increase}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {getRandomFailureMessage()}
              </div>
            </div>,
            {
              duration: 6000, // 6 seconds
            }
          );
        }
      }, 1200);
    } catch (error) {
      setIsExecuting(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to execute robbery"
      );
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 25) return "text-green-400";
    if (risk <= 50) return "text-yellow-400";
    if (risk <= 75) return "text-orange-400";
    return "text-red-400";
  };

  const getDifficultyColor = (riskLevel: number) => {
    if (riskLevel <= 2) return "bg-green-500";
    if (riskLevel <= 4) return "bg-yellow-500";
    if (riskLevel <= 6) return "bg-orange-500";
    if (riskLevel <= 8) return "bg-red-500";
    return "bg-purple-500";
  };

  const getDifficultyText = (riskLevel: number) => {
    if (riskLevel <= 2) return "Easy";
    if (riskLevel <= 4) return "Medium";
    if (riskLevel <= 6) return "Hard";
    if (riskLevel <= 8) return "Very Hard";
    return "Extreme";
  };

  if (isLoading) {
    return (
      <BaseView title="Robbery & Heists">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading robberies...</div>
        </div>
      </BaseView>
    );
  }

  if (error) {
    return (
      <BaseView title="Robbery & Heists">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error loading robberies</div>
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView title="Robbery & Heists">
      {/* Test Button - Restore Energy */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={async () => {
            if (player?.id) {
              try {
                await supabase
                  .from("players")
                  .update({
                    energy: 100,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", player.id);

                toast.success("Energy restored to 100!");
                // Force reload player data without page reload
                const store = useGameStore.getState();
                if (store.userId) {
                  await store.loadGameData(store.userId);
                }
              } catch (error) {
                toast.error("Failed to restore energy");
                console.error(error);
              }
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          🔋 Restore Energy to 100 (Test)
        </button>
      </div>

      {/* Available Heists */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Skull size={24} className="text-red-400" />
          Available Heists
        </h2>
        <div className="grid gap-4">
          {robberies.map((robbery) => {
            const difficultyColor = getDifficultyColor(robbery.risk_level);
            const difficultyText = getDifficultyText(robbery.risk_level);
            const canExecute =
              player &&
              player.stats.reputation >= robbery.min_level &&
              player.stats.energy >= robbery.energy_cost;

            return (
              <div
                key={robbery.id}
                className={`p-4 rounded-xl border ${difficultyColor.replace(
                  "bg-",
                  "border-"
                )}/30 ${difficultyColor.replace(
                  "bg-",
                  "bg-"
                )}/10 cursor-pointer hover:scale-[1.02] transition-transform ${
                  !canExecute ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => canExecute && handleStart(robbery)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center">
                    <Crosshair size={24} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold text-white ${difficultyColor}`}
                      >
                        {difficultyText}
                      </span>
                      <h3 className="font-bold text-white truncate">
                        {robbery.name}
                      </h3>
                      <span
                        className={`text-xs font-bold ${getRiskColor(
                          robbery.risk_level * 10
                        )} flex-shrink-0`}
                      >
                        ⚠️ {robbery.risk_level * 10}%
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-3 line-clamp-2">
                      {robbery.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Wallet size={14} className="text-green-400" />
                        <span className="text-green-400">
                          ${robbery.base_reward.toLocaleString()} - $
                          {robbery.max_reward.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400" />
                        <span className="text-yellow-400">
                          {robbery.energy_cost} Energy
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-blue-400" />
                        <span className="text-blue-400">
                          Reputation {robbery.min_level}+
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={14} className="text-red-400" />
                        <span className="text-red-400">
                          {robbery.success_rate}% Success
                        </span>
                      </div>
                    </div>
                    {!canExecute && (
                      <div className="mt-2 text-xs text-red-400">
                        {player &&
                          player.stats.reputation < robbery.min_level && (
                            <div>
                              ❌ Requires reputation {robbery.min_level} (you
                              have {player.stats.reputation})
                            </div>
                          )}
                        {player &&
                          player.stats.energy < robbery.energy_cost && (
                            <div>
                              ❌ Not enough energy: {robbery.energy_cost} needed
                              (you have {player.stats.energy})
                            </div>
                          )}
                        {!player && <div>❌ Player not loaded</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Modal */}
      {isExecuting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl border border-red-500/30">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">
                Executing Heist...
              </h3>
              <p className="text-white/70">
                Please wait while we process your robbery attempt.
              </p>
            </div>
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default RobberyView;
