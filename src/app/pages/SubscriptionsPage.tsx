import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent, MouseEvent } from 'react';
import { Link } from 'react-router';
import { Check, ChevronsUpDownIcon, PartyPopper } from 'lucide-react';
import { ConfettiIcon } from '@phosphor-icons/react';
import { useLanguage } from '../context/LanguageContext';
import { scrollToTop } from '../../lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function isValidUSPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith('1')) return true;
  return false;
}

const BAG_REFERENCE_URL =
  'https://www.cleanersupply.com/bags/wash-and-fold-laundry-bags/eco2go-large-30-gal-wash-and-fold-laundry-bags-20-x-14-x-15/#sku=wb1te';

const BAG_IMAGE_SRC = '/images/01-laundry-bag.jpg';

const BAG_SECTION_ID = 'subscriptions-bag';

function scrollToBagSection(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const el = document.getElementById(BAG_SECTION_ID);
  if (!el) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}

type PlanId = 'singles' | 'couples' | 'family';

const PLANS: {
  id: PlanId;
  nameKey: string;
  cardTitleKey: string;
  blurbKey: string;
  feature1Key: string;
  feature2Key: string;
  priceKey: string;
  featured?: boolean;
}[] = [
  {
    id: 'singles',
    nameKey: 'subscriptions.plan.singles.name',
    cardTitleKey: 'subscriptions.plan.singles.cardTitle',
    blurbKey: 'subscriptions.plan.singles.blurb',
    feature1Key: 'subscriptions.plan.singles.feature1',
    feature2Key: 'subscriptions.plan.singles.feature2',
    priceKey: 'subscriptions.plan.singles.price',
  },
  {
    id: 'couples',
    nameKey: 'subscriptions.plan.couples.name',
    cardTitleKey: 'subscriptions.plan.couples.cardTitle',
    blurbKey: 'subscriptions.plan.couples.blurb',
    feature1Key: 'subscriptions.plan.couples.feature1',
    feature2Key: 'subscriptions.plan.couples.feature2',
    priceKey: 'subscriptions.plan.couples.price',
    featured: true,
  },
  {
    id: 'family',
    nameKey: 'subscriptions.plan.family.name',
    cardTitleKey: 'subscriptions.plan.family.cardTitle',
    blurbKey: 'subscriptions.plan.family.blurb',
    feature1Key: 'subscriptions.plan.family.feature1',
    feature2Key: 'subscriptions.plan.family.feature2',
    priceKey: 'subscriptions.plan.family.price',
  },
];

const HOLD_DURATION_MS = 3000;

/** Google Apps Script Web App URL — subscription form → Sheet + email (see docs/google-sheets-apps-script-subscriptions.js) */
const GOOGLE_SHEETS_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbwRVTBRDJcRQplN9oMjnEOEGJYQuGCQsNTl42EMpPM8DluDLfbLPPfw-blPiGiCV7c_wA/exec';

const NON_SUBSCRIPTION_ROWS: { labelKey: string; price: string }[] = [
  { labelKey: 'subscriptions.row.singleBag', price: '$30' },
  { labelKey: 'subscriptions.row.twin', price: '$25' },
  { labelKey: 'subscriptions.row.full', price: '$28' },
  { labelKey: 'subscriptions.row.queen', price: '$35' },
  { labelKey: 'subscriptions.row.king', price: '$38' },
];

/** Matches [new-date-time-picker.tsx](src/components/ui/new-date-time-picker.tsx) date trigger + option row height */
const planDropdownTriggerClassName = cn(
  'w-full justify-between text-base font-normal border border-gray-300 rounded bg-white px-4 py-2.5 min-h-[46px]',
  'shadow-none hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0',
  'focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/30 focus:outline-none',
);

