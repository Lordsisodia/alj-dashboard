import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'How fast can we launch?',
    a: 'Most partners get a demo-ready MVP in 48–72 hours, then we iterate with you before go-live.'
  },
  {
    q: 'What does it cost to start?',
    a: 'Zero upfront. You pay when you’re happy with the build and ready to launch.'
  },
  {
    q: 'Can you work with our stack?',
    a: 'Yes. We integrate with your CRM, payments, auth, and data sources; we also provide defaults if you want speed.'
  },
  {
    q: 'Who maintains the app?',
    a: 'We offer ongoing support, but you also get clean, documented code so your team can own it.'
  },
  {
    q: 'What about security and compliance?',
    a: 'Enterprise-grade practices: env isolation, access controls, audit logs, and privacy-by-design. We align to your policies.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">FAQs for Partners</h2>
          <p className="text-siso-text-muted text-sm md:text-base">
            Straight answers to the common questions we get from partner teams.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="border border-gray-800 bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-white text-sm md:text-base font-medium">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-siso-orange transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-siso-text text-sm md:text-base leading-relaxed">
                    {item.a}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

FAQSection.displayName = 'FAQSection';
