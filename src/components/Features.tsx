import { motion } from 'framer-motion';
import { 
  Zap, 
  Globe, 
  Shield, 
  Users, 
  Cpu, 
  Link2, 
  Database, 
  Sparkles,
  Coins,
  Code,
  Network,
  Moon
} from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Cybergraph',
    description: 'Decentralized knowledge graph with semantic neural proofs',
    color: 'primary',
    url: 'https://cyber.page/cybergraph',
  },
  {
    icon: Link2,
    title: 'Cyberlinks',
    description: 'Connect any content through cryptographic links',
    color: 'secondary',
    url: 'https://cyber.page/cyberlink',
  },
  {
    icon: Sparkles,
    title: 'Will Minting',
    description: 'Transform intention into blockchain actions',
    color: 'accent',
  },
  {
    icon: Zap,
    title: 'Bandwidth Limiting',
    description: 'Adaptive pricing based on network demand',
    color: 'primary',
  },
  {
    icon: Cpu,
    title: 'Relevance Machine',
    description: 'AI-powered content ranking and discovery',
    color: 'secondary',
  },
  {
    icon: Users,
    title: 'Avatar System',
    description: 'Digital identity with .moon names and karma',
    color: 'accent',
  },
  {
    icon: Moon,
    title: 'Moon Citizenship',
    description: 'Become a citizen of the moon network state',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Secure PoS',
    description: 'Proof of stake consensus with fair distribution',
    color: 'secondary',
  },
  {
    icon: Coins,
    title: 'Staking Rewards',
    description: 'Earn through staking loans and automatic fuel',
    color: 'accent',
  },
  {
    icon: Code,
    title: 'WASM VM',
    description: 'Deploy smart contracts with incentives',
    color: 'primary',
  },
  {
    icon: Network,
    title: 'IBC & Warp',
    description: 'Cross-chain communication and teleportation',
    color: 'secondary',
  },
  {
    icon: Globe,
    title: 'Soft3 Access',
    description: 'Gateway to the decentralized web',
    color: 'accent',
  },
];

const colorClasses = {
  primary: 'text-primary border-primary/30 hover:border-primary hover:box-glow-primary',
  secondary: 'text-secondary border-secondary/30 hover:border-secondary hover:box-glow-secondary',
  accent: 'text-accent border-accent/30 hover:border-accent',
};

const iconBgClasses = {
  primary: 'bg-primary/10',
  secondary: 'bg-secondary/10',
  accent: 'bg-accent/10',
};

export const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow-primary text-primary">
            CORE FEATURES
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            20+ revolutionary technologies powering the next generation of superintelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const content = (
              <>
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mb-4
                  ${iconBgClasses[feature.color as keyof typeof iconBgClasses]}
                `}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-orbitron font-bold text-lg mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </>
            );

            const cardClasses = `
              p-6 rounded-xl border bg-card/50 backdrop-blur-sm
              transition-all duration-300 ${feature.url ? 'cursor-pointer' : 'cursor-default'}
              ${colorClasses[feature.color as keyof typeof colorClasses]}
            `;

            return feature.url ? (
              <motion.a
                key={feature.title}
                href={feature.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={cardClasses}
              >
                {content}
              </motion.a>
            ) : (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={cardClasses}
              >
                {content}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
