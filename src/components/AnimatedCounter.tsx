import { motion } from 'framer-motion';
import { useWeightCounter } from '@/hooks/useWeightCounter';
import { ConvergenceGraph } from './ConvergenceGraph';
import { useMemo } from 'react';

const MAX_COUNT = 3_000_000;
const DIGIT_SLOTS = 7; // Fixed number of digit slots

export const AnimatedCounter = () => {
  const { count } = useWeightCounter();

  // Calculate progress towards 3M
  const progress = Math.min(count / MAX_COUNT, 1);
  
  // Format with leading zeros to always have 7 digits, then split into chars
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
              Weights Per Second
            </div>
            
            {/* Fixed slots container */}
            <div className="flex justify-center items-center text-5xl md:text-7xl font-orbitron font-bold text-primary text-glow-primary">
              {chars.map((char, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-center ${
                    char === ',' 
                      ? 'w-[0.4em]' 
                      : 'w-[0.75em]'
                  }`}
                  style={{ height: '1.2em' }}
                >
                  {char}
                </div>
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
