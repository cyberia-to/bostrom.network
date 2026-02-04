import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// Import logos
import cybLogo from '@/assets/ecosystem/cyb.png';
import cyberLogo from '@/assets/ecosystem/cyber.png';
import spacepussyLogo from '@/assets/ecosystem/spacepussy.png';
import githubLogo from '@/assets/ecosystem/github.png';
import atomscanLogo from '@/assets/ecosystem/atomscan.png';
import keplrLogo from '@/assets/ecosystem/keplr.png';
import coingeckoLogo from '@/assets/ecosystem/coingecko.png';
import coinmarketcapLogo from '@/assets/ecosystem/coinmarketcap.png';
import telegramLogo from '@/assets/ecosystem/telegram.png';
import xLogo from '@/assets/ecosystem/x.png';
import discordLogo from '@/assets/ecosystem/discord.svg';
import forbesLogo from '@/assets/ecosystem/forbes.png';
import mapofzonesLogo from '@/assets/ecosystem/mapofzones.png';
import pingpubLogo from '@/assets/ecosystem/pingpub.svg';
import exploreristLogo from '@/assets/ecosystem/explorerist.ico';
import stakingexplorerLogo from '@/assets/ecosystem/stakingexplorer.png';
import validatorinfoLogo from '@/assets/ecosystem/validatorinfo.png';
import defillamaLogo from '@/assets/ecosystem/defillama.png';

const ecosystemItems = [
  {
    name: 'cy',
    description: 'CLI tool for agents',
    url: 'https://github.com/cyber-prophet/cy',
    color: 'cyan',
    emoji: '💎',
  },
  {
    name: 'cyb.ai',
    description: 'The immortal robot for superintelligence',
    url: 'https://cyb.ai',
    color: 'primary',
    logo: cybLogo,
  },
  {
    name: 'cyber.page',
    description: 'Community knowledge graph for type I civilization',
    url: 'https://cyber.page/',
    color: 'secondary',
    logo: cyberLogo,
  },
  {
    name: 'spacepussy.ai',
    description: 'Independence sandbox network for play and discover',
    url: 'https://spacepussy.ai/',
    color: 'pink',
    logo: spacepussyLogo,
  },
  {
    name: 'GitHub',
    description: 'Open source code and contributions',
    url: 'https://github.com/cyberia-to/go-cyber',
    color: 'white',
    logo: githubLogo,
  },
  {
    name: 'Atomscan',
    description: 'Bostrom blockchain explorer',
    url: 'https://atomscan.com/bostrom',
    color: 'atomscan',
    logo: atomscanLogo,
  },
  {
    name: 'Forbes',
    description: 'BOOT token on Forbes Digital Assets',
    url: 'https://www.forbes.com/digital-assets/assets/bostrom-boot/',
    color: 'forbes',
    logo: forbesLogo,
  },
  {
    name: 'Map of Zones',
    description: 'Cosmos IBC network visualization',
    url: 'https://mapofzones.com/zones/bostrom/overview',
    color: 'mapofzones',
    logo: mapofzonesLogo,
  },
  {
    name: 'Ping.pub',
    description: 'Open-source blockchain explorer',
    url: 'https://ping.pub/bostrom',
    color: 'pingpub',
    logo: pingpubLogo,
  },
  {
    name: 'Explorer.ist',
    description: 'Bostrom network explorer',
    url: 'https://explorer.ist/bostrom',
    color: 'explorerist',
    logo: exploreristLogo,
  },
  {
    name: 'Staking Explorer',
    description: 'Staking stats and analytics',
    url: 'https://staking-explorer.com/assets/bostrom',
    color: 'stakingexplorer',
    logo: stakingexplorerLogo,
  },
  {
    name: 'Validator Info',
    description: 'Validator rankings and info',
    url: 'https://validatorinfo.com/networks/bostrom/validators',
    color: 'validatorinfo',
    logo: validatorinfoLogo,
  },
  {
    name: 'DefiLlama',
    description: 'DeFi TVL and analytics',
    url: 'https://defillama.com/chain/bostrom',
    color: 'defillama',
    logo: defillamaLogo,
  },
  {
    name: 'Keplr',
    description: 'Interchain wallet for Cosmos ecosystem',
    url: 'https://www.keplr.app/',
    color: 'keplr',
    logo: keplrLogo,
  },
  {
    name: 'CoinGecko',
    description: 'BOOT token price and market data',
    url: 'https://www.coingecko.com/en/coins/bostrom',
    color: 'coingecko',
    logo: coingeckoLogo,
  },
  {
    name: 'CoinMarketCap',
    description: 'BOOT token analytics and rankings',
    url: 'https://coinmarketcap.com/currencies/bostrom/',
    color: 'coinmarketcap',
    logo: coinmarketcapLogo,
  },
  {
    name: 'Telegram',
    description: 'Join the community chat',
    url: 'https://t.me/fuckgoogle',
    color: 'telegram',
    logo: telegramLogo,
  },
  {
    name: 'X',
    description: 'Follow for updates and news',
    url: 'https://x.com/live4cyb',
    color: 'x',
    logo: xLogo,
  },
  {
    name: 'Discord',
    description: 'Gamers community and support',
    url: 'https://discord.gg/ARwv74ZyGH',
    color: 'discord',
    logo: discordLogo,
  },
];

