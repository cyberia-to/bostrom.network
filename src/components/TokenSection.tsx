import { motion } from 'framer-motion';
import bostromLogo from '@/assets/bostrom-logo.png';
import { useBootPrice } from '@/hooks/useBootPrice';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Format price with subscript notation for small numbers (CoinGecko style)
// e.g., 0.00000000127 becomes 0.0₉127 where ₉ indicates 9 zeros
const formatPriceWithSubscript = (price: number): React.ReactNode => {
  if (price >= 0.01) {
    return price < 1 ? price.toFixed(4) : price.toFixed(2);
  }
  
  // Convert to string to count leading zeros after decimal
  const priceStr = price.toFixed(20);
  const match = priceStr.match(/^0\.(0+)(\d+)/);
  
  if (match) {
    const zeroCount = match[1].length;
    // Get significant digits (up to 4)
    const significantDigits = match[2].slice(0, 4);
    
    // Unicode subscript digits
    const subscriptDigits: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    
    const subscriptNumber = zeroCount.toString().split('').map(d => subscriptDigits[d]).join('');
    
    return (
      <>
        0.0<span className="text-[0.7em] align-baseline">{subscriptNumber}</span>{significantDigits}
      </>
    );
  }
  
  return price.toExponential(2);
};

const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

const formatSupply = (num: number): string => {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const TokenSection = () => {
  const { 
    price, 
    priceChange24h, 
    marketCap, 
    fullyDilutedValuation, 
    volume24h, 
    circulatingSupply, 
    totalSupply,
    stakingApr,
    isLoading 
  } = useBootPrice();

  const BootLogo = () => (
    <img src={bostromLogo} alt="BOOT" className="inline-block h-8 md:h-10 w-auto" />
  );

  const liveStats = [
    { 
      label: 'Market Cap', 
      value: marketCap !== null ? `$${formatSupply(marketCap)}` : null,
      loading: isLoading,
      showLogo: false,
    },
    { 
      label: 'Circulating Supply', 
      value: circulatingSupply !== null ? formatSupply(circulatingSupply) : null,
      loading: isLoading,
      showLogo: true,
    },
    { 
      label: 'Total Supply', 
      value: totalSupply !== null ? formatSupply(totalSupply) : null,
      loading: isLoading,
      showLogo: true,
    },
  ];

  return (
    <section id="token" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Token Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={bostromLogo}
                alt="BOOT Token"
                className="w-16 h-16 animate-pulse-glow"
              />
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold">
                <span className="text-primary text-glow-primary">$BOOT</span>
                <span className="text-foreground"> TOKEN</span>
              </h2>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The native token of Bostrom network. Stake BOOT to secure the network, 
              mint hydrogen, and participate in governance.
            </p>

            {/* Live Price Block */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 p-6 rounded-xl border-2 border-primary/50 bg-primary/5 box-glow-primary"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground font-play mb-1">
                    Live Price (Osmosis)
                  </div>
                  <div className="text-3xl md:text-4xl font-orbitron font-bold text-primary text-glow-primary">
                    {isLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : price !== null ? (
                      <>${formatPriceWithSubscript(price)}</>
                    ) : (
                      <span className="text-muted-foreground text-xl">Unavailable</span>
                    )}
                  </div>
                </div>
                {!isLoading && priceChange24h !== null && (
                  <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                    priceChange24h >= 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {priceChange24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-mono text-sm font-bold">
                      {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Live Stats Grid from CoinGecko */}
            <div className="flex flex-col gap-4 mb-8">
              {liveStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-xl border border-border bg-card/50"
                >
                  <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                  <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary flex items-center justify-center gap-3">
                    {stat.loading ? (
                      <span className="animate-pulse text-muted-foreground">...</span>
                    ) : stat.value !== null ? (
                      <>
                        {stat.showLogo && <BootLogo />}
                        {stat.value}
                        {stat.showLogo && <span className="text-primary">BOOT</span>}
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://cyb.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-primary text-primary font-orbitron font-bold rounded-lg hover:bg-primary/10 transition-colors"
              >
                ORACLE
              </a>
              <a
                href="https://app.osmosis.zone/assets/ibc/FE2CD1E6828EC0FAB8AF39BAC45BC25B965BA67CCBC50C13A14BD610B0D1E2C4"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-3 bg-accent text-accent-foreground font-orbitron font-bold rounded-lg hover:scale-105 transition-transform"
              >
                BUY
              </a>
              <a
                href="https://cyb.ai/senate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-primary text-primary font-orbitron font-bold rounded-lg hover:bg-primary/10 transition-colors"
              >
                SENATE
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};