import { useEffect, useState, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { buttonClass } from '../../lib/button-classes';
import {
  cn,
  HOME_SUBSCRIPTION_PRICES_HASH,
  scrollToHomeSubscriptionPricesSection,
  scrollToTop,
} from '../../lib/utils';
import { AreasMap } from '../components/AreasMap';
import { Star, MapPin, Clock, Phone, Hand, Check } from 'lucide-react';
import { ConfettiIcon, GiftIcon } from '@phosphor-icons/react';
import { Card, CardContent } from '../components/Card';
import { useLanguage } from '../context/LanguageContext';
import { CharacterMorph } from '../../components/ui/character-morph';
import { SubscriptionPlanModal } from '../components/SubscriptionPlanModal';
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '../../lib/subscription-plans';

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

const areas = [
  { nameKey: 'home.areas.raleigh', descKey: 'home.areas.raleighDesc' },
  { nameKey: 'home.areas.cary', descKey: 'home.areas.caryDesc' },
  { nameKey: 'home.areas.apex', descKey: 'home.areas.apexDesc' },
  { nameKey: 'home.areas.eastRaleigh', descKey: 'home.areas.eastRaleighDesc' },
  { nameKey: 'home.areas.westRaleigh', descKey: 'home.areas.westRaleighDesc' },
  { nameKey: 'home.areas.garner', descKey: 'home.areas.garnerDesc' },
] as const;

/** Google Maps — directions to storefront (same address as site footer / contact) */
const STORE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=15+Jones+Franklin+Rd,+Raleigh,+NC+27606';

const DEFAULT_HOME_PLAN: SubscriptionPlanId = 'couples';

export function HomePage() {
  const { t } = useLanguage();
  const location = useLocation();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [homePriceChoice, setHomePriceChoice] = useState<SubscriptionPlanId>(DEFAULT_HOME_PLAN);

  useEffect(() => {
    if (location.pathname !== '/' || location.hash !== HOME_SUBSCRIPTION_PRICES_HASH) return;
    const id = window.setTimeout(() => scrollToHomeSubscriptionPricesSection(), 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash]);

  const togglePlanChoice = (planId: SubscriptionPlanId) => {
    setHomePriceChoice((prev: SubscriptionPlanId) => (prev === planId ? DEFAULT_HOME_PLAN : planId));
  };

  const choiceKeyHandler = (action: () => void) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  useEffect(() => {
    // Canonical link
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://maytaglaundromat.com/';
    document.head.appendChild(canonical);

    // Homepage-specific JSON-LD schema
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'homepage-schema';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': ['WebPage', 'DryCleaningOrLaundry'],
      '@id': 'https://maytaglaundromat.com/#laundromat',
      url: 'https://maytaglaundromat.com/',
      name: 'Maytag Coin Laundry of Raleigh',
      mainEntityOfPage: 'https://maytaglaundromat.com/',
      description:
        'Modern Raleigh laundromat offering self-service laundry, wash dry fold, and convenient cashless and coin laundry options. Clean, affordable, and convenient laundry service in Raleigh, NC.',
      telephone: '+1-984-205-9506',
      priceRange: '$',
      paymentAccepted: 'Coins, Credit Card, Debit Card',
      currenciesAccepted: 'USD',
      foundingDate: '1995',
      knowsLanguage: ['English', 'Spanish'],
      image: ['https://maytaglaundromat.com/images/01-hero-image.png'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '15 Jones Franklin Rd',
        addressLocality: 'Raleigh',
        addressRegion: 'NC',
        postalCode: '27606',
        addressCountry: 'US',
      },
      areaServed: {
        '@type': 'City',
        name: 'Raleigh',
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Cashless payment', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Coin-operated machines', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Wash and fold service', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Restrooms', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Laundry Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Self-Service Laundromat',
              serviceType: 'Self-service laundry',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Wash Dry Fold Service',
              serviceType: 'Wash dry fold',
            },
          },
        ],
      },
      sameAs: [
        'PASTE-YOUR-GOOGLE-BUSINESS-PROFILE-URL-HERE',
        'PASTE-YOUR-FACEBOOK-URL-HERE',
        'PASTE-YOUR-INSTAGRAM-URL-HERE',
      ],
    });
    document.head.appendChild(schema);

    return () => {
      canonical.remove();
      schema.remove();
    };
  }, []);

  const testimonials = [
    { rating: 5, nameKey: 'home.testimonials.1.name', textKey: 'home.testimonials.1.text', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop&crop=faces&q=80' },
    { rating: 5, nameKey: 'home.testimonials.2.name', textKey: 'home.testimonials.2.text', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=faces&q=80' },
    { rating: 5, nameKey: 'home.testimonials.3.name', textKey: 'home.testimonials.3.text', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=faces&q=80' },
    { rating: 5, nameKey: 'home.testimonials.4.name', textKey: 'home.testimonials.4.text', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=faces&q=80' },
    { rating: 5, nameKey: 'home.testimonials.5.name', textKey: 'home.testimonials.5.text', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=faces&q=80' },
    { rating: 5, nameKey: 'home.testimonials.6.name', textKey: 'home.testimonials.6.text', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=faces&q=80' },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/01-homepage-hero-mobile.png"
            alt={t('common.heroAlt')}
            className="block md:hidden w-full h-full object-cover"
          />
          <img
            src="/images/01-hero-image.png"
            alt={t('common.heroAlt')}
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile: overlay from bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 md:hidden"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%)'
            }}
          />
          {/* Desktop: overlay from left */}
          <div
            className="hidden md:block absolute inset-y-0 left-0 w-3/5"
            style={{
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 100%)'
            }}
          />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-32 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance max-w-xl sm:max-w-2xl lg:max-w-3xl">
              <CharacterMorph
                texts={[t('home.hero.title')]}
                className="block w-full max-w-full min-w-0 flex flex-wrap !whitespace-normal"
              />
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-[450px] mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/${HOME_SUBSCRIPTION_PRICES_HASH}`}
                className={`${buttonClass.heroCta} inline-flex h-14 w-full items-center justify-center box-border rounded border border-white/80 bg-black/50 px-8 text-center font-medium text-white transition-colors hover:bg-white hover:text-black md:w-auto`}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    scrollToHomeSubscriptionPricesSection();
                    window.history.replaceState(null, '', HOME_SUBSCRIPTION_PRICES_HASH);
                  }
                }}
              >
                {t('home.hero.subscribe')}
              </Link>
              <button
                type="button"
                className={`${buttonClass.heroCta} inline-flex h-14 w-full cursor-pointer items-center justify-center box-border rounded border border-transparent bg-[#00bfb3] px-8 text-white transition-colors hover:bg-[#00a89d] md:w-auto`}
                onClick={() => setPlanModalOpen(true)}
              >
                {t('home.hero.schedulePickup')}
              </button>
            </div>
          </div>
        </div>
        <SubscriptionPlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">{t('home.services.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-balance">
              {t('home.services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 xl:grid-cols-4">
            <Card
              image={{
                src: '/images/self-service-laundry.jpg',
                alt: 'Self-Service Laundry',
                heightClass: 'h-[300px]',
                objectPosition: 'center',
              }}
              hover
              className="group flex flex-col"
            >
              <CardContent className="flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-black mb-3">{t('home.services.selfService.title')}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm text-balance">{t('home.services.selfService.description')}</p>
                  {/* <div className="space-y-2">
                    {[
                      'home.services.selfService.feature1',
                      'home.services.selfService.feature2',
                      'home.services.selfService.feature3',
                      'home.services.selfService.feature4',
                    ].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <CircleCheck className="w-5 h-5 flex-shrink-0 text-white fill-[#00bfb3]" />
                        <p className="text-gray-700 text-sm font-semibold">{t(key)}</p>
                      </div>
                    ))}
                  </div> */}
                </div>
                <div className="mt-6 w-full">
                  <a
                    href={STORE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass.serviceCardCta}
                  >
                    {t('home.services.cardCta.Card01')}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card
              image={{
                src: '/images/01-wash-fold-service.png',
                alt: 'Wash and Fold Service',
                heightClass: 'h-[300px]',
                objectPosition: 'center',
              }}
              hover
              className="group flex flex-col"
            >
              <CardContent className="flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-black mb-3">{t('home.services.washFold.title')}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm text-balance">{t('home.services.washFold.description')}</p>
                  {/* <div className="space-y-2">
                    {[
                      'home.services.washFold.feature1',
                      'home.services.washFold.feature2',
                      'home.services.washFold.feature3',
                      'home.services.washFold.feature4',
                    ].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <CircleCheck className="w-5 h-5 flex-shrink-0 text-white fill-[#00bfb3]" />
                        <p className="text-gray-700 text-sm font-semibold">{t(key)}</p>
                      </div>
                    ))}
                  </div> */}
                </div>
                <div className="mt-6 w-full">
                  <Link
                    to="/subscriptions"
                    className={buttonClass.serviceCardCta}
                    onClick={scrollToTop}
                  >
                    {t('home.services.cardCta.Card02')}
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card
              image={{
                src: '/images/pet-laundry-washer.png',
                alt: 'Pet laundry service',
                heightClass: 'h-[300px]',
                objectPosition: 'center',
              }}
              hover
              className="group flex flex-col"
            >
              <CardContent className="flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-black mb-3">{t('home.services.petLaundry.title')}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm text-balance">{t('home.services.petLaundry.description')}</p>
                  {/* <div className="space-y-2">
                    {[
                      'home.services.petLaundry.feature1',
                      'home.services.petLaundry.feature2',
                      'home.services.petLaundry.feature3',
                      'home.services.petLaundry.feature4',
                    ].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <CircleCheck className="w-5 h-5 flex-shrink-0 text-white fill-[#00bfb3]" />
                        <p className="text-gray-700 text-sm font-semibold">{t(key)}</p>
                      </div>
                    ))}
                  </div> */}
                </div>
                <div className="mt-6 w-full">
                  <Link
                    to="/schedule-pickup"
                    className={buttonClass.serviceCardCta}
                    onClick={scrollToTop}
                  >
                    {t('home.services.cardCta.Card04')}
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card
              image={{
                src: '/images/home-services-delivery.jpg',
                alt: 'Free Pickup and Delivery',
                heightClass: 'h-[300px]',
                objectPosition: 'center',
              }}
              hover
              className="group flex flex-col"
            >
              <CardContent className="flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-black mb-3">{t('home.services.pickupDelivery.title')}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{t('home.services.pickupDelivery.description')}</p>
                  {/* <div className="space-y-2">
                    {[
                      'home.services.pickupDelivery.feature1',
                      'home.services.pickupDelivery.feature2',
                      'home.services.pickupDelivery.feature3',
                      'home.services.pickupDelivery.feature4',
                    ].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <CircleCheck className="w-5 h-5 flex-shrink-0 text-white fill-[#00bfb3]" />
                        <p className="text-gray-700 text-sm font-semibold">{t(key)}</p>
                      </div>
                    ))}
                  </div> */}
                </div>
                <div className="mt-6 w-full">
                  <Link
                    to="/schedule-pickup"
                    className={buttonClass.serviceCardCta}
                    onClick={scrollToTop}
                  >
                    {t('home.services.cardCta.Card04')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription plans (same content layout as subscriptions page; cards + global styles only) */}
      <section
        id="home-subscription-prices"
        className="scroll-mt-24 py-16 sm:py-20 bg-gray-50"
        aria-labelledby="home-subscriptions-heading"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
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

          <div className="w-full min-w-0 lg:mx-auto lg:max-w-[50rem]">
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
              <Link
                to={`/subscriptions?plan=${homePriceChoice}`}
                className={buttonClass.primary}
                onClick={scrollToTop}
              >
                {t('home.prices.unlockBenefits')}
              </Link>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10 lg:mt-12 lg:pt-12">
              <div className="mb-6 text-center sm:mb-8 lg:mb-10">
                <h3 className="text-2xl font-bold text-black text-balance sm:text-4xl">
                  {t('home.prices.payAsYouGo.title')}
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-gray-600 sm:text-base">
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
                      {t('home.prices.payAsYouGo.subtitle')}
                    </p>
                    <div className="-mx-1 mt-4 overflow-x-auto">
                      <table className="w-full min-w-[260px] border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th
                              scope="col"
                              className="py-2 pr-3 text-left text-sm font-medium text-gray-900 sm:text-base"
                            >
                              {t('subscriptions.table.service')}
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
                <button
                  type="button"
                  className={buttonClass.primary}
                  onClick={() => setPlanModalOpen(true)}
                >
                  {t('home.hero.schedulePickup')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Served Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 text-balance">{t('home.areas.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-balance">
              {t('home.areas.subtitle')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* Left: Service areas map */}
            <AreasMap className="w-full aspect-[4/3] lg:w-[420px] lg:h-[315px] lg:flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border border-gray-200" />

            {/* Right: Areas served list */}
            <div className="w-full lg:w-auto flex flex-col gap-4">
              <ul className="space-y-2">
                {areas.map((area) => (
                  <li key={area.nameKey} className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bfb3] flex-shrink-0" />
                    <span className="font-medium text-black whitespace-nowrap">{t(area.nameKey)}</span>
                    <span className="text-gray-500 flex-shrink-0">—</span>
                    <span className="text-gray-600 whitespace-nowrap">{t(area.descKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Have More Questions Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3">{t('home.questions.title')}</h3>
            <p className="text-gray-600 max-w-xl mx-auto text-balance">
              {t('home.questions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Find Us → Google Maps */}
            <a
              href="https://www.google.com/maps?q=15+Jones+Franklin+Rd,+Raleigh,+NC+27606"
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card hover className="h-full">
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00bfb3]/10 rounded-full">
                      <MapPin className="w-6 h-6 text-[#00bfb3]" />
                    </div>
                    <h4 className="font-bold text-black text-lg">{t('home.questions.findUs')}</h4>
                  </div>
                  <p className="text-gray-600 h-full">{t('home.questions.address')}</p>
                </CardContent>
              </Card>
            </a>

            {/* When We're Open → Yelp */}
            <a
              href="https://www.yelp.com/biz/maytag-coin-laundry-of-raleigh-raleigh-3?dd_referrer=https%3A%2F%2Fwww.google.com%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card hover className="h-full">
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00bfb3]/10 rounded-full">
                      <Clock className="w-6 h-6 text-[#00bfb3]" />
                    </div>
                    <h4 className="font-bold text-black text-lg">{t('home.questions.whenOpen')}</h4>
                  </div>
                  <p className="text-gray-600 text-balance">{t('home.questions.hours')}</p>
                </CardContent>
              </Card>
            </a>

            {/* Get in Touch → Call */}
            <a className="block h-full">
              <Card hover className="h-full">
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00bfb3]/10 rounded-full">
                      <Hand className="w-6 h-6 text-[#00bfb3]" />
                    </div>
                    <h4 className="font-bold text-black text-lg">{t('home.questions.getInTouch')}</h4>
                  </div>
                  <p className="text-gray-600">{t('home.questions.phone')}</p>
                  <p className="text-gray-600 mt-2">{t('home.questions.email')}</p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-balance">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
        </div>

        {/* Ticker Animation Container */}
        <div className="relative">
          <div className="flex animate-ticker">
            {/* First set of testimonials */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-[400px] mx-4 flex"
              >
                <div className="w-28 flex-shrink-0 self-stretch">
                  <img
                    src={testimonial.image}
                    alt={t(testimonial.nameKey)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 p-6 flex flex-col justify-center">
                  <p className="font-semibold text-black mb-1">{t(testimonial.nameKey)}</p>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00bfb3] text-[#00bfb3]" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{t(testimonial.textKey)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-ticker {
            animation: ticker 15s linear infinite;
          }
          .animate-ticker:hover {
            animation-play-state: paused;
          }
          @media (max-width: 767px) {
            .animate-ticker {
              animation: ticker 5s linear infinite;
            }
          }
        `}</style>
      </section>

      {/* CTA Section
      <section className="py-16 sm:py-20 bg-[#00bfb3]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {t('home.cta.title1')}
          </h1>
          <p className="text-white text-lg mb-8 max-w-xl mx-auto text-balance">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/claim"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded hover:bg-gray-200 transition-colors"
            onClick={scrollToTop}
          >
            <GiftIcon size={20} weight="bold" />
            {t('home.cta.button')}
          </Link>
        </div>
      </section> */}
    </div>
  );
}
