import { memo, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderOpen, ChevronRight } from 'lucide-react';
import { PublicIndustryCategoryCard } from '@/domains/portfolio/public/PublicIndustryCategoryCard';
import { industries } from '@/domains/portfolio/data/industries';
import { GradientHeading } from '@/components/ui/gradient-heading';

export const PortfolioSection = memo(() => {
  // Use the same industry cards as the portfolio landing (include Elementary/food-beverage).
  const featuredIndustries = useMemo(
    () => industries.filter((i) => ["food-beverage", "saas", "fintech-crypto"].includes(i.id)).slice(0, 3),
    []
  );

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left lg:text-center mb-10 md:mb-12 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
            bg-siso-orange/10 border border-siso-orange/30 text-siso-orange mb-5 shadow-[0_10px_30px_-18px_rgba(255,153,94,0.45)] uppercase tracking-[0.14em] text-xs font-semibold">
            <FolderOpen className="w-4 h-4" />
            <span>Portfolio</span>
          </div>
          
          <GradientHeading
            variant="secondary"
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
          >
            Proofs partners use to close deals
          </GradientHeading>
          
          <div className="h-1 w-16 mx-auto mb-3 rounded-full bg-siso-orange" />
          
          <p className="text-siso-text-muted text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Scan a few partner-ready wins, then open the full library.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative -mx-4 px-4"
        >
          <div className="flex gap-5 md:gap-7 overflow-x-auto pb-6 snap-x snap-mandatory">
            {featuredIndustries.map((industry, idx) => (
              <div
                key={industry.id}
                className="min-w-[320px] sm:min-w-[380px] md:min-w-[420px] max-w-[460px] snap-start"
              >
                <PublicIndustryCategoryCard industry={industry.id} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="flex justify-center gap-2 mt-2"
        >
          {featuredIndustries.map((industry, idx) => (
            <span
              key={industry.id}
              className="h-1.5 w-1.5 rounded-full bg-white/25"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex justify-center mt-6"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-siso-red to-siso-orange text-white font-semibold shadow-lg shadow-siso-orange/25 hover:opacity-90 transition-all duration-200"
          >
            View portfolio
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

PortfolioSection.displayName = 'PortfolioSection';
