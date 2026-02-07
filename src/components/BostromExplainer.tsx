import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useSectionTracking } from '@/hooks/useSectionTracking';

const paragraphs = [
  "Frontier AI runs on transformers. They learn by backpropagation: feed in data, push error backward, adjust weights. Billions of parameters become a next-symbol engine. It works, but it's heavy — trained in massive runs, then mostly frozen. And it can't be intelligent like we are.",
  "Brains don't work like that. They learn live — predict, act, sense, update. A world-model that keeps adapting on 20 watts.",
  "Bostrom is that idea made collective. One public mind instead of many private models. Humans, agents, robots, animals, sensors, swarms — all linking the same living graph.",
  "Link two ideas and you open a path for attention. Stake strengthens the path. Where attention accumulates is what the network treats as important right now. Every weight is public. Auditable. Contestable.",
  "This is diffusion with teeth. For an ergodic walk, attention provably converges to a unique equilibrium. This enables a new kind of consensus — a shared map of collective focus that anyone can verify and recompute.",
  "The whole graph is retrained every minute by GPUs in consensus. That is why it's orders of magnitude faster for a collective learning task than any blockchain today. It can process weights for a knowledge graph that scales to the needs of superintelligence.",
  "Fork it. Run it. Teach it. It's yours."
];

const TypewriterText = ({ text, startDelay, onComplete }: { text: string; startDelay: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, 5); // Super fast typing - 5ms per character

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [text, startDelay, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />}
    </span>
  );
};

export const BostromExplainer = () => {
  const sectionRef = useSectionTracking('how');
  const viewRef = useRef(null);
  const isInView = useInView(viewRef, { once: true, amount: 0.3 });
  const [currentLine, setCurrentLine] = useState(-1);

  useEffect(() => {
    if (isInView && currentLine === -1) {
      setCurrentLine(0);
    }
  }, [isInView, currentLine]);

  const handleLineComplete = (index: number) => {
    if (index < paragraphs.length - 1) {
      setTimeout(() => setCurrentLine(index + 1), 150);
    }
  };

  return (
    <section id="how" ref={sectionRef} className="py-8 md:py-12 pb-4 md:pb-6 bg-background relative overflow-hidden">
      <div ref={viewRef} className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-glow-secondary text-secondary">
            HOW?
          </h2>
        </motion.div>

        {/* Terminal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1008px] mx-auto relative"
        >
          {/* Terminal Frame */}
          <div className="relative border border-primary/40 rounded-lg bg-black/80 backdrop-blur-sm overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_50%)] bg-[length:100%_4px]" />
            </div>
            
            {/* Terminal Content - fixed height to prevent jumping */}
            <div className="p-6 md:p-8 space-y-6">
              {paragraphs.map((text, index) => (
                <div key={index} className="flex gap-3 min-h-[3.5rem] md:min-h-[2rem]">
                  <span className="text-primary/50 font-mono text-sm shrink-0 mt-1">
                    [{String(index + 1).padStart(2, '0')}]
                  </span>
                  <p className="text-base md:text-lg text-foreground/90 leading-relaxed font-play relative">
                    {/* Invisible text to reserve space */}
                    <span className="invisible">{text}</span>
                    {/* Visible animated text overlay */}
                    <span className="absolute inset-0">
                      {index <= currentLine ? (
                        index === currentLine ? (
                          <TypewriterText 
                            text={text} 
                            startDelay={0}
                            onComplete={() => handleLineComplete(index)}
                          />
                        ) : (
                          text
                        )
                      ) : null}
                    </span>
                  </p>
                </div>
              ))}
              
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
