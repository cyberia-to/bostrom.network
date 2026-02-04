import { useEffect, useRef } from 'react';

// Declare plausible on window with correct API
declare global {
  interface Window {
    plausible?: ((event: 'pageview', options?: { u: string }) => void) & 
                ((event: string, options?: { props?: Record<string, string> }) => void);
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
            
            // Construct the full URL with hash
            const newPath = sectionId === 'hero' ? '/' : `/#${sectionId}`;
            const fullUrl = window.location.origin + newPath;
            
            // Update URL hash without scrolling
            history.replaceState(null, '', sectionId === 'hero' ? '/' : `#${sectionId}`);
            
            // Manually trigger pageview with the full URL
            // Plausible tracks 'pageview' events with 'u' parameter for custom URLs
            if (window.plausible) {
              console.log('Plausible pageview:', fullUrl);
              window.plausible('pageview', { u: fullUrl });
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
