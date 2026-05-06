import { Link } from 'react-router';
import { buttonClass } from '../../lib/button-classes';
import { scrollToTop } from '../../lib/utils';
import { SparkleIcon, HeartStraightIcon, ShieldIcon, SunHorizonIcon, TrophyIcon, UsersThreeIcon, WrenchIcon, HandHeartIcon } from '@phosphor-icons/react';
import { Card, CardContent } from '../components/Card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';
import { CharacterMorph } from '../../components/ui/character-morph';
import {
  communityInstagramEmbeds,
  instagramEmbedIframeSrc,
  type CommunityInstagramEmbed,
} from '../../data/community-instagram-embeds';

/**
 * Cross-origin: shift the iframe up so the embed header sits above the clip (overflow-hidden),
 * and mask only the bottom “View on Instagram” strip via clip-path.
 */
const instagramEmbedChrome: Record<
  CommunityInstagramEmbed['variant'],
  {
    iframeTopOffset: number;
    clipPathBottom: number;
    frameClass: string;
    iframeHeight: number;
  }
> = {
  photo: {
    iframeTopOffset: 54,
    clipPathBottom: 38,
    frameClass: 'w-full h-[min(85vh,520px)] sm:h-[520px]',
    iframeHeight: 1400,
  },
  reel: {
    // Pull up slightly more than photo: embed header chrome reads ~10px taller on reels.
    iframeTopOffset: 62,
    clipPathBottom: 50,
    frameClass: 'w-full h-[min(88vh,604px)] sm:h-[604px]',
    iframeHeight: 1550,
  },
};

