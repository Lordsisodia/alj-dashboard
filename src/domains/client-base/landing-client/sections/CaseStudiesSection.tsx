import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Star } from 'lucide-react';

const cases = [
  {
    name: 'Fintech mobile app',
    role: 'Partner: boutique marketing firm',
    value: '$120k project',
    stats: [
      { label: 'Close time', value: '14 days' },
      { label: 'Launch', value: '7 weeks' },
      { label: 'NPS', value: '+56' }
    ],
    outcome: 'We co-wrote the deck and SOW; partner stayed front-facing while our pod shipped mobile + web in parallel.'
  },
  {
    name: 'B2B SaaS relaunch',
    role: 'Partner: product consultancy',
    value: '$65k redesign + build',
    stats: [
      { label: 'Conversion lift', value: '+22%' },
      { label: 'Pages built', value: '18' },
      { label: 'Payout', value: '$11.7k' }
    ],
    outcome: 'Joint discovery, we provided component library and analytics; partner retained the client retainer.'
  },
  {
    name: 'Marketplace MVP',
    role: 'Partner: fractional CTO',
    value: '$90k MVP',
    stats: [
      { label: 'Time to beta', value: '6 weeks' },
      { label: 'Daily users', value: '3.4k' },
      { label: 'Payout', value: '$13.5k' }
    ],
    outcome: 'We ran sprint delivery and weekly demos while partner owned stakeholder updates and roadmap.'
  }
];

export const CaseStudiesSection = () => {
  return (
    <section id="case-studies" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[420px] md:w-[640px] h-[420px] md:h-[640px] bg-siso-red/6 rounded-full blur-[120px]" />
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
            Delivery Receipts
          </GradientHeading>
          <p className="text-sm sm:text-base text-siso-text-muted max-w-3xl mx-auto">
            A few recent partner-led wins across fintech, SaaS, and marketplaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cases.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-siso-red/8 to-siso-orange/8 blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative h-full border border-white/5 bg-black/30 backdrop-blur-sm rounded-2xl p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-siso-text-muted">{item.role}</p>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/90">{item.value}</span>
                </div>

                <p className="text-sm text-siso-text/80 leading-relaxed">{item.outcome}</p>

                <div className="grid grid-cols-3 gap-2">
                  {item.stats.map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-white/5 border border-white/5 p-3 text-center">
                      <div className="text-xs text-siso-text-muted flex items-center justify-center gap-1">
                        {stat.label === 'Conversion lift' ? <BarChart3 className="w-3 h-3" /> : null}
                        {stat.label === 'Time to beta' || stat.label === 'Close time' ? <Clock className="w-3 h-3" /> : null}
                        {stat.label === 'NPS' ? <Star className="w-3 h-3" /> : null}
                        <span>{stat.label}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
