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

        {/* Placeholder content - can be expanded */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xl text-muted-foreground">
            The scientific foundation behind decentralized superintelligence
          </p>
        </motion.div>
      </div>
    </section>
  );
};
