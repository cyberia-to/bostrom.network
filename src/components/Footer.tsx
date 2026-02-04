import bostromLogo from '@/assets/bostrom-logo.png';

export const Footer = () => {
  return (
    <footer className="py-8 md:py-12 pb-24 md:pb-28 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main row - logo, tagline (desktop), BIG BADASS GRAPH */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src={bostromLogo} alt="Bostrom" className="w-8 h-8" />
            <span className="font-orbitron font-bold text-primary">BOSTROM</span>
          </div>

          {/* Tagline - desktop only (inline) */}
          <p className="text-muted-foreground text-center text-xs md:text-sm font-play hidden md:block">
            Named after Nick Bostrom. Building the bootloader of superintelligence.
          </p>

          {/* BIG BADASS GRAPH */}
          <p
            className="font-orbitron font-bold text-sm md:text-lg animate-starlight flex-shrink-0"
            data-text="BIG BADASS GRAPH"
          >
            BIG BADASS GRAPH
          </p>
        </div>

        {/* Tagline - mobile only (below) */}
        <p className="text-muted-foreground text-center text-xs font-play mt-4 md:hidden">
          Named after Nick Bostrom. Building the bootloader of superintelligence.
        </p>
      </div>
    </footer>
  );
};