function CroppedInstagramEmbed({
  embed,
  title,
  autoplay,
  loading,
}: {
  embed: CommunityInstagramEmbed;
  title: string;
  autoplay: boolean;
  loading: 'eager' | 'lazy';
}) {
  const { iframeTopOffset, clipPathBottom, frameClass, iframeHeight } = instagramEmbedChrome[embed.variant];
  const src = instagramEmbedIframeSrc(embed.src, { autoplay });
  const clipPath = `inset(0 0 ${clipPathBottom}px 0)`;

  return (
    <div
      className={`relative overflow-hidden bg-white p-0 ${frameClass}`}
    >
      <iframe
        title={title}
        src={src}
        className="absolute left-0 right-0 w-full max-w-none border-0 p-0"
        style={{
          top: -iframeTopOffset,
          height: iframeHeight,
          clipPath,
          WebkitClipPath: clipPath,
        }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        loading={loading}
      />
    </div>
  );
}

export function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { Icon: HeartStraightIcon, titleKey: 'about.values.customerFirst', descKey: 'about.values.customerFirstDesc' },
    { Icon: ShieldIcon, titleKey: 'about.values.quality', descKey: 'about.values.qualityDesc' },
    { Icon: TrophyIcon, titleKey: 'about.values.professional', descKey: 'about.values.professionalDesc' },
    { Icon: UsersThreeIcon, titleKey: 'about.values.community', descKey: 'about.values.communityDesc' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/about-hero-mobile.png"
            alt={t('common.heroAlt')}
            className="block md:hidden w-full h-full object-cover"
          />
          <img
            src="/images/01-about-hero.png"
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              <CharacterMorph texts={[t('about.hero.title')]} />
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-[450px] mb-8">
              {t('about.hero.subtitle')}
            </p>
            <Link
              to="/pricing"
              className={`${buttonClass.heroCta} block w-full md:w-auto md:inline-block bg-[#00bfb3] text-white px-8 py-4 rounded hover:bg-[#00a89d] transition-colors text-center`}
              onClick={scrollToTop}
            >
              {t('about.hero.exploreServices')}
            </Link>
          </div>
        </div>
      </section>

      {/* The Maytag Standard */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">{t('about.maytagStandard.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-balance">
                {t('about.maytagStandard.p1')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4 text-balance">
                {t('about.maytagStandard.p2')}
              </p>
            </div>
            <div>
              <img
                src="/images/the-maytag-standard.jpg"
                alt={t('common.imageAlt.laundromat')}
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">{t('about.values.title')}</h2>
            <p className="text-lg sm:text-xl font-semibold text-black max-w-2xl mx-auto mb-4">
              {t('about.values.subtitle')}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-balance">
              {t('about.values.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.Icon;
              return (
                <Card key={index} hover>
                  <CardContent className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00bfb3]/10 rounded-full mb-4">
                      <IconComponent className="w-10 h-10 text-[#00bfb3]" weight="regular" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">{t(value.titleKey)}</h3>
                    <p className="text-gray-600">{t(value.descKey)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Journey - Two-column section
      <section className="py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">Our Journey</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-balance">
                Maytag Coin Laundry Raleigh was founded in 2010 with a simple mission: to provide the Raleigh community with a clean, modern, and welcoming place to do laundry. What started as a small neighborhood laundromat has grown into a full-service facility trusted by thousands of customers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to be locally owned and operated, serving families, students, professionals, and businesses throughout Raleigh and the surrounding areas. Our commitment to excellence has made us a cornerstone of the community.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Our team and community"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Equipment Section - 2-column layout */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              {t('about.equipment.sectionTitle')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              {t('about.equipment.sectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card image={{ src: '/images/01-washer.jpg', alt: 'High-efficiency Maytag washers', objectPosition: 'top' }}>
              <CardContent>
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 bg-[#00bfb3]/10 rounded-full flex-shrink-0 text-[#00bfb3]">
                  <SparkleIcon size={24} weight="regular" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-black">{t('about.equipment.smartLaundry.title')}</h3>
                <p className="text-sm leading-relaxed text-[#363d4f]">
                  {t('about.equipment.smartLaundry.desc')}
                </p>
              </CardContent>
            </Card>

            <Card image={{ src: '/images/dryers.jpg', alt: 'Commercial Maytag dryers' }}>
              <CardContent>
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 bg-[#00bfb3]/10 rounded-full flex-shrink-0 text-[#00bfb3]">
                  <UsersThreeIcon size={24} weight="regular" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-black">{t('about.equipment.community.title')}</h3>
                <p className="text-sm leading-relaxed text-[#363d4f]">
                  {t('about.equipment.community.desc')}
                </p>
              </CardContent>
            </Card>

            <Card image={{ src: '/images/maintenance.png', alt: 'Professional equipment maintenance', objectPosition: 'top' }}>
              <CardContent>
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 bg-[#00bfb3]/10 rounded-full flex-shrink-0 text-[#00bfb3]">
                  <HandHeartIcon size={24} weight="regular" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-black">{t('about.equipment.care.title')}</h3>
                <p className="text-sm leading-relaxed text-[#363d4f]">
                  {t('about.equipment.care.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community / Instagram embeds */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="about-community-feed-heading">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2
              id="about-community-feed-heading"
              className="mb-4 text-3xl font-bold text-black text-balance sm:text-4xl"
            >
              {t('about.communityFeed.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-gray-600">
              {t('about.communityFeed.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communityInstagramEmbeds.map((embed, index) => (
              <div
                key={`${embed.src}-${index}`}
                className={`flex w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_2px_rgba(0,0,0,0.04)] ${
                  embed.variant === 'reel' ? 'max-w-none' : 'max-w-[400px]'
                } md:max-w-none`}
              >
                <CroppedInstagramEmbed
                  embed={embed}
                  title={`${t('about.communityFeed.embedTitle')} ${index + 1}`}
                  autoplay={embed.variant === 'reel'}
                  loading={index === 1 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[#00bfb3]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <a
            href="https://www.google.com/maps?q=15+Jones+Franklin+Rd,+Raleigh,+NC+27606"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white font-medium text-black px-8 py-4 rounded hover:bg-gray-200 transition-colors"
          >
            {t('about.cta.button')}
          </a>
        </div>
      </section>
    </div>
  );
}
