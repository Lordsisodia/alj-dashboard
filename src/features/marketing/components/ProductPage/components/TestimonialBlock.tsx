import Image from 'next/image';
import type { EmbeddedTestimonial } from '../types';

interface Props {
  t: EmbeddedTestimonial;
}

export default function TestimonialBlock({ t }: Props) {
  if (!t.logoSrc) return null;
  return (
    <div className="home-testimonial-wrapper">
      <div className="testemonial-contents">
        <Image src={t.logoSrc} width={70} height={40} alt={t.logoAlt} className="testimonial-logo-image" />
        <div className="text-quote">{`"${t.quote}"`}</div>
        <div className="testimonial-bio">
          <Image src={t.authorHeadshot} width={40} height={40} alt="" className="testimonial-author-image" />
          <div className="testimonial-avatar-text">
            <div className="text-white">
              <div className="text-label-m">{t.authorName}</div>
            </div>
            <div className="text-alpha-100">
              <div className="text-body-m">{t.authorTitle}</div>
            </div>
          </div>
        </div>
      </div>
      <Image src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/642db608b19bd600e001723a_awward-right.svg" width={120} height={120} alt="" className="testimonial-decoration is-right" />
      <Image src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/642db6082db5f7803a7a121e_award-left.svg" width={120} height={120} alt="" className="testimonial-decoration" />
    </div>
  );
}
