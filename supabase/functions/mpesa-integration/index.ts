
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, phoneNumber, amount, description } = await req.json();

    console.log('M-Pesa Integration - Action:', action);

    // Get M-Pesa credentials from secrets
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');

    console.log('Consumer Key exists:', !!consumerKey);
    console.log('Consumer Secret exists:', !!consumerSecret);

    if (!consumerKey || !consumerSecret) {
      console.error('Missing M-Pesa credentials');
      return new Response(JSON.stringify({ 
        error: 'M-Pesa credentials not configured properly',
        details: 'Please check your MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get access token
    const accessToken = await getMpesaAccessToken(consumerKey, consumerSecret);
    
    if (action === 'stk_push') {
      const result = await initiateSTKPush({
        accessToken,
        phoneNumber,
        amount,
        description: description || 'Chama contribution'
      });

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'check_balance') {
      const balance = await checkAccountBalance(accessToken);
      
      return new Response(JSON.stringify({ balance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'transaction_status') {
      const { checkoutRequestId } = await req.json();
      const status = await checkTransactionStatus(accessToken, checkoutRequestId);
      
      return new Response(JSON.stringify(status), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('M-Pesa Integration Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Please check your M-Pesa credentials and network connectivity'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getMpesaAccessToken(consumerKey: string, consumerSecret: string): Promise<string> {
  console.log('Getting M-Pesa access token...');
  
  // Encode credentials
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  console.log('Credentials encoded successfully');
  
  try {
    const response = await fetch('https://sandbox-api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Access token response status:', response.status);
    console.log('Access token response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Access token error response:', errorText);
      throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }

    const data: MpesaAccessToken = await response.json();
    console.log('Access token received successfully');
    return data.access_token;
  } catch (error) {
    console.error('Network error getting access token:', error);
    throw new Error(`Network error connecting to M-Pesa API: ${error.message}`);
  }
}

async function initiateSTKPush({ accessToken, phoneNumber, amount, description }: {
  accessToken: string;
  phoneNumber: string;
  amount: number;
  description: string;
}) {
  console.log('Initiating STK Push for phone:', phoneNumber, 'amount:', amount);
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const businessShortCode = '174379'; // Sandbox business short code
  const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox passkey
  
  const password = btoa(`${businessShortCode}${passkey}${timestamp}`);

  // Format phone number - ensure it starts with 254
  let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
    formattedPhone = '254' + formattedPhone;
  }

  console.log('Formatted phone number:', formattedPhone);

  const stkPushData: STKPushRequest = {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: businessShortCode,
    PhoneNumber: formattedPhone,
    CallBackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
    AccountReference: 'Chama Contribution',
    TransactionDesc: description,
  };

  console.log('STK Push payload:', JSON.stringify(stkPushData, null, 2));

  try {
    const response = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    });

    console.log('STK Push response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('STK Push error response:', errorText);
      throw new Error(`STK Push failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('STK Push result:', result);
    return result;
  } catch (error) {
    console.error('STK Push network error:', error);
    throw new Error(`Network error during STK Push: ${error.message}`);
  }
}

async function checkAccountBalance(accessToken: string) {
  console.log('Checking account balance...');
  
  try {
    const response = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/accountbalance/v1/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Initiator: 'testapi',
        SecurityCredential: 'Safaricom999!*!',
        CommandID: 'AccountBalance',
        PartyA: '174379',
        IdentifierType: '4',
        Remarks: 'Balance check',
        QueueTimeOutURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-timeout`,
        ResultURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-result`,
      }),
    });

    const result = await response.json();
    console.log('Balance check result:', result);
    return result;
  } catch (error) {
    console.error('Balance check error:', error);
    throw new Error(`Balance check failed: ${error.message}`);
  }
}

async function checkTransactionStatus(accessToken: string, checkoutRequestId: string) {
  console.log('Checking transaction status for:', checkoutRequestId);
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const businessShortCode = '174379';
  const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const password = btoa(`${businessShortCode}${passkey}${timestamp}`);

  try {
    const response = await fetch('https://sandbox-api.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const result = await response.json();
    console.log('Transaction status result:', result);
    return result;
  } catch (error) {
    console.error('Transaction status check error:', error);
    throw new Error(`Transaction status check failed: ${error.message}`);
  }
}
