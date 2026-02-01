import { motion, AnimatePresence } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { ConvergenceGraph } from './ConvergenceGraph';

const MAX_COUNT = 3_000_000;
const TOTAL_DIGITS = 9; // Maximum digits for 3,000,000 formatted: "3,000,000"

interface DigitSlotProps {
  char: string;
  index: number;
}

const DigitSlot = ({ char, index }: DigitSlotProps) => {
  const isComma = char === ',';
  
  return (
    <span 
      className={`inline-block ${isComma ? 'w-[0.3em]' : 'w-[0.6em]'} text-center relative overflow-hidden`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${index}-${char}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ 
            duration: 0.15,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const AnimatedCounter = () => {
  const { count } = useWeightCounter();

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Calculate progress towards 3M
  const progress = Math.min(count / MAX_COUNT, 1);
  
  const formattedNumber = formatNumber(count);
  const chars = formattedNumber.split('');

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
                <DigitSlot key={index} char={char} index={index} />
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
