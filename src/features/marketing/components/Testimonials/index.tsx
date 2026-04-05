import { CDN } from '@/lib/cdn';

const TESTIMONIALS = [
  {
    quote: "ISSO is a key piece of how we find, save, review, and communicate around performance creative assets. It's really reduced a lot of friction in the process and has allowed us to review and save 10x more content than we would have otherwise.",
    name: "Connor MacDonald",
    title: "CMO @ Ridge Wallet",
    avatar: `${CDN}/6814ed829560f0bddedd81e3_6478c447be86e2342219433d_Connor%20MacDonald.webp`,
  },
  {
    quote: "My team uses it daily. Creative communication between performance teams, clients and strategists has always been a massive bottleneck. ISSO added structure & efficiency that simply let's everyone do their best work while cutting down needless back and forth.",
    name: "Nick Shackelford",
    title: "Founder @ Structured & Konstant Kreative",
    avatar: `${CDN}/646e13166ca538092d4c53fc_nick-shak.webp`,
  },
  {
    quote: "We use ISSO literally every day at our agency. It started as a simple way to collect ad inspiration but it has turned into such a crucial part of our workflow internally, but more importantly for client communication.",
    name: "Savannah Sanchez",
    title: "Founder @ The Social Savannah",
    avatar: `${CDN}/68307355e138e6b0366b3a58_628EA4nu_400x400.png`,
  },
  {
    quote: "We operate in a highly competitive market, and every time I use Spyder, it feels like an unfair advantage. We have been using it since beta, and easily 90% of our winning ads come from Spyder insights.",
    name: "Stephen Hakami",
    title: "Founder @ Wiza",
    avatar: `${CDN}/6679ebddfad13bb59b5a8f25_TS2G1MWKZ-US2G1MXHD-eb1db3a0ea43-192.png`,
  },
  {
    quote: "This is the #1 tool in my facebook ads toolkit. I use it daily for creative strategy research, compiling content ideas for clients, and even personal content development. If you're trying to make better ad creative, ISSO is not just 'a nice to have'. It's a must.",
    name: "Dara Denney",
    title: "Director of Performance Creative",
    avatar: `${CDN}/646e7c53dd2b77ffdce88775_1671719386025.jpg`,
  },
  {
    quote: "Everyone who works in creative strategy knows 90% of your success ends in a brief with references. Every week I schedule time to build out moodboards for our projects. I do most of this work in ISSO since I can save content from anywhere including my mobile phone.",
    name: "Oren John",
    title: "Creative Director",
    avatar: `${CDN}/68307315081e73189935dab8_1706814091085.jpg`,
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '24px',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {/* Quote mark */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.3 }}>
        <path d="M10.5 21.333C7.5 21.333 5.167 19 5.167 16S7.5 10.667 10.5 10.667c-2 0-3.667 1.667-3.667 4S8.5 18.667 10.5 18.667M21.5 21.333c-3 0-5.333-2.333-5.333-5.333S18.5 10.667 21.5 10.667c-2 0-3.667 1.667-3.667 4S19.5 18.667 21.5 18.667" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      {/* Quote text */}
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        lineHeight: '26px',
        color: 'rgba(255,255,255,0.8)',
        margin: 0,
        flex: 1,
      }}>
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            objectFit: 'cover',
            flexShrink: 0,
          }}
          loading="lazy"
        />
        <div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            letterSpacing: '-0.00642857em',
            marginBottom: '2px',
          }}>
            {testimonial.name}
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {testimonial.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ background: '#000', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1216px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 550,
            lineHeight: '1rem',
            letterSpacing: '0.166667em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.68)',
            display: 'block',
            marginBottom: '12px',
          }}>
            Testimonials
          </span>
          <h2 style={{
            fontFamily: 'Inter Display, Arial, sans-serif',
            fontSize: '44px',
            fontWeight: 600,
            lineHeight: '54px',
            letterSpacing: '-0.0075em',
            color: '#ffffff',
            margin: '0 0 16px 0',
          }}>
            Loved by the world's top creatives.
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            lineHeight: '28px',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '512px',
            margin: '0 auto',
          }}>
            Join thousands of performance marketers and creative teams who trust ISSO to power their ad creative workflow.
          </p>
        </div>

        {/* Testimonial Grid - 3 columns */}
        <div className="testimonials-grid" style={{
          gap: '24px',
        }}>
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <a
            href="https://app.isso.co/sign-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#ffffff',
              color: '#000000',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 550,
              lineHeight: '24px',
              letterSpacing: '-0.01125em',
              borderRadius: '10px',
              padding: '14px 32px',
              textDecoration: 'none',
            }}
          >
            Start
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(-90deg)' }}>
              <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
