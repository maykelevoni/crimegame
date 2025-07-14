import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessType {
  id: string;
  name: string;
  type:
    | "restaurant"
    | "nightclub" 
    | "convenience_store"
    | "laundromat"
    | "auto_shop"
    | "pawn_shop"
    | "strip_club"
    | "drug_lab"
    | "cocaine_lab"
    | "meth_lab"
    | "counterfeit_money"
    | "weed_farm"
    | "black_market_syndicate"
    | "arms_dealer"
    | "office";
  description: string;
  base_price: number;
  base_income: number;
  max_level: number;
  upgrade_cost_multiplier: number;
  income_multiplier: number;
  risk_level: number;
  available: boolean;
  created_at: string;
}

export interface PlayerBusiness {
  id: string;
  player_id: string;
  business_type_id: string;
  level: number;
  income_per_hour: number;
  last_collected: string;
  created_at: string;
  business_type?: BusinessType;
}

export const useBusinessTypes = () => {
  return useQuery({
    queryKey: ["business-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("available", true)
        .order("base_price", { ascending: true });

      if (error) throw error;
      return data as unknown as BusinessType[];
    },
  });
};

export const usePlayerBusinesses = (playerId: string) => {
  return useQuery({
    queryKey: ["player-businesses", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("player_id", playerId);

      if (error) throw error;
      return data as unknown as PlayerBusiness[];
    },
    enabled: !!playerId,
  });
};

export const useBuyBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      businessTypeId,
    }: {
      playerId: string;
      businessTypeId: string;
    }) => {
      // Get business type and player data
      const { data: businessType, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessTypeId)
        .single();

      if (businessError) throw businessError;

      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;

      const businessTypeData = businessType as unknown as BusinessType;

      if (player.money < businessTypeData.base_price) {
        throw new Error("Not enough money");
      }

      // Calculate income based on level 1
      const incomePerHour = businessTypeData.base_income;

      // Update player money
      const { error: updateError } = await supabase
        .from("players")
        .update({ money: player.money - businessTypeData.base_price })
        .eq("id", playerId);

      if (updateError) throw updateError;

      // Create player business
      const { data: newBusiness, error: businessCreateError } = await supabase
        .from("businesses")
        .insert({
          player_id: playerId,
          business_type_id: businessTypeId,
          level: 1,
          income_per_hour: incomePerHour,
          last_collected: new Date().toISOString(),
        })
        .select(
          `
          *,
          *
        `
        )
        .single();

      if (businessCreateError) throw businessCreateError;

      return newBusiness as unknown as PlayerBusiness;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["player", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["player-businesses", variables.playerId],
      });
    },
  });
};

export const useCollectBusinessIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      businessId,
    }: {
      playerId: string;
      businessId: string;
    }) => {
      // Get business data
      const { data: business, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .eq("player_id", playerId)
        .single();

      if (businessError) throw businessError;

      const businessData = business as unknown as PlayerBusiness;

      // Calculate income since last collection
      const lastCollected = new Date(businessData.last_collected);
      const now = new Date();
      const hoursSinceLastCollection =
        (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);
      const income = Math.floor(
        businessData.income_per_hour * hoursSinceLastCollection
      );

      if (income <= 0) {
        throw new Error("No income to collect yet");
      }

      // Get player data
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) throw playerError;

      // Update player money and business last_collected
      const { error: updateError } = await supabase
        .from("players")
        .update({ money: player.money + income })
        .eq("id", playerId);

      if (updateError) throw updateError;

      const { error: businessUpdateError } = await supabase
        .from("businesses")
        .update({ last_collected: now.toISOString() })
        .eq("id", businessId);

      if (businessUpdateError) throw businessUpdateError;

      return { income, business: businessData };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["player", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["player-businesses", variables.playerId],
      });
    },
  });
};
