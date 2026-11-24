import { Snowflake } from 'lucide-react';
import { Link } from 'react-router';
import {
  HOLIDAY_SECTION_HASH,
  HOLIDAY_SECTION_ID,
  HOLIDAY_SLIDE_EVENT,
  useHolidayPeriodActive,
} from '../../lib/holiday-period';
import { scrollIntoViewByElementId } from '../../lib/utils';
import { useLanguage } from '../context/LanguageContext';

/**
 * Site-wide announcement banner (renders above the header on every page).
 * Currently announces the holiday hours; it disappears on its own after the holiday window
 * (see `src/lib/holiday-period.ts`). Copy lives in LanguageContext under `banner.*`.
 *
 * The text is repeated so one copy is always on screen while the track loops. Only the first
 * copy is exposed to assistive tech; the rest are `aria-hidden`.
 */
const COPIES_PER_GROUP = 3;
const GROUPS = 2;

export function AnnouncementBanner() {
  const { t } = useLanguage();
  const active = useHolidayPeriodActive();

  if (!active) return null;

  const message = t('banner.message');

  // On the homepage the slideshow is already in the DOM: slide to it and show the holiday slide.
  // Anywhere else, fall through to the router link, which lands on the homepage with the hash.
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!document.getElementById(HOLIDAY_SECTION_ID)) return;
    event.preventDefault();
    window.dispatchEvent(new Event(HOLIDAY_SLIDE_EVENT));
    scrollIntoViewByElementId(HOLIDAY_SECTION_ID);
  };

  return (
    <div className="announcement-banner relative z-[101] bg-[#FFD600] text-black">
      <Link
        to={{ pathname: '/', hash: HOLIDAY_SECTION_HASH }}
        onClick={handleClick}
        className="flex w-full items-stretch no-underline outline-offset-[-3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
      >
        <span className="announcement-banner__label relative z-10 flex shrink-0 items-center gap-2 bg-black py-2.5 pl-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFD600] sm:pl-5 sm:text-xs">
          <Snowflake className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {t('banner.label')}
        </span>

        <span className="announcement-banner__marquee min-w-0 flex-1 py-2.5 text-[13px] font-medium sm:text-sm">
          <span className="announcement-banner__track">
            {Array.from({ length: GROUPS }).map((_, group) => (
              <span key={group} className="announcement-banner__group">
                {Array.from({ length: COPIES_PER_GROUP }).map((_, copy) => (
                  <span
                    key={copy}
                    className="announcement-banner__item"
                    aria-hidden={group === 0 && copy === 0 ? undefined : true}
                  >
                    <span>{message}</span>
                    <Snowflake className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
                  </span>
                ))}
              </span>
            ))}
          </span>
        </span>
      </Link>
    </div>
  );
}
