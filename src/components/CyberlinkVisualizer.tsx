import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Zap, Link2, CheckCircle, XCircle } from 'lucide-react';
import bostromLogo from '@/assets/bostrom-logo.png';

interface BackgroundNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface BackgroundEdge {
  from: number;
  to: number;
}

interface LabeledParticle {
  id: string;
  label: string;
  x: number;
  y: number;
  angle: number;
  color: string;
}

interface CyberlinkResult {
  from: string;
  to: string;
  result: boolean;
  timestamp: number;
}

const BG_COLORS = [
  'hsl(130, 100%, 50%)', // acid green
  'hsl(180, 100%, 50%)', // cyan
  'hsl(300, 100%, 60%)', // magenta
  'hsl(60, 100%, 50%)',  // yellow
  'hsl(30, 100%, 50%)',  // orange
];

const LABELED_PARTICLES: LabeledParticle[] = [
  { id: 'triangle', label: 'triangle', x: 0, y: 0, angle: -Math.PI / 2, color: 'hsl(180, 100%, 50%)' },
  { id: 'pink', label: 'pink', x: 0, y: 0, angle: -Math.PI / 2 + (2 * Math.PI / 5), color: 'hsl(300, 100%, 60%)' },
  { id: 'angle', label: 'angle', x: 0, y: 0, angle: -Math.PI / 2 + (4 * Math.PI / 5), color: 'hsl(130, 100%, 50%)' },
  { id: 'shape', label: 'shape', x: 0, y: 0, angle: -Math.PI / 2 + (6 * Math.PI / 5), color: 'hsl(60, 100%, 50%)' },
  { id: 'neon', label: 'neon', x: 0, y: 0, angle: -Math.PI / 2 + (8 * Math.PI / 5), color: 'hsl(30, 100%, 50%)' },
];

interface ParticleConnection {
  from: string;
  to: string;
}

// Initial connections: neon→pink, angle→shape
const INITIAL_CONNECTIONS: ParticleConnection[] = [
  { from: 'neon', to: 'pink' },
  { from: 'angle', to: 'shape' },
];

