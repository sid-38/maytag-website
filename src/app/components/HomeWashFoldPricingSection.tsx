import { Link } from 'react-router';
import { buttonClass } from '../../lib/button-classes';
import { formatWashFoldItemUsd, PET_BED_PRICES } from '../../lib/wash-fold-pricing';
import { scrollToTop } from '../../lib/utils';
import { Card } from './Card';
import { WashFoldPricingCard } from './WashFoldPricingCard';
import { useLanguage } from '../context/LanguageContext';
import { openSchedulePickupPortalInNewTab } from '../../lib/schedule-pickup-portal';

export function HomeWashFoldPricingSection() {
  const { t } = useLanguage();

  return (
    <section
      id="home-subscription-prices"
      className="scroll-mt-24 py-16 sm:py-20 bg-gray-50"
      aria-labelledby="home-wash-fold-pricing-heading"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12">
          <h2
            id="home-wash-fold-pricing-heading"
            className="text-3xl font-bold text-black text-balance sm:text-4xl"
          >
            {t('home.prices.washFold.heroTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-base font-normal text-gray-600">
            {t('home.prices.washFold.heroSubtitle')}
          </p>
        </div>

        <div className="mx-auto mb-16 flex w-full max-w-[528px] min-w-0 flex-col gap-10">
        <div className="w-full min-w-0">
          <div className="mb-4 flex min-h-[30px] w-full min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <p className="shrink-0 text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
              {t('pricingPage.washFold.title')}
            </p>
            <span className="inline-flex shrink-0 items-center rounded-full border border-[#00bfb3]/35 bg-[#00bfb3]/10 px-2.5 py-1 text-sm font-semibold leading-tight tracking-normal text-[#00bfb3] sm:px-3">
              {t('home.services.pickupDelivery.title')}
            </span>
          </div>
          <WashFoldPricingCard channel="delivery" showSameDay={false} />
        </div>

        <div className="w-full">
          <div className="mb-4 flex h-[30px] w-full items-center justify-start">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
              {t('pricingPage.tab.pets')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10">
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
        </div>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link to="/pricing" className={buttonClass.secondary} onClick={scrollToTop}>
            {t('home.prices.washFold.viewFullPricing')}
          </Link>
          <button type="button" className={buttonClass.primary} onClick={openSchedulePickupPortalInNewTab}>
            {t('home.hero.schedulePickup')}
          </button>
        </div>
      </div>
    </section>
  );
}
