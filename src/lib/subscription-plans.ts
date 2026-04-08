export type SubscriptionPlanId = 'singles' | 'couples' | 'family';

export const SUBSCRIPTION_PLANS: {
  id: SubscriptionPlanId;
  nameKey: string;
  cardTitleKey: string;
  blurbKey: string;
  feature1Key: string;
  feature2Key: string;
  priceKey: string;
  discountPriceKey: string;
  featured?: boolean;
}[] = [
  {
    id: 'singles',
    nameKey: 'subscriptions.plan.singles.name',
    cardTitleKey: 'subscriptions.plan.singles.cardTitle',
    blurbKey: 'subscriptions.plan.singles.blurb',
    feature1Key: 'subscriptions.plan.singles.feature1',
    feature2Key: 'subscriptions.plan.singles.feature2',
    priceKey: 'subscriptions.plan.singles.price',
    discountPriceKey: 'subscriptions.plan.singles.discountPrice',
  },
  {
    id: 'couples',
    nameKey: 'subscriptions.plan.couples.name',
    cardTitleKey: 'subscriptions.plan.couples.cardTitle',
    blurbKey: 'subscriptions.plan.couples.blurb',
    feature1Key: 'subscriptions.plan.couples.feature1',
    feature2Key: 'subscriptions.plan.couples.feature2',
    priceKey: 'subscriptions.plan.couples.price',
    discountPriceKey: 'subscriptions.plan.couples.discountPrice',
    featured: true,
  },
  {
    id: 'family',
    nameKey: 'subscriptions.plan.family.name',
    cardTitleKey: 'subscriptions.plan.family.cardTitle',
    blurbKey: 'subscriptions.plan.family.blurb',
    feature1Key: 'subscriptions.plan.family.feature1',
    feature2Key: 'subscriptions.plan.family.feature2',
    priceKey: 'subscriptions.plan.family.price',
    discountPriceKey: 'subscriptions.plan.family.discountPrice',
  },
];
