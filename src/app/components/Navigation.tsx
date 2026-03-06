import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Globe } from 'lucide-react';
import logoSvg from '../../imports/OP_2.svg';
import { useLanguage } from '../context/LanguageContext';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/services', labelKey: 'nav.services' },
    { path: '/pricing', labelKey: 'nav.pricing' },
    { path: '/about', labelKey: 'nav.about' },
    { path: '/testimonials', labelKey: 'nav.testimonials' },
    { path: '/contact', labelKey: 'nav.contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <nav className="bg-white text-black sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logoSvg} alt="Maytag Laundry" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-[#00bfb3] ${isActive(item.path) ? 'text-[#00bfb3]' : 'text-black'
                  }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded hover:border-[#00bfb3] hover:text-[#00bfb3] transition-colors"
              aria-label={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Ingles'}
            >
              <Globe size={16} />
              <span className="text-sm font-medium">{language === 'en' ? 'ES' : 'EN'}</span>
            </button>
            <Link
              to="/contact"
              className="bg-[#00bfb3] text-white px-6 py-2 rounded hover:bg-[#00a89d] transition-colors"
            >
              {t('nav.getStarted')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 transition-colors hover:text-[#00bfb3] ${isActive(item.path) ? 'text-[#00bfb3]' : 'text-black'
                  }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 py-3 text-black hover:text-[#00bfb3] transition-colors"
              aria-label={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Ingles'}
            >
              <Globe size={18} />
              <span>{language === 'en' ? 'Espanol' : 'English'}</span>
            </button>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block bg-[#00bfb3] text-white px-6 py-2 rounded hover:bg-[#00a89d] transition-colors text-center mt-4"
            >
              {t('nav.getStarted')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
