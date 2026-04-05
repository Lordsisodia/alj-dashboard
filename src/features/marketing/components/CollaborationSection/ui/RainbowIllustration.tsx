import { TESTIMONIALS_RAY_1, TESTIMONIALS_RAY_2 } from '../data/testimonials';
import { TestimonialTooltip } from './TestimonialTooltip';

export function RainbowIllustration() {
  return (
    <div style={{ position: 'relative', marginLeft: '-80px', marginRight: '-80px', height: '434px', display: 'grid', gridTemplateColumns: '1fr', marginBottom: '80px' }}>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ zIndex: 6, filter: 'saturate(124%)', aspectRatio: '1', transformStyle: 'preserve-3d', height: '100%', position: 'relative', transform: 'scale(0.97, 0.993)' }}>
          <svg width="100%" height="100%" viewBox="0 0 520 520">
            <defs>
              <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="0%" y2="1200%">
                <stop offset="0%" stopColor="#E77F6E" />
                <stop offset="3.33%" stopColor="#FFC852" />
                <stop offset="6.66%" stopColor="#D2E382" />
                <stop offset="10%" stopColor="#7CDDB5" />
                <stop offset="13.33%" stopColor="#5DBCE5" />
                <stop offset="16.66%" stopColor="#5D8FE5" />
                <stop offset="20%" stopColor="#5DBCE5" />
                <stop offset="23.33%" stopColor="#7CDDB5" />
                <stop offset="26.66%" stopColor="#D2E382" />
                <stop offset="30%" stopColor="#FFC852" />
                <stop offset="33.33%" stopColor="#E77F6E" />
                <stop offset="36.66%" stopColor="#FFC852" />
                <stop offset="40%" stopColor="#D2E382" />
                <stop offset="43.33%" stopColor="#7CDDB5" />
                <stop offset="46.66%" stopColor="#5DBCE5" />
                <stop offset="50%" stopColor="#5D8FE5" />
                <stop offset="53.33%" stopColor="#5DBCE5" />
                <stop offset="56.66%" stopColor="#7CDDB5" />
                <stop offset="60%" stopColor="#D2E382" />
                <stop offset="63.33%" stopColor="#FFC852" />
                <stop offset="66.66%" stopColor="#E77F6E" />
                <stop offset="70%" stopColor="#FFC852" />
                <stop offset="73.33%" stopColor="#D2E382" />
                <stop offset="76.66%" stopColor="#7CDDB5" />
                <stop offset="80%" stopColor="#5DBCE5" />
                <stop offset="83.33%" stopColor="#5D8FE5" />
                <stop offset="86.66%" stopColor="#5DBCE5" />
                <stop offset="90%" stopColor="#7CDDB5" />
                <stop offset="93.33%" stopColor="#D2E382" />
                <stop offset="96.66%" stopColor="#FFC852" />
                <animate attributeName="y1" from="0%" to="-400%" dur="8s" repeatCount="indefinite" />
                <animate attributeName="y2" from="1200%" to="800%" dur="8s" repeatCount="indefinite" />
              </linearGradient>
              <clipPath id="circle-clip">
                <path d="M260 485C338.219 440.605 391 356.476 391 260C391 163.524 338.219 79.395 260 35C181.781 79.395 129 163.524 129 260C129 356.476 181.781 440.605 260 485Z" />
              </clipPath>
            </defs>
            <rect x="0" y="0" width="520" height="520" fill="url(#rainbow-grad)" clipPath="url(#circle-clip)" />
          </svg>
        </div>
      </div>


      <div style={{ position: 'absolute', top: 0, left: 0, width: '58.8889%', height: '100%', display: 'flex', zIndex: 3, borderTop: '1px solid #e9eaef', borderRight: '1px solid #e9eaef', borderBottom: '1px solid #e9eaef', borderLeft: 'none', background: 'linear-gradient(270deg, rgba(255,255,255,0.12), transparent)', borderTopRightRadius: '999px', borderBottomRightRadius: '999px', pointerEvents: 'none' }}>
        <div style={{ zIndex: 2, backgroundImage: 'linear-gradient(90deg, #ffffff, transparent)', width: '72px', margin: '-2px', position: 'relative' }} />
        <div style={{ position: 'absolute', inset: 0, right: '7%' }}>
          {TESTIMONIALS_RAY_1.map((t, i) => <TestimonialTooltip key={i} testimonial={t} />)}
        </div>
      </div>


      <div style={{ position: 'absolute', top: 0, right: 0, width: '58.8889%', height: '100%', display: 'flex', zIndex: 3, borderTop: '1px solid #e9eaef', borderLeft: '1px solid #e9eaef', borderBottom: '1px solid #e9eaef', borderRight: 'none', background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)', borderTopLeftRadius: '999px', borderBottomLeftRadius: '999px', pointerEvents: 'none' }}>
        <div style={{ zIndex: 2, backgroundImage: 'linear-gradient(90deg, #ffffff, transparent)', width: '72px', margin: '-2px', position: 'relative' }} />
        <div style={{ position: 'absolute', inset: 0, left: '-8%' }}>
          {TESTIMONIALS_RAY_2.map((t, i) => <TestimonialTooltip key={i} testimonial={t} isInverted />)}
        </div>
      </div>


    </div>
  );
}
