
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chama_activities')
        .select(`
          id,
          activity_type,
          description,
          amount,
          created_at,
          chamas (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Generate smart notifications based on activities
      const notifications = data?.map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        title: getNotificationTitle(activity.activity_type),
        message: activity.description,
        amount: activity.amount,
        timestamp: activity.created_at,
        chamaName: (activity.chamas as any)?.name,
        isRead: false,
        priority: getNotificationPriority(activity.activity_type)
      })) || [];

      return notifications;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time feel
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // In a real app, you'd update a notifications table
      // For now, we'll just simulate the action
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    refetch: notificationsQuery.refetch
  };
};

const getNotificationTitle = (activityType: string): string => {
  switch (activityType) {
    case 'contribution_made': return 'Contribution Received';
    case 'member_joined': return 'New Member';
    case 'loan_approved': return 'Loan Approved';
    case 'payment_due': return 'Payment Due';
    case 'vote_created': return 'New Vote';
    default: return 'Activity Update';
  }
};

const getNotificationPriority = (activityType: string): 'high' | 'medium' | 'low' => {
  switch (activityType) {
    case 'payment_due':
    case 'loan_approved': return 'high';
    case 'vote_created':
    case 'contribution_made': return 'medium';
    default: return 'low';
  }
};
