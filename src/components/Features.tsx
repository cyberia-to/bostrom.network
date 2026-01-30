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
  Moon,
  Flame,
  Heart,
  Ghost,
  Compass,
  Vote,
  Brain,
  Lightbulb,
  Atom,
  Bot,
  Fuel
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  url?: string;
  progress: number;
}

const doneFeatures: Feature[] = [
  {
    icon: Database,
    title: 'Cybergraph',
    description: 'Decentralized knowledge graph',
    color: 'primary',
    url: 'https://cyber.page/cybergraph',
    progress: 100,
  },
  {
    icon: Link2,
    title: 'Cyberlinks',
    description: 'Cryptographic content links',
    color: 'secondary',
    url: 'https://cyber.page/cyberlink',
    progress: 100,
  },
  {
    icon: Zap,
    title: 'Bandwidth Limiting',
    description: 'Adaptive network pricing',
    color: 'accent',
    url: 'https://cv.land/bandwidth-limiting',
    progress: 100,
  },
  {
    icon: Flame,
    title: 'Energy Routing',
    description: 'Efficient resource distribution',
    color: 'primary',
    progress: 100,
  },
  {
    icon: Moon,
    title: 'Moon Citizenship',
    description: 'Network state membership',
    color: 'secondary',
    progress: 100,
  },
  {
    icon: Shield,
    title: 'Secure PoS',
    description: 'Proof of stake consensus',
    color: 'accent',
    progress: 100,
  },
  {
    icon: Users,
    title: 'Avatar System',
    description: 'Digital identity & .moon names',
    color: 'primary',
    progress: 100,
  },
  {
    icon: Coins,
    title: 'Staking Rewards',
    description: 'Earn through participation',
    color: 'secondary',
    progress: 100,
  },
  {
    icon: Code,
    title: 'WASM VM',
    description: 'Smart contract deployment',
    color: 'accent',
    progress: 100,
  },
  {
    icon: Globe,
    title: 'Soft3 Access',
    description: 'Decentralized web gateway',
    color: 'primary',
    progress: 100,
  },
  {
    icon: Network,
    title: 'IBC & Warp',
    description: 'Cross-chain communication',
    color: 'secondary',
    progress: 100,
  },
  {
    icon: Heart,
    title: 'Karma',
    description: 'Reputation system',
    color: 'accent',
    progress: 100,
  },
  {
    icon: Ghost,
    title: 'Soul',
    description: 'Persistent identity layer',
    color: 'primary',
    progress: 100,
  },
  {
    icon: Vote,
    title: 'Basic Governance',
    description: 'On-chain voting',
    color: 'secondary',
    progress: 100,
  },
];

const inProgressFeatures: Feature[] = [
  {
    icon: Lightbulb,
    title: 'Learning Incentives',
    description: 'Rewards for knowledge growth',
    color: 'primary',
    progress: 75,
  },
  {
    icon: Cpu,
    title: 'Relevance Machine',
    description: 'AI-powered content ranking',
    color: 'secondary',
    progress: 60,
  },
  {
    icon: Sparkles,
    title: 'Will Minting',
    description: 'Intention to blockchain',
    color: 'accent',
    progress: 45,
  },
  {
    icon: Atom,
    title: 'Syntropy',
    description: 'Order from chaos protocol',
    color: 'primary',
    progress: 35,
  },
  {
    icon: Brain,
    title: 'Semantic Neural Proofs',
    description: 'AI verification layer',
    color: 'secondary',
    progress: 40,
  },
  {
    icon: Compass,
    title: 'Store of Value',
    description: 'Economic foundation',
    color: 'accent',
    progress: 55,
  },
  {
    icon: Bot,
    title: 'Autonomous Progs',
    description: 'Self-executing programs',
    color: 'primary',
    progress: 30,
  },
  {
    icon: Fuel,
    title: 'Staking Loans & Auto Fuel',
    description: 'Automated staking utilities',
    color: 'secondary',
    progress: 50,
  },
];

const colorClasses = {
  primary: 'text-primary border-primary/40',
  secondary: 'text-secondary border-secondary/40',
  accent: 'text-accent border-accent/40',
};

const progressColors = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
};

const glowClasses = {
  primary: 'hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
  secondary: 'hover:shadow-[0_0_20px_hsl(var(--secondary)/0.3)]',
  accent: 'hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)]',
};

const FeatureCard = ({ feature, index, isComplete }: { feature: Feature; index: number; isComplete: boolean }) => {
  const content = (
    <>
      {/* Puzzle connector - top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-2 border-current opacity-60" />
      
      {/* Puzzle connector - right */}
      <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-card border-2 border-current opacity-60" />
      
      <div className="flex items-start gap-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0
          bg-current/10
        `}>
          <feature.icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-orbitron font-bold text-sm mb-1 text-foreground truncate">
            {feature.title}
          </h3>
          <p className="text-muted-foreground text-xs leading-tight">
            {feature.description}
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className={colorClasses[feature.color]}>{feature.progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${feature.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.05 }}
            className={`h-full rounded-full ${progressColors[feature.color]}`}
          />
        </div>
      </div>
    </>
  );

  const cardClasses = `
    relative p-4 rounded-xl border-2 bg-card/50 backdrop-blur-sm
    transition-all duration-300 ${feature.url ? 'cursor-pointer' : 'cursor-default'}
    ${colorClasses[feature.color]}
    ${glowClasses[feature.color]}
    hover:scale-[1.02]
  `;

  return feature.url ? (
    <motion.a
      href={feature.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={cardClasses}
    >
      {content}
    </motion.a>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={cardClasses}
    >
      {content}
    </motion.div>
  );
};

export const Features = () => {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 text-glow-primary text-primary">
            CORE FEATURES
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building blocks of the superintelligence network
          </p>
        </motion.div>

        <Tabs defaultValue="done" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger 
              value="done" 
              className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Done ({doneFeatures.length})
            </TabsTrigger>
            <TabsTrigger 
              value="progress"
              className="font-orbitron data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              In Progress ({inProgressFeatures.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="done" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {doneFeatures.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} isComplete={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {inProgressFeatures.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} isComplete={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
