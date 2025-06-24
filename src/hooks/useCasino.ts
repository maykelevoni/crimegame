import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CasinoGame {
  id: string;
  name: string;
  description: string;
  type: "slots" | "blackjack" | "roulette" | "poker" | "dice";
  min_bet: number;
  max_bet: number;
  house_edge: number;
  payout_multiplier: number;
  available: boolean;
  created_at: string;
}

export const useCasinoGames = () => {
  return useQuery({
    queryKey: ["casino-games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("casino_games")
        .select("*")
        .eq("available", true)
        .order("min_bet", { ascending: true });

      if (error) throw error;
      return data as CasinoGame[];
    },
  });
};

export const useCasinoHistory = (playerId: string) => {
  return useQuery({
    queryKey: ["casino-history", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("casino_history")
        .select(
          `
          *,
          casino_games (*)
        `
        )
        .eq("player_id", playerId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayCasinoGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      gameId,
      betAmount,
    }: {
      playerId: string;
      gameId: string;
      betAmount: number;
    }) => {
      // Get game and player data
      const { data: game, error: gameError } = await supabase
        .from("casino_games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (gameError) throw gameError;

      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;

      // Check requirements
      if (betAmount < game.min_bet || betAmount > game.max_bet) {
        throw new Error(
          `Bet must be between $${game.min_bet} and $${game.max_bet}`
        );
      }

      if (player.money < betAmount) {
        throw new Error("Not enough money");
      }

      // Calculate game result based on type
      let winAmount = 0;
      let gameResult = "";
      const isWin = Math.random() > game.house_edge;

      if (isWin) {
        winAmount = Math.floor(betAmount * game.payout_multiplier);
        gameResult = "win";
      } else {
        gameResult = "loss";
      }

      // Update player money
      const { error: updateError } = await supabase
        .from("players")
        .update({
          money: player.money - betAmount + winAmount,
        })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // Record game result
      const { error: historyError } = await supabase
        .from("casino_history")
        .insert({
          player_id: playerId,
          game_id: gameId,
          bet_amount: betAmount,
          win_amount: winAmount,
          game_result: gameResult,
        });

      if (historyError) throw historyError;

      return {
        game,
        betAmount,
        winAmount,
        isWin,
        gameResult,
        netProfit: winAmount - betAmount,
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["player", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["casino-history", variables.playerId],
      });
    },
  });
};
