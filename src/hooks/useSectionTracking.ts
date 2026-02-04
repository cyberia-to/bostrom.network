import { useEffect, useRef } from 'react';

// Declare plausible on window
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
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
            
            // Send event to Plausible
            if (window.plausible) {
              window.plausible('Section View', { 
                props: { section: sectionId } 
              });
            }
            
            // Update URL hash without scrolling
            if (sectionId !== 'hero') {
              history.replaceState(null, '', `#${sectionId}`);
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
