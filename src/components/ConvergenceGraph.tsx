import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ConvergenceGraphProps {
  progress: number; // 0 to 1
}

export const ConvergenceGraph = ({ progress }: ConvergenceGraphProps) => {
  const width = 280;
  const height = 60;
  const padding = 10;
  
  // Generate converging oscillation path
  const pathData = useMemo(() => {
    const points: string[] = [];
    const numPoints = 50;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = padding + (i / numPoints) * (width - 2 * padding);
      const t = i / numPoints;
      
      // Damped oscillation: amplitude decreases as t increases
      const amplitude = height / 3 * Math.exp(-3 * t);
      const frequency = 8;
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

  // Calculate the visible portion of the path based on progress
  const pathLength = 500; // Approximate path length
  const visibleLength = progress * pathLength;

  return (
    <div className="mt-4 relative">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full max-w-[280px] mx-auto"
        style={{ height: '60px' }}
      >
        {/* Grid lines */}
        <line 
          x1={padding} 
          y1={height / 2} 
          x2={width - padding} 
          y2={height / 2} 
          stroke="hsl(var(--primary))" 
          strokeOpacity={0.2}
          strokeDasharray="4 4"
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
        
        {/* Current point indicator */}
        <motion.circle
          cx={padding + progress * (width - 2 * padding)}
          cy={height / 2}
          r={4}
          fill="hsl(var(--primary))"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            r: [3, 5, 3]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'drop-shadow(0 0 8px hsl(var(--primary)))',
          }}
        />
        
        {/* End point - convergence target */}
        <circle
          cx={width - padding}
          cy={height / 2}
          r={3}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
      </svg>
      
      {/* Label */}
      <div className="text-xs text-primary/60 mt-1 font-mono tracking-wide text-center">
        convergence
      </div>
    </div>
  );
};
