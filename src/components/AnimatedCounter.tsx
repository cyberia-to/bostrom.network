import { motion } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { useBostromStats } from '@/hooks/useBostromStats';
import { ConvergenceGraph } from './ConvergenceGraph';
import { useMemo } from 'react';

const MAX_COUNT = 3_000_000;

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// Fixed-slot formatter to prevent horizontal jitter (Orbitron digits aren't reliably tabular).
// Layout template: XX,XXX,XXX (8 digits) => 10 chars.
const useFixedSlots = (value: number) => {
  return useMemo(() => {
    const safe = Math.max(0, Math.trunc(value));
    // Keep a constant digit count so the number does not shift when crossing digit-length boundaries.
    // Use leading zeros but dim them to preserve readability.
    const digits = safe.toString().padStart(8, '0');

    const chars = [
      digits[0],
      digits[1],
      ',',
      digits[2],
      digits[3],
      digits[4],
      ',',
      digits[5],
      digits[6],
      digits[7],
    ];

    const dimmed = new Set<number>();
    if (safe !== 0) {
      let foundNonZero = false;
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];

        if (!foundNonZero) {
          if (ch === '0' || ch === ',') dimmed.add(i);
          if (ch !== '0' && ch !== ',') foundNonZero = true;
        }
      }
    }

    return { chars, dimmed };
  }, [value]);
};

const NumberLine = ({ value, isLoading }: { value: number; isLoading?: boolean }) => {
  const { chars, dimmed } = useFixedSlots(value);

  return (
    <div className="font-orbitron font-bold text-primary text-glow-primary leading-[1.05] text-center whitespace-nowrap flex items-center justify-center min-h-14 md:min-h-16 w-full min-w-0 px-3 overflow-visible">
      {isLoading ? (
        <span className="animate-pulse">...</span>
      ) : (
        <>
          <span className="sr-only">{formatNumber(value)}</span>
          <span
            aria-hidden="true"
            className="inline-flex flex-nowrap items-center justify-center tabular-nums text-4xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {chars.map((ch, i) => (
              <span
                key={i}
                className={`inline-flex items-center justify-center shrink-0 ${
                  ch === ','
                    ? 'w-[0.36em] sm:w-[0.38em] md:w-[0.40em] lg:w-[0.42em]'
                    : 'w-[0.78em] sm:w-[0.82em] md:w-[0.86em] lg:w-[0.90em]'
                } ${dimmed.has(i) ? 'opacity-25' : 'opacity-100'}`}
              >
                {ch}
              </span>
            ))}
          </span>
        </>
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
  <div className="p-4 sm:p-5 md:p-5 lg:p-8 rounded-2xl border border-primary/30 bg-card box-glow-primary w-full flex-1 h-[160px] md:h-[200px] flex flex-col items-center">
    <div className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent h-7 md:h-8 flex items-center">
      {label}
    </div>
    <NumberLine value={value} isLoading={isLoading} />
    <div className="text-sm sm:text-base md:text-base lg:text-lg text-foreground font-play text-center whitespace-nowrap h-10 md:h-12 flex items-center justify-center">
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
            <div className="order-2 sm:order-2 p-4 sm:p-5 md:p-5 lg:p-8 rounded-2xl border border-primary/30 bg-card box-glow-primary w-full h-[160px] md:h-[200px] flex flex-col items-center">
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron text-accent uppercase tracking-widest text-center text-glow-accent h-7 md:h-8 flex items-center">
                Speed
              </div>

              {/* Number line (aligned with SIZE/QUALITY) */}
              <NumberLine value={count} />
              
              <div className="text-sm sm:text-base md:text-base lg:text-lg text-foreground font-play text-center whitespace-nowrap h-10 md:h-12 flex items-center justify-center">
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