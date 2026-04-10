import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, Phone, X } from 'lucide-react';
import { trackGa4Event } from '../../lib/analytics';
import { scrollToTop } from '../../lib/utils';
import navigationLogoSvg from '../../imports/new-logo-white.svg';
import { useLanguage } from '../context/LanguageContext';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/services', labelKey: 'nav.services' },
    { path: '/about', labelKey: 'nav.about' },
    { path: '/testimonials', labelKey: 'nav.testimonials' },
    { path: '/contact', labelKey: 'nav.contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative bg-white text-black sticky top-0 z-[100] border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={scrollToTop}>
            <img src={navigationLogoSvg} alt="Maytag Laundry" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={scrollToTop}
                className={`transition-colors hover:text-[#00bfb3] ${isActive(item.path) ? 'text-[#00bfb3]' : 'text-black'
                  }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-full border border-gray-300 bg-gray-50 p-0.5 cursor-pointer hover:border-[#00bfb3] hover:bg-white transition-colors"
                role="group"
                aria-label="Language selection"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${language === 'en'
                    ? 'bg-[#00bfb3] text-white'
                    : 'text-gray-700 hover:text-[#00bfb3]'
                  }`}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${language === 'es'
                    ? 'bg-[#00bfb3] text-white'
                    : 'text-gray-700 hover:text-[#00bfb3]'
                  }`}
                  aria-pressed={language === 'es'}
                >
                  ES
                </button>
              </div>
            </div>
            <a
              href="tel:9842059506"
              className="bg-[#00bfb3] text-white px-6 py-2 rounded hover:bg-[#00a89d] transition-colors"
              onClick={() =>
                trackGa4Event('phone_call_click', {
                  link_location: 'header_desktop',
                  link_url: 'tel:9842059506',
                })
              }
            >
              {t('nav.callUs')}
            </a>
          </div>

          {/* Mobile: call + menu */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:9842059506"
              aria-label={t('nav.callUs')}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded bg-[#00bfb3] px-3 py-2 text-md font-medium text-white transition-colors hover:bg-[#00a89d]"
              onClick={() =>
                trackGa4Event('phone_call_click', {
                  link_location: 'header_mobile',
                  link_url: 'tel:9842059506',
                })
              }
            >
              <Phone className="size-[16px] shrink-0" aria-hidden />
              <span>{t('nav.call')}</span>
            </a>
            <button
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center text-black cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - absolute overlay with smooth animation */}
        <div
          id="mobile-nav"
          aria-hidden={!isMenuOpen}
          className={`absolute top-full left-0 right-0 md:hidden bg-white border-b border-gray-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="pb-4 pt-2 px-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                className={`block py-3 transition-colors hover:text-[#00bfb3] ${isActive(item.path) ? 'text-[#00bfb3]' : 'text-black'
                  }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <div className="flex items-center gap-3 py-3">
              <div
                className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 p-0.5 cursor-pointer hover:border-[#00bfb3] hover:bg-white transition-colors"
                role="group"
                aria-label="Language selection"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${language === 'en'
                    ? 'bg-[#00bfb3] text-white'
                    : 'text-gray-800'
                  }`}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${language === 'es'
                    ? 'bg-[#00bfb3] text-white'
                    : 'text-gray-800'
                  }`}
                  aria-pressed={language === 'es'}
                >
                  ES
                </button>
              </div>
            </div>
            {/* <a
              href="tel:9842059506"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-[#00bfb3] text-white px-6 py-2 rounded hover:bg-[#00a89d] transition-colors text-center mt-4"
            >
              {t('nav.callUs')}
            </a> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
