
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useBuyBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playerId, businessId }: { playerId: string; businessId: string }) => {
      // Get business and player data first
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('price')
        .eq('id', businessId)
        .single();

      if (businessError) throw businessError;

      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('money')
        .eq('id', playerId)
        .single();

      if (playerError) throw playerError;

      if (player.money < business.price) {
        throw new Error('Not enough money');
      }

      // Update player money
      const { error: updateError } = await supabase
        .from('players')
        .update({ money: player.money - business.price })
        .eq('id', playerId);

      if (updateError) throw updateError;

      // Add to business history
      const { error: historyError } = await supabase
        .from('business_history')
        .insert({
          player_id: playerId,
          business_id: businessId,
          income: business.price
        });

      if (historyError) throw historyError;

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player', variables.playerId] });
    },
  });
};
