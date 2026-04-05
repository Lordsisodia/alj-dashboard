// MobileAppHero — hero section with phone mockup, video, headline, and app store CTAs.

import Image from 'next/image';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';
import type { MobileAppPageData } from './data/mobile-app';

interface Props {
  hero: MobileAppPageData['hero'];
}

export default function MobileAppHero({ hero }: Props) {
  return (
    <section id="product-hero-section" className="section relative">
      <canvas id="product-hero-canvas" className="product-hero-canvas" />
      <div className="container">
        <div className="product-hero mobile-app-hero">
          <div data-w-id="cc92a1ef-d552-fb81-fdd7-0cbcee7f43e0" className="product-hero-animation-trigger" />
          <div className="product-hero-sticky">
            <div className="mobile-phone-wrapper">
              <div className="div-block-253">
                <Image
                  width={176}
                  height={358}
                  src={hero.heroImageSrc}
                  alt="ISSO ad library software screenshot"
                  className="iphone"
                />
                <div className="background-video-9 w-background-video w-background-video-atom">
                  <LazyVideo
                    src={hero.heroVideoMp4}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={hero.heroVideoPoster}
                    data-wf-ignore
                    data-object-fit="cover"
                  />
                </div>
              </div>
            </div>
            <div className="product-hero-content">
              <h1 className="text-overline text-white-68">{hero.subtitle}</h1>
              <div className="hero-text">
                <h2 className="text-display-h1 hero-title">{hero.headline}</h2>
                <div className="max-w-lg">
                  <div className="text-alpha-100">
                    <p className="text-body-l text-white-84">{hero.paragraph}</p>
                  </div>
                </div>
              </div>
              <div className="main-cta-buttons">
                <a
                  href={hero.appStoreHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-dark button-secondary w-inline-block"
                >
                  <div className="button-text-block">
                    <Image src={hero.appStoreIconSrc} alt="Download on the App Store" className="marketplace-cta-image" width={120} height={40} />
                  </div>
                </a>
                <a
                  href={hero.googlePlayHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-dark button-secondary w-inline-block"
                >
                  <div className="button-text-block">
                    <Image src={hero.googlePlayIconSrc} alt="Get it on Google Play" className="marketplace-cta-image" width={135} height={40} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
