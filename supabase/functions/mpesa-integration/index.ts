
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MpesaAccessToken {
  access_token: string;
  expires_in: string;
}

interface STKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

serve(async (req) => {
  console.log('=== M-Pesa Integration Function Called ===');
  console.log('Request method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const { action, phoneNumber, amount, description } = requestBody;

    console.log('=== Processing M-Pesa Action ===');
    console.log('Action:', action);
    console.log('Phone Number:', phoneNumber);
    console.log('Amount:', amount);

    // Get M-Pesa credentials from environment variables
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');

    console.log('=== Checking Credentials ===');
    console.log('Consumer Key exists:', !!consumerKey);
    console.log('Consumer Secret exists:', !!consumerSecret);

    if (!consumerKey || !consumerSecret) {
      console.error('=== MISSING CREDENTIALS ===');
      
      return new Response(JSON.stringify({ 
        error: 'M-Pesa credentials not configured',
        details: 'MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET must be set in Edge Function secrets'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate input for STK Push
    if (action === 'stk_push') {
      if (!phoneNumber || !amount) {
        console.error('Missing required parameters for STK Push');
        return new Response(JSON.stringify({ 
          error: 'Missing parameters',
          details: 'phoneNumber and amount are required for STK Push'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (amount < 1) {
        console.error('Invalid amount:', amount);
        return new Response(JSON.stringify({ 
          error: 'Invalid amount',
          details: 'Amount must be at least 1 KES'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // For demo purposes, return a mock successful response
      console.log('=== DEMO MODE: Returning mock successful response ===');
      const mockResponse = {
        MerchantRequestID: "mock-merchant-" + Date.now(),
        CheckoutRequestID: "mock-checkout-" + Date.now(),
        ResponseCode: "0",
        ResponseDescription: "Success. Request accepted for processing",
        CustomerMessage: "Success. Request accepted for processing"
      };

      console.log('Mock response:', JSON.stringify(mockResponse, null, 2));
      
      return new Response(JSON.stringify(mockResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'check_balance') {
      console.log('=== DEMO MODE: Balance Check ===');
      return new Response(JSON.stringify({ 
        balance: { 
          WorkingAccountBalance: "1000.00 KES",
          UtilityAccountBalance: "500.00 KES"
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'transaction_status') {
      console.log('=== DEMO MODE: Transaction Status ===');
      const { checkoutRequestId } = requestBody;
      return new Response(JSON.stringify({
        ResponseCode: "0",
        ResponseDescription: "The service request has been accepted successfully",
        MerchantRequestID: "mock-merchant-123",
        CheckoutRequestID: checkoutRequestId,
        ResultCode: "0",
        ResultDesc: "The service request is processed successfully."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.error('Invalid action:', action);
    return new Response(JSON.stringify({ 
      error: 'Invalid action',
      details: `Supported actions: stk_push, check_balance, transaction_status. Received: ${action}`
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== FUNCTION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message,
      details: 'Please check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
