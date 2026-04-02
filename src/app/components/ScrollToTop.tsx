import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Scrolls to top on route changes. Skips when the URL has a hash so the target page can scroll to that section. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}
