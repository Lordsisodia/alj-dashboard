import { GradientHeading } from '@/components/ui/gradient-heading';
import { CheckCircle, ArrowRight, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    day: 'Day 0',
    title: 'Onboard & toolkit',
    description: 'Sign the partner terms, get your referral links, and sync on commission plan.',
    duration: '15-20 min',
    color: 'from-siso-orange to-siso-red'
  },
  {
    day: 'Day 0',
    title: 'Watch the playbook',
    description: 'Short course: product tour, offer script, pricing guardrails, objection handling.',
    duration: '30-45 min',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    day: 'Day 1',
    title: 'Product demo & pipeline setup',
    description: 'Load your first targets, customize decks, and line up co-sell demos with SISO.',
    duration: '2-4 hrs',
    color: 'from-purple-500 to-pink-500'
  },
  {
    day: 'Day 2',
    title: 'Outreach & first closes',
    description: 'Run outreach sequences, book calls, and close with our squad on the line-earn on every win.',
    duration: 'Live ongoing',
    color: 'from-green-500 to-emerald-500'
  }
];

export const PartnerProcessSection = () => (
  <section className="py-12 md:py-16 relative overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-siso-orange/10 border border-siso-orange/30 text-siso-orange text-xs font-semibold uppercase tracking-wide mb-3">
          <Timer className="w-3.5 h-3.5" />
          48-hour launch
        </div>
        <GradientHeading
          variant="secondary"
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4"
        >
          From signup to first commission in 48 hours
        </GradientHeading>
        <p className="text-sm sm:text-base text-siso-text-muted max-w-2xl mx-auto">
          Onboard, learn the playbook, line up demos with us, then outreach and close-earn faster with our co-sell squad.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.08, duration: 0.55 }}
              className="relative text-center"
            >
              <div
                className={`inline-block px-4 py-2 bg-gradient-to-r ${step.color} rounded-full text-sm font-bold text-white mb-4`}
              >
                {step.day}
              </div>

              <div className="bg-siso-bg-tertiary border border-siso-border rounded-xl p-6 shadow-lg shadow-black/20 hover:border-siso-orange/30 transition-all duration-300 h-full">
                <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-siso-text-bold mb-2">{step.title}</h3>
                <p className="text-sm text-siso-text mb-3">{step.description}</p>
                <div className="text-xs text-siso-text-muted">Duration: {step.duration}</div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-siso-orange" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center mt-10"
      >
        <div className="inline-block px-6 py-3 bg-black/30 backdrop-blur-sm border border-siso-orange/30 rounded-full">
          <span className="text-sm text-siso-text">
            ⚡ 48-hour guarantee - we deliver a demo-worthy build or you don't pay.
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

PartnerProcessSection.displayName = 'PartnerProcessSection';
