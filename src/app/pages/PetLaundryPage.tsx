import { Fragment } from 'react';
import { buttonClass } from '../../lib/button-classes';
import { formatWashFoldItemUsd, PET_BED_PRICES } from '../../lib/wash-fold-pricing';
import { useLanguage } from '../context/LanguageContext';
import { openSchedulePickupPortalInNewTab } from '../../lib/schedule-pickup-portal';
import { Card, CardContent } from '../components/Card';

/** Additional pet laundry charges (per item / condition). */
const ADD_ON_PROTEIN_STAIN = 5;
const ADD_ON_LIGHT_HAIR = 3;
const ADD_ON_HEAVY_HAIR = 5;

const PET_LAUNDRY_ADD_ON_ROWS: { labelKey: string; price: number }[] = [
  { labelKey: 'petLaundryPage.addOns.proteinStain', price: ADD_ON_PROTEIN_STAIN },
  { labelKey: 'petLaundryPage.addOns.lightHair', price: ADD_ON_LIGHT_HAIR },
  { labelKey: 'petLaundryPage.addOns.heavyHair', price: ADD_ON_HEAVY_HAIR },
];

const HERO_PRICE_CARDS = [
  { price: PET_BED_PRICES.small, titleKey: 'pricingPage.pet.small' as const },
  { price: PET_BED_PRICES.large, titleKey: 'pricingPage.pet.large' as const },
];

export function PetLaundryPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white overflow-x-hidden">
      <section className="relative flex min-h-screen items-end text-white">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="pointer-events-none block h-full w-full object-cover object-center md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden={true}
          >
            <source src="/images/maytag-dog-video-mobile.mp4" type="video/mp4" />
          </video>
          <img
            src="/images/07-pet-laundry-desktop-hero.png"
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
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-6 sm:py-32 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
          <div className="flex max-w-2xl shrink-0 flex-col">
            <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
              {t('petLaundryPage.hero.title')}
            </h1>
            <p className="mb-8 max-w-[450px] text-lg text-gray-200 sm:text-xl text-balance">{t('petLaundryPage.hero.subtitle')}</p>
            <button
              type="button"
              className={`${buttonClass.heroCta} inline-flex h-14 w-full cursor-pointer items-center justify-center box-border rounded border border-transparent bg-[#00bfb3] px-8 text-white transition-colors hover:bg-[#00a89d] md:w-auto`}
              onClick={openSchedulePickupPortalInNewTab}
            >
              {t('home.hero.schedulePickup')}
            </button>
          </div>

          <div
            className="hidden min-h-0 w-full flex-1 flex-col items-end lg:flex"
            aria-label={t('petLaundryPage.pricing.title')}
          >
            <div className="my-8 flex min-h-0 flex-1 w-fit max-w-full flex-col overflow-hidden rounded-xl bg-black/90 shadow-lg shadow-black/40">
              {HERO_PRICE_CARDS.map((item, index) => (
                <Fragment key={item.titleKey}>
                  {index > 0 ? (
                    <div
                      className="mx-4 h-px shrink-0 bg-white/25 sm:mx-5"
                      aria-hidden
                    />
                  ) : null}
                  <div className="flex min-h-0 flex-1 flex-row items-center gap-3 px-4 py-3 sm:gap-4 sm:px-8 sm:py-4">
                    <span className="shrink-0 text-3xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                      ${item.price}
                    </span>
                    <h3 className="max-w-[min(100%,16rem)] text-balance text-right text-lg font-bold leading-normal text-white sm:max-w-[18rem] sm:text-xl line-clamp-2">
                      {t(item.titleKey)}
                    </h3>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 text-balance">{t('petLaundryPage.pricing.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-balance">
              {t('petLaundryPage.pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card
              hover
              image={{
                src: '/images/small-pet-bed.png',
                alt: t('pricingPage.pet.small'),
                objectPosition: 'center',
              }}
            >
              <CardContent className="p-8 sm:p-10">
                <div className="mb-6">
                  <span className="text-3xl font-bold tracking-tight text-black">
                    {formatWashFoldItemUsd(PET_BED_PRICES.small)}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-medium text-gray-700">{t('pricingPage.pet.small')}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{t('petLaundryPage.card.smallSub')}</p>
              </CardContent>
            </Card>

            <Card
              hover
              image={{
                src: '/images/large-pet-bed.png',
                alt: t('pricingPage.pet.large'),
                objectPosition: 'center',
              }}
            >
              <CardContent className="p-8 sm:p-10">
                <div className="mb-6">
                  <span className="text-3xl font-bold tracking-tight text-black">
                    {formatWashFoldItemUsd(PET_BED_PRICES.large)}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-medium text-gray-700">{t('pricingPage.pet.large')}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{t('petLaundryPage.card.largeSub')}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mx-auto mt-12 w-full max-w-4xl sm:mt-14">
            <p className="mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed text-gray-600 sm:text-base text-balance">
              {t('petLaundryPage.addOns.disclaimer')}
            </p>
            <div className="mx-auto w-full max-w-[450px]">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-0 border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th
                          scope="col"
                          className="w-[70%] py-3 pl-4 pr-3 text-left font-medium text-gray-900 sm:pl-6 sm:text-base"
                        >
                          {t('subscriptions.table.item')}
                        </th>
                        <th
                          scope="col"
                          className="w-[30%] whitespace-nowrap py-3 pl-3 pr-4 text-right font-medium text-gray-900 sm:pr-6 sm:text-base"
                        >
                          {t('subscriptions.table.price')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PET_LAUNDRY_ADD_ON_ROWS.map((row) => (
                        <tr key={row.labelKey} className="border-b border-gray-100 last:border-b-0">
                          <td className="break-words py-3 pl-4 pr-3 text-gray-800 sm:pl-6">
                            {t(row.labelKey)}
                          </td>
                          <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right font-semibold text-gray-900 sm:pr-6">
                            ${row.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-8 w-full sm:mt-10 lg:flex lg:justify-center">
              <button
                type="button"
                className={`${buttonClass.primary} w-full`}
                onClick={openSchedulePickupPortalInNewTab}
              >
                {t('home.hero.schedulePickup')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
