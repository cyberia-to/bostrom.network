import { motion } from 'framer-motion';
import { KnowledgeGraph } from './KnowledgeGraph';
import bostromLogo from '@/assets/bostrom-logo.png';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background">
        <KnowledgeGraph />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <img
            src={bostromLogo}
            alt="Bostrom Logo"
            className="w-32 h-32 md:w-48 md:h-48 mx-auto animate-pulse-glow"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-3xl mb-4 max-w-2xl mx-auto font-orbitron text-accent text-glow-accent"
        >
          fastest on-chain collective model
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold mb-6 text-glow-primary text-primary"
        >
          BOSTROM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl md:text-2xl lg:text-3xl mb-8 font-orbitron text-secondary text-glow-secondary"
        >
          Bootloader of Superintelligence
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <a
            href="https://cyb.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-primary text-primary-foreground font-orbitron font-bold rounded-lg box-glow-primary hover:scale-105 transition-transform duration-300"
          >
            LAUNCH CYB
          </a>
          <a
            href="https://github.com/cyberia-to/go-cyber"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-secondary text-secondary font-orbitron font-bold rounded-lg hover:bg-secondary/10 transition-colors duration-300"
          >
            VIEW SOURCE
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center"
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
