/**
 * Instagram post/reel embed `src` values (Share → Embed → iframe `src`, path only — use `instagramEmbedIframeSrc()` for the final iframe URL).
 * Cards crop the iframe so the profile header + footer chrome stay hidden; fine‑tune per `variant` in AboutPage if IG changes layout.
 */
export type CommunityInstagramEmbed = {
  src: string;
  variant: 'photo' | 'reel';
};

export const communityInstagramEmbeds: readonly CommunityInstagramEmbed[] = [
  { src: 'https://www.instagram.com/p/DXaVA1IAYUx/embed', variant: 'photo' },
  { src: 'https://www.instagram.com/reel/DXu36qADwaI/embed', variant: 'reel' },
  { src: 'https://www.instagram.com/p/DWpGKaHj3Fb/embed', variant: 'photo' },
];

/**
 * Instagram honors `hidecaption` on `/embed` URLs — omit it or set false to show the full post (caption + actions).
 * Reels: `autoplay`/`muted` are best-effort; playback is controlled by Instagram + the browser.
 */
export function instagramEmbedIframeSrc(
  embedPath: string,
  options: { hideCaption?: boolean; autoplay?: boolean } = {},
): string {
  const { hideCaption = false, autoplay = false } = options;
  const u = new URL(embedPath);
  if (hideCaption) u.searchParams.set('hidecaption', 'true');
  if (autoplay) {
    u.searchParams.set('autoplay', '1');
    u.searchParams.set('muted', '1');
  }
  return u.toString();
}

/** Profile URL for the “View on Instagram” link (no @). */
export const communityInstagramProfileUsername = 'maytag_laundry_raleigh';
