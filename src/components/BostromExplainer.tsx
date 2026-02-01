import { motion } from 'framer-motion';

const paragraphs = [
  "Transformers learn where to direct attention. Billions of hidden weights determine information flow. After training, they freeze forever.",
  "In Bostrom, you label by linking ideas using V and weight by staking A. More stake means more attention flows through that link. You're not preparing data for future training — you're editing the model right now.",
  "The network is a random walk. Where attention lands more is what matters more. Convergence isn't empirical — it's provable. Every weight can be read, verified, challenged.",
  "Bostrom recomputes every weight every 10 blocks — not once a year in a datacenter, but every minute, live, as humanity thinks.",
  "One link reshapes the entire model. Bostrom is purpose-built for continuous collective learning and an order of magnitude faster than any existing blockchain."
];

export const BostromExplainer = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          {paragraphs.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed font-light text-center"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
};
