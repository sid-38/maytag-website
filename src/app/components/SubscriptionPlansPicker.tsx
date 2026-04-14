import type { MouseEvent } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '../../lib/subscription-plans';

const ADD_ONS_SECTION_ID = 'subscriptions-add-ons';

/** Shared “what’s included” line for every plan card (pickup/delivery). */
const SUBSCRIPTION_PLAN_COMMON_FEATURE_KEY = 'subscriptions.plan.commonFeature';

function scrollToAnchorById(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
}

function scrollToAddOnsSection(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  scrollToAnchorById(ADD_ONS_SECTION_ID);
}

export type SubscriptionPlansPickerProps = {
  selectedPlan: SubscriptionPlanId | null;
  onSelectPlan: (id: SubscriptionPlanId) => void;
  t: (key: string) => string;
  showLaundryBagLink?: boolean;
  /** When set with `showLaundryBagLink`, hides the scroll link from the `lg` breakpoint up. */
  hideLaundryBagLinkOnDesktop?: boolean;
  ariaLabelledBy: string;
  planCardWidthPx?: 200;
  /** @deprecated No longer used. */
  lockPlanRowToSelectedMinHeight?: boolean;
  noPlanGridTopMargin?: boolean;
  /** When set, plan cards share one row height from content (no fixed min-height); outer cards stretch to match the tallest (usually the featured card). */
  featuredPlanCardFitContent?: boolean;
  className?: string;
};

export function SubscriptionPlansPicker({
  selectedPlan,
  onSelectPlan,
  t,
  showLaundryBagLink = true,
  hideLaundryBagLinkOnDesktop = false,
  ariaLabelledBy,
  planCardWidthPx,
  noPlanGridTopMargin = false,
  featuredPlanCardFitContent = false,
  className,
}: SubscriptionPlansPickerProps) {
  const fixedW = planCardWidthPx === 200;

  return (
    <div className={cn('flex min-h-0 min-w-0 flex-col lg:h-full lg:min-h-0', className)}>
      <div className="flex min-h-0 w-full flex-1 flex-col lg:h-full lg:min-h-0">
        <div
          id="subscription-plans-group"
          className={cn(
            'flex min-h-0 w-full flex-1 flex-col items-center justify-start lg:justify-center',
            fixedW && 'justify-center',
          )}
          role="radiogroup"
          aria-labelledby={ariaLabelledBy}
        >
          <div
            className={cn(
              fixedW
                ? 'flex w-full flex-wrap justify-center gap-4 sm:gap-5'
                : cn(
                    'grid w-full grid-cols-1 items-start gap-5 sm:gap-4 lg:grid-cols-3 lg:gap-4 mb-8 lg:mb-0',
                    featuredPlanCardFitContent ? 'lg:items-stretch' : 'lg:items-center',
                    noPlanGridTopMargin ? 'mt-0' : 'mt-8 lg:mt-0',
                  ),
            )}
          >
            {SUBSCRIPTION_PLANS.map((plan) => {
              const selected = selectedPlan === plan.id;
              const featureKeys = [plan.feature1Key, plan.feature2Key] as const;
              return (
                <button
                  key={plan.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelectPlan(plan.id)}
                  className={cn(
                    'flex cursor-pointer flex-col rounded-2xl border-2 p-4 text-left outline-none',
                    !fixedW && featuredPlanCardFitContent && 'lg:h-full',
                    'transition-[box-shadow,border-color,background-color] duration-300 ease-in-out motion-reduce:transition-none',
                    fixedW
                      ? 'h-auto w-[200px] min-w-[200px] max-w-[200px] shrink-0'
                      : cn('min-w-0', !featuredPlanCardFitContent && 'lg:min-h-[22.25rem]'),
                    selected
                      ? 'relative z-[1] border-[#00bfb3] bg-[#00bfb3]/10 shadow-[0_10px_28px_-6px_rgba(0,191,179,0.35),0_4px_6px_-2px_rgba(0,0,0,0.06)]'
                      : 'relative z-0 border-gray-200 bg-white shadow-none hover:border-gray-400',
                    'focus-visible:ring-2 focus-visible:ring-[#00bfb3] focus-visible:ring-offset-2',
                  )}
                >
                  <div className="flex min-h-0 w-full flex-col">
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
                      <span
                        className="mt-[16px] shrink-0 self-center rounded-full bg-[#00bfb3] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white sm:text-[10px]"
                      >
                        {t('subscriptions.plan.mostPopular')}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {showLaundryBagLink ? (
          <div
            className={cn(
              'flex w-full shrink-0 justify-center self-center pt-3 sm:pt-4',
              hideLaundryBagLinkOnDesktop && 'lg:hidden',
            )}
          >
            <a
              href={`#${ADD_ONS_SECTION_ID}`}
              onClick={scrollToAddOnsSection}
              className="text-center text-base font-medium text-[#00bfb3] underline underline-offset-2 transition-colors hover:text-[#009a91]"
            >
              {t('subscriptions.checkLaundryBagAndPriceList')}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
