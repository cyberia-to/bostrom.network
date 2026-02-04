import { useEffect, useRef } from 'react';

// Declare plausible on window with correct API
declare global {
  interface Window {
    plausible?: ((event: 'pageview', options?: { u: string }) => void) & 
                ((event: string, options?: { props?: Record<string, string> }) => void);
  }
}

// Track which sections have been viewed in this session
const viewedSections = new Set<string>();

export const useSectionTracking = (sectionId: string) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Track when section becomes visible (at least 10% in viewport)
          if (entry.isIntersecting && !viewedSections.has(sectionId)) {
            viewedSections.add(sectionId);
            
            // Construct the full URL with hash
            const newPath = sectionId === 'hero' ? '/' : `/#${sectionId}`;
            const fullUrl = window.location.origin + newPath;
            
            // Update URL hash without scrolling
            if (sectionId !== 'hero') {
              history.replaceState(null, '', `#${sectionId}`);
            } else {
              history.replaceState(null, '', '/');
            }
            
            // Manually trigger pageview with the full URL
            console.log('Plausible pageview:', fullUrl);
            if (window.plausible) {
              window.plausible('pageview', { u: fullUrl });
            }
          }
        });
      },
      { 
        threshold: 0.1 // Trigger when at least 10% of section is visible
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [sectionId]);

  return sectionRef;
};
