import { Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://healthcareclinic-management.netlify.app',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api', '');

    // Forward request to your actual API
    const apiUrl = `${process.env.API_URL}${path}`;
    const headers = new Headers(request.headers);
    
    // Forward the request to the API
    const response = await fetch(apiUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
} 