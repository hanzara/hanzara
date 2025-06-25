
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const callbackData = await req.json();
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    if (stkCallback) {
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

      let transactionData = {
        merchant_request_id: MerchantRequestID,
        checkout_request_id: CheckoutRequestID,
        result_code: ResultCode,
        result_desc: ResultDesc,
        amount: 0,
        receipt_number: '',
        transaction_date: new Date().toISOString(),
        phone_number: '',
      };

      // If transaction was successful, extract metadata
      if (ResultCode === 0 && CallbackMetadata && CallbackMetadata.Item) {
        const items = CallbackMetadata.Item;
        
        items.forEach((item: any) => {
          switch (item.Name) {
            case 'Amount':
              transactionData.amount = item.Value;
              break;
            case 'MpesaReceiptNumber':
              transactionData.receipt_number = item.Value;
              break;
            case 'TransactionDate':
              transactionData.transaction_date = new Date(item.Value.toString()).toISOString();
              break;
            case 'PhoneNumber':
              transactionData.phone_number = item.Value.toString();
              break;
          }
        });

        // Store successful transaction in wallet_transactions
        const { error: insertError } = await supabase
          .from('wallet_transactions')
          .insert({
            amount: transactionData.amount,
            type: 'deposit',
            currency: 'KES',
            description: `M-Pesa deposit - ${transactionData.receipt_number}`,
            status: 'completed',
            user_id: null, // You might want to link this to a specific user based on phone number
          });

        if (insertError) {
          console.error('Error inserting transaction:', insertError);
        }
      }

      // Store callback data for reference
      const { error } = await supabase
        .from('mpesa_callbacks')
        .insert(transactionData);

      if (error) {
        console.error('Error storing callback:', error);
      }
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: 'Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
