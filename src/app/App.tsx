import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { CTAFormPage } from './pages/CTAFormPage';
import { CTAFormSuccessPreview } from './pages/CTAFormSuccessPreview';
import { SchedulePickupPortalRedirect } from '../lib/schedule-pickup-portal';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { LocationSEO } from './components/LocationSEO';
import { WolfpackPage } from './pages/Wolfpack';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PetLaundryPage } from './pages/PetLaundryPage';
import { LanguageProvider } from './context/LanguageContext';
import { Chatbot } from './components/Chatbot';

function AppContent() {
  const location = useLocation();
  const isStandaloneFormPage =
    location.pathname === '/claim' ||
    location.pathname === '/claim/success' ||
    location.pathname === '/schedule-pickup' ||
    location.pathname === '/subscriptions' ||
    location.pathname === '/subscriptions/success';

  return (
    <div className="min-h-screen flex flex-col">
      {!isStandaloneFormPage && (
        <header className="sticky top-0 z-[100]">
          <AnnouncementBanner />
          <Navigation />
        </header>
      )}
        <main className="flex-grow">
        <Routes>
              {/* Core pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/pet-laundry" element={<PetLaundryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/wolfpack" element={<WolfpackPage />} />
              <Route path="/claim" element={<CTAFormPage />} />
              <Route path="/claim/success" element={<CTAFormSuccessPreview />} />
              <Route path="/schedule-pickup" element={<SchedulePickupPortalRedirect />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/subscriptions/success" element={<SubscriptionsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Location pages — reuse existing pages with location SEO */}
              <Route path="/laundromat-in/:locationSlug" element={<LocationSEO page="home"><HomePage /></LocationSEO>} />
              <Route path="/services-in/:locationSlug" element={<LocationSEO page="services"><ServicesPage /></LocationSEO>} />
              <Route path="/pricing-in/:locationSlug" element={<LocationSEO page="pricing"><PricingPage /></LocationSEO>} />
              <Route path="/about-in/:locationSlug" element={<LocationSEO page="about"><AboutPage /></LocationSEO>} />
              <Route path="/contact-in/:locationSlug" element={<LocationSEO page="contact"><ContactPage /></LocationSEO>} />
              <Route path="/testimonials-in/:locationSlug" element={<LocationSEO page="testimonials"><TestimonialsPage /></LocationSEO>} />
        </Routes>
      </main>
      {!isStandaloneFormPage && <Footer />}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}
