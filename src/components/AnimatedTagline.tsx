import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  { text: 'fastest on-chain collective model', duration: 1000 },
  { text: 'coolest on-chain collective model', duration: 1000 },
  { text: 'first on-chain collective model', duration: 1000 },
  { text: 'biggest on-chain collective model', duration: 1000 },
  { text: 'BIG BADASS GRAPH', duration: 10000, special: true },
];

export const AnimatedTagline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, currentPhrase.duration);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentPhrase = phrases[currentIndex];

  return (
    <div className="h-12 md:h-14 lg:h-16 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto font-orbitron text-center ${
            currentPhrase.special
              ? 'text-neon-yellow animate-starlight font-bold'
              : 'text-accent text-glow-accent'
          }`}
        >
          {currentPhrase.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
