import { motion } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { useBostromStats } from '@/hooks/useBostromStats';
import { ConvergenceGraph } from './ConvergenceGraph';
import { useMemo } from 'react';

const MAX_COUNT = 3_000_000;
const DIGIT_SLOTS = 7; // Fixed number of digit slots

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

interface StatBlockProps {
  label: string;
  value: string | number;
  subtitle: string;
  isLoading?: boolean;
}

const StatBlock = ({ label, value, subtitle, isLoading }: StatBlockProps) => (
  <div className="p-4 sm:p-6 md:p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm box-glow-primary w-full flex-1 min-h-[160px] md:h-[200px] flex flex-col justify-between items-center">
    <div className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent pt-2">
      {label}
    </div>
    <div className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-primary text-glow-primary text-center whitespace-nowrap flex items-center justify-center flex-1">
      {isLoading ? (
        <span className="animate-pulse">...</span>
      ) : (
        value
      )}
    </div>
    <div className="text-sm sm:text-base md:text-lg text-muted-foreground font-play text-center pb-2">
      {subtitle}
    </div>
  </div>
);

export const AnimatedCounter = () => {
  const { count } = useWeightCounter();
  const { data: bostromStats, isLoading } = useBostromStats();

  // Calculate progress towards 3M
  const progress = Math.min(count / MAX_COUNT, 1);
  
  // Format with leading zeros to always have 7 digits, then split into chars
  // Track which positions are leading zeros
  const { chars, leadingZeroPositions } = useMemo(() => {
    const paddedNumber = count.toString().padStart(DIGIT_SLOTS, '0');
    // Insert commas: X,XXX,XXX format
    const formatted = paddedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const charArray = formatted.split('');
    
    // Find leading zero positions (before first non-zero digit)
    const leadingZeros = new Set<number>();
    let foundNonZero = false;
    let digitIndex = 0;
    
    for (let i = 0; i < charArray.length; i++) {
      if (charArray[i] === ',') {
        // Hide comma if it's between leading zeros
        if (!foundNonZero) {
          leadingZeros.add(i);
        }
        continue;
      }
      
      if (!foundNonZero && charArray[i] === '0') {
        leadingZeros.add(i);
      } else {
        foundNonZero = true;
      }
      digitIndex++;
    }
    
    return { chars: charArray, leadingZeroPositions: leadingZeros };
  }, [count]);

  // Use real data or fallback to defaults
  const weightsPerSecond = bostromStats?.weightsPerSecond ?? 70000;
  const cyberlinks = bostromStats?.cyberlinks ?? 0;
  const negentropy = bostromStats?.negentropy ?? 0;

  return (
    <section className="py-4 md:py-6 relative overflow-hidden -mt-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Stats blocks row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-[1008px]">
            {/* SIZE Block - order 3 on mobile, 1 on desktop */}
            <div className="order-3 sm:order-1">
              <StatBlock
                label="Size"
                value={formatNumber(cyberlinks)}
                subtitle="total cyberlinks"
                isLoading={isLoading}
              />
            </div>
            
            {/* Convergence line - order 1 on mobile (first), hidden on desktop */}
            <div className="order-1 sm:hidden w-full">
              <ConvergenceGraph progress={progress} />
            </div>
            
            {/* SPEED Block - order 2 on mobile (right after convergence), 2 on desktop (center) */}
            <div className="order-2 sm:order-2 p-4 sm:p-6 md:p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm box-glow-primary w-full min-h-[160px] md:h-[200px] flex flex-col">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron text-accent mb-auto uppercase tracking-widest text-center text-glow-accent pt-2">
                Speed
              </div>
              
              {/* Fixed slots container */}
              <div className="flex justify-center items-center text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-primary text-glow-primary whitespace-nowrap">
                {chars.map((char, index) => {
                  const isLeadingZero = leadingZeroPositions.has(index);
                  return (
                    <div 
                      key={index}
                      className={`flex items-center justify-center ${
                        char === ',' 
                          ? 'w-[0.3em] sm:w-[0.4em]' 
                          : 'w-[0.6em] sm:w-[0.75em]'
                      } ${isLeadingZero ? 'opacity-0' : ''}`}
                      style={{ height: '1.2em' }}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
              
              <div className="text-sm sm:text-base md:text-lg text-muted-foreground mt-auto font-play text-center pb-2">
                {isLoading ? (
                  <span className="animate-pulse">Loading stats...</span>
                ) : (
                  <>~{formatNumber(weightsPerSecond)} weights per second</>
                )}
              </div>
            </div>
            
            {/* QUALITY Block - order 4 on mobile, 3 on desktop */}
            <div className="order-4 sm:order-3">
              <StatBlock
                label="Quality"
                value={formatNumber(negentropy)}
                subtitle="negentropy"
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {/* Convergence line spanning all blocks - hidden on mobile, shown on desktop */}
          <div className="hidden sm:block w-full max-w-[1008px]">
            <ConvergenceGraph progress={progress} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};