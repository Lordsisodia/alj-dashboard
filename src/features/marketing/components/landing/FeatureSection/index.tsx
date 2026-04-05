import { features } from './data/features';
import { FeatureCard } from './ui/FeatureCard';

const styles = {
  section: { background: '#121212', padding: '80px 24px' },
  container: { maxWidth: 1200, margin: '0 auto' },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 48,
    alignItems: 'center',
  },
  label: { fontSize: 12, fontWeight: 600, color: '#FF5722', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 },
  heading: { fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.2 },
  subtext: { fontSize: 16, color: 'rgba(255,255,255,0.6)', margin: '0 0 28px', lineHeight: 1.6 },
  bulletPoint: { display: 'flex', alignItems: 'center', gap: 12 },
  bulletDot: { width: 6, height: 6, borderRadius: '50%', background: '#FF5722', flexShrink: 0 },
  bulletText: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },
};

function getRowStyle(flip: boolean) {
  return {
    ...styles.row,
    marginBottom: flip ? 0 : 80,
    paddingBottom: flip ? 80 : 0,
    borderBottom: flip ? '1px solid rgba(255,255,255,0.06)' : 'none',
  };
}

export default function FeatureSection() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {features.map((feature) => (
          <div
            key={feature.id}
            style={getRowStyle(feature.flip)}
            className="feature-row"
          >
            <div style={{ order: feature.flip ? 2 : 1 }}>
              <div style={styles.label}>{feature.label}</div>
              <h3 style={styles.heading}>{feature.heading}</h3>
              <p style={styles.subtext}>{feature.subtext}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {feature.bullets.map((bullet) => (
                  <li key={bullet} style={styles.bulletPoint}>
                    <div style={styles.bulletDot} />
                    <span style={styles.bulletText}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ order: feature.flip ? 1 : 2 }}>
              <FeatureCard accent={feature.visual.accent} />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .feature-row {
            grid-template-columns: 1fr !important;
            margin-bottom: 0 !important;
            padding-bottom: 80px !important;
          }
          .feature-row:last-child { padding-bottom: 0 !important; }
        }
      `}</style>
    </section>
  );
}
