import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { Activity, FileText, Wallet, Users } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Deal Tracker',
    description: 'See every stage with timestamps, owner, and next action. Exportable updates for your client.',
    tag: 'Pipeline visibility'
  },
  {
    icon: FileText,
    title: 'Docs & Assets',
    description: 'SOWs, proposals, timelines, and design links live in one place with permissions you control.',
    tag: 'Single source of truth'
  },
  {
    icon: Wallet,
    title: 'Payout Ledger',
    description: 'Upcoming payouts, cleared payouts, and receipts. Filter by client or date and download CSV.',
    tag: 'Always-on accounting'
  },
  {
    icon: Users,
    title: 'Invite Your Team',
    description: 'Add AE/AM teammates or finance to keep everyone aligned without extra back-and-forth.',
    tag: 'Role-based access'
  }
];

export const PortalFeaturesSection = () => {
  return (
    <section id="portal" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-10 md:mb-14"
        >
          <div>
            <GradientHeading variant="secondary" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Partner Portal Highlights
            </GradientHeading>
            <p className="text-sm sm:text-base text-siso-text-muted max-w-2xl">
              Everything you and your clients need in one place-no spreadsheets or mystery updates.
            </p>
          </div>
          <div className="text-xs text-siso-text-muted uppercase tracking-wide">Real-time · Secure · White-label friendly</div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-siso-red/8 to-siso-orange/8 blur-lg group-hover:blur-xl transition-all" />
              <div className="relative border border-white/5 bg-black/25 backdrop-blur-sm rounded-xl p-5 flex flex-col gap-3 h-full">
                <div className="flex items-center gap-3 text-siso-orange">
                  <feature.icon className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-wide text-siso-text-muted">{feature.tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-siso-text/80 leading-relaxed flex-1">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
