// DirectoryHero - top hero section with overline, headline, paragraph.

import type { DirectoryHero } from './types';

interface Props {
  hero: DirectoryHero;
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.25 9.25H16.75V14.5C16.75 15.3284 16.0784 16 15.25 16H4.75C3.92157 16 3.25 15.3284 3.25 14.5V9.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.75 9.25V4C10.75 3.58579 11.0858 3.25 11.5 3.25H14.5C14.9142 3.25 15.25 3.58579 15.25 4V9.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.7529 6.25H12.2529" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.75293 9.25V5.65117C4.75293 5.31057 4.86885 4.9801 5.08162 4.71413L6.01867 3.54282C6.16673 3.35774 6.39091 3.25 6.62793 3.25C6.86495 3.25 7.08912 3.35774 7.23718 3.54282L8.17423 4.71413C8.387 4.9801 8.50292 5.31057 8.50292 5.65117V9.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DirectoryHero({ hero }: Props) {
  return (
    <div className="section">
      <div className="container section-container">
        <div className="agency-directory-hero">
          {/* Content */}
          <div id="w-node-_422c71ff-1b8d-f477-95e5-c8eb41c93ac0-375ff8e1" className="work-hero-content">
            <div className="max-w-lg">
              <div className="flex-col-gap-5 text-balance">
                {/* Overline + icon */}
                <div className="flex-gap-1">
                  <div className="icon-20">
                    <div className="w-embed">
                      <FolderIcon />
                    </div>
                  </div>
                  <div className="text-alpha-100">
                    <h1 className="text-overline">{hero.subtitle}</h1>
                  </div>
                </div>

                {/* Headline */}
                <div className="flex-col-gap-3">
                  <div className="text-white">
                    <h2 className="text-display-h2">{hero.headline}</h2>
                  </div>

                  {/* Paragraph */}
                  <div className="text-balance">
                    <div className="text-alpha-50">
                      <div className="text-body-l">{hero.paragraph}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration placeholder - matches HTML structure */}
          <div className="agency-directory-illustration" />
        </div>
      </div>
    </div>
  );
}
