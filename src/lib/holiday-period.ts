import { useEffect, useState } from 'react';

/**
 * Holiday announcement window (banner + homepage holiday slide).
 * Shown from now through the end of this day (US Eastern); gone from the next day.
 * To reuse for another season, change the date and the copy in LanguageContext (`banner.*`, `home.holiday.*`).
 */
export const HOLIDAY_LAST_DAY_ET = '2027-01-01';
const HOLIDAY_TIME_ZONE = 'America/New_York';

/** Homepage slideshow section id + router hash (banner click scrolls here). */
export const HOLIDAY_SECTION_ID = 'home-holiday-plan';
export const HOLIDAY_SECTION_HASH = `#${HOLIDAY_SECTION_ID}`;

/** Dispatched on `window` to ask the homepage slideshow to show the holiday slide. */
export const HOLIDAY_SLIDE_EVENT = 'maytag:show-holiday-slide';

/** Today's calendar date in US Eastern as `YYYY-MM-DD` (en-CA formats dates that way). */
function todayInEastern(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: HOLIDAY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function isHolidayPeriodActive(now: Date = new Date()): boolean {
  return todayInEastern(now) <= HOLIDAY_LAST_DAY_ET;
}

/** Re-checks every minute so a tab left open flips over at midnight Eastern without a reload. */
export function useHolidayPeriodActive(): boolean {
  const [active, setActive] = useState(() => isHolidayPeriodActive());

  useEffect(() => {
    const id = window.setInterval(() => setActive(isHolidayPeriodActive()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return active;
}
