import { RainbowIllustration } from './ui/RainbowIllustration';
import { SharingPanel } from './ui/SharingPanel';

export default function CollaborationSection() {
  return (
    <section style={{ background: '#000', paddingTop: '40px' }}>
      <div style={{ padding: '8px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '36px',
          overflow: 'hidden',
        }}>
          <div style={{ maxWidth: '1216px', margin: '0 auto', padding: '80px 24px 0' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 80px' }}>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 550,
                lineHeight: '1rem',
                letterSpacing: '0.166667em',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.5)',
                display: 'block',
                marginBottom: '12px',
              }}>
                Your Team + AI
              </span>
              <h2 style={{
                fontFamily: 'Inter Display, Arial, sans-serif',
                fontSize: '44px',
                fontWeight: 600,
                lineHeight: '54px',
                letterSpacing: '-0.0075em',
                color: '#000000',
                margin: '0 0 16px 0',
              }}>
                Your team and your agents, working as one.
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                lineHeight: '28px',
                color: 'rgba(0,0,0,0.6)',
                margin: 0,
              }}>
                Models, managers, and AI agents — all on the same page. ISSO connects your creative vision to scalable content output.
              </p>
            </div>
          </div>
          <RainbowIllustration />
          <div style={{ maxWidth: '1216px', margin: '0 auto', padding: '0 24px 0' }}>
            <SharingPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
