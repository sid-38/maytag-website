/**
 * Archived 2026-05-06 — replaced by wash & fold pricing on the homepage.
 * Not imported by the app; kept for reference / recovery.
 */

import { useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { buttonClass } from '../../lib/button-classes';
import { cn, scrollToTop } from '../../lib/utils';
import { Check } from 'lucide-react';
import { ConfettiIcon } from '@phosphor-icons/react';
import { Card, CardContent } from '../components/Card';
import { useLanguage } from '../context/LanguageContext';
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '../../lib/subscription-plans';
import { openSchedulePickupPortalInNewTab } from '../../lib/schedule-pickup-portal';

const SUBSCRIPTION_PLAN_COMMON_FEATURE_KEY = 'subscriptions.plan.commonFeature';

const SINGLE_BAG_INCLUDED_KEYS = [
  'home.prices.singleBag.included1',
  'home.prices.singleBag.included2',
  'home.prices.singleBag.included3',
] as const;

/** Comforter / add-on rows only — single bag is the adjacent card (matches subscriptions form minus first row). */
const A_LA_CARTE_HOME_ROWS: { labelKey: string; price: string }[] = [
  { labelKey: 'subscriptions.row.twin', price: '$25' },
  { labelKey: 'subscriptions.row.full', price: '$28' },
  { labelKey: 'subscriptions.row.queen', price: '$35' },
  { labelKey: 'subscriptions.row.king', price: '$38' },
];

const DEFAULT_HOME_PLAN: SubscriptionPlanId = 'couples';

export function ArchivedHomePageSubscriptionPricesSection() {
  const { t } = useLanguage();
  const [homePriceChoice, setHomePriceChoice] = useState<SubscriptionPlanId>(DEFAULT_HOME_PLAN);

  const togglePlanChoice = (planId: SubscriptionPlanId) => {
    setHomePriceChoice((prev: SubscriptionPlanId) => (prev === planId ? DEFAULT_HOME_PLAN : planId));
  };

  const choiceKeyHandler = (action: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <section
      id="home-subscription-prices"
      className="scroll-mt-24 py-16 sm:py-20 bg-gray-50"
      aria-labelledby="home-subscriptions-heading"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="w-full min-w-0 lg:mx-auto lg:max-w-[50rem]">
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <div className="mb-6 text-center sm:mb-8 lg:mb-10">
              <h3 className="text-2xl font-bold text-black text-balance sm:text-4xl">
                {t('home.prices.payAsYouGo.title')}
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-balance text-sm text-gray-600 sm:text-base">
                {t('home.prices.payAsYouGo.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <div className="min-w-0">
                <Card className="flex h-full min-w-0 flex-col border-2 border-gray-200">
                  <CardContent className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
                    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
                      <div>
                        <div className="flex flex-col items-center text-center">
                          <h3 className="line-clamp-2 max-w-prose text-base font-semibold leading-snug text-gray-900 sm:text-lg">
                            {t('home.prices.singleBag.title')}
                          </h3>
                          <p className="mb-2 line-clamp-3 max-w-prose text-sm text-balance text-gray-600">
                            {t('home.prices.singleBag.description')}
                          </p>
                          <div className="mt-4 flex flex-col gap-1 sm:mt-5">
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                              <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden">
                                <img
                                  src="/images/01-laundry-bag.jpg"
                                  alt={t('home.prices.singleBag.title')}
                                  className="h-full w-full object-contain"
                                  width={100}
                                  height={100}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                              <div className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0">
                                <span className="text-3xl font-bold tracking-tight text-black sm:text-2xl lg:text-3xl xl:text-4xl">
                                  {t('home.prices.singleBag.price')}
                                </span>
                                <span className="text-xs font-medium text-gray-500 sm:text-xs lg:text-sm">
                                  {t('home.prices.singleBag.flatRate')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-col border-t border-gray-200 pt-3 text-left sm:mt-4 sm:pt-4">
                          <p className="text-sm font-medium text-gray-900 sm:text-base">
                            {t('subscriptions.plan.whatsIncluded')}
                          </p>
                          <ul className="mt-2 flex flex-col gap-2 text-sm sm:mt-2.5 sm:gap-2.5">
                            {SINGLE_BAG_INCLUDED_KEYS.map((key) => (
                              <li key={key} className="flex gap-2 sm:gap-2.5">
                                <Check
                                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                                  strokeWidth={2.5}
                                  aria-hidden
                                />
                                <span className="text-left leading-snug text-gray-800 text-balance">
                                  {t(key)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="flex h-full min-w-0 flex-col border-2 border-gray-200">
                <CardContent className="flex min-h-0 flex-1 flex-col">
                  <h3 className="text-center text-base font-semibold text-gray-900 sm:text-lg">
                    {t('subscriptions.nonSubscription.title')}
                  </h3>
                  <p className="mb-2 text-center text-sm text-gray-600 text-balance">
                    {t('home.prices.payAsYouGo.alacarte.subtitle')}
                  </p>
                  <div className="-mx-1 mt-4 overflow-x-auto">
                    <table className="w-full min-w-[260px] border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th
                            scope="col"
                            className="py-2 pr-3 text-left text-sm font-medium text-gray-900 sm:text-base"
                          >
                            {t('subscriptions.table.item')}
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-2 pl-3 text-right text-sm font-medium text-gray-900 sm:text-base"
                          >
                            {t('subscriptions.table.price')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {A_LA_CARTE_HOME_ROWS.map((row) => (
                          <tr key={row.labelKey} className="border-b border-gray-100">
                            <td className="py-2.5 pr-3 text-gray-800">{t(row.labelKey)}</td>
                            <td className="whitespace-nowrap py-2.5 pl-3 text-right font-semibold text-gray-900">
                              {row.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 flex justify-center sm:mt-10">
              <button type="button" className={buttonClass.primary} onClick={openSchedulePickupPortalInNewTab}>
                {t('home.hero.schedulePickup')}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-10 sm:pt-10 lg:pt-12">
            <div className="text-center mb-8">
              <h2
                id="home-subscriptions-heading"
                className="text-3xl sm:text-4xl font-bold text-black mb-4 text-balance"
              >
                {t('home.prices.title')}
              </h2>
              <div className="mx-auto max-w-2xl text-center text-sm text-gray-600 sm:text-base">
                <p className="text-balance">{t('home.prices.subtitle.01')}</p>
                <p className="text-balance">{t('home.prices.subtitle.02')}</p>
              </div>
            </div>
            <div className="mx-auto mb-5 flex w-full max-w-4xl justify-center sm:mb-6">
              <div
                className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#00bfb3]/10 px-3 py-1.5 pl-2.5 text-center sm:gap-2 sm:px-4 sm:py-2"
                role="status"
              >
                <ConfettiIcon
                  weight="bold"
                  className="h-4 w-4 shrink-0 text-[#00bfb3] sm:h-4 sm:w-4"
                  aria-hidden
                />
                <p className="text-sm font-medium leading-snug text-[#00bfb3] text-balance sm:text-sm">
                  {t('subscriptions.promo')}
                </p>
              </div>
            </div>
            <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 sm:gap-4 lg:gap-4 lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const featureKeys = [plan.feature1Key, plan.feature2Key] as const;
                const planPicked = homePriceChoice === plan.id;
                return (
                  <div
                    key={plan.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={planPicked}
                    className="min-w-0 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#00bfb3] focus-visible:ring-offset-2"
                    onClick={() => togglePlanChoice(plan.id)}
                    onKeyDown={choiceKeyHandler(() => togglePlanChoice(plan.id))}
                  >
                    <Card
                      hover
                      className={cn(
                        'group flex h-full min-w-0 w-full max-w-full flex-col pointer-events-none border-2 border-gray-200',
                        planPicked && '!border-[#00bfb3] bg-[#00bfb3]/10',
                      )}
                    >
                      <CardContent className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
                        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
                          <div>
                            <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug text-black">
                              {t(plan.cardTitleKey)}
                            </h3>
                            <p className="mt-1 line-clamp-3 text-left text-xs leading-snug text-gray-600 sm:text-[10px] lg:text-xs text-balance">
                              {t(plan.blurbKey)}
                            </p>
                            <div className="mt-4 flex flex-col gap-1 sm:mt-5">
                              <div className="flex flex-wrap items-baseline gap-x-0.5">
                                <span className="text-xs font-bold text-black sm:text-[11px] lg:text-sm">
                                  {t(plan.priceKey)}
                                </span>
                                <span className="text-xs font-medium text-gray-500 sm:text-xs lg:text-sm">
                                  {t('subscriptions.perMonth')}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0">
                                <span className="text-3xl font-bold tracking-tight text-black sm:text-2xl lg:text-3xl xl:text-4xl">
                                  {t(plan.discountPriceKey)}
                                </span>
                                <span className="text-xs font-medium text-gray-500 sm:text-xs lg:text-sm">
                                  {t('subscriptions.perFirstMonth')}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-col border-t border-gray-200 pt-3 sm:mt-4 sm:pt-4">
                              <p className="text-xs font-bold tracking-wide text-black sm:text-[10px] lg:text-xs">
                                {t('subscriptions.plan.whatsIncluded')}
                              </p>
                              <ul className="mt-2 flex flex-col gap-2 sm:mt-2.5 sm:gap-2.5">
                                {featureKeys.map((key) => (
                                  <li key={key} className="flex gap-2 sm:gap-2.5">
                                    <Check
                                      className="h-3.5 w-3.5 shrink-0 text-gray-500 sm:mt-0.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                                      strokeWidth={2.5}
                                      aria-hidden
                                    />
                                    <span className="text-left text-xs leading-snug text-gray-600 sm:text-[10px] lg:text-xs text-balance">
                                      {t(key)}
                                    </span>
                                  </li>
                                ))}
                                <li
                                  key={`${plan.id}-${SUBSCRIPTION_PLAN_COMMON_FEATURE_KEY}`}
                                  className="flex gap-2 sm:gap-2.5"
                                >
                                  <Check
                                    className="h-3.5 w-3.5 shrink-0 text-gray-500 sm:mt-0.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                                    strokeWidth={2.5}
                                    aria-hidden
                                  />
                                  <span className="text-left text-xs leading-snug text-gray-600 sm:text-[10px] lg:text-xs text-balance">
                                    {t(SUBSCRIPTION_PLAN_COMMON_FEATURE_KEY)}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {plan.featured ? (
                            <span className="mt-4 shrink-0 self-center rounded-full bg-[#00bfb3] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white sm:mt-5 sm:text-[10px]">
                              {t('subscriptions.plan.mostPopular')}
                            </span>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center px-4 sm:px-0">
              <Link to={`/subscriptions?plan=${homePriceChoice}`} className={buttonClass.primary} onClick={scrollToTop}>
                {t('home.prices.unlockBenefits')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
