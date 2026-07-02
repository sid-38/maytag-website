import { useLanguage } from '../context/LanguageContext';
import './HeroAwardSection.css';

export function HeroAwardSection() {
  const { t } = useLanguage();

  return (
    <div className="hero-award-section mb-5 sm:mb-6">
      <img
        src="/images/businessrate-top3-2026-award.png"
        alt="BusinessRate Top 3 2026 Award Winner"
        className="hero-award-badge w-[150px] sm:w-[150px] md:w-[150px]"
        width={220}
        height={220}
        loading="eager"
        decoding="async"
      />
      <div className="hero-award-pill">
        <span>{t('home.hero.awardPill')}</span>
      </div>
    </div>
  );
}
