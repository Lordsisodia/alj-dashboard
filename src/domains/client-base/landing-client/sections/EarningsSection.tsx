import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { Calculator, Coins, Gift, Timer } from 'lucide-react';

const SHARE_PERCENT = 15; // editable if finance updates the program
const BONUS_PERCENT = 5;  // optional bonus for tiered partners
const PAYOUT_WINDOW_DAYS = 7;

const payoutExample = (projectValue: number) => {
  const base = Math.round((projectValue * SHARE_PERCENT) / 100);
  const bonus = Math.round((projectValue * BONUS_PERCENT) / 100);
  return { base, bonus, total: base + bonus };
};

export const EarningsSection = () => {
  const example = payoutExample(50000);

  const cards = [
    {
      icon: Coins,
      label: 'Base revenue share',
      value: `${SHARE_PERCENT}% on closed revenue`,
      detail: `Paid on every milestone or invoice collected.`
    },
    {
      icon: Gift,
      label: 'Tier bonuses',
      value: `+${BONUS_PERCENT}% on streaks`,
      detail: 'Hit 3 deals in a quarter or $100k in volume to unlock.'
    },
    {
      icon: Timer,
      label: 'Payout speed',
      value: `Net ${PAYOUT_WINDOW_DAYS}d after client payment`,
      detail: 'Tracked inside your payout ledger with expected dates.'
    },
    {
      icon: Calculator,
      label: 'Example payout',
      value: `$${example.total.toLocaleString()}`,
      detail: `On a $50k build: $${example.base.toLocaleString()} base + $${example.bonus.toLocaleString()} bonus.`
    }
  ];

  return (
    <section id="earnings" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-1/3 top-1/2 -translate-y-1/2 w-[480px] md:w-[720px] h-[480px] md:h-[720px] bg-siso-red/8 rounded-full blur-[120px]" />
        <div className="absolute -right-1/4 top-1/3 w-[360px] md:w-[520px] h-[360px] md:h-[520px] bg-siso-orange/8 rounded-full blur-[110px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10 md:mb-14"
        >
          <GradientHeading variant="secondary" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Earnings You Can Forecast
          </GradientHeading>
          <p className="text-sm sm:text-base text-siso-text-muted max-w-3xl mx-auto">
            Clear revenue share, transparent ledger, and predictable payout windows. Update the constants above if the finance model changes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {cards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 blur-lg group-hover:blur-xl transition-all" />
              <div className="relative h-full border border-white/5 bg-black/30 backdrop-blur-sm rounded-xl p-5 md:p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-siso-orange">
                  <card.icon className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-wide text-siso-text-muted">{card.label}</span>
                </div>
                <div className="text-xl font-semibold text-white">{card.value}</div>
                <p className="text-sm text-siso-text/80 leading-relaxed flex-1">{card.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
