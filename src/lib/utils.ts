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

export function scrollToHomeSubscriptionPricesSection() {
  document.getElementById('home-subscription-prices')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
