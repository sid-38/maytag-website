import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Homepage subscription plans block (`HomePage` section id + router hash). */
export const HOME_SUBSCRIPTION_PRICES_HASH = '#home-subscription-prices';

/** Pricing page sticky tab bar (In-Store/Delivery/Pets): element id + `Link` hash. */
export const PRICING_TAB_VIEW_ELEMENT_ID = 'pricing-tab-view';
export const PRICING_TAB_VIEW_HASH = `#${PRICING_TAB_VIEW_ELEMENT_ID}`;

/** Pet Laundry page pricing section (below hero). */
export const PET_LAUNDRY_PRICING_ELEMENT_ID = 'pet-laundry-pricing';
export const PET_LAUNDRY_PRICING_HASH = `#${PET_LAUNDRY_PRICING_ELEMENT_ID}`;

export function scrollToHomeSubscriptionPricesSection() {
  document.getElementById('home-subscription-prices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function scrollIntoViewByElementId(elementId: string, options?: ScrollIntoViewOptions) {
  queueMicrotask(() => {
    document
      .getElementById(elementId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start', ...options });
  });
}
