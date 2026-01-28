const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Fetching BOOT token price from Osmosis API...');
    
    // Try multiple endpoints for redundancy
    const endpoints = [
      'https://api-osmosis.imperator.co/tokens/v2/boot',
      'https://api-osmosis.imperator.co/tokens/v2/all',
    ];

    let bootPrice = null;
    let priceChange24h = null;

    // Try the direct BOOT endpoint first
    try {
      const response = await fetch(endpoints[0], {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Direct BOOT endpoint response:', JSON.stringify(data).substring(0, 500));
        
        if (Array.isArray(data) && data.length > 0) {
          bootPrice = data[0].price;
          priceChange24h = data[0].price_24h_change;
        } else if (data.price) {
          bootPrice = data.price;
          priceChange24h = data.price_24h_change;
        }
      }
    } catch (e) {
      console.log('Direct endpoint failed, trying all tokens endpoint...');
    }

    // If direct endpoint failed, try the all tokens endpoint
    if (bootPrice === null) {
      try {
        const response = await fetch(endpoints[1], {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('All tokens response received, searching for BOOT...');
          
          // Find BOOT in the list
          const bootToken = data.find((token: any) => 
            token.symbol?.toLowerCase() === 'boot' || 
            token.display?.toLowerCase() === 'boot' ||
            token.name?.toLowerCase() === 'bostrom'
          );
          
          if (bootToken) {
            console.log('Found BOOT token:', JSON.stringify(bootToken));
            bootPrice = bootToken.price;
            priceChange24h = bootToken.price_24h_change;
          }
        }
      } catch (e) {
        console.error('All tokens endpoint also failed:', e);
      }
    }

    // If still no price, try CoinGecko as fallback
    if (bootPrice === null) {
      try {
        console.log('Trying CoinGecko fallback...');
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bostrom&vs_currencies=usd&include_24hr_change=true',
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('CoinGecko response:', JSON.stringify(data));
          
          if (data.bostrom) {
            bootPrice = data.bostrom.usd;
            priceChange24h = data.bostrom.usd_24h_change;
          }
        }
      } catch (e) {
        console.error('CoinGecko fallback failed:', e);
      }
    }

    if (bootPrice !== null) {
      console.log(`BOOT price found: $${bootPrice}, 24h change: ${priceChange24h}%`);
      
      return new Response(
        JSON.stringify({
          success: true,
          price: bootPrice,
          priceChange24h: priceChange24h,
          symbol: 'BOOT',
          source: 'osmosis',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Return error if no price found
    console.error('Could not fetch BOOT price from any source');
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Could not fetch BOOT price',
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching BOOT price:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
