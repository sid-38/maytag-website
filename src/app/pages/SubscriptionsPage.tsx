import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import Lottie from 'lottie-react';
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import { ConfettiIcon } from '@phosphor-icons/react';
import confettiAnimation from '../../imports/Confetti Effects Lottie Animation.json';
import { useLanguage } from '../context/LanguageContext';
import { scrollToTop } from '../../lib/utils';
import { Card, CardContent } from '../components/Card';
import { SubscriptionPlansPicker } from '../components/SubscriptionPlansPicker';
import { cn } from '@/lib/utils';
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '../../lib/subscription-plans';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NewDateTimePicker } from '@/components/ui/new-date-time-picker';
import { clampPreferredDateToMin, getMinSelectableCalendarDate } from '../../lib/schedule-pickup-date';

function isValidEmail(value: string): boolean {
  if (!value.trim()) return false;
  return value.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

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

const PRICE_LIST_SECTION_ID = 'subscriptions-price-list';

const ADD_ONS_SECTION_ID = 'subscriptions-add-ons';

const SUBSCRIPTIONS_SUCCESS_PATH = '/subscriptions/success';

type PlanId = SubscriptionPlanId;

const PLANS = SUBSCRIPTION_PLANS;

function planFromSearchParams(searchParams: URLSearchParams): PlanId {
  const raw = searchParams.get('plan');
  if (raw && PLANS.some((p) => p.id === raw)) {
    return raw as PlanId;
  }
  return 'couples';
}

const HOLD_DURATION_MS = 3000;

/** Google Apps Script Web App URL — subscription form → Sheet + email (see docs/google-sheets-apps-script-subscriptions.js) */
const GOOGLE_SHEETS_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbwRVTBRDJcRQplN9oMjnEOEGJYQuGCQsNTl42EMpPM8DluDLfbLPPfw-blPiGiCV7c_wA/exec';

const NON_SUBSCRIPTION_ROWS: { labelKey: string; price: string }[] = [
  { labelKey: 'subscriptions.row.singleBag', price: '$35' },
  { labelKey: 'subscriptions.row.twin', price: '$25' },
  { labelKey: 'subscriptions.row.full', price: '$28' },
  { labelKey: 'subscriptions.row.queen', price: '$35' },
  { labelKey: 'subscriptions.row.king', price: '$38' },
];

/** Matches [new-date-time-picker.tsx](src/components/ui/new-date-time-picker.tsx) date trigger + option row height */
const planDropdownTriggerClassName = cn(
  'w-full h-auto min-h-[46px] items-center justify-between gap-2 text-base font-normal border border-gray-300 rounded bg-white px-4 py-2.5',
  'shadow-none hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0',
  'focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/30 focus:outline-none',
);

export function SubscriptionsPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, setLanguage, t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(() => planFromSearchParams(searchParams));
  const [planPopoverOpen, setPlanPopoverOpen] = useState(false);
  const planTriggerRef = useRef<HTMLButtonElement>(null);
  const [planMenuWidth, setPlanMenuWidth] = useState<number | undefined>(undefined);
  /** Natural height of signup panel while form is visible; then fixed so success state does not shrink the column. */
  const [lockedSignupPanelHeight, setLockedSignupPanelHeight] = useState<number | null>(null);
  const signupPanelRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [firstPickupDate, setFirstPickupDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});
  const [showFieldError, setShowFieldError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isSuccessRoute = location.pathname === SUBSCRIPTIONS_SUCCESS_PATH;
  const showSuccessScreen = formSubmitted || isSuccessRoute;
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const errorDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [verified, setVerified] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneValid = isValidUSPhone(formData.phone);
  const emailValid = isValidEmail(formData.email);
  const phoneValidRef = useRef(phoneValid);
  phoneValidRef.current = phoneValid;
  const allFilled = Boolean(
    formData.name.trim() && formData.phone.trim() && emailValid && firstPickupDate !== null,
  );

  const setPlan = (planId: PlanId) => {
    setSelectedPlan(planId);
    setSearchParams(
      (prev: URLSearchParams) => {
        const next = new URLSearchParams(prev);
        next.set('plan', planId);
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    setSelectedPlan(planFromSearchParams(searchParams));
  }, [searchParams]);

  /** After cutoff, today is disabled in the calendar; if user already picked today, bump to min day. */
  useEffect(() => {
    const sync = () => {
      const minCal = getMinSelectableCalendarDate(new Date());
      setFirstPickupDate((prev: Date | null) => {
        if (prev === null) return null;
        return clampPreferredDateToMin(prev, minCal);
      });
    };
    sync();
    const id = window.setInterval(sync, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    if (!planPopoverOpen || !planTriggerRef.current) return;
    setPlanMenuWidth(planTriggerRef.current.getBoundingClientRect().width);
  }, [planPopoverOpen]);

  /** Step 1: while the form is shown, parent height follows signup content (ResizeObserver). Step 2: same px value is applied as fixed height via state + submit snapshot. */
  useLayoutEffect(() => {
    if (showSuccessScreen) return;
    const el = signupPanelRef.current;
    if (!el) return;

    const update = () => {
      const h = el.offsetHeight;
      if (h > 0) setLockedSignupPanelHeight(h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showSuccessScreen]);

  /** Direct visit to /subscriptions/success: lock height from success UI when form never ran. */
  useLayoutEffect(() => {
    if (!showSuccessScreen || lockedSignupPanelHeight != null) return;
    const el = signupPanelRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      const h = el.offsetHeight;
      if (h > 0) setLockedSignupPanelHeight(h);
    });
    return () => cancelAnimationFrame(id);
  }, [showSuccessScreen, lockedSignupPanelHeight]);

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
    if (name === 'email' && verified && !isValidEmail(value)) setVerified(false);
  };

  const handleFirstPickupDateChange = (date: Date | null) => {
    setFirstPickupDate(date);
    setGeneralError(null);
    setShowError(false);
    setShowFieldError(false);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!verified) return;
    const nameOk = formData.name.trim().length > 0;
    const phoneOk = isValidUSPhone(formData.phone);
    const emailOk = isValidEmail(formData.email);
    if (!nameOk || !formData.phone.trim() || !emailOk || !phoneOk || firstPickupDate === null) {
      setShowFieldError(true);
      setErrors({
        phone: formData.phone.trim() && !phoneOk ? t('ctaForm.errorPhoneUSOnly') : undefined,
        email: !emailOk ? t('ctaForm.errorEmailInvalid') : undefined,
      });
      return;
    }
    setErrors({});
    setShowFieldError(false);

    const firstPickupDateStr = firstPickupDate.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const planLabel = t(selectedPlanMeta.nameKey);
    const fields: Record<string, string> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      plan: planLabel,
      firstPickupDate: firstPickupDateStr,
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

    const panel = signupPanelRef.current;
    if (panel && panel.offsetHeight > 0) {
      setLockedSignupPanelHeight(panel.offsetHeight);
    }

    setFormSubmitted(true);
  };

  useEffect(() => {
    return () => {
      if (errorDismissRef.current) clearTimeout(errorDismissRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden overflow-y-auto bg-[#00bfb3]">
      
      {/* Language selection */}
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
        <div className="mx-auto w-full max-w-6xl shrink-0 px-4 pt-6 pb-14 sm:pt-10 sm:pb-20">
          <h1
            id="subscriptions-page-title"
            className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 text-balance"
          >
            {t('subscriptions.title')}
          </h1>
          <p className="mb-4 text-center text-sm text-balance text-white/90 sm:text-base">
            {t('subscriptions.subtitle.02')}
          </p>
          <div className="mx-auto mb-4 flex w-full max-w-4xl justify-center">
            <div
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#00948B] px-3 py-1.5 pl-2.5 text-center sm:gap-2 sm:px-4 sm:py-2"
              role="status"
            >
              <ConfettiIcon
                weight="bold"
                className="h-4 w-4 shrink-0 text-white sm:h-4 sm:w-4"
                aria-hidden
              />
              <p className="text-sm font-medium leading-snug text-white text-balance sm:text-sm">
                {t('subscriptions.promo')}
              </p>
            </div>
          </div>

          {/* Section 1: mobile = two white cards; desktop = one white card (signup | divider | plans) */}
          <section className="min-w-0">
            <div
              className={cn(
                'flex min-w-0 flex-col gap-4',
                'lg:grid lg:grid-cols-[minmax(0,22rem)_1px_1fr] lg:items-stretch lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:bg-white lg:shadow-lg',
              )}
            >
              <div
                className={cn(
                  'order-1 min-w-0 overflow-hidden rounded-xl bg-white shadow-lg',
                  'lg:order-none lg:col-start-3 lg:row-start-1 lg:min-h-0 lg:h-full lg:rounded-none lg:bg-transparent lg:shadow-none',
                )}
              >
                <div className="flex min-h-0 flex-col p-4 sm:p-8 lg:h-full lg:min-h-0 lg:p-8">
                  <p
                    className="mb-4 text-center text-sm leading-snug text-gray-600 text-balance sm:text-base lg:hidden"
                    id="subscription-plans-mobile-intro"
                  >
                    {t('subscriptions.plansMobileIntro')}
                  </p>
                  <SubscriptionPlansPicker
                    selectedPlan={selectedPlan}
                    onSelectPlan={setPlan}
                    t={t}
                    ariaLabelledBy="subscriptions-page-title"
                    featuredPlanCardFitContent
                  />
                </div>
              </div>

              <div
                className="order-2 my-8 hidden w-px shrink-0 self-stretch bg-gray-200 lg:col-start-2 lg:row-start-1 lg:my-8 lg:block"
                role="separator"
                aria-orientation="vertical"
              />

              <div
                className={cn(
                  'order-3 min-w-0 overflow-hidden rounded-xl bg-white shadow-lg',
                  'lg:order-none lg:col-start-1 lg:row-start-1 lg:w-full lg:min-w-0 lg:rounded-none lg:bg-transparent lg:shadow-none',
                )}
              >
                <div
                  ref={signupPanelRef}
                  className="flex min-h-0 min-w-0 flex-col overflow-hidden px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-8 lg:p-8"
                  style={
                    lockedSignupPanelHeight != null
                      ? {
                          height: lockedSignupPanelHeight,
                          minHeight: lockedSignupPanelHeight,
                          maxHeight: lockedSignupPanelHeight,
                        }
                      : undefined
                  }
                >
                  {showSuccessScreen ? (
                    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden text-center">
                      <Lottie
                        animationData={confettiAnimation}
                        loop
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                        aria-hidden
                      />
                      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto">
                        <div className="flex w-full max-w-sm flex-col justify-center space-y-4">
                          <p className="text-lg font-bold text-black">{t('subscriptions.form.successTitle')}</p>
                          <p className="text-balance text-sm text-gray-700 sm:text-base">
                            {t('subscriptions.form.successMessage')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleFormSubmit}
                      className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto overflow-x-hidden"
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
                        <label htmlFor="subscription-email" className="mb-1 block text-sm font-semibold text-black">
                          {t('contact.form.email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="subscription-email"
                          name="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className={`w-full rounded border px-4 py-2.5 transition-colors focus:outline-none ${
                            errors.email || (showFieldError && !formData.email.trim())
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#00bfb3]'
                          }`}
                          placeholder={t('contact.form.emailPlaceholder')}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                              <span className="min-w-0 flex-1 truncate text-left leading-tight">
                                {t(selectedPlanMeta.nameKey)}
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
                                        'flex w-full min-h-[46px] items-center justify-between gap-3 px-4 py-2.5 text-left text-base font-normal text-black',
                                        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                                        selected && 'bg-[#00bfb3]/10 text-black',
                                      )}
                                      onClick={() => {
                                        setPlan(plan.id);
                                        setPlanPopoverOpen(false);
                                      }}
                                    >
                                      <span className="min-w-0 flex-1 truncate text-left">
                                        {t(plan.nameKey)}
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
                      <div
                        className={cn(
                          showFieldError && firstPickupDate === null && 'rounded-lg ring-2 ring-red-500 ring-offset-0',
                        )}
                      >
                        <NewDateTimePicker
                          value={firstPickupDate}
                          onChange={handleFirstPickupDateChange}
                          minDate={getMinSelectableCalendarDate()}
                          datePlaceholder={t('pickupForm.pickDatePlaceholder')}
                          dateLabel={
                            <>
                              {t('subscriptions.form.firstPickupDate')}{' '}
                              <span className="text-red-500">*</span>
                            </>
                          }
                        />
                        {showFieldError && firstPickupDate === null ? (
                          <p className="mt-1 text-sm text-red-600">{t('subscriptions.form.firstPickupDateError')}</p>
                        ) : null}
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
                      {verified && phoneValid && emailValid ? (
                        <div className="flex h-12 min-h-12 w-full shrink-0 items-center justify-start rounded border-2 border-[#00bfb3] bg-[#00bfb3]/15 px-3 font-medium text-[#00a89d] transition-all duration-300 ease-out">
                          <span className="inline-flex items-center gap-2">
                            <span className="font-bold text-[#00bfb3]">✓</span>
                            {t('subscriptions.form.verifiedMessage')}
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
                          className="relative flex h-12 min-h-12 w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded bg-[#00bfb3]/30 px-8 text-center font-semibold text-gray-800 transition-colors duration-300 ease-out"
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
                          className="h-12 min-h-12 w-full shrink-0 cursor-not-allowed rounded bg-[#00bfb3]/15 px-8 text-center font-semibold text-gray-500"
                        >
                          {t('ctaForm.holdToVerify')}
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!verified || !phoneValid || !emailValid || firstPickupDate === null}
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
          className="flex min-h-0 min-w-0 w-full flex-1 flex-col bg-white py-14 sm:py-20"
          aria-labelledby="subscriptions-add-ons-title"
        >
          <h2 id="subscriptions-add-ons-title" className="sr-only">
            {t('subscriptions.addOnsSectionTitle')}
          </h2>
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 lg:min-h-0">
              <section
                id={BAG_SECTION_ID}
                className="flex min-h-0 w-full flex-1 scroll-mt-6 flex-col items-center sm:px-6 lg:min-h-0 lg:px-0"
              >
                <div className="flex w-full flex-1 flex-col items-center gap-0 pt-0 pb-0 sm:pt-6 lg:min-h-0">
                  <h2 className="shrink-0 text-center text-base font-semibold text-gray-900 sm:text-lg">
                    {t('subscriptions.bagSectionTitle')}
                  </h2>
                  <p className="w-full mt-2 text-center text-sm text-gray-600 text-balance">
                    {t('subscriptions.bagSectionSubtitle')}
                  </p>
                  <div className="mt-4 w-full sm:mt-5">
                    <div className="w-full overflow-hidden rounded-lg">
                      <img
                        src={BAG_IMAGE_SRC}
                        alt={t('subscriptions.bagAlt')}
                        className="h-[300px] w-full object-contain object-center"
                        loading="lazy"
                        width={900}
                        height={400}
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section
                id={PRICE_LIST_SECTION_ID}
                className="flex min-h-0 w-full min-w-0 flex-1 scroll-mt-6 flex-col lg:min-h-0"
              >
                <div className="flex min-h-0 w-full flex-1 flex-col sm:px-6 lg:min-h-0 lg:px-0">
                  <Card className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
                    <CardContent className="flex min-h-0 flex-1 flex-col lg:min-h-0">
                      <h2 className="text-center text-base font-semibold text-gray-900 sm:text-lg">
                        {t('subscriptions.nonSubscription.title')}
                      </h2>
                      <p className="mt-2 text-center text-sm text-gray-600 text-balance">
                        {t('subscriptions.priceListSectionSubtitle')}
                      </p>
                      <div className="-mx-1 mt-4 overflow-x-auto">
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
                    </CardContent>
                  </Card>
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
