import { motion } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { useBostromStats } from '@/hooks/useBostromStats';
import { ConvergenceGraph } from './ConvergenceGraph';

const MAX_COUNT = 3_000_000;

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
  <div className="p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm box-glow-primary w-full flex-1 h-[160px] md:h-[200px] flex flex-col items-center overflow-hidden">
    <div className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent h-8 md:h-10 flex items-center">
      {label}
    </div>
    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-primary text-glow-primary tabular-nums leading-none text-center whitespace-nowrap flex items-center justify-center h-16 md:h-20">
      {isLoading ? (
        <span className="animate-pulse">...</span>
      ) : (
        value
      )}
    </div>
    <div className="text-sm sm:text-base md:text-lg text-foreground font-play text-center h-12 md:h-14 flex items-start justify-center">
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
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Stats blocks row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-1 md:gap-2 w-full max-w-[1008px]">
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
            <div className="order-2 sm:order-2 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm box-glow-primary w-full h-[160px] md:h-[200px] flex flex-col items-center overflow-hidden">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent h-8 md:h-10 flex items-center">
                Speed
              </div>

              {/* Number line (aligned with SIZE/QUALITY) */}
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-primary text-glow-primary tabular-nums leading-none text-center whitespace-nowrap flex items-center justify-center h-16 md:h-20">
                {formatNumber(count)}
              </div>
              
              <div className="text-sm sm:text-base md:text-lg text-foreground font-play text-center h-12 md:h-14 flex items-start justify-center">
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