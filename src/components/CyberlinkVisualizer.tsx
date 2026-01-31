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
  connections: number[]; // IDs of connected particles
}

interface Edge {
  from: number;
  to: number;
}

interface CyberlinkResult {
  from: string;
  to: string;
  result: boolean;
  timestamp: number;
}

const NEON_COLORS = [
  'hsl(210, 100%, 50%)', // blue (like reference)
  'hsl(130, 100%, 50%)', // acid green
  'hsl(180, 100%, 50%)', // cyan
];

export const CyberlinkVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animationRef = useRef<number>();
  const isRebalancingRef = useRef(false);
  const rebalanceStartTimeRef = useRef(0);
  
  const [toText, setToText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkCount, setLinkCount] = useState(0);
  const [isCounterRunning, setIsCounterRunning] = useState(false);
  const [results, setResults] = useState<CyberlinkResult[]>([]);
  const [showResult, setShowResult] = useState<boolean | null>(null);

  // Initialize particles with connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      initParticles();
    };

    const initParticles = () => {
      const count = 50;
      particlesRef.current = [];
      edgesRef.current = [];
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Create particles with varying weights (bigger = more connections)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const radius = 60 + Math.random() * 180;
        const weight = Math.random() * 1.5 + 0.3; // Weight affects size and gravity
        
        particlesRef.current.push({
          id: i,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          weight,
          color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
          connections: [],
        });
      }
      
      // Create edges - heavier particles have more connections
      for (let i = 0; i < count; i++) {
        const p = particlesRef.current[i];
        const connectionCount = Math.floor(p.weight * 4) + 1; // More weight = more connections
        
        for (let c = 0; c < connectionCount; c++) {
          // Connect to nearby particles preferentially
          let bestTarget = -1;
          let bestDist = Infinity;
          
          for (let j = 0; j < count; j++) {
            if (i === j || p.connections.includes(j)) continue;
            
            const other = particlesRef.current[j];
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Prefer closer and heavier particles
            const score = dist / (other.weight + 0.5);
            if (score < bestDist && Math.random() > 0.3) {
              bestDist = score;
              bestTarget = j;
            }
          }
          
          if (bestTarget >= 0 && !p.connections.includes(bestTarget)) {
            p.connections.push(bestTarget);
            particlesRef.current[bestTarget].connections.push(i);
            edgesRef.current.push({ from: i, to: bestTarget });
          }
        }
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const edges = edgesRef.current;
      const isRebalancing = isRebalancingRef.current;
      
      // Draw curved edges between particles (like reference image)
      ctx.lineCap = 'round';
      edges.forEach((edge) => {
        const from = particles[edge.from];
        const to = particles[edge.to];
        if (!from || !to) return;
        
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Curve control point
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const perpX = -dy / dist * 20;
        const perpY = dx / dist * 20;
        
        const alpha = Math.min(0.7, (from.weight + to.weight) * 0.3);
        ctx.strokeStyle = `hsla(130, 100%, 50%, ${alpha})`;
        ctx.lineWidth = Math.max(1, (from.weight + to.weight) * 1.5);
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(midX + perpX, midY + perpY, to.x, to.y);
        ctx.stroke();
      });

      // Physics simulation
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Rebalancing intensity
      const rebalanceMultiplier = isRebalancing ? 15 : 1;
      
      particles.forEach((p, i) => {
        // Gravity towards center (proportional to weight)
        const toCenterX = centerX - p.x;
        const toCenterY = centerY - p.y;
        const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
        
        // Heavier particles stay closer to center
        const targetDist = 150 - p.weight * 30;
        const centerForce = (distToCenter - targetDist) * 0.0005 * rebalanceMultiplier;
        p.vx += (toCenterX / distToCenter) * centerForce;
        p.vy += (toCenterY / distToCenter) * centerForce;
        
        // Attraction/repulsion between connected particles
        p.connections.forEach((connId) => {
          const other = particles[connId];
          if (!other) return;
          
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Spring force - heavier particles pull stronger
          const idealDist = 60 + (p.weight + other.weight) * 20;
          const springForce = (dist - idealDist) * 0.002 * other.weight * rebalanceMultiplier;
          
          p.vx += (dx / dist) * springForce;
          p.vy += (dy / dist) * springForce;
        });
        
        // Repulsion from all nearby particles
        particles.forEach((other, j) => {
          if (i === j) return;
          
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 80) {
            const repelForce = (80 - dist) * 0.001 * rebalanceMultiplier;
            p.vx -= (dx / dist) * repelForce;
            p.vy -= (dy / dist) * repelForce;
          }
        });
        
        // Damping
        const damping = isRebalancing ? 0.92 : 0.97;
        p.vx *= damping;
        p.vy *= damping;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Keep in bounds
        p.x = Math.max(30, Math.min(canvas.width - 30, p.x));
        p.y = Math.max(30, Math.min(canvas.height - 30, p.y));
      });

      // Draw particles (bigger = heavier weight) - 3D sphere effect
      particles.forEach((p) => {
        const size = 5 + p.weight * 10;
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(p.x, p.y, size * 0.8, p.x, p.y, size * 3);
        glowGradient.addColorStop(0, p.color.replace(')', ', 0.4)').replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Main sphere with 3D gradient (light from top-left)
        const sphereGradient = ctx.createRadialGradient(
          p.x - size * 0.35, p.y - size * 0.35, size * 0.1,
          p.x, p.y, size
        );
        sphereGradient.addColorStop(0, 'hsl(210, 100%, 75%)'); // bright highlight
        sphereGradient.addColorStop(0.3, 'hsl(210, 100%, 55%)'); // mid tone
        sphereGradient.addColorStop(0.7, 'hsl(210, 100%, 45%)'); // base color
        sphereGradient.addColorStop(1, 'hsl(210, 100%, 25%)'); // dark edge
        
        ctx.fillStyle = sphereGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Specular highlight (small bright spot)
        const highlightGradient = ctx.createRadialGradient(
          p.x - size * 0.4, p.y - size * 0.4, 0,
          p.x - size * 0.4, p.y - size * 0.4, size * 0.5
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        highlightGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(p.x - size * 0.4, p.y - size * 0.4, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Secondary reflection (bottom-right subtle glow)
        const reflectionGradient = ctx.createRadialGradient(
          p.x + size * 0.3, p.y + size * 0.3, 0,
          p.x + size * 0.3, p.y + size * 0.3, size * 0.4
        );
        reflectionGradient.addColorStop(0, 'rgba(100, 180, 255, 0.3)');
        reflectionGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = reflectionGradient;
        ctx.beginPath();
        ctx.arc(p.x + size * 0.3, p.y + size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Link counter - runs during rebalancing, stops at 3M
  useEffect(() => {
    if (!isCounterRunning) return;
    
    const interval = setInterval(() => {
      setLinkCount(prev => {
        const increment = Math.floor(Math.random() * 1200) + 800; // ~70,000/sec at 60fps
        const next = prev + increment;
        if (next >= 3000000) {
          setIsCounterRunning(false);
          return 3000000;
        }
        return next;
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, [isCounterRunning]);

  // Reorganize particles - intense rebalancing
  const reorganizeParticles = useCallback(() => {
    isRebalancingRef.current = true;
    rebalanceStartTimeRef.current = Date.now();
    
    // Start counter from 0
    setLinkCount(0);
    setIsCounterRunning(true);
    
    particlesRef.current.forEach((p) => {
      // Randomize weights dramatically
      p.weight = Math.random() * 1.5 + 0.3;
      
      // Strong impulses for chaotic movement
      p.vx += (Math.random() - 0.5) * 20;
      p.vy += (Math.random() - 0.5) * 20;
      
      // Change some colors
      if (Math.random() > 0.5) {
        p.color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      }
    });
    
    // Some edges get rewired
    const edges = edgesRef.current;
    for (let i = edges.length - 1; i >= 0; i--) {
      if (Math.random() > 0.7) {
        const edge = edges[i];
        const fromP = particlesRef.current[edge.from];
        const toP = particlesRef.current[edge.to];
        if (fromP && toP) {
          fromP.connections = fromP.connections.filter(c => c !== edge.to);
          toP.connections = toP.connections.filter(c => c !== edge.from);
        }
        edges.splice(i, 1);
      }
    }
    
    // Add some new random edges
    const particles = particlesRef.current;
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * particles.length);
      const b = Math.floor(Math.random() * particles.length);
      if (a !== b && !particles[a].connections.includes(b)) {
        particles[a].connections.push(b);
        particles[b].connections.push(a);
        edges.push({ from: a, to: b });
      }
    }
    
    // Stop rebalancing after 2 seconds
    setTimeout(() => {
      isRebalancingRef.current = false;
    }, 2000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toText.trim()) return;

    setIsProcessing(true);
    setShowResult(null);

    // Start intense rebalancing
    reorganizeParticles();
    
    // Wait for rebalancing to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate result
    const result = Math.random() > 0.3;
    setShowResult(result);
    
    setResults(prev => [{
      from: '△',
      to: toText,
      result,
      timestamp: Date.now(),
    }, ...prev.slice(0, 4)]);

    setIsProcessing(false);
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
              <div className="text-xs text-muted-foreground">
                {isCounterRunning ? 'Rebalancing...' : 'Ready'}
              </div>
              <div className="text-lg font-orbitron text-primary text-glow-primary tabular-nums">
                {linkCount.toLocaleString()}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Neon Pink Triangle */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <svg 
                    width="80" 
                    height="70" 
                    viewBox="0 0 80 70" 
                    className="drop-shadow-[0_0_15px_hsl(300,100%,60%)]"
                  >
                    <polygon 
                      points="40,5 75,65 5,65" 
                      fill="transparent"
                      stroke="hsl(300, 100%, 60%)"
                      strokeWidth="3"
                      className="animate-pulse-slow"
                    />
                    <polygon 
                      points="40,5 75,65 5,65" 
                      fill="hsla(300, 100%, 60%, 0.1)"
                    />
                  </svg>
                  {/* Inner glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[hsl(300,100%,60%)] blur-md opacity-60" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-play uppercase tracking-wider">Particle</span>
              </div>

              <div className="flex justify-center">
                <Link2 className="w-6 h-6 text-[hsl(300,100%,60%)] rotate-90" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-play">Connect to</label>
                <div className="relative">
                  <Input
                    value={toText}
                    onChange={(e) => setToText(e.target.value)}
                    placeholder="Enter knowledge..."
                    className="bg-card/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing || !toText.trim()}
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
                <div className="text-xs text-muted-foreground mb-1">Graph Edges</div>
                <div className="font-orbitron text-secondary text-glow-secondary">
                  {edgesRef.current.length}
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
