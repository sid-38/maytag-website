import { useLayoutEffect } from 'react';

/** BubblePay customer portal — pickup scheduling and sign-in. */
export const MAYTAG_SCHEDULE_PICKUP_PORTAL_URL = 'https://maytag.custx.bubblepayportal.com/';

export function openSchedulePickupPortalInNewTab() {
  const tab = window.open(MAYTAG_SCHEDULE_PICKUP_PORTAL_URL, '_blank');
  if (tab) tab.opener = null;
}

export function SchedulePickupPortalRedirect() {
  useLayoutEffect(() => {
    window.location.replace(MAYTAG_SCHEDULE_PICKUP_PORTAL_URL);
  }, []);
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-white px-4 py-16 text-gray-600">
      <p className="text-base">Redirecting…</p>
    </div>
  );
}
