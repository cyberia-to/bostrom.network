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
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(0)}T`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(0)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(0)}M`;
  }
  return num.toLocaleString();
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

  const liveStats = [
    { 
      label: 'Market Cap', 
      value: marketCap !== null ? `$${formatLargeNumber(marketCap)}` : null,
      loading: isLoading,
    },
    { 
      label: 'Fully Diluted Valuation', 
      value: fullyDilutedValuation !== null ? `$${formatLargeNumber(fullyDilutedValuation)}` : null,
      loading: isLoading,
    },
    { 
      label: '24h Trading Volume', 
      value: volume24h !== null ? `$${formatLargeNumber(volume24h)}` : null,
      loading: isLoading,
    },
    { 
      label: 'Staking APR', 
      value: stakingApr !== null ? `${stakingApr.toFixed(2)}%` : null,
      loading: isLoading,
      highlight: true,
    },
    { 
      label: 'Circulating Supply', 
      value: circulatingSupply !== null ? `${formatSupply(circulatingSupply)} BOOT` : null,
      loading: isLoading,
    },
    { 
      label: 'Total Supply', 
      value: totalSupply !== null ? `${formatSupply(totalSupply)} BOOT` : null,
      loading: isLoading,
    },
  ];

  return (
    <section id="token" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Token Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border border-secondary/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border border-accent/20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              
              {/* Main token */}
              <div className="relative z-10 w-40 h-40 flex items-center justify-center">
                <img
                  src={bostromLogo}
                  alt="BOOT Token"
                  className="w-32 h-32 animate-pulse-glow"
                />
              </div>
            </div>
          </motion.div>

          {/* Token Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              <span className="text-primary text-glow-primary">$BOOT</span>
              <span className="text-foreground"> TOKEN</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {liveStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    stat.highlight 
                      ? 'border-secondary bg-secondary/10' 
                      : 'border-border bg-card/50'
                  }`}
                >
                  <div className={`text-lg md:text-xl font-orbitron font-bold ${
                    stat.highlight ? 'text-secondary' : 'text-primary'
                  }`}>
                    {stat.loading ? (
                      <span className="animate-pulse text-muted-foreground">...</span>
                    ) : stat.value !== null ? (
                      stat.value
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
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
