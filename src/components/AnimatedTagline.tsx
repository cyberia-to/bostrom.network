import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['fastest', 'coolest', 'first', 'biggest'];
const staticPart = 'on-chain collective model';
const specialPhrase = { text: 'BIG BADASS GRAPH', duration: 30000 };

export const AnimatedTagline = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isSpecial, setIsSpecial] = useState(false);

  useEffect(() => {
    if (isSpecial) {
      const timer = setTimeout(() => {
        setIsSpecial(false);
        setWordIndex(0);
      }, specialPhrase.duration);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      if (wordIndex === words.length - 1) {
        setIsSpecial(true);
      } else {
        setWordIndex((prev) => prev + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [wordIndex, isSpecial]);

  if (isSpecial) {
    return (
      <div className="h-12 md:h-14 lg:h-16 flex items-center justify-center overflow-visible">
        <motion.p
          key="special"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto font-orbitron text-center animate-starlight font-bold"
          data-text={specialPhrase.text}
        >
          {specialPhrase.text}
        </motion.p>
      </div>
    );
  }

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
