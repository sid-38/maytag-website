import {
  BLANKET_SIZES,
  formatWashFoldUsdCents,
  PET_BED_PRICES,
  WASH_FOLD_PRICING,
} from './wash-fold-pricing';

/**
 * Per-page SEO: title, meta description, canonical, robots, Open Graph and JSON-LD.
 * Applied on every route by <RouteSeo /> (and by <LocationSEO /> for /…-in/:slug pages).
 *
 * Prices in titles/descriptions/schema are read from wash-fold-pricing.ts so they can't drift
 * from what the Pricing page shows.
 */

export const SITE_URL = 'https://maytaglaundromat.com';
export const BUSINESS_NAME = 'Maytag Coin Laundry of Raleigh';
export const BUSINESS_PHONE = '+1-415-533-5772';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/01-hero-image.png`;
export const SOCIAL_PROFILES = [
  'https://g.page/r/CUQC-uRBqlWcEBM',
  'https://www.facebook.com/profile.php?id=61582250078677',
  'https://www.instagram.com/maytag_laundry_raleigh/',
  'https://www.yelp.com/biz/maytag-coin-laundry-of-raleigh-raleigh-3',
];

const HOME_ID = `${SITE_URL}/#laundromat`;

const washFold = WASH_FOLD_PRICING.delivery;
const perLb = formatWashFoldUsdCents(washFold.standardPerLb);

export type JsonLd = Record<string, unknown>;

export interface PageSeo {
  title: string;
  description: string;
  /** Keep the page out of search results (utility/orphan pages). */
  noindex?: boolean;
  /** JSON-LD blocks, each rendered as its own <script type="application/ld+json">. */
  schema?: JsonLd[];
}

const address = {
  '@type': 'PostalAddress',
  streetAddress: '15 Jones Franklin Rd',
  addressLocality: 'Raleigh',
  addressRegion: 'NC',
  postalCode: '27606',
  addressCountry: 'US',
};

/** Full business node. Only the home and contact pages embed it; other pages reference it by @id. */
function laundromatNode(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'DryCleaningOrLaundry',
    '@id': HOME_ID,
    name: BUSINESS_NAME,
    url: `${SITE_URL}/`,
    telephone: BUSINESS_PHONE,
    priceRange: '$',
    paymentAccepted: 'Coins, Credit Card, Debit Card',
    currenciesAccepted: 'USD',
    foundingDate: '1995',
    knowsLanguage: ['English', 'Spanish'],
    image: [DEFAULT_OG_IMAGE],
    address,
    areaServed: { '@type': 'City', name: 'Raleigh' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '05:00',
      closes: '23:00',
    },
    amenityFeature: [
      'Cashless payment',
      'Coin-operated machines',
      'Wash and fold service',
      'Air conditioning',
      'Free Wi-Fi',
      'Restrooms',
      'Parking',
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Laundry Services',
      itemListElement: [
        ['Self-Service Laundromat', 'Self-service laundry'],
        ['Wash Dry Fold Service', 'Wash dry fold'],
        ['Pet Laundry Service', 'Pet bed laundry'],
        ['Free Pickup & Delivery', 'Laundry pickup and delivery'],
      ].map(([name, serviceType]) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name, serviceType },
      })),
    },
    sameAs: SOCIAL_PROFILES,
  };
}

function breadcrumb(name: string, path: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

function webPage(type: string, name: string, path: string, description: string, extra: JsonLd = {}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${SITE_URL}${path}#webpage`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': HOME_ID },
    inLanguage: 'en-US',
    ...extra,
  };
}

function usdOffer(name: string, price: number, description?: string): JsonLd {
  return {
    '@type': 'Offer',
    name,
    ...(description ? { description } : {}),
    price: price.toFixed(2),
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  };
}

const provider = { '@type': 'DryCleaningOrLaundry', '@id': HOME_ID, name: BUSINESS_NAME };

function service(name: string, serviceType: string, description: string, extra: JsonLd = {}): JsonLd {
  return {
    '@type': 'Service',
    name,
    serviceType,
    description,
    provider,
    areaServed: { '@type': 'City', name: 'Raleigh' },
    ...extra,
  };
}

const blanketOffers = BLANKET_SIZES.map((size) =>
  usdOffer(
    `${size[0].toUpperCase()}${size.slice(1)} blanket or comforter`,
    washFold.blankets[size],
    'Flat per-item price',
  ),
);

