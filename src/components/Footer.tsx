import { Github, Twitter, MessageCircle } from 'lucide-react';
import bostromLogo from '@/assets/bostrom-logo.png';

const socialLinks = [
  { icon: Github, href: 'https://github.com/cybercongress', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/cyber_devs', label: 'Twitter' },
  { icon: MessageCircle, href: 'https://t.me/fuckgoogle', label: 'Telegram' },
];

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={bostromLogo} alt="Bostrom" className="w-8 h-8" />
            <span className="font-orbitron font-bold text-primary">BOSTROM</span>
          </div>

          {/* Tagline */}
          <p className="text-muted-foreground text-center font-play">
            Named after Nick Bostrom. Building the bootloader of superintelligence.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground font-play">
            © {new Date().getFullYear()} Bostrom Network. Open source. Built by{' '}
            <a
              href="https://github.com/cybercongress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              cyber~Congress
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
