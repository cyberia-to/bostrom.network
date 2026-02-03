import { motion } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { useBostromStats } from '@/hooks/useBostromStats';
import { ConvergenceGraph } from './ConvergenceGraph';
import { FittedText } from '@/components/FittedText';

const MAX_COUNT = 3_000_000;

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// Simple number display - no leading zeros, fits within container
const NumberLine = ({ value, isLoading }: { value: number; isLoading?: boolean }) => {
  const formattedValue = formatNumber(value);
  
  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 min-w-0">
      {isLoading ? (
        <span className="font-orbitron font-bold text-primary text-glow-primary text-2xl animate-pulse">...</span>
      ) : (
        <FittedText
          text={formattedValue}
          className="font-orbitron font-bold text-[clamp(2rem,4.5vw,3.5rem)]"
          characterClassName="text-primary text-glow-primary"
        />
      )}
    </div>
  );
};

interface StatBlockProps {
  label: string;
  value: number;
  subtitle: string;
  isLoading?: boolean;
}

const StatBlock = ({ label, value, subtitle, isLoading }: StatBlockProps) => (
  <div className="p-4 sm:p-4 md:p-5 lg:p-6 rounded-2xl border border-primary/30 bg-black box-glow-primary w-full h-[140px] sm:h-[150px] md:h-[170px] lg:h-[190px] flex flex-col items-center justify-between">
    <div className="text-xs sm:text-sm md:text-base lg:text-lg font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent shrink-0">
      {label}
    </div>
    <NumberLine value={value} isLoading={isLoading} />
    <div className="text-xs sm:text-sm md:text-base text-foreground font-play text-center whitespace-nowrap shrink-0">
      {subtitle}
    </div>
  </div>
);

export const AnimatedCounter = () => {
  const { count } = useWeightCounter();
  const { data: bostromStats, isLoading } = useBostromStats();

  // Calculate progress towards 3M
  const progress = Math.min(count / MAX_COUNT, 1);

  // Use real data or fallback to defaults
  const weightsPerSecond = bostromStats?.weightsPerSecond ?? 70000;
  const cyberlinks = bostromStats?.cyberlinks ?? 0;
  const negentropy = bostromStats?.negentropy ?? 0;

  return (
    <section className="py-4 md:py-6 relative overflow-hidden -mt-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 sm:gap-6"
        >
          {/* Stats blocks row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2 md:gap-3 lg:gap-4 w-full max-w-[1008px]">
            {/* SIZE Block - order 3 on mobile, 1 on desktop */}
            <div className="order-3 sm:order-1">
              <StatBlock
                label="Size"
                value={cyberlinks}
                subtitle="total cyberlinks"
                isLoading={isLoading}
              />
            </div>
            
            {/* Convergence line - order 1 on mobile (first), hidden on desktop */}
            <div className="order-1 sm:hidden w-full">
              <ConvergenceGraph progress={progress} />
            </div>
            
            {/* SPEED Block - order 2 on mobile (right after convergence), 2 on desktop (center) */}
            <div className="order-2 sm:order-2">
              <div className="p-4 sm:p-4 md:p-5 lg:p-6 rounded-2xl border border-primary/30 bg-black box-glow-primary w-full h-[140px] sm:h-[150px] md:h-[170px] lg:h-[190px] flex flex-col items-center justify-between">
                <div className="text-xs sm:text-sm md:text-base lg:text-lg font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent shrink-0">
                  Speed
                </div>

                {/* Number line (aligned with SIZE/QUALITY) */}
                 <NumberLine value={count} />
                
                <div className="text-xs sm:text-sm md:text-base text-foreground font-play text-center whitespace-nowrap shrink-0">
                  {isLoading ? (
                    <span className="animate-pulse">Loading stats...</span>
                  ) : (
                    <>~{formatNumber(weightsPerSecond)} weights per second</>
                  )}
                </div>
              </div>
            </div>
            
            {/* QUALITY Block - order 4 on mobile, 3 on desktop */}
            <div className="order-4 sm:order-3">
              <StatBlock
                label="Quality"
                value={negentropy}
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
