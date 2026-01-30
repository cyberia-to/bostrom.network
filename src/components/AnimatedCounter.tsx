import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const AnimatedCounter = () => {
  const [count, setCount] = useState(0);
  const maxCount = 3000000;
  const durationMs = 60000; // 1 minute
  const intervalMs = 16; // ~60fps
  const incrementPerInterval = Math.round(maxCount / (durationMs / intervalMs));

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const next = prev + incrementPerInterval;
        if (next >= maxCount) {
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [incrementPerInterval]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

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
              Cyberlinks Created
            </div>
            <div className="text-5xl md:text-7xl font-orbitron font-bold text-primary text-glow-primary tabular-nums">
              {formatNumber(count)}
            </div>
            <div className="text-xs text-muted-foreground mt-3 font-play">
              ~70,000 per second • ~3M per minute
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
