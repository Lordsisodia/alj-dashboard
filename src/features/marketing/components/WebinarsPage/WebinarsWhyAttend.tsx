// WebinarsWhyAttend — "Why should I attend?" section with 3 benefit cards.

import type { WebinarsPageData } from './data/webinars';

interface Props {
  whyAttend: WebinarsPageData['whyAttend'];
}

function EyeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.16667 19.5C7.08714 19.5 7.83333 18.7538 7.83333 17.8333C7.83333 16.9128 7.08714 16.1666 6.16667 16.1666C5.24619 16.1666 4.5 16.9128 4.5 17.8333C4.5 18.7538 5.24619 19.5 6.16667 19.5Z" stroke="white" strokeWidth="1.66667" />
      <path d="M14.8721 5.5529C15.1387 5.92783 15.5943 6.18378 16.054 6.16853C16.0915 6.16729 16.129 6.16667 16.1666 6.16667C18.0075 6.16667 19.5 7.65905 19.5 9.5C19.5 10.7398 18.823 11.8217 17.8185 12.3958C17.6427 12.4964 17.4964 12.6427 17.3958 12.8186C16.8216 13.8231 15.7398 14.5 14.5 14.5C14.1419 14.5 13.797 14.4435 13.4737 14.339C12.983 14.1804 12.3922 14.342 12.0098 14.6879C11.5663 15.0891 10.9783 15.3333 10.3333 15.3333C8.95258 15.3333 7.83329 14.2141 7.83329 12.8333C7.83329 12.5771 7.71668 12.3283 7.51113 12.1753C6.69514 11.5677 6.16663 10.5956 6.16663 9.5C6.16663 7.65905 7.65901 6.16667 9.49996 6.16667C9.53763 6.16667 9.57515 6.16729 9.61251 6.16853C10.0723 6.18378 10.5279 5.92783 10.7945 5.5529C11.2475 4.91568 11.9919 4.5 12.8333 4.5C13.6747 4.5 14.419 4.91568 14.8721 5.5529Z" stroke="white" strokeWidth="1.66667" strokeLinejoin="round" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 11.1575L5.30789 13.0866C5.60626 13.7991 6.62334 13.7599 6.86648 13.0265L7.85052 10.0582C8.10629 9.28672 9.19523 9.29706 9.43648 10.0733L11.9246 18.0787C12.1775 18.8925 13.3369 18.8507 13.5312 18.0207L16.349 5.97942C16.5396 5.16498 17.6691 5.10349 17.946 5.89246L19.5 10.3195" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.75 7.83337C10.75 9.21408 9.63071 10.3334 8.25 10.3334C6.86929 10.3334 5.75 9.21408 5.75 7.83337C5.75 6.45267 6.86929 5.33337 8.25 5.33337C9.63071 5.33337 10.75 6.45267 10.75 7.83337Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.25 7.83337C18.25 9.21408 17.1307 10.3334 15.75 10.3334C14.3692 10.3334 13.25 9.21408 13.25 7.83337C13.25 6.45267 14.3692 5.33337 15.75 5.33337C17.1307 5.33337 18.25 6.45267 18.25 7.83337Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.3548 17.7751C3.27575 18.2519 3.66153 18.6667 4.14484 18.6667H12.3566C12.8398 18.6667 13.2257 18.2519 13.1466 17.7751C12.0542 11.1861 4.44716 11.1861 3.3548 17.7751Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.7278 12.956C17.199 12.3552 20.0142 13.9625 20.6455 17.7778C20.7244 18.2547 20.3384 18.6667 19.855 18.6667H16.5826" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  eye: <EyeIcon />,
  trending: <TrendingIcon />,
  people: <PeopleIcon />,
};

export default function WebinarsWhyAttend({ whyAttend }: Props) {
  return (
    <div className="section relative">
      <div className="product-page-padding-y">
        <div className="container section-container">
          <div className="lens-security">
            <div className="section-head">
              <div className="section-head-wrapper">
                <div className="section-head_title">
                  <h2 className="text-display-h3">{whyAttend.title}</h2>
                </div>
                <div className="section-head_paragraph">
                  <div className="text-alpha-100">
                    <p className="text-body-m">{whyAttend.paragraph}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lens-security-grid">
              {whyAttend.cards.map((card, idx) => (
                <div key={idx} className={`lens-security-card${idx === 1 ? ' is-middle' : ''}`}>
                  <div className="lens-security-card-head">
                    <div className="icon-24 w-embed">{ICONS[card.icon]}</div>
                    <h3 className="text-label-m">{card.title}</h3>
                  </div>
                  <div className="lens-security-card-body home-card-body">
                    <img
                      src={card.imageSrc}
                      loading="lazy"
                      sizes="(max-width: 767px) 100vw, 768px"
                      alt={card.imageAlt}
                      className="lens-security-card-illustration"
                    />
                  </div>
                  <div className="lens-security-card-footer">
                    <div className="card-button-holder">
                      <div className="text-alpha-50">
                        <div className="text-body-m">{card.body}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
