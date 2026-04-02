import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { scrollToTop } from '../../lib/utils';

function isValidUSPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith('1')) return true;
  return false;
}

const BAG_REFERENCE_URL =
  'https://www.cleanersupply.com/bags/wash-and-fold-laundry-bags/eco2go-large-30-gal-wash-and-fold-laundry-bags-20-x-14-x-15/#sku=wb1te';

const BAG_IMAGE_SRC = '/subscriptions-wash-fold-bag.jpg';

type PlanId = 'singles' | 'couples' | 'family';

const PLANS: { id: PlanId; nameKey: string; feature1Key: string; feature2Key: string; priceKey: string }[] = [
  {
    id: 'singles',
    nameKey: 'subscriptions.plan.singles.name',
    feature1Key: 'subscriptions.plan.singles.feature1',
    feature2Key: 'subscriptions.plan.singles.feature2',
    priceKey: 'subscriptions.plan.singles.price',
  },
  {
    id: 'couples',
    nameKey: 'subscriptions.plan.couples.name',
    feature1Key: 'subscriptions.plan.couples.feature1',
    feature2Key: 'subscriptions.plan.couples.feature2',
    priceKey: 'subscriptions.plan.couples.price',
  },
  {
    id: 'family',
    nameKey: 'subscriptions.plan.family.name',
    feature1Key: 'subscriptions.plan.family.feature1',
    feature2Key: 'subscriptions.plan.family.feature2',
    priceKey: 'subscriptions.plan.family.price',
  },
];

const NON_SUBSCRIPTION_ROWS: { labelKey: string; price: string }[] = [
  { labelKey: 'subscriptions.row.singleBag', price: '$30' },
  { labelKey: 'subscriptions.row.twin', price: '$25' },
  { labelKey: 'subscriptions.row.full', price: '$28' },
  { labelKey: 'subscriptions.row.queen', price: '$35' },
  { labelKey: 'subscriptions.row.king', price: '$38' },
];

export function SubscriptionsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('singles');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [showFieldError, setShowFieldError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const setPlan = (planId: PlanId) => {
    setSelectedPlan(planId);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setShowFieldError(false);
  };

  const handlePlanSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPlan(e.target.value as PlanId);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
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
    setFormSubmitted(true);
  };

  const handleSubmitAnother = () => {
    setFormSubmitted(false);
    setFormData({ name: '', phone: '' });
    setErrors({});
    setShowFieldError(false);
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col bg-[#00bfb3]">
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

      <div className="flex-1 flex justify-center px-4 py-6 sm:py-8 min-h-0">
        <div className="w-full max-w-lg space-y-6 pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 text-balance">
            {t('subscriptions.title')}
          </h1>
          <p className="text-white/90 text-center text-sm sm:text-base mb-2 text-balance">
            {t('subscriptions.subtitle')}
          </p>

          {formSubmitted ? (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4 text-center">
              <p className="text-lg font-bold text-black">{t('subscriptions.form.successTitle')}</p>
              <p className="text-gray-700 text-sm sm:text-base">{t('subscriptions.form.successMessage')}</p>
              <button
                type="button"
                onClick={handleSubmitAnother}
                className="mt-2 w-full min-h-[44px] bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {t('subscriptions.form.submitAnother')}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4"
              noValidate
            >
              <h2 className="text-lg font-bold text-black text-center">{t('subscriptions.form.title')}</h2>
              <div>
                <label htmlFor="subscription-name" className="block text-sm font-semibold text-black mb-1">
                  {t('contact.form.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subscription-name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-2.5 border rounded focus:outline-none transition-colors ${
                    showFieldError && !formData.name.trim()
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-[#00bfb3]'
                  }`}
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="subscription-phone" className="block text-sm font-semibold text-black mb-1">
                  {t('contact.form.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="subscription-phone"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className={`w-full px-4 py-2.5 border rounded focus:outline-none transition-colors ${
                    errors.phone || (showFieldError && !formData.phone.trim())
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-[#00bfb3]'
                  }`}
                  placeholder={t('contact.form.phonePlaceholder')}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="subscription-plan" className="block text-sm font-semibold text-black mb-1">
                  {t('subscriptions.form.planLabel')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="subscription-plan"
                  name="plan"
                  value={selectedPlan}
                  onChange={handlePlanSelectChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#00bfb3] transition-colors bg-white cursor-pointer"
                >
                  {PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {t(plan.nameKey)} — {t(plan.priceKey)}
                      {t('subscriptions.perMonth')}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {t('subscriptions.form.submit')}
              </button>
            </form>
          )}

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
              <div
                className="rounded-lg border-2 border-[#00bfb3] bg-[#00bfb3]/10 px-4 py-3 text-center"
                role="status"
              >
                <p className="text-sm sm:text-base font-semibold text-gray-900">{t('subscriptions.promo')}</p>
              </div>

              <div>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img
                    src={BAG_IMAGE_SRC}
                    alt={t('subscriptions.bagAlt')}
                    className="w-full h-48 sm:h-56 object-cover object-center"
                    loading="lazy"
                    width={900}
                    height={400}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600 text-center">{t('subscriptions.bagCaption')}</p>
                <p className="mt-1 text-center">
                  <a
                    href={BAG_REFERENCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#00bfb3] font-medium underline hover:text-[#00a89d]"
                  >
                    {t('subscriptions.bagReferenceLink')}
                  </a>
                </p>
              </div>

              <div>
                <h2 id="subscription-plans-heading" className="text-lg font-bold text-black text-center mb-4">
                  {t('subscriptions.plansHeading')}
                </h2>
                <div
                  id="subscription-plans-group"
                  className="space-y-3"
                  role="radiogroup"
                  aria-labelledby="subscription-plans-heading"
                >
                  {PLANS.map((plan) => {
                    const selected = selectedPlan === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setPlan(plan.id)}
                        className={`w-full text-left rounded-xl border-2 px-4 py-4 transition-all cursor-pointer ${
                          selected
                            ? 'border-[#00bfb3] bg-[#00bfb3]/10 ring-2 ring-[#00bfb3]/30 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-[#00bfb3]/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-black">{t(plan.nameKey)}</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                              <li>{t(plan.feature1Key)}</li>
                              <li>{t(plan.feature2Key)}</li>
                            </ul>
                          </div>
                          <div className="shrink-0 sm:text-right">
                            <span className="text-2xl font-bold text-[#00bfb3]">{t(plan.priceKey)}</span>
                            <span className="text-sm font-medium text-gray-600 ml-1">
                              {t('subscriptions.perMonth')}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-black">{t('subscriptions.nonSubscription.title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('subscriptions.nonSubscription.subtitle')}</p>
              </div>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[280px] text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th scope="col" className="text-left py-2 pr-4 font-semibold text-black">
                        {t('subscriptions.table.service')}
                      </th>
                      <th scope="col" className="text-right py-2 pl-4 font-semibold text-black whitespace-nowrap">
                        {t('subscriptions.table.price')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {NON_SUBSCRIPTION_ROWS.map((row) => (
                      <tr key={row.labelKey} className="border-b border-gray-100">
                        <td className="py-2.5 pr-4 text-gray-800">{t(row.labelKey)}</td>
                        <td className="py-2.5 pl-4 text-right font-semibold text-[#00bfb3] whitespace-nowrap">
                          {row.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="text-center">
            <Link
              to="/services"
              className="text-white underline hover:text-white/90 transition-colors"
              onClick={scrollToTop}
            >
              {t('ctaForm.backToWebsite')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
