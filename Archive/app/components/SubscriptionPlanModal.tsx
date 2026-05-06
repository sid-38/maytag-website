/**
 * ARCHIVED — not part of the build. Source snapshot; see Archive/README.md.
 * Restore to: src/app/components/SubscriptionPlanModal.tsx
 */
import { useEffect, useState } from 'react';
import type { DismissableLayerProps } from '@radix-ui/react-dismissable-layer';
import { ConfettiIcon } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import { scrollToTop, cn } from '../../lib/utils';
import type { SubscriptionPlanId } from '../../lib/subscription-plans';
import { SubscriptionPlansPicker } from './SubscriptionPlansPicker';
import {
  Dialog,
  DialogContent,
  DialogContentCloseButton,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type PointerDownOutsideEvent = Parameters<
  NonNullable<DismissableLayerProps['onPointerDownOutside']>
>[0];
type InteractOutsideEvent = Parameters<
  NonNullable<DismissableLayerProps['onInteractOutside']>
>[0];
type EscapeKeyDownEvent = Parameters<
  NonNullable<DismissableLayerProps['onEscapeKeyDown']>
>[0];

const stopPointerDownOutside = (e: PointerDownOutsideEvent) => e.preventDefault();
const stopInteractOutside = (e: InteractOutsideEvent) => e.preventDefault();
const stopEscapeKeyDown = (e: EscapeKeyDownEvent) => e.preventDefault();

type SubscriptionPlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SubscriptionPlanModal({ open, onOpenChange }: SubscriptionPlanModalProps) {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan('couples');
    }
  }, [open]);

  const openInNewTab = (path: string) => {
    const url = `${window.location.origin}${path}`;
    const tab = window.open(url, '_blank');
    if (tab) tab.opener = null;
  };

  /** Skip: schedule pickup without a plan. Continue: subscription signup with selected plan. */
  const goToSchedulePickupWithoutPlan = () => {
    onOpenChange(false);
    scrollToTop();
    openInNewTab('/schedule-pickup');
  };

  const goToSubscriptionsWithPlan = (plan: SubscriptionPlanId) => {
    onOpenChange(false);
    scrollToTop();
    openInNewTab(`/subscriptions?plan=${encodeURIComponent(plan)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 backdrop-blur-xs"
        onOpenAutoFocus={(e: Event) => {
          e.preventDefault();
          const heading = document.getElementById('subscription-plan-modal-title');
          if (heading instanceof HTMLElement) {
            heading.focus();
          }
        }}
        onPointerDownOutside={stopPointerDownOutside}
        onInteractOutside={stopInteractOutside}
        onEscapeKeyDown={stopEscapeKeyDown}
        className={cn(
          'flex max-h-[min(92vh,880px)] w-[calc(100vw-1rem)] max-w-6xl flex-col gap-0 overflow-y-auto border-0 bg-transparent py-0 shadow-none',
          'px-4 sm:px-6 md:px-12 lg:px-[200px]',
          'sm:w-[calc(100vw-2rem)] sm:max-w-6xl',
        )}
      >
        <div className="relative flex w-full flex-col rounded-lg bg-white p-4 shadow-lg sm:rounded-xl sm:p-8">
          <DialogContentCloseButton
            className={cn(
              'z-20 rounded-md p-2 text-gray-800 opacity-100 transition-colors hover:bg-gray-200/90 hover:opacity-100',
              'top-2 right-2 sm:top-4 sm:right-4',
            )}
          />
          <DialogHeader className="pb-4 text-center sm:text-center">
            <DialogTitle
              id="subscription-plan-modal-title"
              tabIndex={-1}
              className="text-balance px-2 pr-11 text-xl font-bold text-black outline-none focus:outline-none sm:px-10 sm:pr-10 sm:text-2xl"
            >
              {t('pickupForm.planStep.title')}
            </DialogTitle>
            <DialogDescription className="text-balance px-1 text-sm text-gray-600 sm:px-0 sm:text-base">
              {t('pickupForm.planStep.subtitle')}
            </DialogDescription>
          </DialogHeader>

          <div className="mx-auto mb-4 flex w-full max-w-4xl justify-center">
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
                {t('subscriptions.modal.promo')}
              </p>
            </div>
          </div>

          <SubscriptionPlansPicker
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            t={t}
            showLaundryBagLink={false}
            ariaLabelledBy="subscription-plan-modal-title"
            lockPlanRowToSelectedMinHeight
            noPlanGridTopMargin
            featuredPlanCardFitContent
          />

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={goToSchedulePickupWithoutPlan}
              className={cn(
                'inline-flex h-[44px] w-full min-w-0 cursor-pointer items-center justify-center rounded border-2 border-gray-300 bg-white px-4 text-base font-semibold text-gray-900 sm:whitespace-nowrap sm:px-8',
                'box-border transition-all duration-300 ease-out',
                'hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              {t('pickupForm.planStep.skip')}
            </button>
            <button
              type="button"
              disabled={selectedPlan === null}
              onClick={() => selectedPlan && goToSubscriptionsWithPlan(selectedPlan)}
              className="inline-flex h-[44px] w-full min-w-0 cursor-pointer items-center justify-center rounded border-2 border-transparent bg-black px-4 text-base font-semibold text-white transition-all duration-300 ease-out hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
            >
              {t('pickupForm.planStep.continue')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
