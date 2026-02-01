import { useEffect, useState, useCallback } from 'react';

// Global state for counter synchronization
let globalCount = 0;
let listeners: Set<(count: number) => void> = new Set();
let intervalId: NodeJS.Timeout | null = null;

const maxCount = 3000000;
const durationMs = 60000; // 1 minute
const intervalMs = 16; // ~60fps
const incrementPerInterval = Math.round(maxCount / (durationMs / intervalMs));

const startInterval = () => {
  if (intervalId) return;
  
  intervalId = setInterval(() => {
    globalCount += incrementPerInterval;
    if (globalCount >= maxCount) {
      globalCount = 0;
    }
    listeners.forEach(listener => listener(globalCount));
  }, intervalMs);
};

const stopInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

export const triggerRebalance = () => {
  globalCount = 0;
  listeners.forEach(listener => listener(0));
};

export const useWeightCounter = () => {
  const [count, setCount] = useState(globalCount);

  useEffect(() => {
    listeners.add(setCount);
    
    // Start interval if first listener
    if (listeners.size === 1) {
      startInterval();
    }

    return () => {
      listeners.delete(setCount);
      
      // Stop interval if no more listeners
      if (listeners.size === 0) {
        stopInterval();
      }
    };
  }, []);

  const resetCounter = useCallback(() => {
    triggerRebalance();
  }, []);

  return { count, resetCounter };
};
