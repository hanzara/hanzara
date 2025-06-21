
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'borrower' | 'investor' | 'chama_member' | 'admin';

interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserRoleData[];
    },
    enabled: !!user,
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ role, isPrimary = false }: { role: UserRole; isPrimary?: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role,
          is_primary: isPrimary
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast({
        title: "Role Added",
        description: "Your new role has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add role",
        variant: "destructive",
      });
    },
  });

  const hasRole = (role: UserRole) => {
    return rolesQuery.data?.some(r => r.role === role) || false;
  };

  const getPrimaryRole = (): UserRole | null => {
    const primaryRole = rolesQuery.data?.find(r => r.is_primary);
    return primaryRole?.role || rolesQuery.data?.[0]?.role || null;
  };

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    hasRole,
    getPrimaryRole,
    addRole: addRoleMutation.mutate,
    isAddingRole: addRoleMutation.isPending
  };
};