export const CyberlinkVisualizer = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgNodesRef = useRef<BackgroundNode[]>([]);
  const bgEdgesRef = useRef<BackgroundEdge[]>([]);
  const bgAnimationRef = useRef<number>();
  const graphAnimationRef = useRef<number>();
  const particlesRef = useRef<LabeledParticle[]>([...LABELED_PARTICLES]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isRebalancingRef = useRef(false);
  
  const [toText, setToText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkCount, setLinkCount] = useState(0);
  const [isCounterRunning, setIsCounterRunning] = useState(false);
  const [results, setResults] = useState<CyberlinkResult[]>([]);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [selectedParticles, setSelectedParticles] = useState<string[]>([]);
  const [particleConnections, setParticleConnections] = useState<ParticleConnection[]>([...INITIAL_CONNECTIONS]);
  const connectionsRef = useRef<ParticleConnection[]>([...INITIAL_CONNECTIONS]);
  const selectedParticlesRef = useRef<string[]>([]);

  // Sync connections ref with state
  useEffect(() => {
    connectionsRef.current = particleConnections;
  }, [particleConnections]);

  // Sync selected particles ref with state
  useEffect(() => {
    selectedParticlesRef.current = selectedParticles;
  }, [selectedParticles]);

  // Initialize background nodes (like KnowledgeGraph)
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initBgNodes();
    };

    const initBgNodes = () => {
      const nodeCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 8000));
      bgNodesRef.current = [];
      bgEdgesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        bgNodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          color: BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)],
        });
      }

      // Create edges between nearby nodes
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (Math.random() < 0.08) {
            bgEdgesRef.current.push({ from: i, to: j });
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = bgNodesRef.current;
      const edges = bgEdgesRef.current;
      const mouse = mouseRef.current;

      // Update and draw nodes
      nodes.forEach((node) => {
        // Mouse attraction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          node.vx += (dx / dist) * 0.015;
          node.vy += (dy / dist) * 0.015;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Damping
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Draw edges
      edges.forEach((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const dist = Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2);

        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.25;
          ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      });

      // Draw nodes with minimal glow
      nodes.forEach((node) => {
        // Small glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.6, node.color.replace(')', ', 0.2)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      bgAnimationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (bgAnimationRef.current) {
        cancelAnimationFrame(bgAnimationRef.current);
      }
    };
  }, []);

  // Graph animation (central core + 5 labeled particles)
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coreImage = new Image();
    coreImage.src = bostromLogo;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const orbitRadius = Math.min(canvas.width, canvas.height) * 0.32;
      const particles = particlesRef.current;
      const isRebalancing = isRebalancingRef.current;

      // Update particle positions
      particles.forEach((p, i) => {
        if (isRebalancing) {
          p.angle += 0.05 + Math.random() * 0.02;
        } else {
          p.angle += 0.002;
        }
        p.x = centerX + Math.cos(p.angle) * orbitRadius;
        p.y = centerY + Math.sin(p.angle) * orbitRadius;
      });

      // Draw connections from particles to core
      particles.forEach((p) => {
        const gradient = ctx.createLinearGradient(centerX, centerY, p.x, p.y);
        gradient.addColorStop(0, 'hsla(130, 100%, 50%, 0.3)');
        gradient.addColorStop(1, p.color.replace(')', ', 0.5)').replace('hsl', 'hsla'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });

      // Draw inter-particle connections
      connectionsRef.current.forEach((conn) => {
        const fromP = particles.find(p => p.id === conn.from);
        const toP = particles.find(p => p.id === conn.to);
        if (!fromP || !toP) return;

        const gradient = ctx.createLinearGradient(fromP.x, fromP.y, toP.x, toP.y);
        gradient.addColorStop(0, fromP.color.replace(')', ', 0.6)').replace('hsl', 'hsla'));
        gradient.addColorStop(1, toP.color.replace(')', ', 0.6)').replace('hsl', 'hsla'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromP.x, fromP.y);
        ctx.lineTo(toP.x, toP.y);
        ctx.stroke();
      });

      // Draw core (Bostrom logo)
      const coreSize = Math.min(canvas.width, canvas.height) * 0.18;
      if (coreImage.complete) {
        // Glow behind core
        const coreGlow = ctx.createRadialGradient(centerX, centerY, coreSize * 0.3, centerX, centerY, coreSize * 0.8);
        coreGlow.addColorStop(0, 'hsla(130, 100%, 50%, 0.2)');
        coreGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(
          coreImage,
          centerX - coreSize / 2,
          centerY - coreSize / 2,
          coreSize,
          coreSize
        );
      }

      // Draw labeled particles (small glow)
      const selected = selectedParticlesRef.current;
      particles.forEach((p) => {
        const size = 12;
        const isSelected = selected.includes(p.id);

        // Selection ring (if selected)
        if (isSelected) {
          ctx.strokeStyle = 'hsl(300, 100%, 60%)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size + 6, 0, Math.PI * 2);
          ctx.stroke();
          
          // Pulsing glow for selected
          const pulseGlow = ctx.createRadialGradient(p.x, p.y, size, p.x, p.y, size * 2.5);
          pulseGlow.addColorStop(0, 'hsla(300, 100%, 60%, 0.4)');
          pulseGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = pulseGlow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Minimal glow
        const glowGradient = ctx.createRadialGradient(p.x, p.y, size * 0.5, p.x, p.y, size * 1.5);
        glowGradient.addColorStop(0, p.color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 3D sphere
        const sphereGradient = ctx.createRadialGradient(
          p.x - size * 0.3, p.y - size * 0.3, size * 0.1,
          p.x, p.y, size
        );
        sphereGradient.addColorStop(0, 'hsl(0, 0%, 90%)');
        sphereGradient.addColorStop(0.3, p.color);
        sphereGradient.addColorStop(1, p.color.replace('100%', '30%').replace('60%', '20%'));
        
        ctx.fillStyle = sphereGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '11px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? 'hsl(300, 100%, 60%)' : '#ffffff';
        ctx.fillText(p.label, p.x, p.y + size + 16);
      });

      graphAnimationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (graphAnimationRef.current) {
        cancelAnimationFrame(graphAnimationRef.current);
      }
    };
  }, []);

  // Link counter
  useEffect(() => {
    if (!isCounterRunning) return;
    
    const interval = setInterval(() => {
      setLinkCount(prev => {
        const increment = Math.floor(Math.random() * 1200) + 800;
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

  const reorganizeParticles = useCallback(() => {
    isRebalancingRef.current = true;
    setLinkCount(0);
    setIsCounterRunning(true);
    
    // After animation, redistribute particles evenly around the orbit
    setTimeout(() => {
      isRebalancingRef.current = false;
      const particles = particlesRef.current;
      const count = particles.length;
      particles.forEach((p, i) => {
        // Evenly distribute starting from top (-PI/2)
        p.angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      });
    }, 2000);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const particles = particlesRef.current;
    const clickRadius = 25; // Hit area for particles

    // Check if clicked on a particle
    for (const p of particles) {
      const dist = Math.sqrt((clickX - p.x) ** 2 + (clickY - p.y) ** 2);
      if (dist < clickRadius) {
        setSelectedParticles(prev => {
          if (prev.includes(p.id)) {
            // Deselect if already selected
            return prev.filter(id => id !== p.id);
          } else if (prev.length < 2) {
            // Add to selection (max 2)
            return [...prev, p.id];
          } else {
            // Replace first selection
            return [prev[1], p.id];
          }
        });
        return;
      }
    }

    // Clicked on empty space - clear selection
    setSelectedParticles([]);
  }, []);

  const handleCreateLink = useCallback(() => {
    if (selectedParticles.length !== 2) return;

    const [from, to] = selectedParticles;
    
    // Check if connection already exists
    const exists = particleConnections.some(
      conn => (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)
    );

    if (!exists) {
      const newConnection = { from, to };
      setParticleConnections(prev => [...prev, newConnection]);
      reorganizeParticles();
    }

    setSelectedParticles([]);
  }, [selectedParticles, particleConnections, reorganizeParticles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toText.trim()) return;

    setIsProcessing(true);
    setShowResult(null);
    
    // Add new particle on the LEFT side of the graph (angle = PI)
    const newParticle: LabeledParticle = {
      id: `particle-${Date.now()}`,
      label: toText.trim(),
      x: 0,
      y: 0,
      angle: Math.PI, // Left side of the orbit
      color: BG_COLORS[particlesRef.current.length % BG_COLORS.length],
    };
    particlesRef.current.push(newParticle);
    
    reorganizeParticles();
    
    await new Promise(resolve => setTimeout(resolve, 2000));

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
      {/* Background canvas (like main page) */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
      
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
          {/* Graph Canvas */}
          <div className="relative aspect-square max-h-[500px] rounded-xl border border-primary/30 overflow-hidden box-glow-primary bg-background/50 backdrop-blur-sm">
            <canvas
              ref={graphCanvasRef}
              className="w-full h-full cursor-pointer"
              style={{ background: 'transparent' }}
              onClick={handleCanvasClick}
            />

            {/* Selected particles info & create link button */}
            <AnimatePresence>
              {selectedParticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-0 right-0 mx-auto w-fit bg-card/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-[hsl(300,100%,60%)]/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[hsl(300,100%,60%)] font-orbitron">
                        {selectedParticles[0]}
                      </span>
                      {selectedParticles.length === 2 && (
                        <>
                          <Link2 className="w-4 h-4 text-[hsl(300,100%,60%)]" />
                          <span className="text-sm text-[hsl(300,100%,60%)] font-orbitron">
                            {selectedParticles[1]}
                          </span>
                        </>
                      )}
                    </div>
                    {selectedParticles.length === 2 && (
                      <Button
                        size="sm"
                        onClick={handleCreateLink}
                        className="font-orbitron bg-[hsl(300,100%,60%)] hover:bg-[hsl(300,100%,50%)] text-white"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Cyberlink
                      </Button>
                    )}
                  </div>
                  {selectedParticles.length === 1 && (
                    <p className="text-xs text-muted-foreground mt-1">Select another particle</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            

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
                <div className="text-xs text-muted-foreground mb-1">Connections</div>
                <div className="font-orbitron text-secondary text-glow-secondary">
                  {5 + particleConnections.length}
                </div>
              </div>
              <div className="bg-card/30 rounded-lg p-4 border border-accent/30">
                <div className="text-xs text-muted-foreground mb-1">Knowledge Particles</div>
                <div className="font-orbitron text-accent text-glow-accent">
                  6
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
