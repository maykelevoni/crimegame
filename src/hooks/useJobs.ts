
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('salary', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useWorkJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ playerId, jobId }: { playerId: string; jobId: string }) => {
      // First get the job details
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (jobError) throw jobError;
      
      // Then get player data
      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (playerError) throw playerError;
      
      // Check if player has enough energy
      if (player.energy < job.energy_cost) {
        throw new Error('Not enough energy');
      }
      
      // Update player stats
      const { data, error } = await supabase
        .from('players')
        .update({
          money: player.money + job.salary,
          energy: player.energy - job.energy_cost,
          experience: player.experience + Math.floor(job.salary / 10)
        })
        .eq('id', playerId)
        .select()
        .single();
      
      if (error) throw error;
      return { player: data, job };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['player', data.player.id] });
    },
  });
};
