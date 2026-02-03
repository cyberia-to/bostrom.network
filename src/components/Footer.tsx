import bostromLogo from '@/assets/bostrom-logo.png';

export const Footer = () => {
  return (
    <footer className="py-8 md:py-12 pb-24 md:pb-28 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Top row - logo and BIG BADASS GRAPH */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={bostromLogo} alt="Bostrom" className="w-8 h-8" />
            <span className="font-orbitron font-bold text-primary">BOSTROM</span>
          </div>

          {/* BIG BADASS GRAPH */}
          <p
            className="font-orbitron font-bold text-sm md:text-lg animate-starlight"
            data-text="BIG BADASS GRAPH"
          >
            BIG BADASS GRAPH
          </p>
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground text-center text-sm font-play mb-6">
          Named after Nick Bostrom. Building the bootloader of superintelligence.
        </p>

      </div>
    </footer>
  );
};
