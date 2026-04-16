import { useState } from 'react';
import { Link } from 'react-router';
import {
  WifiHighIcon,
  ArmchairIcon,
  ShoppingCartIcon,
  SecurityCameraIcon,
  CarIcon,
  UserIcon,
  WashingMachineIcon,
  TShirtIcon,
  PawPrintIcon,
  VanIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useLanguage } from '../context/LanguageContext';
import { CharacterMorph } from '../../components/ui/character-morph';
import { buttonClass } from '../../lib/button-classes';
import { cn, HOME_SUBSCRIPTION_PRICES_HASH, scrollToTop } from '../../lib/utils';
import { SubscriptionPlanModal } from '../components/SubscriptionPlanModal';

const STORE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=15+Jones+Franklin+Rd,+Raleigh,+NC+27606';

const amenitiesConfig = [
  { Icon: WifiHighIcon, labelKey: 'services.amenities.wifi' as const },
  { Icon: ArmchairIcon, labelKey: 'services.amenities.seating' as const },
  { Icon: ShoppingCartIcon, labelKey: 'services.amenities.folding' as const },
  { Icon: SecurityCameraIcon, labelKey: 'services.amenities.security' as const },
  { Icon: CarIcon, labelKey: 'services.amenities.parking' as const },
  { Icon: UserIcon, labelKey: 'services.amenities.attendant' as const },
];

const amenitiesImages = [
  '/images/amenities-2.png',
  '/images/amenities-3.png',
  '/images/amenities-4.png',
  '/images/amenities-5.png',
  '/images/amenities-6.png',
  '/images/amenities-7.png',
];

/** Mobile: one hero image/video. sm+: three-image row (main + two stacked). */
const SERVICE_MEDIA_MOBILE =
  'h-[300px] w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-lg sm:hidden';
const SERVICE_MEDIA_GRID =
  'hidden h-[500px] flex-shrink-0 flex-row items-stretch gap-4 sm:flex';
const SERVICE_MEDIA_MAIN =
  'flex h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg bg-gray-100 shadow-lg';
const SERVICE_MEDIA_MAIN_COVER = 'h-full w-full min-h-0 object-cover object-center';
const SERVICE_MEDIA_STACK = 'flex h-full min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-4';
const SERVICE_MEDIA_STACK_CELL =
  'min-h-0 flex-1 overflow-hidden rounded-lg bg-gray-100 shadow-md';
const SERVICE_MEDIA_STACK_IMG = 'h-full w-full object-cover object-center';

const SERVICE_PANEL_ROW =
  'flex flex-col gap-10 md:flex-row md:items-stretch md:gap-8 lg:gap-12';
const SERVICE_PANEL_MEDIA = 'order-1 w-full md:order-1 md:min-w-0 md:flex-1';
const SERVICE_PANEL_COPY =
  'order-2 flex w-full flex-col justify-center md:order-2 md:min-w-0 md:flex-1';

/** Tab CTAs: `.btn-primary` (56px height, 4px radius — see `buttons.css` tokens). */
const SERVICE_TAB_CTA_CLASS = [buttonClass.primary, 'w-full gap-2 sm:w-fit'].join(' ');