const petBedOffers = [
  usdOffer('Small pet bed cleaning', PET_BED_PRICES.small, 'For small dogs'),
  usdOffer('Large pet bed cleaning', PET_BED_PRICES.large, 'For medium to large dogs'),
];

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'Raleigh Laundromat & Wash and Fold | Maytag Coin Laundry',
    description: `Maytag Coin Laundry at 15 Jones Franklin Rd, Raleigh: self-service wash & dry, wash and fold from ${perLb}/lb and free pickup & delivery. Open daily 5AM–11PM.`,
    schema: [{ ...laundromatNode(), '@type': ['WebPage', 'DryCleaningOrLaundry'], mainEntityOfPage: `${SITE_URL}/` }],
  },

  '/services': {
    title: 'Laundry Services in Raleigh, NC | Maytag Coin Laundry',
    description:
      'Self-service washers and dryers, wash and fold, pet laundry, commercial laundry and free pickup & delivery in Raleigh, NC. Open daily 5AM–11PM at 15 Jones Franklin Rd.',
    schema: [
      webPage('CollectionPage', 'Laundry Services in Raleigh, NC', '/services', 'Self-service, wash and fold, pet laundry, commercial laundry and free pickup & delivery in Raleigh, NC.', {
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [
            service('Self-Service Wash', 'Self-service laundry', 'High-efficiency self-service washers in multiple sizes.'),
            service('Self-Service Dry', 'Self-service laundry', 'Large and extra-large commercial dryers.'),
            service('Wash & Fold Service', 'Wash dry fold', 'Drop off your laundry and pick it up clean and neatly folded, or schedule free pickup and delivery.'),
            service('Pet Laundry Service', 'Pet bed laundry', 'Pet-safe cleaning for pet beds and bedding.'),
            service('Commercial Laundry', 'Commercial laundry', 'Bulk and commercial laundry services.'),
          ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })),
        },
      }),
      breadcrumb('Services', '/services'),
    ],
  },

  '/pricing': {
    title: `Laundry Prices in Raleigh | Wash & Fold ${perLb}/lb`,
    description: `Wash and fold at ${perLb}/lb, ${washFold.minLb} lb minimum, ${washFold.turnaroundHours}-hour turnaround, plus blanket and pet bed prices. Free pickup & delivery in Raleigh, NC.`,
    schema: [
      webPage('WebPage', 'Laundry Services & Pricing', '/pricing', 'Wash and fold, blanket and pet bed pricing at Maytag Coin Laundry in Raleigh, NC.', {
        mainEntity: {
          '@type': 'OfferCatalog',
          name: 'Maytag Coin Laundry Pricing',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Wash & Fold',
              description: `${washFold.minLb} lb minimum, ${washFold.turnaroundHours}-hour turnaround, free local pickup & delivery`,
              priceCurrency: 'USD',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: washFold.standardPerLb.toFixed(2),
                priceCurrency: 'USD',
                referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'LBR' },
                eligibleQuantity: { '@type': 'QuantitativeValue', minValue: washFold.minLb, unitCode: 'LBR' },
              },
              itemOffered: { '@type': 'Service', name: 'Wash & Fold Service', provider },
            },
            ...blanketOffers,
            ...petBedOffers,
          ],
        },
      }),
      breadcrumb('Pricing', '/pricing'),
    ],
  },

  '/pet-laundry': {
    title: 'Pet Bed Laundry in Raleigh, NC | Maytag Coin Laundry',
    description: `Professional pet bed and bedding cleaning in Raleigh. Small pet beds $${PET_BED_PRICES.small}, large $${PET_BED_PRICES.large}. Drop off in store or ask about pickup and delivery.`,
    schema: [
      {
        '@context': 'https://schema.org',
        ...service('Pet Laundry Service', 'Pet bed laundry', 'Professional cleaning for pet beds and bedding.', {
          url: `${SITE_URL}/pet-laundry`,
          offers: petBedOffers,
        }),
      },
      breadcrumb('Pet Laundry', '/pet-laundry'),
    ],
  },

  '/subscriptions': {
    title: 'Wash & Fold Subscriptions in Raleigh | Maytag Laundry',
    description:
      'Monthly wash and fold subscription plans for singles, couples and families, with free pickup and delivery in Raleigh, NC. Pick a plan and skip laundry day.',
    schema: [
      {
        '@context': 'https://schema.org',
        ...service('Wash & Fold Subscriptions', 'Laundry subscription', 'Monthly wash and fold plans for singles, couples and families with free pickup and delivery.', {
          url: `${SITE_URL}/subscriptions`,
        }),
      },
      breadcrumb('Subscriptions', '/subscriptions'),
    ],
  },

  '/about': {
    title: 'About Maytag Coin Laundry | Serving Raleigh Since 1995',
    description:
      "For over 30 years, Maytag Coin Laundry has been Raleigh's trusted laundromat: modern equipment, a clean comfortable space and friendly service at 15 Jones Franklin Rd.",
    schema: [
      webPage('AboutPage', 'About Maytag Coin Laundry', '/about', "Raleigh's trusted laundromat since 1995.", {
        mainEntity: { '@id': HOME_ID },
      }),
      breadcrumb('About', '/about'),
    ],
  },

  '/contact': {
    title: 'Contact & Hours | Maytag Coin Laundry Raleigh, NC',
    description:
      'Visit 15 Jones Franklin Rd, Raleigh, NC 27606, call (415) 533-5772 or send us a message. Open daily 5AM–11PM, 365 days a year.',
    schema: [
      webPage('ContactPage', 'Contact Maytag Coin Laundry', '/contact', 'Address, phone number and hours for Maytag Coin Laundry in Raleigh, NC.', {
        mainEntity: laundromatNode(),
      }),
      breadcrumb('Contact', '/contact'),
    ],
  },

  '/testimonials': {
    title: 'Customer Reviews | Maytag Coin Laundry Raleigh',
    description:
      'See what Raleigh customers say about Maytag Coin Laundry: clean machines, friendly staff and reliable wash and fold. Serving Raleigh since 1995.',
    schema: [
      webPage('CollectionPage', 'Customer Reviews', '/testimonials', 'What customers say about Maytag Coin Laundry in Raleigh, NC.'),
      breadcrumb('Testimonials', '/testimonials'),
    ],
  },

  '/terms': {
    title: 'Terms of Service | Maytag Coin Laundry',
    description: 'Terms of service for Maytag Coin Laundry of Raleigh, including laundry, wash and fold, pickup and delivery, and subscription services.',
    schema: [webPage('WebPage', 'Terms of Service', '/terms', 'Terms of service for Maytag Coin Laundry of Raleigh.')],
  },

  '/privacy': {
    title: 'Privacy Policy | Maytag Coin Laundry',
    description: 'How Maytag Coin Laundry of Raleigh collects, uses and protects your personal information.',
    schema: [webPage('WebPage', 'Privacy Policy', '/privacy', 'Privacy policy for Maytag Coin Laundry of Raleigh.')],
  },

  // Utility / orphan pages: keep out of search results.
  '/claim': { title: 'Claim Your Offer | Maytag Coin Laundry', description: 'Claim your Maytag Coin Laundry offer.', noindex: true },
  '/claim/success': { title: 'Offer Claimed | Maytag Coin Laundry', description: 'Your Maytag Coin Laundry offer has been claimed.', noindex: true },
  '/schedule-pickup': { title: 'Schedule a Pickup | Maytag Coin Laundry', description: 'Schedule a free laundry pickup and delivery in Raleigh.', noindex: true },
  '/subscriptions/success': { title: 'Subscription Confirmed | Maytag Coin Laundry', description: 'Your Maytag Coin Laundry subscription is confirmed.', noindex: true },
  '/wolfpack': { title: 'NC State Students | Maytag Coin Laundry', description: 'Laundry near NC State for students.', noindex: true },
};

