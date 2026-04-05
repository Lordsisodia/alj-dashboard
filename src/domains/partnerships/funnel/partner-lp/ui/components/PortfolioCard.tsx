import { memo } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortfolioCategory } from './PortfolioData';

type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  status: 'live' | 'prototype';
  priceRange: { min: number; max: number };
  technologies: string[];
  image: string;
};

export const PortfolioCard = memo(({ item, index }: { item: PortfolioItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-800/80 bg-black/40 backdrop-blur-sm shadow-lg shadow-black/30"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-siso-orange/90 text-white font-semibold shadow-md shadow-siso-orange/20">
          {item.category}
        </div>
        <div className="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] rounded-full bg-white/10 text-white border border-white/15 flex items-center gap-1">
          {item.status === 'live' ? <BadgeCheck className="w-3 h-3 text-emerald-400" /> : <Rocket className="w-3 h-3 text-yellow-300" />}
          {item.status === 'live' ? 'Live' : 'In build'}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white leading-tight">{item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Avg budget</div>
            <div className="text-sm font-semibold text-siso-orange">
              €{item.priceRange.min.toLocaleString()} - €{item.priceRange.max.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-[11px] rounded-full bg-white/5 text-gray-200 border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Conversion-ready template</span>
          <span className={cn(
            'px-2 py-0.5 rounded-full border text-[11px] font-semibold',
            item.status === 'live'
              ? 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10'
              : 'border-yellow-300/40 text-yellow-200 bg-yellow-500/10'
          )}>
            {item.status === 'live' ? 'Client-ready' : 'Preview'}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

PortfolioCard.displayName = 'PortfolioCard';

