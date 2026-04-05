// ─── Product badge data ─────────────────────────────────────────────────
const PRODUCTS = [
  {
    label: 'Hub',
    desc: 'Your content library',
    href: '/hub',
    spriteSrc: '/assets/cdn.foreplay.co/nav-spritesheet-160x160-library.png',
  },
  {
    label: 'Intelligence',
    desc: 'Trend detection',
    href: '/discovery',
    spriteSrc: '/assets/cdn.foreplay.co/nav-spritesheet-160x160-discovery.png',
  },
  {
    label: 'Recon',
    desc: '24/7 tracking',
    href: '/recon',
    spriteSrc: '/assets/cdn.foreplay.co/nav-spritesheet-160x160-spyder.png',
  },
  {
    label: 'Agents',
    desc: 'Your AI agent team',
    href: '/agents',
    spriteSrc: '/assets/cdn.foreplay.co/nav-spritesheet-160x160-lens.png',
  },
  {
    label: 'Content Gen',
    desc: 'AI video pipeline',
    href: '/content-gen',
    spriteSrc: '/assets/cdn.foreplay.co/nav-spritesheet-160x160-briefs.png',
  },
];

export default function FooterProducts() {
  return (
    <div className="flex gap-4 flex-wrap">
      {PRODUCTS.map((p) => (
        <a
          key={p.label}
          href={p.href}
          className="flex items-center gap-3 text-white/72 min-w-[200px] px-[10px] py-2 flex-1 no-underline"
          style={{ textDecoration: 'none' }}
        >
          {/* 44x44 sprite icon */}
          <div
            className="shrink-0 w-11 h-11 bg-no-repeat bg-left"
            style={{
              backgroundImage: `url('${p.spriteSrc}')`,
              backgroundSize: 'auto 100%',
            }}
          />
          <div>
            <p
              className="m-0 text-[0.875rem] font-normal leading-tight"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', lineHeight: 1.25 }}
            >
              {p.desc}
            </p>
            <p
              className="m-0 text-base font-medium leading-snug"
              style={{ color: '#fff', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01125em' }}
            >
              {p.label}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
