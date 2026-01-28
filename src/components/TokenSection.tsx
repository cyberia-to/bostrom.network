import { motion } from 'framer-motion';
import bostromLogo from '@/assets/bostrom-logo.png';

const stats = [
  { label: 'Total Supply', value: '1T', suffix: 'BOOT' },
  { label: 'Staking APR', value: '~20', suffix: '%' },
  { label: 'Active Validators', value: '50', suffix: '+' },
  { label: 'Network State', value: 'MOON', suffix: '' },
];

export const TokenSection = () => {
  return (
    <section id="token" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Token Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border border-secondary/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border border-accent/20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              
              {/* Main token */}
              <div className="relative z-10 w-40 h-40 flex items-center justify-center">
                <img
                  src={bostromLogo}
                  alt="BOOT Token"
                  className="w-32 h-32 animate-pulse-glow"
                />
              </div>
            </div>
          </motion.div>

          {/* Token Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              <span className="text-primary text-glow-primary">$BOOT</span>
              <span className="text-foreground"> TOKEN</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              The native token of Bostrom network. Stake BOOT to secure the network, 
              mint cyberlinks, and participate in governance. Fair genesis distribution 
              ensures decentralized ownership.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-4 rounded-xl border border-border bg-card/50"
                >
                  <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary">
                    {stat.value}
                    <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.mintscan.io/bostrom"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground font-orbitron font-bold rounded-lg hover:scale-105 transition-transform"
              >
                VIEW EXPLORER
              </a>
              <a
                href="https://cyb.ai/senate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-primary text-primary font-orbitron font-bold rounded-lg hover:bg-primary/10 transition-colors"
              >
                GOVERNANCE
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
