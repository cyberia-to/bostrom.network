import { motion } from 'framer-motion';
import bostromLogo from '@/assets/bostrom-logo.png';
import { useBootPrice } from '@/hooks/useBootPrice';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PriceChart } from './PriceChart';

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
  // For mobile-friendly display, use abbreviated format for very large numbers
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
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
    priceHistory,
    isLoading 
  } = useBootPrice();

  const BootLogo = () => (
    <img src={bostromLogo} alt="BOOT" className="inline-block h-8 md:h-10 w-auto" />
  );

  // Calculate Market Cap locally: Price × Total Supply
  const calculatedMarketCap = price !== null && totalSupply !== null 
    ? price * totalSupply 
    : null;

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
              </h2>
            </div>
            <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
              The native token of Bostrom network. Stake BOOT to secure the network, 
              mint hydrogen, and participate in governance.
            </p>

            {/* Price Chart - above formula */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 p-4 rounded-xl border border-border bg-card/30"
            >
              <PriceChart 
                data={priceHistory} 
                isPositive={(priceChange24h ?? 0) >= 0} 
              />
            </motion.div>

            {/* Formula: Price × Supply = Market Cap */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 mb-8">
              
              {/* Price Block */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 rounded-xl border-2 border-primary/50 bg-primary/5 box-glow-primary w-full lg:w-auto lg:min-w-[200px]"
              >
                <div className="text-sm text-muted-foreground font-play mb-1">
                  Price
                </div>
                <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary text-glow-primary">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : price !== null ? (
                    <>${formatPriceWithSubscript(price)}</>
                  ) : (
                    <span className="text-muted-foreground text-xl">N/A</span>
                  )}
                </div>
                {!isLoading && priceChange24h !== null && (
                  <div className={`flex items-center justify-center gap-1 mt-2 ${
                    priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {priceChange24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-mono text-xs font-bold">
                      {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Multiplication Sign */}
              <div className="text-4xl font-orbitron font-bold text-primary text-glow-primary">
                ×
              </div>

              {/* Supply Block */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 rounded-xl border border-border bg-card/50 w-full lg:w-auto lg:min-w-[200px]"
              >
                <h3 
                  className="text-lg font-orbitron font-bold text-cyan-300 mb-2"
                  style={{ textShadow: '0 0 8px #00FFFF, 0 0 20px #00FFFF' }}
                >
                  Total Supply
                </h3>
                <div className="text-xl md:text-2xl font-orbitron font-bold text-primary flex items-center justify-center gap-2">
                  {isLoading ? (
                    <span className="animate-pulse text-muted-foreground">...</span>
                  ) : totalSupply !== null ? (
                    <>
                      <BootLogo />
                      <span className="whitespace-nowrap">{formatSupply(totalSupply)}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </div>
              </motion.div>

              {/* Equals Sign */}
              <div className="text-4xl font-orbitron font-bold text-primary text-glow-primary">
                =
              </div>

              {/* Market Cap Block (calculated locally) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 rounded-xl border-2 border-accent/50 bg-accent/5 w-full lg:w-auto lg:min-w-[200px]"
                style={{ boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)' }}
              >
                <h3 
                  className="text-lg font-orbitron font-bold text-cyan-300 mb-2"
                  style={{ textShadow: '0 0 8px #00FFFF, 0 0 20px #00FFFF' }}
                >
                  Market Cap
                </h3>
                <div className="text-2xl md:text-3xl font-orbitron font-bold text-accent">
                  {isLoading ? (
                    <span className="animate-pulse text-muted-foreground">...</span>
                  ) : calculatedMarketCap !== null ? (
                    <span className="whitespace-nowrap">${formatLargeNumber(calculatedMarketCap)}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* CTA - Single BUY button */}
            <div className="flex justify-center">
              <a
                href="https://app.osmosis.zone/assets/ibc/FE2CD1E6828EC0FAB8AF39BAC45BC25B965BA67CCBC50C13A14BD610B0D1E2C4"
                target="_blank"
                rel="noopener noreferrer"
                className="px-16 sm:px-24 py-4 sm:py-5 bg-accent text-accent-foreground font-orbitron font-bold text-lg sm:text-xl rounded-lg hover:scale-105 transition-transform text-center"
              >
                BUY $BOOT
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};