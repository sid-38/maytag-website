import { useRef } from 'react';
import { useInView } from 'motion/react';
import { Star } from 'lucide-react';
import { DropIcon, WrenchIcon, UsersThreeIcon, TrophyIcon } from '@phosphor-icons/react';
import { Card, CardContent } from './Card';
import { SlidingNumber } from './SlidingNumber';
import { TestimonialsColumn } from './TestimonialsColumn';
import { useLanguage } from '../context/LanguageContext';

const TESTIMONIAL_REVIEW_KEYS = [
  { nameKey: 'testimonials.review.1.name', textKey: 'testimonials.review.1.text', rating: 5 },
  { nameKey: 'testimonials.review.2.name', textKey: 'testimonials.review.2.text', rating: 5 },
  { nameKey: 'testimonials.review.3.name', textKey: 'testimonials.review.3.text', rating: 5 },
  { nameKey: 'testimonials.review.4.name', textKey: 'testimonials.review.4.text', rating: 5 },
  { nameKey: 'testimonials.review.5.name', textKey: 'testimonials.review.5.text', rating: 5 },
  { nameKey: 'testimonials.review.6.name', textKey: 'testimonials.review.6.text', rating: 5 },
  { nameKey: 'testimonials.review.7.name', textKey: 'testimonials.review.7.text', rating: 5 },
  { nameKey: 'testimonials.review.8.name', textKey: 'testimonials.review.8.text', rating: 5 },
  { nameKey: 'testimonials.review.9.name', textKey: 'testimonials.review.9.text', rating: 5 },
];

const STATS = [
  { numericValue: 30, suffix: '+', labelKey: 'testimonials.stats.years' },
  { numericValue: 5, suffix: '', labelKey: 'testimonials.stats.rating' },
  { numericValue: 50, suffix: 'K+', labelKey: 'testimonials.stats.customers' },
] as const;

const WHY_LOVE_ITEMS = [
  { Icon: DropIcon, titleKey: 'testimonials.whyLove.clean', descKey: 'testimonials.whyLove.cleanDesc' },
  { Icon: WrenchIcon, titleKey: 'testimonials.whyLove.equipment', descKey: 'testimonials.whyLove.equipmentDesc' },
  { Icon: UsersThreeIcon, titleKey: 'testimonials.whyLove.staff', descKey: 'testimonials.whyLove.staffDesc' },
  { Icon: TrophyIcon, titleKey: 'testimonials.whyLove.value', descKey: 'testimonials.whyLove.valueDesc' },
];

export function TestimonialStatsSection() {
  const { t } = useLanguage();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <section className="py-12 bg-white" ref={statsRef}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-48">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-[54px] font-bold leading-none tabular-nums text-[#00bfb3] mb-2">
                <SlidingNumber value={statsInView ? stat.numericValue : 0} duration={1.5} />
                {stat.suffix !== '' && <span>{stat.suffix}</span>}
                {stat.labelKey === 'testimonials.stats.rating' && (
                  <Star className="size-10 shrink-0 fill-current text-yellow-400" aria-hidden />
                )}
              </div>
              <div className="text-gray-600">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialAllReviewsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">{t('testimonials.allReviews.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('testimonials.allReviews.subtitle')}</p>
        </div>
      </div>

      <div className="flex gap-6 justify-center max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
        <TestimonialsColumn
          testimonials={TESTIMONIAL_REVIEW_KEYS.filter((_, i) => i % 3 === 0).map(item => ({
            name: t(item.nameKey),
            text: t(item.textKey),
            rating: item.rating,
          }))}
          duration={18}
          className="w-full max-w-sm"
        />
        <TestimonialsColumn
          testimonials={TESTIMONIAL_REVIEW_KEYS.filter((_, i) => i % 3 === 1).map(item => ({
            name: t(item.nameKey),
            text: t(item.textKey),
            rating: item.rating,
          }))}
          duration={22}
          className="hidden md:block w-full max-w-sm"
        />
        <TestimonialsColumn
          testimonials={TESTIMONIAL_REVIEW_KEYS.filter((_, i) => i % 3 === 2).map(item => ({
            name: t(item.nameKey),
            text: t(item.textKey),
            rating: item.rating,
          }))}
          duration={16}
          className="hidden lg:block w-full max-w-sm"
        />
      </div>
    </section>
  );
}

export function TestimonialWhyLoveSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">{t('testimonials.whyLove.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('testimonials.whyLove.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_LOVE_ITEMS.map((item, index) => {
            const IconComponent = item.Icon;
            return (
              <Card key={index} hover>
                <CardContent className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00bfb3]/10 rounded-full mb-4">
                    <IconComponent className="w-10 h-10 text-[#00bfb3]" weight="regular" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{t(item.titleKey)}</h3>
                  <p className="text-gray-600">{t(item.descKey)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
