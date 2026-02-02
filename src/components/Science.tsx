import { motion } from 'framer-motion';

export const Science = () => {
  return (
    <section id="science" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl font-orbitron font-bold animate-starlight"
            data-text="SCIENCE"
          >
            SCIENCE
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <p className="text-xl text-foreground">
            The scientific foundation behind decentralized superintelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          <motion.a
            href="https://paragraph.com/@mastercyb/collective-focus-theorem"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative p-6 md:p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-xl md:text-2xl font-orbitron font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              Collective Focus Theorem
            </h3>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              Explore the mathematical foundation →
            </p>
          </motion.a>

          <motion.a
            href="https://paragraph.com/@mastercyb/cyberia-manifesto-of-the-superintelligent-nation"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative p-6 md:p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <h3 className="text-xl md:text-2xl font-orbitron font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              MANIFESTO
            </h3>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              Read the vision for superintelligent nation →
            </p>
          </motion.a>
        </div>
      </div>
    </section>
  );
};
