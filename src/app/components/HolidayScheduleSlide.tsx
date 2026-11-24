import { Clock, Drumstick, Gift, PartyPopper, ShoppingCart, Sparkles, TreePine } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../context/LanguageContext';

/**
 * Hero image for the holiday slide (square source, shown at 4:3 on desktop and 3:4 on mobile via
 * object-cover). Replace `public/images/holiday-hero.jpg` to change it; the branded gradient behind
 * it shows if the file is missing.
 */
const HOLIDAY_HERO_SRC = '/images/holiday-hero.jpg';

const PILL_CLASS =
  'inline-flex items-center gap-2 rounded-full bg-[#00bfb3]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#00857c]';

type Attendant = 'none' | 'until2pm';

const HOLIDAYS = [
  { key: 'row1', icon: Drumstick, attendant: 'none' },
  { key: 'row2', icon: TreePine, attendant: 'until2pm' },
  { key: 'row3', icon: Gift, attendant: 'none' },
  { key: 'row4', icon: PartyPopper, attendant: 'until2pm' },
  { key: 'row5', icon: Sparkles, attendant: 'none' },
] as const;

const STATUS_STYLES: Record<Attendant, string> = {
  none: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  until2pm: 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-200',
};

export function HolidayScheduleSlide() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
      <div className="mb-12 text-center">
        <h2
          id="holiday-plan-heading"
          className="mb-4 text-3xl font-bold text-black text-balance sm:text-4xl"
        >
          {t('home.holiday.sectionTitle')}
        </h2>
        <p className="mx-auto max-w-2xl text-balance text-gray-600">
          {t('home.holiday.sectionBody')}
        </p>
      </div>

      <div className="relative mx-auto grid w-7/8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_2px_8px_rgba(0,0,0,0.04)] lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        {/* Image: 4:3 (on desktop it grows to match the content height if that is taller) */}
        <div className="relative z-10 aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#00bfb3] to-[#00746c] w-full lg:self-stretch">
          <TreePine
            className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 text-white/20"
            strokeWidth={1}
            aria-hidden="true"
          />
          <img
            src={HOLIDAY_HERO_SRC}
            alt={t('home.holiday.imageAlt')}
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD600] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-black">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t('home.holiday.newTag')}
            </p>
            <p className={PILL_CLASS}>
              <Clock className="h-4 w-4" aria-hidden="true" />
              {t('home.holiday.eyebrow')}
            </p>
          </div>

          <h3 className="text-3xl font-bold text-black text-balance sm:text-4xl">
            {t('home.holiday.title')}
          </h3>

          <ul className="mt-5 space-y-1.5">
            {HOLIDAYS.map(({ key, icon: Icon, attendant }) => (
              <li
                key={key}
                className="grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-0.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 sm:grid-cols-[auto_1fr_auto]"
              >
                {/* Mobile: name, then date + badge on one line (no icon). sm+: icon | name/date | badge. */}
                <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#00bfb3]/10 sm:row-span-2 sm:inline-flex">
                  <Icon className="h-4 w-4 text-[#00bfb3]" aria-hidden="true" />
                </span>
                <p className="col-span-2 text-[15px] font-semibold leading-tight text-black sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:text-base">
                  {t(`home.holiday.${key}.name`)}
                </p>
                <p className="whitespace-nowrap text-sm text-gray-600 sm:col-start-2 sm:row-start-2">
                  {t(`home.holiday.${key}.date`)}
                </p>
                <span
                  className={cn(
                    'w-fit justify-self-start whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold leading-tight sm:col-start-3 sm:px-2.5 sm:text-xs sm:row-span-2 sm:row-start-1 sm:justify-self-end',
                    STATUS_STYLES[attendant],
                  )}
                >
                  {attendant === 'none'
                    ? t('home.holiday.status.noAttendant')
                    : t('home.holiday.status.attendantUntil2')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="flex items-start gap-3 border-t border-[#00bfb3]/20 bg-[#00bfb3]/10 px-6 py-4 text-sm text-[#005f58] sm:items-center sm:px-8 lg:col-span-2 lg:px-10">
          <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0 sm:mt-0" aria-hidden="true" />
          {t('home.holiday.note')}
        </p>
      </div>
    </div>
  );
}
