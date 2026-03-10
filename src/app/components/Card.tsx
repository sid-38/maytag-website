import { cn } from './ui/utils';

/**
 * Global card style used across the site.
 * Based on the "Where Service Meets Innovation" section design.
 * Update this component to change card styling site-wide.
 */
const cardBaseStyles =
  'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_2px_rgba(0,0,0,0.04)]';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional image to display at top of card */
  image?: {
    src: string;
    alt: string;
    objectPosition?: 'top' | 'center' | 'bottom';
    /** Image area: fixed height (default) or aspect ratio */
    aspect?: '4/3' | 'square';
  };
  /** Enable hover effect (border + shadow) */
  hover?: boolean;
}

export function Card({
  className,
  image,
  hover = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardBaseStyles,
        hover && 'transition-all hover:border-[#00bfb3] hover:shadow-lg',
        className
      )}
      {...props}
    >
      {image && (
        <div
          className={cn(
            'overflow-hidden',
            image.aspect === '4/3' && 'aspect-[4/3]',
            image.aspect === 'square' && 'aspect-square',
            !image.aspect && 'h-[255px]'
          )}
        >
          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              'h-full w-full object-cover',
              image.objectPosition === 'top' && 'object-top',
              image.objectPosition === 'bottom' && 'object-bottom'
            )}
          />
        </div>
      )}
      {children}
    </div>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
}

export function CardContent({
  className,
  padding = 'md',
  children,
  ...props
}: CardContentProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}
