import { memo, useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Crown, Handshake, Rocket, Star } from 'lucide-react';
import { tierBenefits } from '@/domains/partnerships/earnings/03-tier-progression/data/tierProgression';
import { cn } from '@/lib/utils';

type TierCard = {
  name: string;
  rate: string;
  perks: string[];
  badge?: string;
  icon: React.ComponentType<any>;
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Trailblazer: Rocket,
  Builder: Handshake,
  Vanguard: DollarSign,
  Apex: Star,
  Sovereign: Crown,
};

const tierImageMap: Record<string, string> = {
  Trailblazer: '/tiers/Trailblazer.svg',
  Builder: '/tiers/Builder.svg',
  Vanguard: '/tiers/Vanguard.svg',
  Apex: '/tiers/Apex.svg',
  Sovereign: '/tiers/Sovereign.svg',
};

const shortPerks: Record<string, string[]> = {
  Trailblazer: ['20% recurring', 'Onboarding + hub access', 'Support SLA: 72h'],
  Builder: ['23% recurring', 'Ops betas', 'Support SLA: 48h'],
  Vanguard: ['26% recurring', 'Growth betas', 'Support SLA: 36h'],
  Apex: ['28% recurring', 'Roadmap vote + launches', 'Support SLA: 24h'],
  Sovereign: ['30% recurring', 'Rev-share pilots + concierge', 'Dedicated captain'],
};

const payouts = [
  { label: 'Cadence', value: 'Monthly, post go-live' },
  { label: 'Channel', value: 'ACH / Stripe' },
  { label: 'Visibility', value: 'Real-time in partner hub' },
];

export const EarningsSection = memo(() => {
  const commissionPerks = useMemo(() => {
    const commissionEntry = tierBenefits.find((b) => b.perk === 'Commission rate');
    if (!commissionEntry) return [];
    return Object.entries(commissionEntry.tiers).map(([name, rate]) => {
      const icon = iconMap[name] ?? DollarSign;
      const perks = shortPerks[name] ?? [rate, 'Co-sell with SISO', 'Recurring payouts'];
      const badge = name === 'Vanguard' ? 'Popular' : name === 'Sovereign' ? 'Top tier' : undefined;
      return { name, rate, perks, badge, icon } as TierCard;
    });
  }, []);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handle = () => {
      const itemWidth = 340; // approximate card width incl. gap
      const idx = Math.round(el.scrollLeft / itemWidth);
      setActiveIdx(Math.min(Math.max(idx, 0), commissionPerks.length - 1));
    };
    el.addEventListener('scroll', handle, { passive: true });
    return () => el.removeEventListener('scroll', handle);
  }, [commissionPerks.length]);
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-siso-orange/10 border border-siso-orange/30 text-siso-orange text-xs font-semibold uppercase tracking-[0.14em] mb-4">
            <DollarSign className="w-4 h-4" />
            Earnings
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-siso-text-bold leading-tight mb-3">
            Transparent partner payouts
          </h2>
          <div className="h-1 w-16 mx-auto mb-3 rounded-full bg-siso-orange" />
          <p className="text-siso-text-muted text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Choose how you engage—refer, co-sell, or lead—and get recurring commissions on every deal.
          </p>
        </motion.div>

        <div className="relative -mx-4 px-4">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
          >
          {commissionPerks.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 * idx }}
                className="h-full min-w-[280px] sm:min-w-[320px] md:min-w-[340px] max-w-[380px] snap-start"
              >
                <div className="h-full rounded-[26px] border border-siso-orange/40 bg-siso-bg-secondary shadow-[0_16px_38px_-24px_rgba(0,0,0,0.55)] overflow-hidden">
                  {/* Image header */}
                  <div className="relative h-28">
                    <img
                      src={tierImageMap[tier.name] || '/tiers/Trailblazer.svg'}
                      alt={`${tier.name} tier art`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent" />
                  </div>
                  {/* Double callout: header band */}
                  <div className="relative h-24 bg-gradient-to-br from-siso-orange/20 via-siso-orange/10 to-transparent flex items-center px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-black/30 border border-siso-orange/30 flex items-center justify-center text-siso-orange">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-siso-text-muted">Tier</p>
                        <p className="text-lg font-semibold text-white">{tier.name}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-2xl font-bold text-siso-orange">{tier.rate}</span>
                      {tier.badge && (
                        <span className="px-3 py-1 rounded-full bg-black/30 border border-siso-orange/30 text-xs font-semibold text-siso-orange">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Inner body */}
                  <div className="px-5 pb-5 pt-4 bg-siso-bg-tertiary/90 border-t border-white/5 space-y-3">
                    <div className="flex items-baseline gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-black/30 border border-siso-orange/30 flex items-center justify-center text-siso-orange">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-base font-semibold text-white">{tier.name}</span>
                      </div>
                      {tier.badge && (
                        <span className="px-3 py-1 rounded-full bg-black/30 border border-siso-orange/30 text-xs font-semibold text-siso-orange">
                          {tier.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-siso-orange">{tier.rate}</span>
                    </div>

                    <ul className="space-y-2 text-sm text-siso-text-muted">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-siso-orange/80" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-2">
          {commissionPerks.map((_, idx) => (
            <span
              key={`dot-${idx}`}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-200",
                activeIdx === idx ? "bg-siso-orange" : "bg-white/25"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

EarningsSection.displayName = 'EarningsSection';
