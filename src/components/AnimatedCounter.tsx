import { motion } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { ConvergenceGraph } from './ConvergenceGraph';
import { useMemo } from 'react';

const MAX_COUNT = 3_000_000;
const DIGIT_SLOTS = 7; // Fixed number of digit slots

interface DigitSlotProps {
  char: string;
}

const DigitSlot = ({ char }: DigitSlotProps) => {
  const isComma = char === ',';
  
  return (
    <span 
      className={`inline-flex items-center justify-center ${isComma ? 'w-[0.35em]' : 'w-[0.65em]'} h-[1.2em] overflow-hidden`}
    >
      <motion.span
        key={char}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.12,
          ease: "easeOut"
        }}
        className="inline-block"
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedCounter = () => {
  const { count } = useWeightCounter();

  // Calculate progress towards 3M
  const progress = Math.min(count / MAX_COUNT, 1);
  
  // Format with leading zeros to always have 7 digits
  const chars = useMemo(() => {
    const paddedNumber = count.toString().padStart(DIGIT_SLOTS, '0');
    // Insert commas: X,XXX,XXX format
    const formatted = paddedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formatted.split('');
  }, [count]);

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm box-glow-primary">
            <div className="text-sm font-play text-muted-foreground mb-2 uppercase tracking-wider">
              Weight Per Second
            </div>
            <div className="text-5xl md:text-7xl font-orbitron font-bold text-primary text-glow-primary tabular-nums flex justify-center items-center">
              {chars.map((char, index) => (
                <DigitSlot key={`slot-${index}`} char={char} />
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-3 font-play">
              ~70,000 per second • ~3M per minute
            </div>
            
            {/* Convergence visualization */}
            <ConvergenceGraph progress={progress} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
