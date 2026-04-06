// AgencyDirectory - assembles hero, sidebar filters, agency feed, and footer.

import DirectoryHero from './DirectoryHero';
import DirectoryFilters from './DirectoryFilters';
import DirectoryFeed from './DirectoryFeed';
import Footer from '@/features/marketing/components/Footer';
import type { AgencyDirectoryData } from './types';

interface Props {
  data: AgencyDirectoryData;
}

export default function AgencyDirectory({ data }: Props) {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        <DirectoryHero hero={data.hero} />

        {/* Main directory section: sidebar + feed */}
        <div className="section">
          <div className="container section-container">
            <div className="agency-directory-main">
              <div className="agency-directory-feed-sidebar">
                <DirectoryFilters filterGroups={data.filterGroups} />
              </div>
              <DirectoryFeed agencies={data.agencies} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
