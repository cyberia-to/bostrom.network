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
    console.log('Fetching Bostrom graph stats and negentropy...');
    
    // Fetch both endpoints in parallel
    const [graphResponse, negentropyResponse] = await Promise.all([
      fetch(
        'https://lcd.bostrom.cybernode.ai/cyber/graph/v1beta1/graph_stats',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      ),
      fetch(
        'https://lcd.bostrom.cybernode.ai/cyber/rank/v1beta1/negentropy',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      ),
    ]);

    if (!graphResponse.ok) {
      console.error('Bostrom graph API error:', graphResponse.status, graphResponse.statusText);
      throw new Error(`Bostrom graph API responded with status ${graphResponse.status}`);
    }

    if (!negentropyResponse.ok) {
      console.error('Bostrom negentropy API error:', negentropyResponse.status, negentropyResponse.statusText);
      throw new Error(`Bostrom negentropy API responded with status ${negentropyResponse.status}`);
    }

    const [graphData, negentropyData] = await Promise.all([
      graphResponse.json(),
      negentropyResponse.json(),
    ]);
    
    console.log('Bostrom stats received:', graphData);
    console.log('Negentropy received:', negentropyData);

    const particles = parseInt(graphData.particles, 10);
    const cyberlinks = parseInt(graphData.cyberlinks, 10);
    const negentropy = parseInt(negentropyData.negentropy, 10);
    
    // Speed calculation: total particles / 50 seconds (10 blocks)
    const weightsPerSecond = Math.round(particles / 50);
    const weightsPerMinute = weightsPerSecond * 60;

    const result = {
      particles,
      cyberlinks,
      negentropy,
      weightsPerSecond,
      weightsPerMinute,
    };

    console.log('Returning stats:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log detailed error server-side only
    console.error('Error fetching Bostrom stats:', error);
    
    // Return generic error message to client
    return new Response(
      JSON.stringify({ error: 'Unable to fetch blockchain statistics. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
