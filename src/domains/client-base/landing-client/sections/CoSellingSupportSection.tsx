import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { Headset, FileSignature, Presentation, ClipboardList } from 'lucide-react';

const supports = [
  {
    icon: Presentation,
    title: 'Joint discovery + demos',
    description: 'We hop on calls with you to unpack needs, map scope, and show relevant builds.'
  },
  {
    icon: FileSignature,
    title: 'Proposal + SOW drafting',
    description: 'We write the proposal, pricing, milestones, and delivery plan. You keep the client front-facing.'
  },
  {
    icon: ClipboardList,
    title: 'Pre-built assets',
    description: 'Pitch deck slides, case blurbs, and ROI calculators ready to drop into your sales flow.'
  },
  {
    icon: Headset,
    title: 'Partner success desk',
    description: 'Dedicated partner manager + Slack/Email for quick answers on scope, pricing, and delivery.'
  }
];

export const CoSellingSupportSection = () => {
  return (
    <section id="co-selling" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[320px] md:w-[520px] h-[320px] md:h-[520px] bg-siso-orange/10 rounded-full blur-[110px]" />
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
            We Co-Sell With You
          </GradientHeading>
          <p className="text-sm sm:text-base text-siso-text-muted max-w-3xl mx-auto">
            Stay the relationship owner. We bring the technical depth, proposals, and delivery muscle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {supports.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-siso-red/8 to-siso-orange/8 blur-lg group-hover:blur-xl transition-all" />
              <div className="relative border border-white/5 bg-black/30 backdrop-blur-sm rounded-xl p-5 md:p-6 flex gap-4 h-full">
                <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-siso-red/12 to-siso-orange/12 flex items-center justify-center text-siso-orange">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-siso-text/80 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
