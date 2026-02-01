import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BostromStats {
  particles: number;
  cyberlinks: number;
  negentropy: number;
  weightsPerSecond: number;
  weightsPerMinute: number;
}

export const useBostromStats = () => {
  return useQuery({
    queryKey: ['bostrom-stats'],
    queryFn: async (): Promise<BostromStats> => {
      const { data, error } = await supabase.functions.invoke('get-bostrom-stats');
      
      if (error) {
        console.error('Error fetching Bostrom stats:', error);
        throw error;
      }
      
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};
