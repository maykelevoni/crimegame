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

  // Functions for random explicit messages
  const getRandomSuccessMessage = () => {
    const messages = [
      "FUCK YEAH! You robbed those bitches blind! Easy money, motherfucker! 💰",
      "Holy shit! You pulled that heist like a fucking pro! Nobody saw a damn thing! 😎",
      "BADASS! You just became the king of crime! Those pussies didn't know what hit them! 👑",
      "DAMN! You cleaned out those suckers! Time to spend that dirty money! 🔥",
      "Like a fucking ghost! In and out without those idiots noticing! 🥷",
      "BOOM! Another successful robbery! You're a criminal mastermind! 🎯",
      "The cops are scratching their asses while you're counting cash! 😂",
      "Born to steal! You're a natural-born thief, you beautiful bastard! ⭐",
      "Clean fucking getaway! Those losers will never catch you! 🏃‍♂️",
      "Robbery perfection! You just wrote the book on how to steal shit! 🎨",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomFailureMessage = () => {
    const messages = [
      "SHIT! The fucking alarm went off! You screwed that up, dumbass! 🚨",
      "Bad luck, asshole! Sometimes crime doesn't pay! 🍀",
      "The security guard wasn't sleeping on the job! Tough shit! 👮‍♂️",
      "You fucked up! Try again when you grow some balls! 🤞",
      "Someone spotted your stupid ass! Learn to be more sneaky! 👀",
      "Timing was shit! You rushed it like an amateur! ⏰",
      "Sometimes you win, sometimes you lose! That's crime, bitch! 🎲",
      "The pigs showed up too fast! Your intel was garbage! 🚔",
      "Some snitch called the cops! Can't trust anyone these days! 😤",
      "Get better at this shit! Practice makes perfect, you rookie! 💪",
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

        // Dismiss any existing toasts to prevent stacking
        toast.dismiss();
        
        // Show detailed result notifications with delay
        if (result.success) {
          // Success notification with explicit language
          toast.success(
            <div className="space-y-1">
              <div className="text-green-400 font-bold text-lg">
                🔥 ROBBERY SUCCESS! 🔥
              </div>
              <div className="text-green-400">
                💰 Cash stolen: ${result.reward.toLocaleString()}
              </div>
              <div className="text-yellow-400">
                ⚡ Energy used: {result.energy_spent}
              </div>
              <div className="text-red-400">
                🩸 Health lost: {result.health_spent}
              </div>
              <div className="text-blue-400">
                ⭐ Rep gained: +{result.reputation_gained}
              </div>
              <div className="text-red-400">
                🚨 Heat level: +{result.wanted_increase}
              </div>
              <div className="text-sm text-white mt-2 font-bold">
                {getRandomSuccessMessage()}
              </div>
            </div>,
            {
              duration: 4000, // 4 seconds for success
            }
          );
        } else {
          // Failure notification with explicit language
          toast.error(
            <div className="space-y-1">
              <div className="text-red-400 font-bold text-lg">
                💥 ROBBERY FAILED! 💥
              </div>
              <div className="text-red-400">💸 No cash stolen</div>
              <div className="text-yellow-400">
                ⚡ Energy wasted: {result.energy_spent}
              </div>
              <div className="text-red-400">
                🩸 Health lost: {result.health_spent}
              </div>
              <div className="text-gray-400">⭐ No rep gained</div>
              <div className="text-red-400">
                🚨 Heat level: +{result.wanted_increase}
              </div>
              <div className="text-sm text-white mt-2 font-bold">
                {getRandomFailureMessage()}
              </div>
            </div>,
            {
              duration: 4000, // 4 seconds for failure
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
