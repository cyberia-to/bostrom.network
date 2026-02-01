import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ConvergenceGraphProps {
  progress: number; // 0 to 1
}

export const ConvergenceGraph = ({ progress }: ConvergenceGraphProps) => {
  const width = 1000;
  const height = 60;
  const padding = 20;
  
  // Generate converging oscillation path that spans across all blocks
  const pathData = useMemo(() => {
    const points: string[] = [];
    const numPoints = 100;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = padding + (i / numPoints) * (width - 2 * padding);
      const t = i / numPoints;
      
      // Damped oscillation: amplitude decreases as t increases
      const amplitude = height / 3 * Math.exp(-2.5 * t);
      const frequency = 6;
      const oscillation = amplitude * Math.sin(t * frequency * Math.PI);
      
      // Center line with oscillation
      const y = height / 2 + oscillation;
      
      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }
    
    return points.join(' ');
  }, []);

  return (
    <div className="w-full relative">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full"
        style={{ height: '60px' }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <line 
          x1={padding} 
          y1={height / 2} 
          x2={width - padding} 
          y2={height / 2} 
          stroke="hsl(var(--primary))" 
          strokeOpacity={0.15}
          strokeDasharray="8 8"
        />
        
        {/* Convergence path - background */}
        <path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity={0.1}
          strokeWidth={2}
        />
        
        {/* Convergence path - animated */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.1, ease: "linear" }}
          style={{
            filter: 'drop-shadow(0 0 4px hsl(var(--primary)))',
          }}
        />
        
        {/* Start point indicator */}
        <motion.circle
          cx={padding}
          cy={height / 2}
          r={5}
          fill="hsl(var(--primary))"
          initial={{ opacity: 0.5 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            r: [4, 6, 4]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'drop-shadow(0 0 8px hsl(var(--primary)))',
          }}
        />
        
        {/* Current progress point */}
        <motion.circle
          cx={padding + progress * (width - 2 * padding)}
          cy={height / 2}
          r={4}
          fill="hsl(var(--accent))"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.6, 1, 0.6],
            r: [3, 5, 3]
          }}
          transition={{ 
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'drop-shadow(0 0 6px hsl(var(--accent)))',
          }}
        />
        
        {/* End point - convergence target */}
        <circle
          cx={width - padding}
          cy={height / 2}
          r={4}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity={0.5}
          strokeWidth={1.5}
        />
      </svg>
      
      {/* Label */}
      <div className="text-xs text-primary/60 mt-2 font-mono tracking-wide text-center">
        convergence
      </div>
    </div>
  );
};