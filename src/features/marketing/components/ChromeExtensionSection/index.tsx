import { ChromeExtensionCard } from './ui/ChromeExtensionCard';

export default function ChromeExtensionSection() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <style>{`
        @media (max-width: 768px) {
          .chrome-ext-outer { position: relative !important; }
          .chrome-ext-logo {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            width: 80px !important;
            height: 80px !important;
            margin-bottom: 16px;
            opacity: 0.7;
          }
          .chrome-ext-card { padding: 24px !important; }
          .chrome-ext-content { padding-left: 0 !important; }
          .chrome-ext-stats { padding-left: 0 !important; flex-wrap: wrap; gap: 16px !important; }
          .chrome-ext-cta { position: relative !important; bottom: auto !important; right: auto !important; margin-top: 16px; display: flex !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1216px', margin: '0 auto', position: 'relative' }}>
        <ChromeExtensionCard />
      </div>
    </section>
  );
}
