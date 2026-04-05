// Maps each product ID to its sprite PNG
const PRODUCT_SPRITES: Record<string, string> = {
  hub:          '/sprites/nav-spritesheet-160x160-library.png',
  intelligence: '/sprites/nav-spritesheet-160x160-discovery.png',
  recon:        '/sprites/nav-spritesheet-160x160-spyder.png',
  agents:       '/sprites/nav-spritesheet-160x160-lens.png',
  'content-gen': '/sprites/nav-spritesheet-160x160-briefs.png',
};

interface ProductIconProps {
  product: 'hub' | 'intelligence' | 'recon' | 'agents' | 'content-gen';
  size?: number;
  className?: string;
}

/**
 * Renders the product sprite icon at any size.
 * Use in ContentPageShell's `icon` prop to match the sidebar icons.
 *
 * Example:
 *   <ContentPageShell icon={<ProductIcon product="recon" size={18} />} ... />
 */
export function ProductIcon({ product, size = 18, className }: ProductIconProps) {
  const src = PRODUCT_SPRITES[product];
  if (!src) return null;
  // The spritesheets are horizontal animation strips (4960×160, 31 frames).
  // We show only the first frame using backgroundPosition: left + backgroundSize: auto 100%.
  return (
    <div
      aria-label={product}
      className={className}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        backgroundImage: `url('${src}')`,
        backgroundSize: 'auto 100%',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        borderRadius: Math.round(size * 0.28),
      }}
    />
  );
}