export function getPageSeo(pathname: string): PageSeo | undefined {
  const path = pathname.replace(/\/+$/, '') || '/';
  return PAGE_SEO[path];
}

export interface HeadOptions extends PageSeo {
  /** Absolute canonical URL. */
  canonical: string;
  ogImage?: string;
}

/**
 * Writes title, description, canonical, robots, Open Graph/Twitter tags and JSON-LD into <head>.
 * Tags already in index.html are updated in place (and restored by the returned cleanup) so
 * there are never duplicates. Everything else is created and removed again on cleanup.
 */
export function applyHead(opts: HeadOptions): () => void {
  const cleanups: Array<() => void> = [];

  const prevTitle = document.title;
  document.title = opts.title;
  cleanups.push(() => {
    document.title = prevTitle;
  });

  function upsert(tag: 'meta' | 'link', selector: string, attrs: Record<string, string>) {
    let el = document.head.querySelector<HTMLElement>(selector);
    if (el) {
      const prev = Object.fromEntries(Object.keys(attrs).map((k) => [k, el!.getAttribute(k)]));
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      cleanups.push(() => {
        Object.entries(prev).forEach(([k, v]) => (v === null ? el!.removeAttribute(k) : el!.setAttribute(k, v)));
      });
    } else {
      el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      document.head.appendChild(el);
      cleanups.push(() => el!.remove());
    }
  }

  const meta = (name: string, content: string) => upsert('meta', `meta[name="${name}"]`, { name, content });
  const og = (property: string, content: string) =>
    upsert('meta', `meta[property="${property}"]`, { property, content });

  meta('description', opts.description);
  meta('robots', opts.noindex ? 'noindex, nofollow' : 'index, follow');
  upsert('link', 'link[rel="canonical"]', { rel: 'canonical', href: opts.canonical });

  og('og:type', 'website');
  og('og:site_name', 'Maytag Coin Laundry');
  og('og:locale', 'en_US');
  og('og:title', opts.title);
  og('og:description', opts.description);
  og('og:url', opts.canonical);
  og('og:image', opts.ogImage ?? DEFAULT_OG_IMAGE);
  meta('twitter:card', 'summary_large_image');
  meta('twitter:title', opts.title);
  meta('twitter:description', opts.description);
  meta('twitter:image', opts.ogImage ?? DEFAULT_OG_IMAGE);

  (opts.schema ?? []).forEach((block, i) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `page-seo-schema-${i}`;
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
    cleanups.push(() => script.remove());
  });

  return () => cleanups.reverse().forEach((fn) => fn());
}
