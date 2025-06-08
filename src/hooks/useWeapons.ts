
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWeapons = () => {
  return useQuery({
    queryKey: ['weapons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weapons')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const usePlayerInventory = (playerId: string) => {
  return useQuery({
    queryKey: ['inventory', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          weapons (*)
        `)
        .eq('player_id', playerId);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useBuyWeapon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playerId, weaponId }: { playerId: string; weaponId: string }) => {
      // Get weapon and player data first
      const { data: weapon, error: weaponError } = await supabase
        .from('weapons')
        .select('price')
        .eq('id', weaponId)
        .single();

      if (weaponError) throw weaponError;

      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('money')
        .eq('id', playerId)
        .single();

      if (playerError) throw playerError;

      if (player.money < weapon.price) {
        throw new Error('Not enough money');
      }

      // Update player money
      const { error: updateError } = await supabase
        .from('players')
        .update({ money: player.money - weapon.price })
        .eq('id', playerId);

      if (updateError) throw updateError;

      // Add weapon to inventory
      const { error: inventoryError } = await supabase
        .from('inventory')
        .upsert({
          player_id: playerId,
          weapon_id: weaponId,
          quantity: 1
        }, {
          onConflict: 'player_id,weapon_id'
        });

      if (inventoryError) throw inventoryError;

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['player', variables.playerId] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.playerId] });
    },
  });
};
