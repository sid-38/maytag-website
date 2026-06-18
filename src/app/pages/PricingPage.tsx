import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Check } from 'lucide-react';
import { Card } from '../components/Card';
import { WashFoldPricingCard } from '../components/WashFoldPricingCard';
import { useLanguage } from '../context/LanguageContext';
import { buttonClass } from '../../lib/button-classes';
import { openSchedulePickupPortalInNewTab } from '../../lib/schedule-pickup-portal';
import { cn, PRICING_TAB_VIEW_ELEMENT_ID, PRICING_TAB_VIEW_HASH, scrollIntoViewByElementId } from '../../lib/utils';
import type { BlanketSize } from '../../lib/wash-fold-pricing';
import {
  formatWashFoldItemUsd,
  PET_BED_PRICES,
  PET_LAUNDRY_SURCHARGES,
  WASH_FOLD_PRICING,
} from '../../lib/wash-fold-pricing';

const STORE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=15+Jones+Franklin+Rd,+Raleigh,+NC+27606';

type PanelId = 'instore' | 'delivery' | 'pets';

export function PricingPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const [panel, setPanel] = useState<PanelId>('instore');
  const mainRef = useRef<HTMLElement>(null);
  const instore = WASH_FOLD_PRICING.instore;
  const delivery = WASH_FOLD_PRICING.delivery;

  function selectPanel(next: PanelId) {
    setPanel(next);
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useEffect(() => {
    if (location.hash !== PRICING_TAB_VIEW_HASH) return;
    scrollIntoViewByElementId(PRICING_TAB_VIEW_ELEMENT_ID);
  }, [location.pathname, location.hash]);

  const blanketSizes = ['Twin', 'Full', 'Queen', 'King'] as const;

  const petSurchargeRows = [
    {
      labelKey: 'pricingPage.pet.surcharges.proteinStains' as const,
      usd: PET_LAUNDRY_SURCHARGES.proteinStains,
    },
    {
      labelKey: 'pricingPage.pet.surcharges.lightHair' as const,
      usd: PET_LAUNDRY_SURCHARGES.lightHair,
    },
    {
      labelKey: 'pricingPage.pet.surcharges.heavyHair' as const,
      usd: PET_LAUNDRY_SURCHARGES.heavyHair,
    },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <section className="relative flex min-h-screen items-end text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/services-mobile-hero.png"
            alt={t('common.heroAlt')}
            className="block h-full w-full object-cover object-center md:hidden"
          />
          <img
            src="/images/services-hero.png"
            alt={t('common.heroAlt')}
            className="hidden h-full w-full object-cover object-top md:block"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 md:hidden"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-y-0 left-0 hidden w-3/5 md:block"
            style={{
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%)',
            }}
          />
        </div>
        <div className="relative mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
              {t('pricingPage.hero.titleLine')} {t('pricingPage.hero.titleAccent')}
            </h1>
            <p className="mb-8 max-w-[450px] text-lg text-gray-200 sm:text-xl">{t('services.hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <div
        id={PRICING_TAB_VIEW_ELEMENT_ID}
        className="sticky top-20 z-[90] scroll-mt-20 border-b border-gray-200 bg-gray-50 px-4 py-10 text-center sm:px-6"
      >
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
          {t('pricingPage.toggle.label')}
        </p>
        <div
          className="mx-auto flex max-w-full w-max flex-nowrap justify-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm md:grid md:grid-cols-3"
          role="tablist"
          aria-label={t('pricingPage.toggle.label')}
        >
          {(['instore', 'delivery', 'pets'] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={panel === id}
              onClick={() => selectPanel(id)}
              className={cn(
                'w-auto shrink-0 rounded-full px-5 py-2.5 text-center text-base font-medium whitespace-nowrap transition-all md:w-full md:min-w-0',
                panel === id && 'bg-black text-white shadow-md',
                panel !== id && 'text-gray-500 hover:text-gray-800'
              )}
            >
              {id === 'instore' && t('pricingPage.tab.instore')}
              {id === 'delivery' && t('pricingPage.tab.delivery')}
              {id === 'pets' && t('pricingPage.tab.pets')}
            </button>
          ))}
        </div>
      </div>

      <main ref={mainRef} className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16">
        {panel === 'instore' && (
          <div className="space-y-12">
            <section>
              <div className="mb-6 flex flex-col gap-1.5 border-b border-gray-200 pb-3">
                <h2 className="text-2xl font-bold text-black">{t('pricingPage.washFold.title')}</h2>
                <p className="text-sm text-gray-500">{t('pricingPage.instore.washFold.subtitle')}</p>
              </div>
              <WashFoldPricingCard channel="instore" showSameDay={false} />
            </section>

            <section>
              <div className="mb-6 flex flex-col gap-1.5 border-b border-gray-200 pb-3">
                <h2 className="text-2xl font-bold text-black">{t('pricingPage.blankets.title')}</h2>
                <p className="text-sm text-gray-500">{t('pricingPage.instore.blankets.subtitle')}</p>
              </div>
              <Card className="flex min-w-0 flex-col">
                {blanketSizes.map((size, index) => {
                  const key = size.toLowerCase() as BlanketSize;
                  return (
                    <div
                      key={size}
                      className={cn(
                        'flex items-center justify-between gap-4 px-6 py-4',
                        index < blanketSizes.length - 1 && 'border-b border-gray-200'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-700">
                          {t(`pricingPage.size.${size.toLowerCase()}`)}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">{t('pricingPage.blanketOrComforter')}</div>
                      </div>
                      <div className="shrink-0 text-lg font-bold tracking-tight text-black sm:text-xl">
                        {formatWashFoldItemUsd(instore.blankets[key])}
                      </div>
                    </div>
                  );
                })}
              </Card>
            </section>

            <div className="flex w-full justify-center">
              <a
                className={cn(buttonClass.primary, 'flex w-full justify-center')}
                href={STORE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('home.services.cardCta.Card01')}
              </a>
            </div>
          </div>
        )}

        {panel === 'delivery' && (
          <div className="space-y-12">
            <section>
              <div className="mb-6 flex flex-row flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b border-gray-200 pb-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <h2 className="text-2xl font-bold text-black">{t('pricingPage.washFold.title')}</h2>
                  <p className="text-sm text-gray-500">{t('pricingPage.delivery.washFold.subtitle')}</p>
                </div>
                <span className="inline-flex shrink-0 self-center rounded-full border border-[#00bfb3]/35 bg-[#00bfb3]/10 px-3 py-1.5 text-xs font-semibold tracking-normal text-[#00bfb3]">
                  {t('home.services.pickupDelivery.title')}
                </span>
              </div>
              <WashFoldPricingCard channel="delivery" showSameDay={false} />
            </section>

            <section>
              <div className="mb-6 flex flex-col gap-1.5 border-b border-gray-200 pb-3">
                <h2 className="text-2xl font-bold text-black">{t('pricingPage.blankets.title')}</h2>
                <p className="text-sm text-gray-500">{t('pricingPage.delivery.blankets.subtitle')}</p>
              </div>
              <Card className="flex min-w-0 flex-col">
                {blanketSizes.map((size, index) => {
                  const key = size.toLowerCase() as BlanketSize;
                  return (
                    <div
                      key={size}
                      className={cn(
                        'flex items-center justify-between gap-4 px-6 py-4',
                        index < blanketSizes.length - 1 && 'border-b border-gray-200'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-700">
                          {t(`pricingPage.size.${size.toLowerCase()}`)}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">{t('pricingPage.blanketOrComforter')}</div>
                      </div>
                      <div className="shrink-0 text-lg font-bold tracking-tight text-black sm:text-xl">
                        {formatWashFoldItemUsd(delivery.blankets[key])}
                      </div>
                    </div>
                  );
                })}
              </Card>
            </section>

            <div className="flex w-full justify-center">
              <button
                type="button"
                className={cn(buttonClass.primary, 'flex w-full justify-center')}
                onClick={openSchedulePickupPortalInNewTab}
              >
                {t('home.hero.schedulePickup')}
              </button>
            </div>
          </div>
        )}

        {panel === 'pets' && (
          <div className="space-y-8">
            <section>
              <div className="mb-6 flex flex-col gap-1.5 border-b border-gray-200 pb-3">
                <h2 className="text-2xl font-bold text-black">{t('pricingPage.pet.beds.title')}</h2>
                <p className="text-sm text-gray-500">{t('pricingPage.pet.beds.subtitle')}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-[#00bfb3]/10 px-6 py-7 sm:flex-nowrap">
                    <div className="min-w-0">
                      <div className="text-base font-medium text-gray-700">{t('pricingPage.pet.small')}</div>
                      <div className="mt-0.5 text-sm text-gray-500">{t('pricingPage.pet.subtitleSmall')}</div>
                    </div>
                    <div className="shrink-0 text-3xl font-bold tracking-tight text-black">
                      {formatWashFoldItemUsd(PET_BED_PRICES.small)}
                    </div>
                  </div>
                </Card>
                <Card className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-[#00bfb3]/10 px-6 py-7 sm:flex-nowrap">
                    <div className="min-w-0">
                      <div className="text-base font-medium text-gray-700">{t('pricingPage.pet.large')}</div>
                      <div className="mt-0.5 text-sm text-gray-500">{t('pricingPage.pet.subtitleLarge')}</div>
                    </div>
                    <div className="shrink-0 text-3xl font-bold tracking-tight text-black">
                      {formatWashFoldItemUsd(PET_BED_PRICES.large)}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-10">
                <p className="mx-auto mb-4 max-w-2xl px-1 text-center text-sm leading-relaxed text-gray-600 text-balance lg:hidden">
                  {t('pricingPage.pet.surcharges.introLine1')} {t('pricingPage.pet.surcharges.introLine2')}
                </p>
                <p className="mx-auto mb-4 hidden max-w-2xl px-1 text-center text-sm leading-relaxed text-gray-600 lg:block">
                  <span className="block">{t('pricingPage.pet.surcharges.introLine1')}</span>
                  <span className="block">{t('pricingPage.pet.surcharges.introLine2')}</span>
                </p>
                <div className="mx-auto w-full max-w-xl">
                  <Card className="flex min-w-0 flex-col">
                    <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-3">
                      <span className="min-w-0 text-sm font-bold text-black">{t('pricingPage.pet.surcharges.colItem')}</span>
                      <span className="shrink-0 text-sm font-bold text-black">{t('pricingPage.pet.surcharges.colPrice')}</span>
                    </div>
                    {petSurchargeRows.map((row, index) => (
                      <div
                        key={row.labelKey}
                        className={cn(
                          'flex items-center justify-between gap-4 px-6 py-4',
                          index < petSurchargeRows.length - 1 && 'border-b border-gray-200'
                        )}
                      >
                        <p className="min-w-0 flex-1 text-sm font-medium text-gray-700">{t(row.labelKey)}</p>
                        <span className="shrink-0 text-lg font-bold tracking-tight text-black sm:text-xl">
                          {formatWashFoldItemUsd(row.usd)}
                        </span>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            </section>

            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <Link
                className={cn(buttonClass.secondary, 'flex w-full justify-center sm:w-auto')}
                to="/contact"
              >
                {t('pricingPage.pet.ctaQuestions')}
              </Link>
              <button
                type="button"
                className={cn(buttonClass.primary, 'flex w-full justify-center sm:w-auto')}
                onClick={openSchedulePickupPortalInNewTab}
              >
                {t('home.hero.schedulePickup')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
