
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/lib/database.types';

type Chama = Database['public']['Tables']['chamas']['Row'];
type ChamaInsert = Database['public']['Tables']['chamas']['Insert'];

export const useChamas = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chamas', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chamas')
        .select(`
          *,
          chama_members!inner(role, is_active),
          contributions(amount, status),
          loans(amount, status)
        `)
        .eq('chama_members.user_id', user.id)
        .eq('chama_members.is_active', true);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateChama = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chamaData: Omit<ChamaInsert, 'created_by'>) => {
      if (!user) throw new Error('User not authenticated');

      // Create the chama
      const { data: chama, error: chamaError } = await supabase
        .from('chamas')
        .insert({
          ...chamaData,
          created_by: user.id,
        })
        .select()
        .single();

      if (chamaError) throw chamaError;

      // Add the creator as an admin member
      const { error: memberError } = await supabase
        .from('chama_members')
        .insert({
          chama_id: chama.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      return chama;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chamas'] });
      toast({
        title: "Chama Created!",
        description: "Your new Chama has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
