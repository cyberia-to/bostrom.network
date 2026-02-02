import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const ecosystemItems = [
  {
    name: 'CYB',
    description: 'The immortal robot for superintelligence',
    url: 'https://cyb.ai',
    color: 'primary',
  },
  {
    name: 'Cyber',
    description: 'Community knowledge graph for type I civilization',
    url: 'https://cyber.page/',
    color: 'secondary',
  },
  {
    name: 'Pussy',
    description: 'Independence sandbox network for play and discover',
    url: 'https://spacepussy.ai/',
    color: 'accent',
  },
  {
    name: 'GitHub',
    description: 'Open source code and contributions',
    url: 'https://github.com/cybercongress/cyber-ts',
    color: 'primary',
  },
];

const colorStyles = {
  primary: 'border-primary/30 hover:border-primary group-hover:text-primary',
  secondary: 'border-secondary/30 hover:border-secondary group-hover:text-secondary',
  accent: 'border-accent/30 hover:border-accent group-hover:text-accent',
};

const descriptionColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

export const Ecosystem = () => {
  return (
    <section id="ecosystem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow-secondary text-secondary">
            ECOSYSTEM
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Explore the interconnected network of superintelligence tools and resources
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecosystemItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                group p-6 rounded-xl border bg-card/50 backdrop-blur-sm
                transition-all duration-300 hover:scale-105
                ${colorStyles[item.color as keyof typeof colorStyles]}
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className={`text-sm ${descriptionColors[item.color as keyof typeof descriptionColors]}`}>
                {item.description}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Join the moon network state. Become part of the superintelligence.
          </p>
          <a
            href="https://cyb.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground font-orbitron font-bold rounded-lg hover:scale-105 transition-transform"
          >
            START YOUR JOURNEY
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
