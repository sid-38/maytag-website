import { CalendarDate } from '@internationalized/date';

/** Local wall-clock time at or after this hour: same calendar day is not selectable. */
export const PICKUP_SAME_DAY_CUTOFF_HOUR = 18;

export function isPastSameDayCutoff(now: Date = new Date()): boolean {
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), PICKUP_SAME_DAY_CUTOFF_HOUR, 0, 0, 0);
  return now.getTime() >= cutoff.getTime();
}

/** Earliest selectable calendar day in the user's local timezone. */
export function getMinSelectableCalendarDate(now: Date = new Date()): CalendarDate {
  if (isPastSameDayCutoff(now)) {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    return new CalendarDate(t.getFullYear(), t.getMonth() + 1, t.getDate());
  }
  return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function dateToCalendarDate(d: Date): CalendarDate {
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** If `selected` is before `minCal`, return local midnight on `minCal` (date-only). */
export function clampPreferredDateToMin(selected: Date, minCal: CalendarDate): Date {
  const sel = dateToCalendarDate(selected);
  if (sel.compare(minCal) >= 0) {
    return new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0, 0, 0, 0);
  }
  return new Date(minCal.year, minCal.month - 1, minCal.day, 0, 0, 0, 0);
}
