import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { UploadCloud, FileCheck2, Rocket, Coins } from 'lucide-react';

const steps = [
  {
    icon: UploadCloud,
    title: 'Submit a Lead',
    description: 'Share the client, scope, and timing inside the partner portal. We acknowledge within hours.',
    meta: '1 minute form'
  },
  {
    icon: FileCheck2,
    title: 'Co-Scope & Propose',
    description: 'We join discovery, write the SOW, and price it with margin for you. You stay in the loop.',
    meta: 'Collaborative'
  },
  {
    icon: Rocket,
    title: 'We Build & Deliver',
    description: 'Dedicated pod executes with milestone check-ins. You can keep it white-label or co-branded.',
    meta: 'Weekly demos'
  },
  {
    icon: Coins,
    title: 'You Get Paid',
    description: 'Payouts hit on the cadence we set together. Track status and upcoming payouts in the portal.',
    meta: 'Transparent payouts'
  }
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10 md:mb-14"
        >
          <GradientHeading variant="secondary" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            How the Partner Program Flows
          </GradientHeading>
          <p className="text-sm sm:text-base text-siso-text-muted max-w-2xl mx-auto">
            Give us the lead, we handle delivery, you keep the relationship and share in the revenue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-siso-red/8 to-siso-orange/8 blur-lg group-hover:blur-xl transition-all" />
              <div className="relative border border-white/5 bg-black/30 backdrop-blur-sm rounded-xl p-5 md:p-6 flex gap-4 md:gap-5">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-siso-red/12 to-siso-orange/12 flex items-center justify-center text-siso-orange">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 min-w-[28px] px-2 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/80">
                      {index + 1}
                    </span>
                    <span className="text-xs text-siso-text-muted uppercase tracking-wide">{step.meta}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-siso-text/80 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
