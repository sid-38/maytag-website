/**
 * Class names for global buttons in `src/styles/buttons.css`.
 * Sizing/radius/font are driven by `--btn-height`, `--btn-radius`, `--btn-font-size`, `--btn-line-height` on `:root` (see `buttons.css`).
 * Use with `className` / `cn()` on `<a>`, `<button>`, or `asChild` components.
 */
export const buttonClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  /** Secondary; inside `.group`, becomes primary on card hover (desktop lg+ only) — see `buttons.css` */
  secondaryElevate: 'btn-secondary-elevate',
} as const;
