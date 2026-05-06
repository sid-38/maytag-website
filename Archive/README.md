# Archived schedule pickup / subscription modal code

These files are **not imported** anywhere in the app. They preserve the older in-site schedule pickup form and subscription plan modal removed when pickup moved to the external customer portal (`http://maytag.custx.smrtlite.org/`).

## Layout (mirrors former `src/app/` paths)

| Archive path | Former `src/` path |
|--------------|-------------------|
| `app/components/SubscriptionPlanModal.tsx` | `src/app/components/SubscriptionPlanModal.tsx` |
| `app/components/SchedulePickupSuccessScreen.tsx` | `src/app/components/SchedulePickupSuccessScreen.tsx` |
| `app/pages/SchedulePickupFormPage.tsx` | `src/app/pages/SchedulePickupFormPage.tsx` |

## Restore checklist

Copy each file back into `src/` at the paths above.

You will likely need to:

1. Wire the route in `App.tsx` (`/schedule-pickup`) if you want the form page again instead of `SchedulePickupPortalRedirect`.
2. Re-import modal usage from archived `SubscriptionPlanModal` where needed (homepage, services, pet laundry previously).
3. Update any paths or translations if `main` has diverged since this archive snapshot.
