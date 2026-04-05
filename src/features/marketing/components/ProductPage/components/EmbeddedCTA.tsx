import Image from 'next/image';
import ChevronIcon from './ChevronIcon';
import type { EmbeddedCTA as EmbeddedCTAType } from '../types';

interface Props {
  data: EmbeddedCTAType;
}

export default function EmbeddedCTA({ data }: Props) {
  if (!data.headline) return null;
  const paragraphs = data.paragraph.split('\n').filter(Boolean);

  return (
    <div className="section">
      <div className="container section-container">
        <div className="cta">
          <div className="cta-block">
            <div className="cta-block-content">
              <div className="flex-col-gap-2 align-start text-balance">
                <div className="text-white">
                  <h2 className="text-display-h3 mobile-landscape-text-display-h4">{data.headline}</h2>
                </div>
                <div className="text-alpha-100">
                  <div className="text-balance">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="text-body-l mobile-landscape-text-body-n">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-col-gap-3">
                <a href={data.primaryCtaHref} className="button-dark button-primary w-inline-block">
                  <div className="button-text-block">
                    <div className="text-heading-m">{data.primaryCtaText}</div>
                  </div>
                  <div className="button-icon-block icon-right opacity-100">
                    <div className="icon-24">
                      <div className="svg w-embed"><ChevronIcon /></div>
                    </div>
                  </div>
                </a>
                {data.showNoCcBadge && (
                  <div className="no-cc-required">
                    <div className="flex-gap-2">
                      <div className="icon-20">
                        <div className="svg w-embed">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 20 20">
                            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".68" strokeWidth="1.5" d="M2.3 8.13v6.24c0 .92.74 1.67 1.66 1.67h7.29M2.29 8.13v-2.5c0-.92.75-1.67 1.67-1.67h12.08c.92 0 1.66.74 1.66 1.66v2.5m-15.4 0h15.4m0 0v1.25M17.8 12.6l-1.76 1.77m0 0-1.77 1.77m1.77-1.77-1.77-1.77m1.77 1.77 1.76 1.77" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-alpha-100">
                        <div className="text-label-s">No credit card required</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {data.iconSrc && (
              <div className="cta-block-icon">
                <Image src={data.iconSrc} width={80} height={80} alt="product icon" className="cta-block-icon-image" style={{ display: 'block' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
