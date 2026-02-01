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
    <section className="py-8 md:py-12 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Terminal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Terminal Frame */}
          <div className="relative border border-primary/40 rounded-lg bg-black/80 backdrop-blur-sm overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_50%)] bg-[length:100%_4px]" />
            </div>
            
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/30 bg-primary/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-secondary/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
              </div>
              <span className="text-xs font-orbitron text-primary/60 ml-2 tracking-wider">
                BOSTROM://CORE_MANIFESTO.SYS
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] font-mono text-primary/40 animate-pulse">● LIVE</span>
              </div>
            </div>
            
            {/* Terminal Content */}
            <div className="p-6 md:p-8 space-y-6">
              {paragraphs.map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <span className="text-primary/50 font-mono text-sm shrink-0 mt-1">
                    [{String(index + 1).padStart(2, '0')}]
                  </span>
                  <p className="text-base md:text-lg text-foreground/90 leading-relaxed font-play">
                    {text}
                  </p>
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-primary/50 font-mono text-sm">&gt;</span>
                <span className="w-3 h-5 bg-primary animate-pulse" />
              </div>
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/60 rounded-br-lg" />
          </div>
          
          {/* Glow effect behind terminal */}
          <div className="absolute inset-0 -z-10 bg-primary/5 blur-3xl rounded-full scale-110" />
        </motion.div>
      </div>
    </section>
  );
};
