/** Wash & fold + blanket pricing (in-store drop-off vs delivery). Single source for PricingPage + HomePage. */

export const BLANKET_SIZES = ['twin', 'full', 'queen', 'king'] as const;
export type BlanketSize = (typeof BLANKET_SIZES)[number];

export type WashFoldChannel = 'instore' | 'delivery';

export interface WashFoldChannelPricing {
  standardPerLb: number;
  sameDayPerLb: number;
  minLb: number;
  turnaroundHours: number;
  blankets: Record<BlanketSize, number>;
}

export const WASH_FOLD_PRICING: Record<WashFoldChannel, WashFoldChannelPricing> = {
  instore: {
    standardPerLb: 1.75,
    sameDayPerLb: 2.75,
    minLb: 10,
    turnaroundHours: 24,
    blankets: { twin: 21, full: 23, queen: 24, king: 25 },
  },
  delivery: {
    standardPerLb: 2,
    sameDayPerLb: 3.75,
    minLb: 10,
    turnaroundHours: 24,
    blankets: { twin: 23.5, full: 25.5, queen: 26.5, king: 27.5 },
  },
};

/** Pet bed flat-rate pricing (PetLaundryPage + pricing tab). */
export const PET_BED_PRICES = {
  small: 20,
  large: 30,
} as const;

/** Optional pet laundry surcharges (pricing tab additional charges). */
export const PET_LAUNDRY_SURCHARGES = {
  proteinStains: 5,
  lightHair: 3,
  heavyHair: 5,
} as const;

const usdCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** USD with cents, e.g. per-lb hero lines: $1.75, $2.00 */
export function formatWashFoldUsdCents(amount: number): string {
  return usdCents.format(amount);
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** USD for display, e.g. 23.5 → "$23.5" or "$23.50" per locale (typically 2 decimals when non-integer). */
export function formatWashFoldUsd(amount: number): string {
  return usd.format(amount);
}

/** Blankets / flat items: whole dollars without “.00”, half-dollars with two decimals (e.g. $23.50). */
export function formatWashFoldItemUsd(amount: number): string {
  const cents = Math.round(amount * 100);
  if (cents % 100 === 0) {
    return usd.format(amount);
  }
  return usdCents.format(amount);
}

export function formatPerLb(amount: number): string {
  return `${formatWashFoldUsd(amount)} / lb`;
}
