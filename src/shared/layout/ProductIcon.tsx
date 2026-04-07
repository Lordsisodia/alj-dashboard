// Static PNG icons — frame 1 extracted from animated spritesheets at 36px (2x display size).
// Each icon: ~3KB vs the original 500–640KB spritesheet.
// Stored in public/sprites-icons/ — served as static assets, no bundle overhead.
const PRODUCT_ICONS: Record<string, string> = {
  hub:          '/sprites-icons/library-36.png',
  intelligence: '/sprites-icons/discovery-36.png',
  recon:        '/sprites-icons/spyder-36.png',
  agents:       '/sprites-icons/lens-36.png',
  'content-gen': '/sprites-icons/briefs-36.png',
};

interface ProductIconProps {
  product: 'hub' | 'intelligence' | 'recon' | 'agents' | 'content-gen';
  size?: number;
  className?: string;
}

/**
 * Renders the product icon at any size using a static PNG.
 * Maintains the original animated sprite aesthetic without loading a full spritesheet.
 */
export function ProductIcon({ product, size = 18, className }: ProductIconProps) {
  const src = PRODUCT_ICONS[product];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={product}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: Math.round(size * 0.28),
        objectFit: 'contain',
      }}
    />
  );
}
