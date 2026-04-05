import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection = () => {
  const navigate = useNavigate();

  const handleApply = () => navigate('/partners/recruitment/submit-partner');
  const handleCall = () => navigate('/partners/recruitment/submit-partner?book=call');

  return (
    <section id="apply" className="py-14 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-siso-red/15 via-siso-orange/15 to-transparent blur-3xl" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative max-w-5xl mx-auto border border-white/8 bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-siso-red/20 rounded-full blur-3xl" />
          <div className="absolute -right-16 bottom-0 w-48 h-48 bg-siso-orange/20 rounded-full blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[3fr,2fr] items-center">
            <div className="space-y-4">
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold leading-tight">
                Ready to bring us a project?
              </GradientHeading>
              <p className="text-base text-siso-text-muted max-w-2xl">
                Apply once, submit your first lead, and track it end-to-end. We keep you in the loop, on-brand, and paid on schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApply}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-siso-red to-siso-orange text-white text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Apply to the Partner Program <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCall}
                  className="px-6 py-3 rounded-lg border border-siso-orange/30 bg-siso-orange/10 text-siso-orange hover:bg-siso-orange/20 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <PhoneCall className="w-4 h-4" />
                  Book a Partner Call
                </button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-siso-text-muted">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">No exclusivity</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">White-label friendly</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Payout tracker included</span>
              </div>
            </div>

            <div className="relative border border-white/5 rounded-2xl bg-white/5 p-6 space-y-4 shadow-[0_0_60px_-24px_rgba(255,86,33,0.35)]">
              <div className="text-xs text-siso-text-muted uppercase tracking-wide">Snapshot</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-black/30 border border-white/10 p-3">
                  <div className="text-siso-text-muted">Avg. payout</div>
                  <div className="text-white text-lg font-semibold">$7.5k</div>
                </div>
                <div className="rounded-lg bg-black/30 border border-white/10 p-3">
                  <div className="text-siso-text-muted">Close rate with co-sell</div>
                  <div className="text-white text-lg font-semibold">38%</div>
                </div>
                <div className="rounded-lg bg-black/30 border border-white/10 p-3">
                  <div className="text-siso-text-muted">Time to first response</div>
                  <div className="text-white text-lg font-semibold">&lt;4h</div>
                </div>
                <div className="rounded-lg bg-black/30 border border-white/10 p-3">
                  <div className="text-siso-text-muted">Projects delivered</div>
                  <div className="text-white text-lg font-semibold">200+</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
