import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { ShieldCheck, Handshake, Activity, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';

const PARTICLE_POSITIONS = [
  { top: 10, left: 12, delay: 0.2 },
  { top: 18, left: 72, delay: 0.9 },
  { top: 30, left: 46, delay: 1.6 },
  { top: 44, left: 80, delay: 0.4 },
  { top: 52, left: 18, delay: 1.8 },
  { top: 60, left: 58, delay: 2.6 },
  { top: 70, left: 34, delay: 3.3 },
  { top: 78, left: 85, delay: 0.7 },
  { top: 86, left: 22, delay: 2.1 },
  { top: 92, left: 64, delay: 3.8 }
];

export const WhyPartnerSection = () => {
  const isMobile = useIsMobile();

  const features = [
    {
      icon: Wallet,
      title: 'Transparent Payouts',
      description: 'Flat revenue share with a published schedule so you always know when you get paid.',
      stats: 'On-time since launch',
      highlight: 'Clear %, no surprises'
    },
    {
      icon: Activity,
      title: 'Live Deal Tracking',
      description: 'Portal shows every stage from intake to delivery with notes, files, and ETA.',
      stats: 'Real-time updates',
      highlight: 'Zero blind spots'
    },
    {
      icon: Handshake,
      title: 'Co-Selling Support',
      description: 'We join discovery, scope, and proposals so you can close bigger projects faster.',
      stats: 'Win rate booster',
      highlight: 'Partner-led, SISO-backed'
    },
    {
      icon: ShieldCheck,
      title: 'White-Label Delivery',
      description: 'Keep the client relationship. We deliver under your brand or as your tech arm.',
      stats: 'White/Co-brand options',
      highlight: 'You stay front-and-center'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 }
    }
  };

  const particles = useMemo(
    () => PARTICLE_POSITIONS.slice(0, isMobile ? 6 : PARTICLE_POSITIONS.length),
    [isMobile]
  );

  return (
    <section id="why-partner" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[220px] md:w-[420px] h-[220px] md:h-[420px] bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-full filter blur-[60px] md:blur-[110px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[220px] md:w-[420px] h-[220px] md:h-[420px] bg-gradient-to-r from-siso-orange/10 to-siso-red/10 rounded-full filter blur-[60px] md:blur-[110px] animate-float-slower" />
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-siso-orange/20 rounded-full animate-float-slow"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-siso-orange/30 mb-4">
            <span className="w-2 h-2 bg-siso-orange rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-siso-text-secondary">Partner-first benefits</span>
          </div>
          <GradientHeading variant="secondary" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Why Partners Choose SISO
          </GradientHeading>
          <p className="text-sm sm:text-base text-siso-text-muted max-w-2xl mx-auto">
            Built for partners who source web & app work and want predictable payouts, reliable delivery, and a team that co-sells with them.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-siso-red/6 to-siso-orange/6 rounded-xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative bg-black/25 backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-5 hover:border-siso-orange/25 transition-colors duration-300 h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 relative w-10 h-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-siso-red to-siso-orange opacity-20 rounded-lg blur-sm" />
                    <div className="relative h-full rounded-lg bg-gradient-to-br from-siso-red/12 to-siso-orange/12 p-2">
                      <feature.icon className="w-full h-full text-siso-orange" />
                    </div>
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <div className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-siso-red/12 to-siso-orange/12 text-[11px] text-siso-orange">
                      {feature.stats}
                    </div>
                    <p className="text-sm text-siso-text/80 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-siso-text-bold">
                      <span className="w-1 h-1 rounded-full bg-siso-orange animate-pulse" />
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
