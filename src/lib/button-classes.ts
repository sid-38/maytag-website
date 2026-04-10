/**
 * Class names for global buttons in `src/styles/buttons.css`.
 * Sizing/radius/font are driven by `--btn-height`, `--btn-radius`, `--btn-font-size`, `--btn-line-height`,
 * and at lg+ by `--btn-width-desktop` for `.btn-primary` / `.btn-secondary` (see `buttons.css`).
 * Use with `className` / `cn()` on `<a>`, `<button>`, or `asChild` components.
 */
export const buttonClass = {
  /** Full-width image heroes: pairs with `w-full` / `md:w-auto`; fixed width at lg+ */
  heroCta: 'hero-cta',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  /** Secondary; inside `.group`, becomes primary on card hover (desktop lg+ only) — see `buttons.css` */
  secondaryElevate: 'btn-secondary-elevate',
  /** Primary below `md`; same as `secondaryElevate` from `md` — see `buttons.css` */
  serviceCardCta: 'btn-service-card-cta',
} as const;
