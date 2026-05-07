import { Star } from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { useLanguage } from '../context/LanguageContext';
import { CharacterMorph } from '@/components/ui/character-morph';
import {
  TestimonialAllReviewsSection,
  TestimonialStatsSection,
  TestimonialWhyLoveSection,
} from '../components/TestimonialPageSections';

export function TestimonialsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          {/* Mobile hero image — replace src with a portrait-cropped version when available */}
          <img
            src="/images/01-testimonial-hero-mobile.png"
            alt={t('common.heroAlt')}
            className="block md:hidden w-full h-full object-cover"
          />
          {/* Desktop hero image */}
          <img
            src="/images/testimonial-hero.png"
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance max-w-lg sm:max-w-2xl lg:max-w-3xl">
              <CharacterMorph
                texts={[t('testimonials.hero.title')]}
                className="block w-full max-w-full min-w-0 flex flex-wrap !whitespace-normal"
              />
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-[450px]">
              {t('testimonials.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <TestimonialStatsSection />

      {/* Featured Testimonial */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
          {/* Image */}
          <div className="w-full h-56 sm:w-64 sm:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
            <img
              src="/images/featured-testimonial.jpg"
              alt="Happy couple"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quote */}
          <blockquote className="relative pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-[#00bfb3]">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-800 text-lg leading-relaxed text-balance">
              {t('testimonials.review.1.text')}
            </p>
            <footer className="mt-4 flex items-center gap-2">
              <cite className="font-semibold text-black not-italic">{t('testimonials.review.1.name')}</cite>
              <span aria-hidden className="bg-gray-400 size-1 rounded-full" />
              <span className="text-gray-500">Verified Customer</span>
            </footer>
          </blockquote>
        </div>
      </section>

      <TestimonialAllReviewsSection />

      <TestimonialWhyLoveSection />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[#00bfb3]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('testimonials.cta.title')}
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            {t('testimonials.cta.subtitle')}
          </p>
          <a
            href="https://www.yelp.com/biz/maytag-coin-laundry-of-raleigh-raleigh-3?dd_referrer=https%3A%2F%2Fwww.google.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-8 py-4 rounded hover:bg-gray-100 transition-colors"
          >
            {t('testimonials.cta.button')}
          </a>
        </div>
      </section>
    </div>
  );
}
