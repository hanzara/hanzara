
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useMpesaIntegration = () => {
  const { toast } = useToast();

  const stkPushMutation = useMutation({
    mutationFn: async ({ phoneNumber, amount, description }: {
      phoneNumber: string;
      amount: number;
      description?: string;
    }) => {
      console.log('Initiating STK Push:', { phoneNumber, amount, description });

      const { data, error } = await supabase.functions.invoke('mpesa-integration', {
        body: {
          action: 'stk_push',
          phoneNumber,
          amount,
          description: description || 'Chama transaction'
        }
      });

      if (error) {
        console.error('STK Push error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('STK Push success:', data);
      if (data.ResponseCode === '0') {
        toast({
          title: "Payment Request Sent",
          description: "Check your phone for the M-Pesa PIN prompt",
        });
      } else {
        toast({
          title: "Payment Request Failed",
          description: data.ResponseDescription || "Failed to send payment request",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('STK Push mutation error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    },
  });

  const checkTransactionStatusMutation = useMutation({
    mutationFn: async (checkoutRequestId: string) => {
      const { data, error } = await supabase.functions.invoke('mpesa-integration', {
        body: {
          action: 'transaction_status',
          checkoutRequestId
        }
      });

      if (error) throw error;
      return data;
    },
  });

  const checkBalanceMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mpesa-integration', {
        body: {
          action: 'check_balance'
        }
      });

      if (error) throw error;
      return data;
    },
  });

  return {
    stkPushMutation,
    checkTransactionStatusMutation,
    checkBalanceMutation,
    isProcessingPayment: stkPushMutation.isPending,
    isCheckingStatus: checkTransactionStatusMutation.isPending,
    isCheckingBalance: checkBalanceMutation.isPending,
  };
};
