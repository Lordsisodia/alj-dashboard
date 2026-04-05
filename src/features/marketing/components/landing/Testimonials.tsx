const testimonials = [
  {
    quote: 'SISO cut our research time from 2 weeks to 2 hours. The AI agents actually understand what we\'re trying to do.',
    name: 'Sarah Chen',
    role: 'Head of Growth',
    company: 'Nexus Digital',
    initials: 'SC',
    color: '#FF5722',
  },
  {
    quote: 'We deployed 12 automation pipelines in a month. Our team now focuses on strategy, not busywork.',
    name: 'Marcus Webb',
    role: 'CEO',
    company: 'Velocity Studios',
    initials: 'MW',
    color: '#FFA726',
  },
  {
    quote: 'Best investment we\'ve made. The multi-agent setup handles our entire content workflow.',
    name: 'Priya Nair',
    role: 'Marketing Director',
    company: 'Bloom Agency',
    initials: 'PN',
    color: '#FF5722',
  },
  {
    quote: 'Finally, analytics that tell us what to do next. Not just vanity metrics.',
    name: 'James Okonkwo',
    role: 'CMO',
    company: 'Scale Ventures',
    initials: 'JO',
    color: '#FFA726',
  },
];

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FFA726">
          <path d="M8 1l1.85 3.74 4.15.6-3 2.92.71 4.13L8 10.5l-3.71 1.95.71-4.13L2 5.34l4.15-.6z"/>
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: `${color}25`,
      border: `1px solid ${color}50`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color, letterSpacing: '0.05em' }}>{initials}</span>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ background: '#0f0f0f', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#FF5722', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Testimonials
          </h2>
          <h3 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#fff', margin: 0 }}>
            Trusted by teams that ship
          </h3>
        </div>

        {/* Cards grid / scroll */}
        <div
          className="testimonials-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '32px',
                transition: 'all 200ms ease',
              }}
              className="testimonial-card"
            >
              <StarRating />
              <blockquote style={{
                fontSize: 16,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.7,
                margin: '0 0 24px',
              }}>
                "{t.quote}"
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar initials={t.initials} color={t.color} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {t.role} @ {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-scroll {
            grid-template-columns: 1fr !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .testimonial-card {
            min-width: 85vw;
            scroll-snap-align: start;
          }
        }
        .testimonial-card:hover {
          border-color: rgba(255,87,34,0.25);
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
      `}</style>
    </section>
  );
}
