
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
      console.log('=== M-Pesa STK Push Started ===');
      console.log('Phone Number:', phoneNumber);
      console.log('Amount:', amount);
      console.log('Description:', description);

      try {
        const { data, error } = await supabase.functions.invoke('mpesa-integration', {
          body: {
            action: 'stk_push',
            phoneNumber,
            amount,
            description: description || 'Chama transaction'
          }
        });

        console.log('=== Supabase Function Response ===');
        console.log('Data:', data);
        console.log('Error:', error);

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to call M-Pesa service');
        }

        if (!data) {
          console.error('No data returned from function');
          throw new Error('No response from M-Pesa service');
        }

        // Check if it's an error response from the function
        if (data.error) {
          console.error('M-Pesa API error:', data.error);
          throw new Error(data.error);
        }

        console.log('=== M-Pesa API Response ===');
        console.log('Response Code:', data.ResponseCode);
        console.log('Response Description:', data.ResponseDescription);
        console.log('Full Response:', data);

        return data;
      } catch (err) {
        console.error('=== M-Pesa Integration Error ===');
        console.error('Error type:', typeof err);
        console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
        console.error('Full error:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('=== STK Push Mutation Success ===');
      console.log('Success data:', data);
      
      if (data?.ResponseCode === '0') {
        toast({
          title: "Payment Request Sent! 📱",
          description: "Check your phone for the M-Pesa PIN prompt. Enter your PIN to complete the payment.",
        });
      } else {
        console.warn('Unexpected response code:', data?.ResponseCode);
        toast({
          title: "Payment Request Issues",
          description: data?.ResponseDescription || data?.errorMessage || "Please check your phone and try again",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('=== STK Push Mutation Error ===');
      console.error('Error in onError:', error);
      
      let errorMessage = "Failed to initiate payment. Please try again.";
      
      if (error?.message) {
        if (error.message.includes('credentials')) {
          errorMessage = "M-Pesa service configuration error. Please contact support.";
        } else if (error.message.includes('network') || error.message.includes('Network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('phone') || error.message.includes('Phone')) {
          errorMessage = "Invalid phone number. Please check the format and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Payment Failed ❌",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const checkTransactionStatusMutation = useMutation({
    mutationFn: async (checkoutRequestId: string) => {
      console.log('Checking transaction status for:', checkoutRequestId);
      
      const { data, error } = await supabase.functions.invoke('mpesa-integration', {
        body: {
          action: 'transaction_status',
          checkoutRequestId
        }
      });

      if (error) {
        console.error('Transaction status check error:', error);
        throw new Error(error.message);
      }
      
      console.log('Transaction status response:', data);
      return data;
    },
  });

  const checkBalanceMutation = useMutation({
    mutationFn: async () => {
      console.log('Checking M-Pesa balance...');
      
      const { data, error } = await supabase.functions.invoke('mpesa-integration', {
        body: {
          action: 'check_balance'
        }
      });

      if (error) {
        console.error('Balance check error:', error);
        throw new Error(error.message);
      }
      
      console.log('Balance check response:', data);
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
