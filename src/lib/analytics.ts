/**
 * GA4 via gtag.js (loaded in index.html). Safe no-op when gtag is unavailable (e.g. dev, blockers).
 */
export function trackGa4Event(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  const cleaned = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      ) as Record<string, string | number | boolean>
    : undefined;
  gtag('event', eventName, cleaned);
}
