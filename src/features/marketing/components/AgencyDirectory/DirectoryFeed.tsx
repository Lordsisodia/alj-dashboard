// DirectoryFeed - agency card list with pagination stub.

import type { AgencyCard } from './types';
import DirectoryCard from './DirectoryCard';

interface Props {
  agencies: AgencyCard[];
}

export default function DirectoryFeed({ agencies }: Props) {
  return (
    <div className="agency-directory-feed">
      <div className="w-dyn-list">
        <div
          fs-list-load="pagination"
          fs-list-element="list"
          role="list"
          className="agrendy-directory-feed-list w-dyn-items"
        >
          {agencies.map((agency) => (
            <div key={agency.id} role="listitem" className="w-dyn-item">
              <DirectoryCard agency={agency} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination stub - matches HTML structure */}
      <div role="navigation" aria-label="List" className="w-pagination-wrapper pagination">
        <div aria-label="Page 1 of 2" role="heading" className="w-page-count page-count-2">
          1 / 2
        </div>
        <a href="?0d3b6e6c_page=2" aria-label="Next Page" className="w-pagination-next pagination_previous">
          <div className="w-inline-block">Next</div>
          <svg className="w-pagination-next-icon" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" transform="translate(0, 1)">
            <path fill="none" stroke="currentColor" fillRule="evenodd" d="M4 2l4 4-4 4" />
          </svg>
        </a>
        <link rel="prerender" href="?0d3b6e6c_page=2" />
      </div>
    </div>
  );
}
