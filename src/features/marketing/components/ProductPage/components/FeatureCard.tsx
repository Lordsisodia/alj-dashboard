import Image from 'next/image';
import type { SmartFeatureCard } from '../types';

interface Props {
  card: SmartFeatureCard;
}

export default function FeatureCard({ card }: Props) {
  return (
    <div className="product-page-feature-block-new">
      <Image src={card.imageSrc} width={599} height={400} alt={card.title} className="product-page-feature-image" />
      <div className="product-page-feature-content">
        <div className="text-white">
          <div className="product-page-feature-text">
            <h3 className="text-label-m">{card.title}</h3>
            <div className="text-alpha-100">
              <p className="text-body-m">{card.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
