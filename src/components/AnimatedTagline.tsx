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
    <div className="min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem] flex items-center justify-center">
      <p className="text-base sm:text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto font-orbitron text-center text-accent text-glow-accent">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="inline"
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
        {' '}{staticPart}
      </p>
    </div>
  );
};
