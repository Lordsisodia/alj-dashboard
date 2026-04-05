import Image from 'next/image';
import { BenchmarkSegment, BenchmarkBadge } from './types';

interface Props {
  segments: BenchmarkSegment[];
  badges: BenchmarkBadge[];
}

export default function LensBenchmarking({ segments, badges }: Props) {
  return (
    <div className="lens-benchmarking">
      <div className="self-center">
        <div className="text-overline">Over 100 Benchmarking Segments</div>
      </div>

      {/* Scrollable segment cards */}
      <div className="lens-benchmarking-dynamic-grid">
        <ul role="list" className="carousel-ul w-list-unstyled" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', listStyle: 'none', margin: 0 }}>
          {segments.map((seg) => (
            <li key={seg.name} className="carousel-li" style={{ flexShrink: 0 }}>
              <div className="lens-benchmarking-segment_card" style={{ position: 'relative' }}>
                <Image src={seg.imageUrl} alt={seg.name} className="img-full object-cover" fill sizes="(max-width: 768px) 100vw, 200px" />
                <div className="lens-benchmarking-segment-layout">
                  <div className="text-white">
                    <div className="text-label-m">{seg.name}</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Static badge grid */}
      <div className="lens-benchmarking-static_grid">
        <ul role="list" className="carousel-ul w-list-unstyled" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0 }}>
          {badges.map((badge) => (
            <li key={`${badge.value}-${badge.label}`} className="carousel-li">
              <div className="lens-benchmarking-segment_badge">
                <div className="flex-1">
                  <div className="text-label-m mobile-landscape-text-label-s">{badge.value}</div>
                </div>
                <div className={`lens-benchmarking-segment_label${badge.isGreen ? ' is-green' : ''}`}>
                  <div className="text-label-m mobile-landscape-text-label-s">{badge.label}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
