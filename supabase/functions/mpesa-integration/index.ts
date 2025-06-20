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
  console.log('=== M-Pesa Integration Function Called ===');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

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
    console.log('Consumer Key length:', consumerKey?.length || 0);
    console.log('Consumer Secret length:', consumerSecret?.length || 0);

    if (!consumerKey || !consumerSecret) {
      console.error('=== MISSING CREDENTIALS ===');
      console.error('Consumer Key:', consumerKey ? 'EXISTS' : 'MISSING');
      console.error('Consumer Secret:', consumerSecret ? 'EXISTS' : 'MISSING');
      
      return new Response(JSON.stringify({ 
        error: 'M-Pesa credentials not configured',
        details: 'MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET must be set in Edge Function secrets',
        consumerKeyExists: !!consumerKey,
        consumerSecretExists: !!consumerSecret
      }), {
        status: 500,
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
    }

    console.log('=== Getting Access Token ===');
    // Get access token
    const accessToken = await getMpesaAccessToken(consumerKey, consumerSecret);
    console.log('Access token obtained successfully');
    
    if (action === 'stk_push') {
      console.log('=== Processing STK Push ===');
      const result = await initiateSTKPush({
        accessToken,
        phoneNumber,
        amount,
        description: description || 'Chama contribution'
      });

      console.log('=== STK Push Result ===');
      console.log('Result:', JSON.stringify(result, null, 2));

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'check_balance') {
      console.log('=== Processing Balance Check ===');
      const balance = await checkAccountBalance(accessToken);
      
      return new Response(JSON.stringify({ balance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'transaction_status') {
      console.log('=== Processing Transaction Status ===');
      const { checkoutRequestId } = requestBody;
      const status = await checkTransactionStatus(accessToken, checkoutRequestId);
      
      return new Response(JSON.stringify(status), {
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
    console.error('Error type:', typeof error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
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

async function getMpesaAccessToken(consumerKey: string, consumerSecret: string): Promise<string> {
  console.log('=== Getting M-Pesa Access Token ===');
  
  // Encode credentials in base64
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  console.log('Credentials encoded for authentication');
  
  const authUrl = 'https://sandbox-api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  console.log('Auth URL:', authUrl);
  
  try {
    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('=== Access Token Response ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== ACCESS TOKEN ERROR ===');
      console.error('Status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }

    const data: MpesaAccessToken = await response.json();
    console.log('=== Access Token Success ===');
    console.log('Token obtained, expires in:', data.expires_in);
    return data.access_token;
  } catch (error) {
    console.error('=== ACCESS TOKEN NETWORK ERROR ===');
    console.error('Error:', error);
    throw new Error(`Network error getting access token: ${error.message}`);
  }
}

async function initiateSTKPush({ accessToken, phoneNumber, amount, description }: {
  accessToken: string;
  phoneNumber: string;
  amount: number;
  description: string;
}) {
  console.log('=== Initiating STK Push ===');
  console.log('Phone:', phoneNumber);
  console.log('Amount:', amount);
  console.log('Description:', description);
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const businessShortCode = '174379'; // Sandbox business short code
  const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox passkey
  
  const password = btoa(`${businessShortCode}${passkey}${timestamp}`);

  // Format phone number - ensure it starts with 254
  let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  console.log('Phone after removing non-digits:', formattedPhone);
  
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
    formattedPhone = '254' + formattedPhone;
  }

  console.log('=== Phone Number Formatting ===');
  console.log('Original:', phoneNumber);
  console.log('Formatted:', formattedPhone);

  // Validate phone number format
  if (!formattedPhone.match(/^254[17]\d{8}$/)) {
    console.error('Invalid phone number format:', formattedPhone);
    throw new Error('Invalid phone number format. Use format: 254XXXXXXXXX or 07XXXXXXXX');
  }

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
    AccountReference: 'Chama',
    TransactionDesc: description,
  };

  console.log('=== STK Push Payload ===');
  console.log(JSON.stringify(stkPushData, null, 2));

  const stkUrl = 'https://sandbox-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  console.log('STK Push URL:', stkUrl);

  try {
    const response = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    });

    console.log('=== STK Push Response ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== STK PUSH ERROR ===');
      console.error('Status:', response.status);
      console.error('Error response:', errorText);
      throw new Error(`STK Push failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('=== STK Push Success ===');
    console.log('Result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('=== STK PUSH NETWORK ERROR ===');
    console.error('Error:', error);
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