export function SubscriptionsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('couples');
  const [planPopoverOpen, setPlanPopoverOpen] = useState(false);
  const planTriggerRef = useRef<HTMLButtonElement>(null);
  const [planMenuWidth, setPlanMenuWidth] = useState<number | undefined>(undefined);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [showFieldError, setShowFieldError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const errorDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [verified, setVerified] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneValid = isValidUSPhone(formData.phone);
  const phoneValidRef = useRef(phoneValid);
  phoneValidRef.current = phoneValid;
  const allFilled = Boolean(formData.name.trim() && formData.phone.trim());

  const setPlan = (planId: PlanId) => {
    setSelectedPlan(planId);
  };

  useLayoutEffect(() => {
    if (!planPopoverOpen || !planTriggerRef.current) return;
    setPlanMenuWidth(planTriggerRef.current.getBoundingClientRect().width);
  }, [planPopoverOpen]);

  const selectedPlanMeta = PLANS.find((p) => p.id === selectedPlan) ?? PLANS[0];

  const clearHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  const validateAllAndShowErrors = (fromHoldAttempt = false) => {
    if (!allFilled) {
      setGeneralError(t('ctaForm.fillFieldsFirst'));
      setErrors({});
    } else if (fromHoldAttempt) {
      const valid = phoneValidRef.current;
      setGeneralError(null);
      setErrors({
        phone: !valid ? t('ctaForm.errorPhoneUSOnly') : undefined,
      });
      if (!valid) setVerified(false);
    }
    setShowError(true);
    if (errorDismissRef.current) clearTimeout(errorDismissRef.current);
    errorDismissRef.current = setTimeout(() => {
      setShowError(false);
      setErrors({});
      errorDismissRef.current = null;
    }, 4000);
  };

  const startHold = () => {
    if (!allFilled || verified) return;
    clearHold();
    const start = Date.now();
    const onHoldComplete = () => {
      if (!phoneValidRef.current) {
        validateAllAndShowErrors(true);
        return;
      }
      setVerified(true);
    };
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        clearHold();
        onHoldComplete();
      }
    }, 50);
    holdTimerRef.current = setTimeout(() => {
      clearHold();
      setHoldProgress(100);
      onHoldComplete();
    }, HOLD_DURATION_MS);
  };

  const cancelHold = () => {
    clearHold();
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError(null);
    setShowError(false);
    setErrors({});
    setShowFieldError(false);
    if (name === 'phone' && verified && !isValidUSPhone(value)) setVerified(false);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!verified) return;
    const nameOk = formData.name.trim().length > 0;
    const phoneOk = isValidUSPhone(formData.phone);
    if (!nameOk || !formData.phone.trim()) {
      setShowFieldError(true);
      setErrors({ phone: !phoneOk && formData.phone.trim() ? t('ctaForm.errorPhoneUSOnly') : undefined });
      return;
    }
    if (!phoneOk) {
      setErrors({ phone: t('ctaForm.errorPhoneUSOnly') });
      return;
    }
    setErrors({});
    setShowFieldError(false);

    const planLabel = t(selectedPlanMeta.nameKey);
    const fields: Record<string, string> = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      plan: planLabel,
    };

    // Form POST to hidden iframe — avoids CORS (same pattern as SchedulePickupFormPage)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SHEETS_WEB_APP_URL;
    form.target = 'sheet-submit-frame-subscriptions';
    form.style.display = 'none';
    form.setAttribute('enctype', 'application/x-www-form-urlencoded');

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    let iframe = document.getElementById('sheet-submit-frame-subscriptions') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = 'sheet-submit-frame-subscriptions';
      iframe.id = 'sheet-submit-frame-subscriptions';
      iframe.style.display = 'none';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();

    setFormSubmitted(true);
  };

  const handleSubmitAnother = () => {
    setFormSubmitted(false);
    setFormData({ name: '', phone: '' });
    setErrors({});
    setShowFieldError(false);
    setVerified(false);
    setHoldProgress(0);
    setGeneralError(null);
    setShowError(false);
    clearHold();
  };

  useEffect(() => {
    return () => {
      if (errorDismissRef.current) clearTimeout(errorDismissRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden overflow-y-auto bg-[#00bfb3]">
      <div className="flex justify-center px-4 py-4 shrink-0">
        <div
          className="flex items-center rounded-full border border-white/50 bg-white/10 p-0.5 cursor-pointer hover:bg-white/20 transition-colors"
          role="group"
          aria-label="Language selection"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              language === 'en' ? 'bg-white text-[#00bfb3]' : 'text-white hover:text-white/90'
            }`}
            aria-pressed={language === 'en'}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              language === 'es' ? 'bg-white text-[#00bfb3]' : 'text-white hover:text-white/90'
            }`}
            aria-pressed={language === 'es'}
          >
            ES
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-stretch gap-0">
        <div className="mx-auto w-full max-w-6xl shrink-0 px-4 pb-20 pt-10">
          <h1
            id="subscriptions-page-title"
            className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 text-balance"
          >
            {t('subscriptions.title')}
          </h1>
          <p className="text-white/90 text-center text-sm sm:text-base mb-4 text-balance">
            {t('subscriptions.subtitle')}
          </p>
          <div className="mx-auto mb-4 flex w-full max-w-4xl justify-center">
            <div
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/35 bg-white px-3 py-1.5 pl-2.5 text-center sm:gap-2 sm:px-4 sm:py-2"
              role="status"
            >
              <ConfettiIcon className="h-3.5 w-3.5 shrink-0 text-[#00bfb3] sm:h-4 sm:w-4" aria-hidden />
              <p className="text-[11px] font-medium leading-snug text-[#00bfb3] text-balance sm:text-xs">
                {t('subscriptions.promo')}
              </p>
            </div>
          </div>

          {/* Section 1: subscription plans & sign-up */}
          <section className="min-w-0">
              <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl bg-white shadow-lg">
                {/* Plans + signup row — lg: grid so all columns share one row height (plans column fills full height) */}
                <div
                  className={cn(
                    'grid min-h-0 w-full flex-1 grid-cols-1 gap-0',
                    'lg:grid-cols-[minmax(0,22rem)_1px_1fr] lg:grid-rows-1 lg:items-stretch',
                  )}
                >
                <div className="order-1 flex min-h-0 min-w-0 flex-col p-4 sm:p-8 lg:order-none lg:col-start-3 lg:row-start-1 lg:h-full lg:min-h-0 lg:p-8">
                  <div className="flex min-h-0 w-full flex-1 flex-col lg:h-full lg:min-h-0">
                    <div
                      id="subscription-plans-group"
                      className="flex min-h-0 w-full flex-1 flex-col items-center justify-start lg:justify-center"
                      role="radiogroup"
                      aria-labelledby="subscriptions-page-title"
                    >
                      <div className="grid w-full grid-cols-1 items-start gap-2 sm:gap-3 lg:grid-cols-3 lg:items-center lg:gap-4">
                      {PLANS.map((plan) => {
                        const selected = selectedPlan === plan.id;
                        const featureKeys = [plan.feature1Key, plan.feature2Key] as const;
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setPlan(plan.id)}
                            className={cn(
                              'flex min-h-0 min-w-0 cursor-pointer flex-col rounded-2xl border-2 p-2.5 text-left transition-colors sm:p-3 lg:p-4',
                              'lg:transition-[min-height,box-shadow] lg:duration-300 lg:ease-in-out motion-reduce:lg:transition-none',
                              selected
                                ? 'border-[#00bfb3] bg-[#00bfb3]/10 shadow-lg ring-2 ring-[#00bfb3]/20 lg:min-h-[22.25rem]'
                                : 'border-gray-200 bg-white hover:border-gray-400 lg:min-h-[20rem]',
                            )}
                          >
                            <div className="flex min-h-0 w-full flex-1 flex-col">
                              <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug text-black">
                                {t(plan.cardTitleKey)}
                              </h3>
                              <p className="mt-1 line-clamp-3 text-left text-[9px] leading-snug text-gray-600 sm:text-[10px] lg:text-xs text-balance">
                                {t(plan.blurbKey)}
                              </p>
                              <div className="mt-3 flex flex-wrap items-baseline gap-x-1 gap-y-0 sm:mt-4">
                                <span className="text-xl font-bold tracking-tight text-black sm:text-2xl lg:text-3xl xl:text-4xl">
                                  {t(plan.priceKey)}
                                </span>
                                <span className="text-[10px] font-medium text-gray-500 sm:text-xs lg:text-sm">
                                  {t('subscriptions.perMonth')}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-col border-t border-gray-200 pt-3 sm:mt-4 sm:pt-4">
                                <p className="text-[9px] font-bold tracking-wide text-black sm:text-[10px] lg:text-xs">
                                  {t('subscriptions.plan.whatsIncluded')}
                                </p>
                                <ul className="mt-2 flex flex-col gap-2 sm:mt-2.5 sm:gap-2.5">
                                  {featureKeys.map((key) => (
                                    <li key={key} className="flex gap-2 sm:gap-2.5">
                                      <Check
                                        className="mt-0.5 h-3 w-3 shrink-0 text-gray-500 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                      />
                                      <span className="text-left text-[9px] leading-snug text-gray-600 sm:text-[10px] lg:text-xs text-balance">
                                        {t(key)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {plan.featured && (
                                <span className="mt-auto shrink-0 self-center rounded-full bg-[#00bfb3] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white sm:text-[10px]">
                                  {t('subscriptions.plan.mostPopular')}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      </div>
                    </div>
                    <div className="flex w-full shrink-0 justify-center self-center pt-3 sm:pt-4">
                      <a
                        href={`#${BAG_SECTION_ID}`}
                        onClick={scrollToBagSection}
                        className="text-base font-medium text-[#00bfb3] underline underline-offset-2 transition-colors hover:text-[#009a91]"
                      >
                        {t('subscriptions.checkLaundryBag')}
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="order-2 my-4 h-px w-full shrink-0 bg-gray-200 mx-4 sm:mx-6 lg:hidden"
                  role="separator"
                  aria-orientation="horizontal"
                />
                <div
                  className="order-2 my-4 hidden w-px shrink-0 self-stretch bg-gray-200 lg:col-start-2 lg:row-start-1 lg:my-0 lg:block"
                  role="separator"
                  aria-orientation="vertical"
                />

                {/* Mobile: signup after divider; desktop: signup on the left (narrower column) */}
                <div className="order-3 min-w-0 px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-8 lg:order-none lg:col-start-1 lg:row-start-1 lg:min-h-0 lg:w-full lg:min-w-0 lg:p-8">
                  {formSubmitted ? (
                    <div className="space-y-4 text-center">
                      <p className="text-lg font-bold text-black">{t('subscriptions.form.successTitle')}</p>
                      <p className="text-sm text-gray-700 sm:text-base">{t('subscriptions.form.successMessage')}</p>
                      <button
                        type="button"
                        onClick={handleSubmitAnother}
                        className="mt-2 w-full min-h-[44px] rounded bg-black px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer"
                      >
                        {t('subscriptions.form.submitAnother')}
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleFormSubmit}
                      className="space-y-4"
                      noValidate
                      aria-labelledby="subscriptions-page-title"
                    >
                      <div>
                        <label htmlFor="subscription-name" className="mb-1 block text-sm font-semibold text-black">
                          {t('contact.form.name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="subscription-name"
                          name="name"
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          className={`w-full rounded border px-4 py-2.5 transition-colors focus:outline-none ${
                            showFieldError && !formData.name.trim()
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#00bfb3]'
                          }`}
                          placeholder={t('contact.form.namePlaceholder')}
                        />
                      </div>
                      <div>
                        <label htmlFor="subscription-phone" className="mb-1 block text-sm font-semibold text-black">
                          {t('contact.form.phone')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="subscription-phone"
                          name="phone"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className={`w-full rounded border px-4 py-2.5 transition-colors focus:outline-none ${
                            errors.phone || (showFieldError && !formData.phone.trim())
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#00bfb3]'
                          }`}
                          placeholder={t('contact.form.phonePlaceholder')}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                      </div>
                      <div>
                        <label
                          id="subscription-plan-label"
                          htmlFor="subscription-plan"
                          className="mb-1 block text-sm font-semibold text-black"
                        >
                          {t('subscriptions.form.planLabel')} <span className="text-red-500">*</span>
                        </label>
                        <Popover open={planPopoverOpen} onOpenChange={setPlanPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              ref={planTriggerRef}
                              type="button"
                              variant="outline"
                              id="subscription-plan"
                              aria-expanded={planPopoverOpen}
                              aria-haspopup="listbox"
                              className={planDropdownTriggerClassName}
                            >
                              <span className="min-w-0 truncate text-left">
                                {t(selectedPlanMeta.nameKey)} — {t(selectedPlanMeta.priceKey)}
                                {t('subscriptions.perMonth')}
                              </span>
                              <ChevronsUpDownIcon className="h-4 w-4 shrink-0" aria-hidden />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            sideOffset={4}
                            className="w-auto max-w-none border border-gray-300 rounded-lg bg-white p-0 shadow-lg overflow-hidden"
                            style={planMenuWidth ? { width: planMenuWidth } : undefined}
                            onOpenAutoFocus={(e: FocusEvent) => e.preventDefault()}
                          >
                            <ul role="listbox" aria-labelledby="subscription-plan-label">
                              {PLANS.map((plan) => {
                                const selected = selectedPlan === plan.id;
                                return (
                                  <li key={plan.id} role="presentation">
                                    <button
                                      type="button"
                                      role="option"
                                      aria-selected={selected}
                                      className={cn(
                                        'flex w-full min-h-[46px] items-center justify-between gap-3 px-4 text-left text-base font-normal text-black',
                                        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                                        selected && 'bg-[#00bfb3]/10 text-black',
                                      )}
                                      onClick={() => {
                                        setPlan(plan.id);
                                        setPlanPopoverOpen(false);
                                      }}
                                    >
                                      <span className="min-w-0 flex-1">
                                        {t(plan.nameKey)} — {t(plan.priceKey)}
                                        {t('subscriptions.perMonth')}
                                      </span>
                                      <span
                                        className="flex h-4 w-4 shrink-0 items-center justify-center"
                                        aria-hidden
                                      >
                                        {selected && (
                                          <Check className="h-4 w-4 text-[#00bfb3]" strokeWidth={2.5} />
                                        )}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex min-h-[44px] flex-col gap-1">
                        {generalError || !allFilled ? (
                          <p
                            className={`w-full rounded border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-600 transition-opacity duration-300 ${
                              showError ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            {generalError || t('ctaForm.fillFieldsFirst')}
                          </p>
                        ) : null}
                      </div>
                      <p className="mb-2 text-sm text-black text-balance">{t('ctaForm.holdInstruction')}</p>
                      {verified && phoneValid ? (
                        <div className="flex w-full items-start justify-start rounded border-2 border-[#00bfb3] bg-[#00bfb3]/15 px-3 py-3 font-medium text-[#00a89d] transition-all duration-300 ease-out">
                          <span className="inline-flex items-center gap-2">
                            <span className="font-bold text-[#00bfb3]">✓</span>
                            {t('ctaForm.verifiedMessage')}
                          </span>
                        </div>
                      ) : allFilled ? (
                        <button
                          type="button"
                          onMouseDown={() => startHold()}
                          onMouseUp={cancelHold}
                          onMouseLeave={cancelHold}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            startHold();
                          }}
                          onTouchEnd={cancelHold}
                          onTouchCancel={cancelHold}
                          onContextMenu={(e) => e.preventDefault()}
                          className="relative flex min-h-[44px] w-full cursor-pointer items-center justify-center overflow-hidden rounded bg-[#00bfb3]/30 px-8 py-3 text-center font-semibold text-gray-800 transition-colors duration-300 ease-out"
                        >
                          <span
                            className="absolute inset-y-0 left-0 bg-[#00bfb3] transition-[width] duration-100 ease-linear"
                            style={{ width: `${holdProgress}%` }}
                          />
                          <span className="relative z-10">{t('ctaForm.holdToVerify')}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => validateAllAndShowErrors()}
                          className="w-full min-h-[44px] cursor-not-allowed rounded bg-[#00bfb3]/15 px-8 py-3 text-center font-semibold text-gray-500"
                        >
                          {t('ctaForm.holdToVerify')}
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!verified || !phoneValid}
                        className="mt-2 w-full min-h-[44px] cursor-pointer rounded bg-black px-8 py-3 font-semibold text-white transition-all duration-300 ease-out hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {t('subscriptions.form.submit')}
                      </button>
                    </form>
                  )}
                </div>
                </div>
              </div>
          </section>

          <div className="mt-8 flex flex-col items-center text-center sm:mt-10">
            <h2 className="mb-4 max-w-xl text-base font-semibold text-white text-balance sm:text-lg">
              {t('subscriptions.notReadyTitle')}
            </h2>
            <Link
              to="/contact#contact-form"
              className="inline-block rounded bg-white px-5 py-2.5 text-sm font-semibold text-[#00bfb3] transition-colors hover:bg-gray-100 hover:text-[#009a91]"
            >
              {t('subscriptions.contactUsButton')}
            </Link>
          </div>
        </div>

        {/* Section 2: full-bleed white — grows to bottom of viewport; back link pinned inside */}
        <section
          id="subscriptions-add-ons"
          className="flex min-h-0 min-w-0 w-full flex-1 flex-col bg-white py-20"
          aria-labelledby="subscriptions-add-ons-title"
        >
          <h2 id="subscriptions-add-ons-title" className="sr-only">
            {t('subscriptions.addOnsSectionTitle')}
          </h2>
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
            <div
              className={cn(
                'flex min-h-0 w-full min-w-0 flex-1 flex-col gap-0',
                'lg:grid lg:grid-cols-2 lg:items-start lg:gap-0',
              )}
            >
              {/* Bag first in DOM — stack order on mobile; left column on lg */}
              <section
                id={BAG_SECTION_ID}
                className="flex min-w-0 scroll-mt-6 flex-col border-t border-gray-200 pt-6 lg:border-t-0 lg:pt-0 lg:pr-8"
              >
                <div className="flex flex-col gap-5 p-5 sm:gap-6 sm:px-6 sm:pt-6 sm:pb-0">
                  <h2 className="shrink-0 text-center text-base font-semibold text-gray-900 sm:text-lg">
                    {t('subscriptions.bagSectionTitle')}
                  </h2>

                  <div className="mx-auto w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[280px]">
                    <div className="w-full overflow-hidden rounded-lg">
                      <img
                        src={BAG_IMAGE_SRC}
                        alt={t('subscriptions.bagAlt')}
                        className="h-auto w-full object-contain object-center"
                        loading="lazy"
                        width={900}
                        height={400}
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* À la carte pricing */}
              <section className="min-w-0 border-t border-gray-200 pt-6 lg:border-t-0 lg:border-l lg:border-gray-200 lg:pl-8 lg:pt-0">
                <div className="space-y-4 p-5 sm:p-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                      {t('subscriptions.nonSubscription.title')}
                    </h2>
                  </div>
                  <div className="overflow-x-auto -mx-1">
                    <table className="w-full min-w-[280px] border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th
                            scope="col"
                            className="py-2 pr-4 text-left text-base font-medium text-gray-900"
                          >
                            {t('subscriptions.table.service')}
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-2 pl-4 text-right text-base font-medium text-gray-900"
                          >
                            {t('subscriptions.table.price')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {NON_SUBSCRIPTION_ROWS.map((row) => (
                          <tr key={row.labelKey} className="border-b border-gray-100">
                            <td className="py-2.5 pr-4 text-gray-800">{t(row.labelKey)}</td>
                            <td className="whitespace-nowrap py-2.5 pl-4 text-right font-semibold text-gray-900">
                              {row.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-auto shrink-0 w-full">
              <div className="pt-8 lg:mt-8">
                <p className="text-center">
                  <Link
                    to="/services"
                    className="font-medium text-[#00bfb3] underline underline-offset-2 transition-colors hover:text-[#009a91]"
                    onClick={scrollToTop}
                  >
                    {t('ctaForm.backToWebsite')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
