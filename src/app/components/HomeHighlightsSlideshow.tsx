import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLocation } from 'react-router';
import {
  HOLIDAY_SECTION_HASH,
  HOLIDAY_SECTION_ID,
  HOLIDAY_SLIDE_EVENT,
  useHolidayPeriodActive,
} from '../../lib/holiday-period';
import { cn, scrollIntoViewByElementId } from '../../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { HolidayScheduleSlide } from './HolidayScheduleSlide';
import { StudentDiscountContent, StudentDiscountSection } from './StudentDiscountSection';

const AUTOPLAY_MS = 8000;
const SLIDE_COUNT = 2;
const HOLIDAY_SLIDE_INDEX = 1;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Homepage block under the hero.
 * - During the holiday window: a 2-slide autoplay slideshow (student discount → holiday schedule).
 * - Otherwise (after Jan 1, US Eastern): the plain student discount section.
 */
export function HomeHighlightsSlideshow() {
  const holidayActive = useHolidayPeriodActive();
  return holidayActive ? <HolidaySlideshow /> : <StudentDiscountSection />;
}

function HolidaySlideshow() {
  const { t } = useLanguage();
  const { hash } = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const [focusWithin, setFocusWithin] = useState(false);
  const [hovered, setHovered] = useState(false);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi]);

  // Autoplay. Depending on `selected` restarts the timer after every change (including manual ones),
  // so a dot click never gets immediately followed by an auto-advance. Pauses while the mouse is over
  // the section or keyboard focus is inside it; the timer starts fresh when it resumes.
  useEffect(() => {
    if (!emblaApi || reducedMotion || focusWithin || hovered) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, reducedMotion, focusWithin, hovered, selected]);

  // Keep links in the off-screen slide out of the tab order.
  useEffect(() => {
    slideRefs.current.forEach((el, index) => {
      el?.toggleAttribute('inert', index !== selected);
    });
  }, [selected]);

  // Banner click (already on the homepage) asks for the holiday slide.
  useEffect(() => {
    if (!emblaApi) return;
    const show = () => emblaApi.scrollTo(HOLIDAY_SLIDE_INDEX);
    window.addEventListener(HOLIDAY_SLIDE_EVENT, show);
    return () => window.removeEventListener(HOLIDAY_SLIDE_EVENT, show);
  }, [emblaApi]);

  // Banner click from another page lands here with the hash.
  useEffect(() => {
    if (!emblaApi || hash !== HOLIDAY_SECTION_HASH) return;
    emblaApi.scrollTo(HOLIDAY_SLIDE_INDEX, true);
    const id = window.setTimeout(() => scrollIntoViewByElementId(HOLIDAY_SECTION_ID), 0);
    return () => window.clearTimeout(id);
  }, [emblaApi, hash]);

  const goTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <section
      id={HOLIDAY_SECTION_ID}
      className="scroll-mt-20 bg-gray-50 py-16 sm:py-20"
      aria-roledescription="carousel"
      aria-label={t('home.slideshow.label')}
      // Mouse only: on touch screens a tap would leave "hover" stuck on and stop autoplay for good.
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setHovered(false)}
    >
      {/* Bottom padding / negative margin leaves room for the card shadow inside the clipped viewport */}
      <div
        ref={emblaRef}
        className="-mb-8 overflow-hidden pb-8"
        onFocus={() => setFocusWithin(true)}
        onBlur={() => setFocusWithin(false)}
      >
        <div className="flex" aria-live="off">
          {[<StudentDiscountContent key="student" />, <HolidayScheduleSlide key="holiday" />].map(
            (slide, index) => (
              <div
                key={index}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                className="min-w-0 shrink-0 grow-0 basis-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${SLIDE_COUNT}`}
              >
                {slide}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => {
          const active = index === selected;
          return (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`${t('home.slideshow.goTo')} ${index + 1}`}
              aria-current={active ? 'true' : undefined}
              className="group cursor-pointer p-2"
            >
              <span
                className={cn(
                  'block h-2.5 rounded-full transition-all duration-300',
                  active ? 'w-8 bg-[#00bfb3]' : 'w-2.5 bg-gray-300 group-hover:bg-gray-400',
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
