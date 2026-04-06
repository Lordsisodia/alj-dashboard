import { GradientHeading } from '@/components/ui/gradient-heading';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Who is a good-fit partner?',
    a: 'Freelance PMs/consultants, boutique marketing firms, and niche dev shops that source web/app projects but want a reliable build team.'
  },
  {
    q: 'Do I lose the client relationship?',
    a: 'No. You stay front-facing. We deliver white-label or co-branded based on what you choose per deal.'
  },
  {
    q: 'What deal sizes do you take?',
    a: 'Typical builds range from $25k-$150k. Smaller landing pages are fine if part of a roadmap; larger multi-phase programs work too.'
  },
  {
    q: 'How fast are payouts?',
    a: 'Standard is net 7 days from client payment. Milestone payments mirror the client payment schedule.'
  },
  {
    q: 'Can you help me close the deal?',
    a: 'Yes. We join discovery, produce the SOW, and provide demo assets. You control when and how we appear to the client.'
  },
  {
    q: 'Is there exclusivity?',
    a: 'No exclusivity. Bring as many deals as you like; higher volume unlocks bonus % and faster review queues.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8 md:mb-12"
        >
          <GradientHeading variant="secondary" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            FAQ
          </GradientHeading>
          <p className="text-sm sm:text-base text-siso-text-muted max-w-2xl mx-auto">
            The most common questions partners ask before sending their first lead.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3">
          {faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                className="border border-white/5 rounded-xl bg-black/30 backdrop-blur-sm overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 md:px-6 py-4 text-left"
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <div className="space-y-1">
                    <p className="text-base md:text-lg font-semibold text-white">{item.q}</p>
                    <p className="text-xs text-siso-text-muted">{open ? 'Tap to collapse' : 'Tap to expand'}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-siso-orange transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 md:px-6 pb-4 text-sm text-siso-text/80"
                  style={{ display: open ? 'block' : 'none' }}
                >
                  {item.a}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