/** Same as homepage “Have more questions” cards: 48px teal-tint circle + 24px icon */
const TAB_ICON_WRAP =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-data-[state=active]:bg-[#00bfb3]/10';
const TAB_ICON_CLASS =
  'size-6 shrink-0 text-gray-500 transition-colors group-data-[state=active]:text-[#00bfb3]';

function SectionEyebrow({ tagline }: { tagline: string }) {
  return (
    <div className="mb-3 text-[#00bfb3] uppercase tracking-wide font-bold text-sm sm:text-base">
      {tagline}
    </div>
  );
}

function ServicesTabLabel({
  t,
  desktopKey,
  line1Key,
  line2Key,
}: {
  t: (key: string) => string;
  desktopKey: string;
  line1Key: string;
  line2Key: string;
}) {
  return (
    <>
      <span className="hidden text-center text-sm font-medium leading-tight sm:block">{t(desktopKey)}</span>
      <span className="grid w-full min-w-0 justify-items-center gap-0.5 text-center text-[11px] font-medium leading-snug sm:hidden">
        <span className="block max-w-full break-words">{t(line1Key)}</span>
        <span className="block max-w-full break-words">{t(line2Key)}</span>
      </span>
    </>
  );
}

type ServiceSectionPrefix =
  | 'services.section.selfService'
  | 'services.section.washFold'
  | 'services.section.pet'
  | 'services.section.pickup';

function ServiceSectionBodyBlock({
  t,
  sectionPrefix,
}: {
  t: (key: string) => string;
  sectionPrefix: ServiceSectionPrefix;
}) {
  return (
    <>
      <p className="mb-8 leading-relaxed text-gray-700 sm:hidden">{t(`${sectionPrefix}.body.mobile`)}</p>
      <p className="mb-6 leading-relaxed text-gray-700 hidden sm:block">{t(`${sectionPrefix}.body1`)}</p>
      <p className="mb-8 leading-relaxed text-gray-700 hidden sm:block">{t(`${sectionPrefix}.body2`)}</p>
    </>
  );
}

export function ServicesPage() {
  const { t } = useLanguage();
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const tabTriggerClass =
    'group flex min-w-0 flex-1 basis-0 flex-col items-center gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent p-2 text-gray-500 shadow-none transition-colors data-[state=active]:border-[#00bfb3] data-[state=active]:text-[#00bfb3] data-[state=inactive]:text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bfb3] focus-visible:ring-offset-2 sm:gap-2';

  return (
    <div className="bg-white overflow-x-hidden">
      <section className="relative flex min-h-screen items-end text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/services-mobile-hero.png"
            alt={t('common.heroAlt')}
            className="block h-full w-full object-cover object-center md:hidden"
          />
          <img
            src="/images/services-hero.png"
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
        <div className="relative mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-balance text-4xl font-bold sm:text-5xl lg:text-6xl">
              <CharacterMorph texts={[t('services.hero.title')]} />
            </h1>
            <p className="mb-8 max-w-[450px] text-lg text-gray-200 sm:text-xl">{t('services.hero.subtitle')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to={`/${HOME_SUBSCRIPTION_PRICES_HASH}`}
                className={`${buttonClass.heroCta} inline-flex h-14 w-full items-center justify-center rounded border border-white/80 bg-black/50 px-8 font-medium text-white transition-colors hover:bg-white hover:text-black md:w-auto`}
              >
                {t('home.hero.subscribe')}
              </Link>
              <button
                type="button"
                className={`${buttonClass.heroCta} inline-flex h-14 w-full cursor-pointer items-center justify-center rounded border border-transparent bg-[#00bfb3] px-8 text-white transition-colors hover:bg-[#00a89d] md:w-auto`}
                onClick={() => setPlanModalOpen(true)}
              >
                {t('home.hero.schedulePickup')}
              </button>
            </div>
          </div>
        </div>
        <SubscriptionPlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
      </section>

      {/* Tabbed services */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Tabs defaultValue="self-service" className="w-full gap-0">
            <div className="w-full pb-2 sm:pb-px">
              <TabsList
                className={cn(
                  'flex h-auto w-full min-w-0 gap-0 rounded-none border-0 border-b border-gray-200 bg-transparent p-0 text-inherit shadow-none'
                )}
              >
                <TabsTrigger value="self-service" className={tabTriggerClass}>
                  <span className={TAB_ICON_WRAP} aria-hidden>
                    <WashingMachineIcon className={TAB_ICON_CLASS} weight="regular" />
                  </span>
                  <ServicesTabLabel
                    t={t}
                    desktopKey="services.tabs.selfService"
                    line1Key="services.tabs.mobile.selfService.line1"
                    line2Key="services.tabs.mobile.selfService.line2"
                  />
                </TabsTrigger>
                <TabsTrigger value="wash-fold" className={tabTriggerClass}>
                  <span className={TAB_ICON_WRAP} aria-hidden>
                    <TShirtIcon className={TAB_ICON_CLASS} weight="regular" />
                  </span>
                  <ServicesTabLabel
                    t={t}
                    desktopKey="services.tabs.washFold"
                    line1Key="services.tabs.mobile.washFold.line1"
                    line2Key="services.tabs.mobile.washFold.line2"
                  />
                </TabsTrigger>
                <TabsTrigger value="pet" className={tabTriggerClass}>
                  <span className={TAB_ICON_WRAP} aria-hidden>
                    <PawPrintIcon className={TAB_ICON_CLASS} weight="regular" />
                  </span>
                  <ServicesTabLabel
                    t={t}
                    desktopKey="services.tabs.pet"
                    line1Key="services.tabs.mobile.pet.line1"
                    line2Key="services.tabs.mobile.pet.line2"
                  />
                </TabsTrigger>
                <TabsTrigger value="pickup" className={tabTriggerClass}>
                  <span className={TAB_ICON_WRAP} aria-hidden>
                    <VanIcon className={TAB_ICON_CLASS} weight="regular" />
                  </span>
                  <ServicesTabLabel
                    t={t}
                    desktopKey="services.tabs.pickup"
                    line1Key="services.tabs.mobile.pickup.line1"
                    line2Key="services.tabs.mobile.pickup.line2"
                  />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="self-service" className="mt-10 outline-none">
              <div className={SERVICE_PANEL_ROW}>
                <div className={SERVICE_PANEL_MEDIA}>
                  <div className={SERVICE_MEDIA_MOBILE}>
                    <img
                      src="/images/self-service-laundromat-main.png"
                      alt={t('services.alt.selfServiceMain')}
                      className={cn(SERVICE_MEDIA_MAIN_COVER, 'object-[center_20%]')}
                    />
                  </div>
                  <div className={SERVICE_MEDIA_GRID}>
                    <div className={SERVICE_MEDIA_MAIN}>
                      <img
                        src="/images/self-service-laundromat-main.png"
                        alt={t('services.alt.selfServiceMain')}
                        className={SERVICE_MEDIA_MAIN_COVER}
                      />
                    </div>
                    <div className={SERVICE_MEDIA_STACK}>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/self-service-side-payment.png"
                          alt={t('services.alt.selfServicePayment')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/self-service-side-dexter.png"
                          alt={t('services.alt.selfServiceTerminal')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={SERVICE_PANEL_COPY}>
                  <SectionEyebrow tagline={t('services.section.selfService.tagline')} />
                  <h2 className="mb-6 text-balance text-3xl font-bold text-black sm:text-4xl">
                    {t('services.section.selfService.heading')}
                  </h2>
                  <ServiceSectionBodyBlock t={t} sectionPrefix="services.section.selfService" />
                  <a
                    href={STORE_MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SERVICE_TAB_CTA_CLASS}
                  >
                    {t('home.services.cardCta.Card01')}
                    <ArrowRightIcon className="size-5" weight="bold" />
                  </a>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wash-fold" className="mt-10 outline-none">
              <div className={SERVICE_PANEL_ROW}>
                <div className={SERVICE_PANEL_MEDIA}>
                  <div className={SERVICE_MEDIA_MOBILE}>
                    <img
                      src="/images/maintenance.png"
                      alt={t('services.alt.washFoldHero')}
                      className={cn(SERVICE_MEDIA_MAIN_COVER, 'object-[center_10%]')}
                    />
                  </div>
                  <div className={SERVICE_MEDIA_GRID}>
                    <div className={SERVICE_MEDIA_MAIN}>
                      <img
                        src="/images/wash-fold-hero.png"
                        alt={t('services.alt.washFoldHero')}
                        className={SERVICE_MEDIA_MAIN_COVER}
                      />
                    </div>
                    <div className={SERVICE_MEDIA_STACK}>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/wash-fold-towels.png"
                          alt={t('services.alt.washFoldTowels')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/wash-fold-bag.png"
                          alt={t('services.alt.washFoldBag')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={SERVICE_PANEL_COPY}>
                  <SectionEyebrow tagline={t('services.section.washFold.tagline')} />
                  <h2 className="mb-6 text-balance text-3xl font-bold text-black sm:text-4xl">
                    {t('services.section.washFold.heading')}
                  </h2>
                  <ServiceSectionBodyBlock t={t} sectionPrefix="services.section.washFold" />
                  <Link
                    to="/subscriptions"
                    className={SERVICE_TAB_CTA_CLASS}
                    onClick={scrollToTop}
                  >
                    {t('home.services.cardCta.Card02')}
                    <ArrowRightIcon className="size-5" weight="bold" />
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pet" className="mt-10 outline-none">
              <div className={SERVICE_PANEL_ROW}>
                <div className={SERVICE_PANEL_MEDIA}>
                  <div className={SERVICE_MEDIA_MOBILE}>
                    <img
                      src="/images/pet-laundry-washer.png"
                      alt={t('services.alt.petWasher')}
                      className={cn(SERVICE_MEDIA_MAIN_COVER, 'object-[center_25%]')}
                    />
                  </div>
                  <div className={SERVICE_MEDIA_GRID}>
                    <div className={SERVICE_MEDIA_MAIN}>
                      <img
                        src="/images/pet-laundry-washer.png"
                        alt={t('services.alt.petWasher')}
                        className={SERVICE_MEDIA_MAIN_COVER}
                      />
                    </div>
                    <div className={SERVICE_MEDIA_STACK}>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/pet-laundry-hero.png"
                          alt={t('services.alt.petHero')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/pet-laundry-dog-toy.png"
                          alt={t('services.alt.petToy')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={SERVICE_PANEL_COPY}>
                  <SectionEyebrow tagline={t('services.section.pet.tagline')} />
                  <h2 className="mb-6 text-balance text-3xl font-bold text-black sm:text-4xl">
                    {t('services.section.pet.heading')}
                  </h2>
                  <ServiceSectionBodyBlock t={t} sectionPrefix="services.section.pet" />
                  <Link
                    to="/schedule-pickup"
                    className={SERVICE_TAB_CTA_CLASS}
                    onClick={scrollToTop}
                  >
                    {t('home.services.cardCta.Card04')}
                    <ArrowRightIcon className="size-5" weight="bold" />
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pickup" className="mt-10 outline-none">
              <div className={SERVICE_PANEL_ROW}>
                <div className={SERVICE_PANEL_MEDIA}>
                  <div className={SERVICE_MEDIA_MOBILE}>
                    <img
                      src="/images/home-services-delivery.jpg"
                      alt={t('services.alt.pickupVideo')}
                      className={SERVICE_MEDIA_MAIN_COVER}
                    />
                  </div>
                  <div className={SERVICE_MEDIA_GRID}>
                    <div className={SERVICE_MEDIA_MAIN}>
                      <video
                        className={SERVICE_MEDIA_MAIN_COVER}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/images/free-pickup-delivery.png"
                        aria-label={t('services.alt.pickupVideo')}
                      >
                        <source src="/videos/pickup-delivery.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className={SERVICE_MEDIA_STACK}>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/hero-storefront.png"
                          alt={t('services.alt.pickupStorefront')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                      <div className={SERVICE_MEDIA_STACK_CELL}>
                        <img
                          src="/images/home-services-delivery.jpg"
                          alt={t('services.alt.pickupDeliveryVan')}
                          className={SERVICE_MEDIA_STACK_IMG}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={SERVICE_PANEL_COPY}>
                  <SectionEyebrow tagline={t('services.pickupDelivery.tagline')} />
                  <h2 className="mb-6 text-balance text-3xl font-bold text-black sm:text-4xl">
                    {t('services.pickupDelivery.titleLine1')}{' '}
                    {t('services.pickupDelivery.titleLine2')}
                  </h2>
                  <ServiceSectionBodyBlock t={t} sectionPrefix="services.section.pickup" />
                  <Link
                    to="/schedule-pickup"
                    className={SERVICE_TAB_CTA_CLASS}
                    onClick={scrollToTop}
                  >
                    {t('home.services.cardCta.Card04')}
                    <ArrowRightIcon className="size-5" weight="bold" />
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-balance text-3xl font-bold text-black sm:text-4xl">{t('services.amenities.title')}</h2>
          </div>

          <div className="mx-auto grid w-full max-w-xs grid-cols-1 gap-x-8 gap-y-6 sm:mx-0 sm:max-w-none sm:grid-cols-3">
            {amenitiesConfig.map((amenity, index) => {
              const IconComponent = amenity.Icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00bfb3]/10 text-[#00bfb3]">
                    <IconComponent size={24} weight="regular" />
                  </div>
                  <div className="text-base font-medium leading-snug text-balance text-[#363d4f]">{t(amenity.labelKey)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 w-full">
          <div className="amenities-ticker">
            <div className="amenities-ticker__track">
              {[0, 1].map((groupIndex) => (
                <div className="amenities-ticker__group" key={groupIndex} aria-hidden={groupIndex === 1}>
                  {amenitiesImages.map((src, idx) => (
                    <div
                      key={`${groupIndex}-${idx}`}
                      className="h-40 min-w-[220px] flex-none overflow-hidden sm:h-48 sm:min-w-[260px] md:h-56 md:min-w-[320px] lg:h-64 lg:min-w-[360px]"
                    >
                      <img
                        src={src}
                        alt={t('services.alt.amenitiesGallery')}
                        className="h-full w-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#00bfb3] py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{t('services.cta.title')}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{t('services.cta.subtitle')}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:9842059506"
              className="inline-flex w-full items-center justify-center rounded bg-white px-8 py-4 font-medium text-black transition-colors hover:bg-gray-200 sm:w-auto"
            >
              {t('services.cta.callUs')}
            </a>
            <a
              href="https://www.google.com/maps?q=15+Jones+Franklin+Rd,+Raleigh,+NC+27606"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded border border-white/80 bg-transparent px-8 py-4 font-medium text-white transition-colors hover:bg-white hover:text-black sm:w-auto"
            >
              {t('services.cta.visitUs')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
