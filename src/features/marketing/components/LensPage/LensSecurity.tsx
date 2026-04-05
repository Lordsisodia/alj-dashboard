import { SecurityCard } from './types';

interface Props {
  cards: SecurityCard[];
}

export default function LensSecurity({ cards }: Props) {
  return (
    <div className="lens-security">
      <div className="section-head">
        <div className="section-head-wrapper">
          <div className="section-head_subtitle">
            <div className="text-overline text-white-68">Security</div>
          </div>
          <h2 className="text-display-h3">Creative data secured under lock &amp; key</h2>
          <p className="text-body-m text-alpha-100">
            Keep your creative data out of the hands of competitors. Work securely with agencies and restrict access on report
            snapshots.
          </p>
        </div>
      </div>
      <div className="lens-security-grid">
        {cards.map((card) => (
          <div key={card.title} className="lens-security-card">
            <div className="lens-security-card-head">
              <div className="icon-24">
                <div className="svg w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={card.svgPath} />
                  </svg>
                </div>
              </div>
              <h3 className="text-label-m">{card.title}</h3>
            </div>
            <div className="lens-security-card-body">
              <img
                src={card.imageUrl}
                loading="lazy"
                alt={card.title}
                className="lens-security-card-illustration"
              />
            </div>
            <div className="lens-security-card-footer">
              <p className="text-body-m text-alpha-50">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
