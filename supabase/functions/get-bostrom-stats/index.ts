const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Fetching Bostrom graph stats...');
    
    const response = await fetch(
      'https://lcd.bostrom.cybernode.ai/cyber/graph/v1beta1/graph_stats',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Bostrom API error:', response.status, response.statusText);
      throw new Error(`Bostrom API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Bostrom stats received:', data);

    const particles = parseInt(data.particles, 10);
    const cyberlinks = parseInt(data.cyberlinks, 10);
    
    // Speed calculation: total particles / 50 seconds (10 blocks)
    const weightsPerSecond = Math.round(particles / 50);
    const weightsPerMinute = weightsPerSecond * 60;

    const result = {
      particles,
      cyberlinks,
      weightsPerSecond,
      weightsPerMinute,
    };

    console.log('Returning stats:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Bostrom stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
