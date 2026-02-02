import { Github, Send } from 'lucide-react';
import bostromLogo from '@/assets/bostrom-logo.png';

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { icon: Github, href: 'https://github.com/cyberia-to/cyb-ts', label: 'GitHub' },
  { icon: Send, href: 'https://t.me/fuckgoogle', label: 'Telegram' },
  { icon: XIcon, href: 'https://x.com/live4cyb', label: 'X' },
];

export const Footer = () => {
  return (
    <footer className="py-8 md:py-12 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main row - all items aligned */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={bostromLogo} alt="Bostrom" className="w-8 h-8" />
            <span className="font-orbitron font-bold text-primary">BOSTROM</span>
          </div>

          {/* Tagline - centered and flexible */}
          <p className="text-muted-foreground text-center text-sm md:text-base font-play flex-1 max-w-xl">
            Named after Nick Bostrom. Building the bootloader of superintelligence.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 shrink-0">
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

        {/* Copyright */}
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border/50 text-center">
          <p className="text-xs md:text-sm text-muted-foreground font-play">
            © {new Date().getFullYear()} Bostrom Network. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
};
