import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Zap, Link2, CheckCircle, XCircle } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  weight: number;
  color: string;
  label?: string;
}

interface CyberlinkResult {
  from: string;
  to: string;
  result: boolean;
  timestamp: number;
}

const NEON_COLORS = [
  'hsl(130, 100%, 50%)', // acid green
  'hsl(180, 100%, 50%)', // cyan
  'hsl(300, 100%, 60%)', // magenta
  'hsl(60, 100%, 50%)',  // yellow
];

export const CyberlinkVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const centerParticleRef = useRef({ x: 0, y: 0 });
  
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkCount, setLinkCount] = useState(0);
  const [results, setResults] = useState<CyberlinkResult[]>([]);
  const [showResult, setShowResult] = useState<boolean | null>(null);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      centerParticleRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2,
      };
      
      initParticles();
    };

    const initParticles = () => {
      const count = 40;
      particlesRef.current = [];
      
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const radius = 100 + Math.random() * 150;
        particlesRef.current.push({
          id: i,
          x: centerParticleRef.current.x + Math.cos(angle) * radius,
          y: centerParticleRef.current.y + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          weight: Math.random() * 0.5 + 0.5,
          color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const center = centerParticleRef.current;
      const particles = particlesRef.current;

      // Draw connections to center
      particles.forEach((p) => {
        const dx = center.x - p.x;
        const dy = center.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 250) {
          const alpha = ((1 - dist / 250) * p.weight * 0.6);
          ctx.strokeStyle = p.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
          ctx.lineWidth = p.weight * 2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(center.x, center.y);
          ctx.stroke();
        }
      });

      // Draw and update particles
      particles.forEach((p) => {
        // Gentle orbit around center
        const dx = center.x - p.x;
        const dy = center.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction to maintain orbit
        const targetDist = 120 + p.weight * 80;
        const force = (dist - targetDist) * 0.001;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        
        // Tangential velocity for orbit
        p.vx += (-dy / dist) * 0.02;
        p.vy += (dx / dist) * 0.02;
        
        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15 * p.weight);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15 * p.weight, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.weight, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw center particle (neon triangle)
      const triangleSize = 35;
      const rotation = Date.now() / 3000; // Slow rotation
      const pulse = 1 + Math.sin(Date.now() / 500) * 0.1;
      
      // Triangle vertices
      const vertices = [];
      for (let i = 0; i < 3; i++) {
        const angle = rotation + (i * Math.PI * 2) / 3 - Math.PI / 2;
        vertices.push({
          x: center.x + Math.cos(angle) * triangleSize * pulse,
          y: center.y + Math.sin(angle) * triangleSize * pulse,
        });
      }

      // Outer glow
      ctx.shadowColor = 'hsl(130, 100%, 50%)';
      ctx.shadowBlur = 30;
      
      // Fill with gradient
      const triGradient = ctx.createRadialGradient(
        center.x, center.y, 0,
        center.x, center.y, triangleSize * 1.5
      );
      triGradient.addColorStop(0, 'hsla(130, 100%, 60%, 0.4)');
      triGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = triGradient;
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      ctx.lineTo(vertices[1].x, vertices[1].y);
      ctx.lineTo(vertices[2].x, vertices[2].y);
      ctx.closePath();
      ctx.fill();
      
      // Neon stroke
      ctx.strokeStyle = 'hsl(130, 100%, 50%)';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Inner glow stroke
      ctx.strokeStyle = 'hsla(130, 100%, 70%, 0.5)';
      ctx.lineWidth = 6;
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Link counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLinkCount(prev => prev + Math.floor(Math.random() * 100) + 50);
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  // Reorganize particles based on new weights
  const reorganizeParticles = useCallback(() => {
    particlesRef.current.forEach((p) => {
      // Randomize weights to simulate learning
      p.weight = Math.random() * 0.5 + 0.5;
      // Add impulse
      p.vx += (Math.random() - 0.5) * 3;
      p.vy += (Math.random() - 0.5) * 3;
      // Possibly change color
      if (Math.random() > 0.7) {
        p.color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromText.trim() || !toText.trim()) return;

    setIsProcessing(true);
    setShowResult(null);

    // Simulate processing with visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Reorganize graph
    reorganizeParticles();
    
    await new Promise(resolve => setTimeout(resolve, 600));

    // Generate result
    const result = Math.random() > 0.3;
    setShowResult(result);
    
    setResults(prev => [{
      from: fromText,
      to: toText,
      result,
      timestamp: Date.now(),
    }, ...prev.slice(0, 4)]);

    setIsProcessing(false);
    setFromText('');
    setToText('');
  };

  return (
    <section className="py-20 relative overflow-hidden min-h-[700px]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-glow-primary mb-4">
            Create Cyberlink
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect knowledge particles and watch the graph reorganize in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Visualization Canvas */}
          <div className="relative aspect-square max-h-[500px] rounded-xl border border-primary/30 overflow-hidden box-glow-primary">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: 'transparent' }}
            />
            
            {/* Live counter overlay */}
            <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/30">
              <div className="text-xs text-muted-foreground">Links/sec</div>
              <div className="text-lg font-orbitron text-primary text-glow-primary">
                ~70,000
              </div>
            </div>

            {/* Processing overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="font-orbitron text-primary text-glow-primary">
                      Recalculating weights...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result overlay */}
            <AnimatePresence>
              {showResult !== null && !isProcessing && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    {showResult ? (
                      <CheckCircle className="w-8 h-8 text-primary" />
                    ) : (
                      <XCircle className="w-8 h-8 text-destructive" />
                    )}
                    <span className={`font-orbitron text-xl ${showResult ? 'text-primary text-glow-primary' : 'text-destructive'}`}>
                      {showResult ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-play">From (Particle A)</label>
                <div className="relative">
                  <Input
                    value={fromText}
                    onChange={(e) => setFromText(e.target.value)}
                    placeholder="Enter knowledge..."
                    className="bg-card/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Link2 className="w-6 h-6 text-primary rotate-90" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-play">To (Particle B)</label>
                <div className="relative">
                  <Input
                    value={toText}
                    onChange={(e) => setToText(e.target.value)}
                    placeholder="Connect to..."
                    className="bg-card/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing || !fromText.trim() || !toText.trim()}
                className="w-full font-orbitron box-glow-primary"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Create Cyberlink'}
              </Button>
            </form>

            {/* Recent links */}
            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-play text-muted-foreground">Recent Cyberlinks</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.timestamp}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm bg-card/30 rounded-lg px-3 py-2 border border-primary/20"
                    >
                      <span className="text-muted-foreground truncate flex-1">{r.from}</span>
                      <Link2 className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground truncate flex-1">{r.to}</span>
                      {r.result ? (
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/30 rounded-lg p-4 border border-secondary/30">
                <div className="text-xs text-muted-foreground mb-1">Total Links Created</div>
                <div className="font-orbitron text-secondary text-glow-secondary">
                  {linkCount.toLocaleString()}
                </div>
              </div>
              <div className="bg-card/30 rounded-lg p-4 border border-accent/30">
                <div className="text-xs text-muted-foreground mb-1">Knowledge Particles</div>
                <div className="font-orbitron text-accent text-glow-accent">
                  {particlesRef.current.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
