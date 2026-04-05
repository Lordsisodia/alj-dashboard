interface FeatureCardProps {
  accent: string;
}

export function FeatureCard({ accent }: FeatureCardProps) {
  return (
    <div style={{
      background: '#1a1a1a',
      border: `1px solid ${accent}30`,
      borderRadius: 16,
      padding: '32px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 200,
        height: 200,
        background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          EXAMPLE
        </div>
        <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1 }}>94%</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>prediction accuracy</div>
      </div>
    </div>
  );
}
