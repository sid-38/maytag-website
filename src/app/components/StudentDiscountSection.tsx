import { GraduationCap, IdCard, Repeat, School, Store } from 'lucide-react';
import { buttonClass } from '../../lib/button-classes';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './Card';

const STORE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=15+Jones+Franklin+Rd,+Raleigh,+NC+27606';

const PILL_CLASS =
  'inline-flex items-center gap-2 rounded-full bg-[#00bfb3]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#00857c]';

const PERFORATION_DOTS = 14;


export function StudentDiscountSection() {
  const { t } = useLanguage();

  const chips = [
    {
      icon: IdCard,
      titleKey: 'home.studentDiscount.chip1.title',
      bodyKey: 'home.studentDiscount.chip1.body',
    },
    {
      icon: School,
      titleKey: 'home.studentDiscount.chip2.title',
      bodyKey: 'home.studentDiscount.chip2.body',
    },
    {
      icon: Repeat,
      titleKey: 'home.studentDiscount.chip3.title',
      bodyKey: 'home.studentDiscount.chip3.body',
    },
  ] as const;

  return (
    <section
      className="bg-gray-50 py-16 sm:py-20"
      aria-labelledby="student-discount-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2
            id="student-discount-heading"
            className="mb-4 text-3xl font-bold text-black sm:text-4xl"
          >
            {t('home.studentDiscount.sectionTitle')}
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-gray-600">
            {t('home.studentDiscount.sectionBody')}
          </p>
          <div className="pt-6">
            <a
              href={STORE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass.primary} cursor-pointer`}
            >
              {t('home.services.cardCta.Card01')}
            </a>
          </div>
        </div>

        <div className="relative mx-auto grid w-7/8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0px_12px_32px_rgba(0,0,0,0.08),0px_2px_8px_rgba(0,0,0,0.04)] lg:grid-cols-[minmax(220px,280px)_1fr]">
          <div className="relative z-10 h-64 sm:h-80 lg:h-full">
            <img
              src="/images/student-discount-students.png"
              alt={t('home.studentDiscount.imageAlt')}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-between px-3 lg:hidden">
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className="h-3.5 w-3.5 translate-y-1/2 rounded-full bg-gray-50"
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden translate-x-1/2 flex-col justify-between py-4 lg:flex">
              {Array.from({ length: PERFORATION_DOTS }).map((_, index) => (
                <span
                  key={index}
                  className="h-3.5 w-3.5 rounded-full bg-gray-50"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <p className={PILL_CLASS}>
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                {t('home.studentDiscount.eyebrow')}
              </p>
              <span className="text-xs font-semibold text-gray-400" aria-hidden="true">
                @
              </span>
              <p className={PILL_CLASS}>
                <Store className="h-4 w-4" aria-hidden="true" />
                {t('home.studentDiscount.storeName')}
              </p>
            </div>
            <h3 className="text-3xl font-bold text-black text-balance sm:text-4xl">
              {t('home.studentDiscount.title')}
            </h3>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 text-balance">
              {t('home.studentDiscount.body')}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {chips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <Card key={chip.titleKey} className="h-full shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
                    <CardContent padding="sm" className="flex items-start gap-3 sm:flex-col sm:gap-3">
                      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00bfb3]/10">
                        <Icon className="h-5 w-5 text-[#00bfb3]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-black">{t(chip.titleKey)}</p>
                        <p className="mt-0.5 text-sm text-gray-600">{t(chip.bodyKey)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
