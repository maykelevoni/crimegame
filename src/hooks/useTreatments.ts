import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Treatment {
  id: string;
  name: string;
  description: string;
  type: "health" | "energy" | "addiction" | "wanted_level" | "plastic_surgery";
  cost: number;
  health_restore: number;
  energy_restore: number;
  addiction_reduction: number;
  wanted_level_reduction: number;
  duration_minutes: number;
  cooldown_minutes: number;
  min_level: number;
  available: boolean;
  created_at: string;
}

export const useTreatments = () => {
  return useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .order("cost", { ascending: true });

      if (error) throw error;
      return data as Treatment[];
    },
  });
};


export const useExecuteTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      treatmentId,
    }: {
      playerId: string;
      treatmentId: string;
    }) => {
      // Get treatment and player data
      const { data: treatment, error: treatmentError } = await supabase
        .from("treatments")
        .select("*")
        .eq("id", treatmentId)
        .single();

      if (treatmentError) throw treatmentError;

      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;

      // Check requirements
      if (player.level < treatment.min_level) {
        throw new Error(`Required level: ${treatment.min_level}`);
      }

      if (player.money < treatment.cost) {
        throw new Error("Not enough money");
      }

      // Calculate new stats
      const newHealth = Math.min(100, player.health + treatment.health_restore);
      const newEnergy = Math.min(100, player.energy + treatment.energy_restore);
      const newAddiction = Math.max(
        0,
        player.addiction - treatment.addiction_reduction
      );
      const newWantedLevel = Math.max(
        0,
        player.wanted_level - treatment.wanted_level_reduction
      );

      // Update player stats
      const { error: updateError } = await supabase
        .from("players")
        .update({
          health: newHealth,
          energy: newEnergy,
          addiction: newAddiction,
          wanted_level: newWantedLevel,
          money: player.money - treatment.cost,
        })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // No treatment history recording needed

      return {
        treatment,
        newStats: {
          health: newHealth,
          energy: newEnergy,
          addiction: newAddiction,
          wanted_level: newWantedLevel,
        },
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["player", variables.playerId],
      });
    },
  });
};
