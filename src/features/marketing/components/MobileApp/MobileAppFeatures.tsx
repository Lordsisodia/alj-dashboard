// MobileAppFeatures — three feature sections: save, snap, browse.

import Image from 'next/image';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';
import type { MobileAppPageData } from './data/mobile-app';

interface Props {
  features: MobileAppPageData['features'];
}

function FeatureVideo({
  mp4,
  webm,
  poster,
  className,
}: {
  mp4: string;
  webm: string;
  poster: string;
  className?: string;
}) {
  return (
    <div className={`video-feature-block w-background-video w-background-video-atom ${className ?? ''}`}>
      <LazyVideo
        src={mp4}
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        data-wf-ignore
        data-object-fit="cover"
      />
    </div>
  );
}

export default function MobileAppFeatures({ features }: Props) {
  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="container section-container">
          <div className="mobile-app-main-features">
            {/* Feature 1: Save to ISSO from Phone */}
            <div className="feature-block mobile-app-video">
              <div className="macbook-sync-block-copy">
                <div className="div-block-254">
                  <Image
                    src={features.savePhoneImageSrc}
                    width={183}
                    height={372}
                    alt="iPhone sync"
                    className="image-101"
                  />
                </div>
                <div className="text-white">
                  <div className="mobile-app-feature-content">
                    <h3 className="text-display-h4">{features.saveHeadline}</h3>
                    <div className="max-w-lg">
                      <div className="text-alpha-100">
                        <p className="text-body-l">{features.saveParagraph}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="macbook-sync-holder" />
              </div>
            </div>

            {/* Feature 2: Snap a Photo */}
            <div className="left-right-section">
              <FeatureVideo
                mp4={features.saveVideoMp4}
                webm={features.saveVideoWebm}
                poster={features.saveVideoPoster}
                className="mobile-app-video-holder"
              />
              <div className="left-right-section-content">
                <div className="section-head is-align-left">
                  <div className="app-icon-wrapper">
                    <Image src={features.snapIconIos} width={40} height={40} alt="" className="app-logo" />
                    <Image src={features.snapIconArrow} width={24} height={24} alt="" className="app-to-app-arrows" />
                    <Image src={features.snapIconSwipeFile} width={40} height={40} alt="" className="app-logo" />
                  </div>
                  <div className="section-head_title">
                    <div className="text-white">
                      <h2 className="text-display-h3 mobile-landscape-text-display-h4">
                        {features.snapHeadline}
                      </h2>
                    </div>
                  </div>
                  <div className="section-head_paragraph">
                    <div className="text-alpha-100">
                      <p className="text-body-l">{features.snapParagraph}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Browse Millions of Ads */}
            <div className="left-right-section">
              <div className="left-right-section-content">
                <div className="section-head is-align-left">
                  <div className="app-icon-wrapper">
                    <Image src={features.discoveryIcon} width={40} height={40} alt="" className="app-logo" />
                  </div>
                  <div className="section-head_title">
                    <div className="text-white">
                      <h2 className="text-display-h3 mobile-landscape-text-display-h4">
                        {features.browseHeadline}
                      </h2>
                    </div>
                  </div>
                  <div className="section-head_paragraph">
                    <div className="text-alpha-100">
                      <p className="text-body-l">{features.browseParagraph}</p>
                    </div>
                  </div>
                </div>
              </div>
              <FeatureVideo
                mp4={features.browseVideoMp4}
                webm={features.browseVideoWebm}
                poster={features.browseVideoPoster}
                className="mobile-app-video-holder"
              />
            </div>
          </div>
        </div>
        <div className="container section-container" />
      </div>
      <div className="negative-spacing-bottom" />
    </div>
  );
}
