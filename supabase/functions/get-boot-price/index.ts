const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface TokenData {
  price: number | null;
  priceChange24h: number | null;
  marketCap: number | null;
  fullyDilutedValuation: number | null;
  volume24h: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Fetching BOOT token data...');

    const tokenData: TokenData = {
      price: null,
      priceChange24h: null,
      marketCap: null,
      fullyDilutedValuation: null,
      volume24h: null,
      circulatingSupply: null,
      totalSupply: null,
    };

    // Try CoinGecko first for comprehensive data
    try {
      console.log('Fetching from CoinGecko...');
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bostrom?localization=false&tickers=false&community_data=false&developer_data=false',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('CoinGecko response received');
        
        if (data.market_data) {
          tokenData.price = data.market_data.current_price?.usd || null;
          tokenData.priceChange24h = data.market_data.price_change_percentage_24h || null;
          tokenData.marketCap = data.market_data.market_cap?.usd || null;
          tokenData.fullyDilutedValuation = data.market_data.fully_diluted_valuation?.usd || null;
          tokenData.volume24h = data.market_data.total_volume?.usd || null;
          tokenData.circulatingSupply = data.market_data.circulating_supply || null;
          tokenData.totalSupply = data.market_data.total_supply || null;
        }
      } else {
        console.log('CoinGecko request failed with status:', response.status);
      }
    } catch (e) {
      console.error('CoinGecko fetch error:', e);
    }

    // If CoinGecko failed for price, try Osmosis as fallback
    if (tokenData.price === null) {
      try {
        console.log('Trying Osmosis API fallback for price...');
        const response = await fetch('https://api-osmosis.imperator.co/tokens/v2/boot', {
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            tokenData.price = data[0].price;
            tokenData.priceChange24h = data[0].price_24h_change;
          }
        }
      } catch (e) {
        console.error('Osmosis fallback failed:', e);
      }
    }

    // If still no price, try all tokens endpoint
    if (tokenData.price === null) {
      try {
        const response = await fetch('https://api-osmosis.imperator.co/tokens/v2/all', {
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          const bootToken = data.find((token: any) => 
            token.symbol?.toLowerCase() === 'boot' || 
            token.display?.toLowerCase() === 'boot' ||
            token.name?.toLowerCase() === 'bostrom'
          );
          
          if (bootToken) {
            tokenData.price = bootToken.price;
            tokenData.priceChange24h = bootToken.price_24h_change;
          }
        }
      } catch (e) {
        console.error('Osmosis all tokens fallback failed:', e);
      }
    }

    console.log('Final token data:', JSON.stringify(tokenData));

    return new Response(
      JSON.stringify({
        success: true,
        ...tokenData,
        symbol: 'BOOT',
        source: 'coingecko',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching BOOT data:', error);
    
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
