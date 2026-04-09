import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { scrollToTop } from '../../lib/utils';
import type { SubscriptionPlanId } from '../../lib/subscription-plans';
import { clampPreferredDateToMin, getMinSelectableCalendarDate } from '../../lib/schedule-pickup-date';
import { SchedulePickupSuccessScreen } from '../components/SchedulePickupSuccessScreen';
import { NewDateTimePicker } from '../../components/ui/new-date-time-picker';

const HOLD_DURATION_MS = 3000;

/** Google Apps Script Web App URL – captures form submissions to a Google Sheet */
const GOOGLE_SHEETS_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbz34aM2KtTbCTa4NPCANFKhkpY-xqpl5qS5imuxlojf3LaiTGX92587sXhnA-k5DGLJ/exec';

/** Same asset as subscriptions bag section */
const BAG_IMAGE_SRC = '/images/01-laundry-bag.jpg';

function isValidUSPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith('1')) return true;
  return false;
}

function planFromSearchParam(value: string | null): SubscriptionPlanId | null {
  if (value === 'singles' || value === 'couples' || value === 'family') return value;
  return null;
}

export function SchedulePickupFormPage() {
  const { language, setLanguage, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [interestPlan, setInterestPlan] = useState<SubscriptionPlanId | null>(() =>
    planFromSearchParam(searchParams.get('plan')),
  );
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const errorDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phoneValid = isValidUSPhone(formData.phone);
  const phoneValidRef = useRef(phoneValid);
  phoneValidRef.current = phoneValid;
  const allFilled = Boolean(
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.address.trim()
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError(null);
    setShowError(false);
    setErrors({});
    if (name === 'phone' && verified && !isValidUSPhone(value)) setVerified(false);
  };

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

  const startHold = (e?: React.TouchEvent) => {
    e?.preventDefault();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) return;
    setSubmitError(null);
    setSubmitting(true);

    const preferredDateStr = preferredDate
      ? preferredDate.toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '';

    // Use form POST to hidden iframe – avoids CORS (Apps Script doesn't return CORS headers)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SHEETS_WEB_APP_URL;
    form.target = 'sheet-submit-frame';
    form.style.display = 'none';

    const fields: Record<string, string> = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      preferredDate: preferredDateStr,
      notes: formData.notes.trim(),
      planInterest: interestPlan ?? '',
    };

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    let iframe = document.getElementById('sheet-submit-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = 'sheet-submit-frame';
      iframe.id = 'sheet-submit-frame';
      iframe.style.display = 'none';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();

    setSubmitting(false);
    setSubmitted(true);
  };

  useEffect(() => {
    return () => {
      if (errorDismissRef.current) clearTimeout(errorDismissRef.current);
    };
  }, []);

  useEffect(() => {
    setInterestPlan(planFromSearchParam(searchParams.get('plan')));
  }, [searchParams]);

  /** After cutoff, today is disabled in the calendar; if user already picked today, bump to min day. No auto-selection when empty. */
  useEffect(() => {
    const sync = () => {
      const minCal = getMinSelectableCalendarDate(new Date());
      setPreferredDate((prev: Date | null) => {
        if (prev === null) return null;
        return clampPreferredDateToMin(prev, minCal);
      });
    };
    sync();
    const id = window.setInterval(sync, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col bg-[#00bfb3]">
      <div className="flex justify-center px-4 py-4">
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
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8 min-h-0 overflow-visible">
        <div className="mx-auto w-full max-w-md overflow-visible">
          {submitted ? (
            <SchedulePickupSuccessScreen />
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 text-balance">
                {t('pickupForm.title')}
              </h1>
              <p className="mb-4 text-center text-sm text-balance text-white/90 sm:text-base">
                {t('pickupForm.subtitle')}
              </p>
              <div className="mb-6 w-full overflow-hidden rounded-2xl border-2 border-white/40 bg-white shadow-lg">
                <div className="p-6 pb-8 sm:p-8">
                  <div className="flex flex-row items-center gap-3 md:grid md:grid-cols-2 md:items-center md:gap-6">
                    <div className="flex min-h-0 w-auto shrink-0 items-center justify-center overflow-hidden rounded-xl md:w-full md:max-w-none">
                      <img
                        src={BAG_IMAGE_SRC}
                        alt={t('pickupForm.bagPromo.imageAlt')}
                        className="h-auto max-h-[60px] w-auto max-w-[100px] object-contain object-center sm:max-w-[120px] md:max-h-[200px] md:w-full md:max-w-none"
                      />
                    </div>
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center text-left md:min-w-0">
                      <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-start md:gap-4">
                        <div className="order-1 min-w-0 flex-1 md:order-2">
                          {/* <h2 className="line-clamp-3 text-sm font-semibold leading-snug text-black sm:text-base text-balance">
                            {t('pickupForm.bagPromo.title')}
                          </h2> */}
                          <p className="mt-0 text-xs leading-snug text-gray-600 sm:text-sm text-balance md:mt-0">
                            {t('schedulePickupForm.bagSectionSubtitle')}
                          </p>
                        </div>
                        <div className="order-2 flex shrink-0 flex-col items-end md:order-1 md:mt-0 md:w-full md:items-start">
                          <div className="flex flex-col items-center gap-0.5 md:flex-row md:flex-wrap md:items-baseline md:justify-start md:gap-x-2 md:gap-y-0">
                            <span className="text-3xl font-bold tracking-tight text-black sm:text-2xl lg:text-3xl xl:text-4xl">
                              {t('pickupForm.bagPromo.price')}
                            </span>
                            <span className="text-xs font-medium text-gray-500 sm:text-xs lg:text-sm">
                              {t('pickupForm.bagPromo.flatRate')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="m-0 mx-4 border-0 border-t border-gray-200" />
                <form
                  onSubmit={handleSubmit}
                  className="w-full space-y-4 p-6 pt-8 sm:p-8"
                >
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-black mb-1">
                    {t('contact.form.name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border rounded focus:outline-none transition-colors ${
                      showError && !formData.name.trim() ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#00bfb3]'
                    }`}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-black mb-1">
                    {t('contact.form.phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border rounded focus:outline-none transition-colors ${
                      (allFilled && errors.phone) || (showError && !formData.phone.trim()) ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#00bfb3]'
                    }`}
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                  {allFilled && errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-black mb-1">
                    {t('pickupForm.address')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 border rounded focus:outline-none transition-colors ${
                      showError && !formData.address.trim() ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#00bfb3]'
                    }`}
                    placeholder={t('pickupForm.addressPlaceholder')}
                  />
                </div>
                <div>
                  <NewDateTimePicker
                    value={preferredDate}
                    onChange={setPreferredDate}
                    minDate={getMinSelectableCalendarDate()}
                    datePlaceholder={t('pickupForm.pickDatePlaceholder')}
                    dateLabel={t('pickupForm.preferredDate')}
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-black mb-1">
                    {t('pickupForm.notes')}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#00bfb3] transition-colors resize-none"
                    placeholder={t('pickupForm.notesPlaceholder')}
                  />
                </div>
                <div className="min-h-[44px] flex flex-col gap-1">
                  {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 w-full text-left">
                      {submitError}
                    </p>
                  )}
                  {generalError || !allFilled ? (
                    <p
                      className={`text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 w-full text-left transition-opacity duration-300 ${
                        showError ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {generalError || t('ctaForm.fillFieldsFirst')}
                    </p>
                  ) : null}
                </div>
                <p className="text-sm text-black mb-2">{t('ctaForm.holdInstruction')}</p>
                {verified && phoneValid ? (
                  <div className="w-full px-3 py-3 rounded border-2 border-[#00bfb3] bg-[#00bfb3]/15 text-[#00a89d] font-medium transition-all duration-300 ease-out flex items-start justify-start">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-[#00bfb3] font-bold">✓</span>
                      {t('ctaForm.verifiedMessage')}
                    </span>
                  </div>
                ) : allFilled ? (
                  <button
                    type="button"
                    onMouseDown={() => startHold()}
                    onMouseUp={cancelHold}
                    onMouseLeave={cancelHold}
                    onTouchStart={(e) => startHold(e)}
                    onTouchEnd={cancelHold}
                    onTouchCancel={cancelHold}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full min-h-[44px] px-8 py-3 rounded font-semibold relative overflow-hidden transition-colors duration-300 ease-out bg-[#00bfb3]/30 text-gray-800 cursor-pointer flex items-center justify-center text-center"
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
                    className="w-full min-h-[44px] px-8 py-3 rounded font-semibold bg-[#00bfb3]/15 text-gray-500 cursor-not-allowed text-center"
                  >
                    {t('ctaForm.holdToVerify')}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!verified || !phoneValid || submitting}
                  className="w-full min-h-[44px] bg-black text-white px-8 py-3 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out font-semibold mt-2 cursor-pointer"
                >
                  {submitting ? t('contact.form.sending') : t('pickupForm.submit')}
                </button>
                </form>
              </div>
              <p className="text-center mt-6">
                <Link
                  to="/services"
                  className="text-white underline hover:text-white/90 transition-colors"
                  onClick={scrollToTop}
                >
                  {t('ctaForm.backToWebsite')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
