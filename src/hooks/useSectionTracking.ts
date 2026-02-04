import { useEffect, useRef } from 'react';

// Declare plausible on window
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string>; u?: string }) => void;
  }
}

const trackedSections = new Set<string>();

export const useSectionTracking = (sectionId: string) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Track when section becomes 50% visible
          if (entry.isIntersecting && !trackedSections.has(sectionId)) {
            trackedSections.add(sectionId);
            
            // Update URL hash and trigger pageview for Plausible
            const newUrl = sectionId === 'hero' ? '/' : `/#${sectionId}`;
            history.replaceState(null, '', sectionId === 'hero' ? '/' : `#${sectionId}`);
            
            // Manually trigger pageview with the new URL
            if (window.plausible) {
              window.plausible('pageview', { u: window.location.origin + newUrl });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [sectionId]);

  // Reset tracking when user leaves and comes back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackedSections.clear();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return sectionRef;
};
