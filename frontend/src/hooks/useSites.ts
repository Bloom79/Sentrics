import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSites() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
}

export function useSite(siteId: string | undefined) {
  return useQuery({
    queryKey: ['sites', siteId],
    queryFn: async () => {
      if (!siteId) return null;
      
      const { data, error } = await supabase
        .from('sites')
        .select(`
          *,
          plants:plants(*)
        `)
        .eq('id', siteId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!siteId
  });
} 