const colorStyles = {
  primary: 'border-primary/30 hover:border-primary',
  secondary: 'border-secondary/30 hover:border-secondary',
  accent: 'border-accent/30 hover:border-accent',
  pink: 'border-accent/30 hover:border-accent',
  white: 'border-foreground/30 hover:border-foreground',
  cyan: 'border-secondary/30 hover:border-secondary',
  atomscan: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]',
  keplr: 'border-[#5F38FB]/30 hover:border-[#5F38FB]',
  coingecko: 'border-[#8DC63F]/30 hover:border-[#8DC63F]',
  coinmarketcap: 'border-[#3861FB]/30 hover:border-[#3861FB]',
  telegram: 'border-[#229ED9]/30 hover:border-[#229ED9]',
  x: 'border-foreground/30 hover:border-foreground',
  discord: 'border-[#5865F2]/30 hover:border-[#5865F2]',
  forbes: 'border-[#B4A06E]/30 hover:border-[#B4A06E]',
  mapofzones: 'border-[#7B61FF]/30 hover:border-[#7B61FF]',
  pingpub: 'border-[#6366F1]/30 hover:border-[#6366F1]',
  explorerist: 'border-[#22D3EE]/30 hover:border-[#22D3EE]',
  stakingexplorer: 'border-[#F59E0B]/30 hover:border-[#F59E0B]',
  validatorinfo: 'border-[#10B981]/30 hover:border-[#10B981]',
  defillama: 'border-[#2775CA]/30 hover:border-[#2775CA]',
};

const textColorStyles = {
  primary: 'group-hover:text-primary',
  secondary: 'group-hover:text-secondary',
  accent: 'group-hover:text-accent',
  pink: 'group-hover:text-accent',
  white: 'group-hover:text-foreground group-hover:[text-shadow:0_0_10px_rgba(255,255,255,0.8)]',
  cyan: 'group-hover:text-secondary',
  atomscan: 'group-hover:text-[#8B5CF6]',
  keplr: 'group-hover:text-[#5F38FB]',
  coingecko: 'group-hover:text-[#8DC63F]',
  coinmarketcap: 'group-hover:text-[#3861FB]',
  telegram: 'group-hover:text-[#229ED9]',
  x: 'group-hover:text-foreground',
  discord: 'group-hover:text-[#5865F2]',
  forbes: 'group-hover:text-[#B4A06E]',
  mapofzones: 'group-hover:text-[#7B61FF]',
  pingpub: 'group-hover:text-[#6366F1]',
  explorerist: 'group-hover:text-[#22D3EE]',
  stakingexplorer: 'group-hover:text-[#F59E0B]',
  validatorinfo: 'group-hover:text-[#10B981]',
  defillama: 'group-hover:text-[#2775CA]',
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {ecosystemItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`
                group p-4 md:p-6 rounded-xl border bg-card/50 backdrop-blur-sm
                transition-all duration-300 hover:scale-105
                ${colorStyles[item.color as keyof typeof colorStyles]}
              `}
            >
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Logo or emoji visible only on desktop */}
                  {'emoji' in item && item.emoji ? (
                    <span className="hidden md:block text-2xl">{item.emoji}</span>
                  ) : 'logo' in item && item.logo ? (
                    <img 
                      src={item.logo} 
                      alt={`${item.name} logo`}
                      className="hidden md:block w-6 h-6 object-contain rounded-full"
                    />
                  ) : null}
                  <h3 className={`font-orbitron font-bold text-sm md:text-lg text-foreground transition-colors ${textColorStyles[item.color as keyof typeof textColorStyles]}`}>
                    {item.name}
                  </h3>
                </div>
                <ExternalLink className={`hidden md:block w-5 h-5 text-muted-foreground transition-colors ${textColorStyles[item.color as keyof typeof textColorStyles]}`} />
              </div>
              <p className="text-muted-foreground text-xs md:text-sm transition-colors group-hover:text-foreground">
                {item.description}
              </p>
              {/* Logo or emoji visible only on mobile - at bottom */}
              {'emoji' in item && item.emoji ? (
                <div className="mt-3 flex justify-center md:hidden">
                  <span className="text-3xl">{item.emoji}</span>
                </div>
              ) : 'logo' in item && item.logo ? (
                <div className="mt-3 flex justify-center md:hidden">
                  <img 
                    src={item.logo} 
                    alt={`${item.name} logo`}
                    className="w-8 h-8 object-contain rounded-full"
                  />
                </div>
              ) : null}
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
          <p className="text-foreground text-xl md:text-2xl mb-6">
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
