import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { applyHead, getPageSeo, SITE_URL } from '../../lib/seo';

/**
 * Applies the title, description, canonical, robots, Open Graph tags and JSON-LD for the current
 * route (see lib/seo.ts). Location pages (/…-in/:slug) are handled by <LocationSEO /> instead.
 */
export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (/-in\/[^/]+\/?$/.test(pathname)) return;
    const seo = getPageSeo(pathname);
    if (!seo) return;
    const path = pathname.replace(/\/+$/, '') || '/';
    return applyHead({ ...seo, canonical: `${SITE_URL}${path === '/' ? '/' : path}` });
  }, [pathname]);

  return null;
}
