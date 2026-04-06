// DirectoryCard - single agency card with logo, name, country, verified badge, services, and industries.

import type { AgencyCard } from './types';

interface Props {
  agency: AgencyCard;
}

function VerifiedBadge() {
  return (
    <div className="agency-directory-verified-badge">
      <img
        src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/691f5c6f5a60a7669c84e1fb_verified-icon.svg"
        loading="lazy"
        alt=""
        className="icon-20"
      />
      <div className="text-white">
        <div className="text-label-m">Verified Agency</div>
      </div>
    </div>
  );
}

export default function DirectoryCard({ agency }: Props) {
  return (
    <div className="ad-feed-item">
      {/* Header row: logo + name + country + verified */}
      <a href={`/agencies/${agency.slug}`} className="ad-feed-item-header w-inline-block">
        <div className="flex-gap-3">
          <img
            src={agency.logoSrc}
            loading="lazy"
            alt={agency.logoAlt}
            className="ad-feed-item-logo"
          />
          <div className="flex-col-gap-1 align-start">
            <div className="text-white">
              <div className="text-label-l">{agency.name}</div>
            </div>
            <div className="flex-gap-1">
              <img
                src={agency.countryFlagSrc}
                loading="lazy"
                alt=""
                className="agency-directory-location-flag"
              />
              <div className="text-alpha-100">
                <div className="text-label-s">{agency.country}</div>
              </div>
            </div>
          </div>
        </div>
        {agency.isVerified && <VerifiedBadge />}
      </a>

      {/* Content: services + industries */}
      <div className="ad-feed-item-content">
        {/* Core Services */}
        <div className="ad-feed-item-content-list">
          <div className="text-overline">
            <div>Core Services</div>
          </div>
          <div className="w-dyn-list">
            <div role="list" className="flex-gap-1 w-dyn-items">
              {agency.services.map((service) => (
                <div key={service} role="listitem" className="agency-directory-list-item w-dyn-item">
                  <div className="text-alpha-50">
                    <div className="text-label-s">{service}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Industries */}
        <div className="ad-feed-item-content-list">
          <div className="text-overline">
            <div>Core Industries</div>
          </div>
          <div className="w-dyn-list">
            <div role="list" className="flex-gap-1 w-dyn-items">
              {agency.industries.map((industry) => (
                <div key={industry} role="listitem" className="agency-directory-list-item w-dyn-item">
                  <div className="text-alpha-50">
                    <div className="text-label-s">{industry}</div>
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
