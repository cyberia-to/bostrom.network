import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['first', 'biggest', 'fastest'];
const staticPart = 'on-chain collective model';

export const AnimatedTagline = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [wordIndex]);

  return (
    <div className="h-12 md:h-14 lg:h-16 flex items-center justify-center overflow-hidden">
      <p className="text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto font-orbitron text-center text-accent text-glow-accent">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="inline-block"
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
        {' '}{staticPart}
      </p>
    </div>
  );
};
