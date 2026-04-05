import ChevronIcon from './ChevronIcon';
import type { ProductHero as ProductHeroType } from '../types';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

interface Props {
  hero: ProductHeroType;
}

export default function ProductHero({ hero }: Props) {
  return (
    <section id="product-hero-section" className="section relative">
      <div className="dot-bg" />
      <div className="container">
        <div className="product-hero">
          <div className="product-hero-sticky">
            <div className="product-hero-icon">
              <div className="product-hero-icon-video">
                <LazyVideo src={hero.animatedIconVideoSrc} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
              </div>
              <img
                src={hero.staticIconSrc}
                loading="lazy"
                width={128}
                height={128}
                alt={`${hero.subtitle} icon`}
                className="product-hero-icon-image"
              />
            </div>
            <div className="product-hero-content">
              <h1 className={`text-overline${hero.subtitle === 'Lens' ? '' : ' text-white-68'}`}>
                {hero.subtitle}
              </h1>
              <div className="hero-text">
                <h2 className="text-display-h1 hero-title">{hero.headline}</h2>
                <div className="max-w-lg">
                  <div className="text-alpha-100">
                    <p className="text-body-l text-white-84">{hero.paragraph}</p>
                  </div>
                </div>
              </div>
              <a href={hero.ctaHref} className="button-dark button-primary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">Start free trial</div>
                </div>
                <div className="button-icon-block icon-right opacity-100">
                  <div className="icon-24">
                    <div className="svg w-embed"><ChevronIcon /></div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="product-hero-preview">
            <div className="product-hero-video w-embed">
              <LazyVideo src={hero.heroVideoSrc} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
            </div>
            <img
              src={hero.mockupSrc}
              loading="lazy"
              width={1440}
              height={900}
              alt="Apple Pro XDR monitor mockup"
              srcSet={`${hero.mockupSrc.replace('.webp', '-p-500.webp')} 500w, ${hero.mockupSrc.replace('.webp', '-p-800.webp')} 800w, ${hero.mockupSrc.replace('.webp', '-p-1080.webp')} 1080w, ${hero.mockupSrc.replace('.webp', '-p-1600.webp')} 1600w, ${hero.mockupSrc.replace('.webp', '-p-2000.webp')} 2000w, ${hero.mockupSrc} 2160w`}
              sizes="(max-width: 1439px) 100vw, 1440px"
              className="product-hero-preview-image"
            />
            <div className="product-hero-preview-underlay" />
            <div
              data-poster-url={hero.heroVideoPoster}
              data-video-urls={hero.heroVideoPoster}
              data-autoplay="true"
              data-loop="true"
              data-wf-ignore="true"
              className="product-hero-video w-background-video w-background-video-atom"
            >
              <LazyVideo
                src={hero.heroVideoPoster}
                autoPlay
                loop
                muted
                playsInline
                poster={hero.heroVideoPoster}
                data-wf-ignore="true"
                data-object-fit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
