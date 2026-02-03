import * as React from "react";

import { cn } from "@/lib/utils";

type FittedTextProps = {
  text: string;
  className?: string;
  characterClassName?: string;
};

/**
 * Keeps text on a single line, prevents horizontal jitter by rendering each character
 * in a fixed-width cell, and scales down to fit within the available container width.
 */
export function FittedText({ text, className, characterClassName }: FittedTextProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [scale, setScale] = React.useState(1);

  const recompute = React.useCallback(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const available = container.clientWidth;
    const needed = el.scrollWidth;
    if (available <= 0 || needed <= 0) return;

    const next = Math.min(1, available / needed);
    setScale((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
  }, []);

  React.useLayoutEffect(() => {
    // Only recompute when character count changes to avoid work on every SPEED tick.
    recompute();
  }, [text.length, recompute]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => recompute());
    ro.observe(container);
    return () => ro.disconnect();
  }, [recompute]);

  return (
    <div ref={containerRef} className="w-full min-w-0 flex items-center justify-center">
      <span
        ref={textRef}
        aria-label={text}
        className={cn(
          "inline-flex whitespace-nowrap leading-none transform-gpu tabular-nums",
          className,
        )}
        style={{ transform: `scale(${scale})`, transformOrigin: "center", willChange: "transform" }}
      >
        {text.split("").map((ch, i) => (
          <span
            key={i}
            className={cn("inline-block w-[1ch] text-center text-primary", characterClassName)}
            style={{ color: '#00FF41', textShadow: '0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.5)' }}
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  );
}
