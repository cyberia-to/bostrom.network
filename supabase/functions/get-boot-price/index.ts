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
  stakingApr: number | null;
  priceHistory: { timestamp: number; price: number }[] | null;
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
      stakingApr: null,
      priceHistory: null,
    };

    // Fetch total supply from Bostrom LCD API (accurate source)
    let bostromTotalSupply: number | null = null;
    try {
      console.log('Fetching total supply from Bostrom LCD API...');
      const supplyResponse = await fetch(
        'https://lcd.bostrom.cybernode.ai/cosmos/bank/v1beta1/supply',
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (supplyResponse.ok) {
        const supplyData = await supplyResponse.json();
        const bootSupply = supplyData.supply?.find((s: any) => s.denom === 'boot');
        if (bootSupply) {
          bostromTotalSupply = parseInt(bootSupply.amount, 10);
          tokenData.totalSupply = bostromTotalSupply;
          console.log('Bostrom total supply:', bostromTotalSupply);
        }
      }
    } catch (e) {
      console.error('Bostrom LCD API error:', e);
    }

    // Fetch staking pool to calculate circulating supply and APR
    let bondedTokens: number | null = null;
    try {
      console.log('Fetching staking pool from Bostrom...');
      const poolResponse = await fetch(
        'https://lcd.bostrom.cybernode.ai/cosmos/staking/v1beta1/pool',
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (poolResponse.ok) {
        const poolData = await poolResponse.json();
        bondedTokens = parseInt(poolData.pool?.bonded_tokens || '0', 10);
        const notBondedTokens = parseInt(poolData.pool?.not_bonded_tokens || '0', 10);
        // Circulating supply = bonded + not_bonded (tokens that can be transferred)
        tokenData.circulatingSupply = bondedTokens + notBondedTokens;
        console.log('Circulating supply from staking pool:', tokenData.circulatingSupply);
        console.log('Bonded tokens:', bondedTokens);
      }
    } catch (e) {
      console.error('Bostrom staking pool API error:', e);
    }

    // Fetch inflation and distribution params to calculate staking APR
    // APR = (inflation * (1 - community_tax)) / bonded_ratio
    try {
      console.log('Fetching inflation and distribution params...');
      const [inflationRes, distRes] = await Promise.all([
        fetch('https://lcd.bostrom.cybernode.ai/cosmos/mint/v1beta1/inflation', {
          headers: { 'Accept': 'application/json' }
        }),
        fetch('https://lcd.bostrom.cybernode.ai/cosmos/distribution/v1beta1/params', {
          headers: { 'Accept': 'application/json' }
        })
      ]);

      if (inflationRes.ok && distRes.ok && bostromTotalSupply && bondedTokens) {
        const inflationData = await inflationRes.json();
        const distData = await distRes.json();

        const inflation = parseFloat(inflationData.inflation || '0');
        const communityTax = parseFloat(distData.params?.community_tax || '0');
        const bondedRatio = bondedTokens / bostromTotalSupply;

        if (bondedRatio > 0) {
          // Staking APR formula: (inflation * (1 - community_tax)) / bonded_ratio * 100
          tokenData.stakingApr = (inflation * (1 - communityTax)) / bondedRatio * 100;
          console.log('Calculated staking APR:', tokenData.stakingApr, '%');
        }
      }
    } catch (e) {
      console.error('Error calculating staking APR:', e);
    }

    // Try CoinGecko for price data and history
    try {
      console.log('Fetching price from CoinGecko...');
      const [priceResponse, historyResponse] = await Promise.all([
        fetch(
          'https://api.coingecko.com/api/v3/coins/bostrom?localization=false&tickers=false&community_data=false&developer_data=false',
          { headers: { 'Accept': 'application/json' } }
        ),
        fetch(
          'https://api.coingecko.com/api/v3/coins/bostrom/market_chart?vs_currency=usd&days=7',
          { headers: { 'Accept': 'application/json' } }
        )
      ]);
      
      if (priceResponse.ok) {
        const data = await priceResponse.json();
        console.log('CoinGecko price response received');
        
        if (data.market_data) {
          tokenData.price = data.market_data.current_price?.usd || null;
          tokenData.priceChange24h = data.market_data.price_change_percentage_24h || null;
          tokenData.marketCap = data.market_data.market_cap?.usd || null;
          tokenData.volume24h = data.market_data.total_volume?.usd || null;
          
          // Use circulating supply from CoinGecko as fallback
          if (tokenData.circulatingSupply === null) {
            tokenData.circulatingSupply = data.market_data.circulating_supply || null;
          }
        }
      } else {
        console.log('CoinGecko price request failed with status:', priceResponse.status);
      }

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        console.log('CoinGecko history response received');
        
        if (historyData.prices && Array.isArray(historyData.prices)) {
          // Sample every ~6 hours to reduce data points (keep ~28 points for 7 days)
          const sampledPrices = historyData.prices.filter((_: any, i: number) => i % 6 === 0);
          tokenData.priceHistory = sampledPrices.map((p: [number, number]) => ({
            timestamp: p[0],
            price: p[1]
          }));
          console.log('Price history points:', tokenData.priceHistory?.length ?? 0);
        }
      } else {
        console.log('CoinGecko history request failed with status:', historyResponse.status);
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

    // Calculate FDV using Bostrom's accurate total supply and current price
    if (tokenData.price !== null && bostromTotalSupply !== null) {
      tokenData.fullyDilutedValuation = tokenData.price * bostromTotalSupply;
      console.log('Calculated FDV:', tokenData.fullyDilutedValuation);
    }

    console.log('Final token data:', JSON.stringify(tokenData));

    return new Response(
      JSON.stringify({
        success: true,
        ...tokenData,
        symbol: 'BOOT',
        source: 'bostrom-lcd',
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