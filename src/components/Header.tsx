import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import bostromLogo from '@/assets/bostrom-logo.png';

const navLinks = [
  { label: 'How?', href: '#how' },
  { label: '$BOOT', href: '#token' },
  { label: 'Science', href: '#science' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Docs', href: 'https://cyber.page/bostrom', external: true },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border' : ''
      }`}
    >
      <div className="container mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Tagline group */}
          <div className="flex items-center shrink-0">
            <a href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
              <img src={bostromLogo} alt="Bostrom" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              <span className="font-orbitron font-bold text-base sm:text-lg md:text-xl text-primary text-glow-primary">
                BOSTROM
              </span>
            </a>

            {/* Animated tagline - visible on mobile */}
            <span 
              className="font-orbitron font-bold text-xs sm:text-sm animate-starlight min-w-0 truncate md:hidden"
              style={{ wordSpacing: '-0.1em', marginLeft: '0.6em' }}
              data-text="BIG BADASS GRAPH"
            >
              BIG BADASS GRAPH
            </span>

            {/* Desktop tagline */}
            <span 
              className="hidden md:inline font-orbitron font-bold text-sm md:text-base animate-starlight"
              style={{ wordSpacing: '-0.1em', marginLeft: '0.6em' }}
              data-text="BIG BADASS GRAPH"
            >
              BIG BADASS GRAPH
            </span>
          </div>

          {/* Desktop Nav - hidden on mobile and tablet */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="font-play text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://cyb.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground font-orbitron font-bold text-sm rounded-lg hover:scale-105 transition-transform"
            >
              BROWSER
            </a>
          </nav>

          {/* Mobile/Tablet Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 text-foreground shrink-0"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu - Fullscreen overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed inset-0 top-0 z-[100]"
          style={{ backgroundColor: 'hsl(0 0% 0%)' }}
        >
          {/* Header area spacer */}
          <div className="h-16 md:h-20" />
          
          {/* Gradient background effect */}
          <div className="absolute inset-0 top-16 md:top-20 bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          
          <nav className="relative container mx-auto px-6 pt-20 md:pt-24 pb-8 flex flex-col h-full overflow-y-auto">
            {/* Navigation links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group flex items-center gap-4 py-4 border-b border-border/30 hover:border-primary/50 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_10px_hsl(var(--primary))] transition-all" />
                  <span className="font-orbitron text-xl text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </div>
            
            {/* CTA Button at bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-auto pb-8"
            >
              <a
                href="https://cyb.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 bg-primary text-primary-foreground font-orbitron font-bold text-center text-lg rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              >
                LAUNCH BROWSER
              </a>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};
