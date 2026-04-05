// WebinarsPage — assembles all Fireside Webinars page sections.

import WebinarsHero from './WebinarsHero';
import WebinarsWhyAttend from './WebinarsWhyAttend';
import WebinarsBottomCTA from './WebinarsBottomCTA';
import Footer from '@/features/marketing/components/Footer';
import type { WebinarsPageData } from './data/webinars';
import type { WebinarReplay } from './data/webinars';

interface Props {
  data: WebinarsPageData;
  replays: WebinarReplay[];
}

export default function WebinarsPage({ data, replays }: Props) {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        <WebinarsHero
          hero={data.hero}
          replays={replays}
          speakerCta={data.speakerCta}
        />
        <WebinarsWhyAttend whyAttend={data.whyAttend} />
        <WebinarsBottomCTA bottomCta={data.bottomCta} />
      </div>
      <Footer />
    </div>
  );
}
