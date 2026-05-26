import { Card } from './Card';
import { useLanguage } from '../context/LanguageContext';
import { formatWashFoldUsdCents, WASH_FOLD_PRICING, type WashFoldChannel } from '../../lib/wash-fold-pricing';

export function WashFoldPricingCard({
  channel,
  showSameDay = true,
}: {
  channel: WashFoldChannel;
  showSameDay?: boolean;
}) {
  const { t } = useLanguage();
  const p = WASH_FOLD_PRICING[channel];

  return (
    <Card className="flex min-w-0 flex-col">
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-gray-200 bg-[#00bfb3]/10 px-6 py-7 sm:flex-nowrap ${showSameDay ? 'border-b' : ''}`}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0">
          <span className="text-3xl font-bold tracking-tight text-black sm:text-2xl lg:text-3xl xl:text-4xl">
            {formatWashFoldUsdCents(p.standardPerLb)}
          </span>
          <span className="text-sm font-medium text-gray-500">{t('pricingPage.perLb')}</span>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-sm font-semibold text-gray-500">{t('pricingPage.minimum')}</div>
          <div className="mt-0.5 text-base font-semibold text-black">{p.minLb} lbs</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-sm font-semibold text-gray-500">{t('pricingPage.turnaround')}</div>
          <div className="mt-0.5 text-base font-semibold text-black">
            {p.turnaroundHours} {t('pricingPage.hours')}
          </div>
        </div>
      </div>
      {showSameDay ? (
        <div>
          <div className="flex flex-col justify-between gap-2 border-b border-gray-200 px-6 py-3.5 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <div className="text-base font-medium text-gray-700">{t('pricingPage.sameDay')}</div>
              <div className="text-sm text-gray-500">
                {t(
                  channel === 'instore'
                    ? 'pricingPage.instore.sameDay.note'
                    : 'pricingPage.delivery.sameDay.note',
                )}
              </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0 sm:justify-end sm:text-right">
              <span className="text-base font-bold tracking-tight text-black">
                {formatWashFoldUsdCents(p.sameDayPerLb)}
              </span>
              <span className="text-sm font-medium text-gray-500">{t('pricingPage.perLb')}</span>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
