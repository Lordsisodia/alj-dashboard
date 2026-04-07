
import { useMemo } from 'react';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Bot, Users, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const WhyChooseSection = () => {
  const isMobile = useIsMobile();

  // deterministic particle positions to avoid SSR hydration mismatches
  const particlePositions = useMemo(
    () => {
      const base = [
        { top: 5, left: 12 }, { top: 18, left: 42 }, { top: 26, left: 78 },
        { top: 35, left: 22 }, { top: 44, left: 58 }, { top: 52, left: 85 },
        { top: 61, left: 15 }, { top: 68, left: 48 }, { top: 72, left: 30 },
        { top: 79, left: 66 }, { top: 84, left: 10 }, { top: 88, left: 52 },
        { top: 12, left: 65 }, { top: 56, left: 74 }, { top: 24, left: 8 }
      ];
      return isMobile ? base.slice(0, 8) : base;
    },
    [isMobile]
  );
  
  const features = [
    {
      icon: Bot,
      title: "Recurring Commissions",
      description: "Close SISO deals and collect recurring commissions—delivery handled by us.",
      stats: "Earn on every close",
      highlight: "Revenue-first"
    },
    {
      icon: Users,
      title: "Co-Sell With Our Team",
      description: "Partner reps and SISO closers join your calls, demos, and proposals to boost win rates.",
      stats: "Joint demos",
      highlight: "Higher close"
    },
    {
      icon: Zap,
      title: "Ready-to-Sell Offers",
      description: "Pitch decks, pricing, and case stories you can drop into your pipeline today.",
      stats: "Sell day 1",
      highlight: "Instant ammo"
    },
    {
      icon: ShieldCheck,
      title: "Zero Delivery Risk",
      description: "We build, launch, and support—your focus stays on selling and relationships.",
      stats: "We deliver",
      highlight: "No fulfillment load"
    }
  ];

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-full filter blur-[50px] md:blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-gradient-to-r from-siso-orange/10 to-siso-red/10 rounded-full filter blur-[50px] md:blur-[100px] animate-float-slower" />
        
        {/* Added particle-like decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-siso-orange/20 rounded-full animate-float-slow"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                animationDelay: `${(i % 5) * 0.6}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 relative"
        >
          {/* Enhanced decorative ring behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] md:w-[250px] h-[150px] md:h-[250px] bg-gradient-to-r from-siso-red/5 to-siso-orange/5 rounded-full filter blur-[20px] md:blur-[40px]" />
          
          <GradientHeading variant="secondary" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 relative">
            Why Partner With SISO
          </GradientHeading>

          {/* Enhanced separator with animation */}
          <div className="relative h-1 w-16 md:w-20 mx-auto mb-3 md:mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-siso-red to-siso-orange rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-siso-orange to-siso-red rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <p className="text-sm sm:text-base text-siso-text-muted max-w-xl mx-auto relative">
            A proven sales engine: we co-sell, fulfill, and pay you recurring commissions
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              {/* Optimized card background with streamlined layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-siso-red/5 to-siso-orange/5 rounded-lg transform group-hover:scale-105 transition-transform duration-300 blur-md" />
              
              <div className="relative bg-black/20 backdrop-blur-sm border border-siso-text/10 rounded-lg p-3 sm:p-4 hover:border-siso-orange/20 transition-all duration-300 h-full">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Compact icon container */}
                  <div className="flex-shrink-0 relative w-8 sm:w-10 h-8 sm:h-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-siso-red to-siso-orange opacity-20 rounded-lg blur-sm group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative h-full rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 p-1.5 sm:p-2 group-hover:from-siso-red/20 group-hover:to-siso-orange/20 transition-colors duration-300">
                      <feature.icon className="w-full h-full text-siso-orange" />
                    </div>
                  </div>
                  
                  <div className="space-y-0.5 sm:space-y-1 flex-grow">
                    <h3 className="text-base sm:text-lg font-semibold text-siso-text-bold">
                      {feature.title}
                    </h3>
                    
                    {/* Stats badge */}
                    <div className="inline-block px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 text-xs text-siso-orange">
                      {feature.stats}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-siso-text/80 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Highlight tag */}
                    <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
                      <div className="w-1 h-1 rounded-full bg-siso-orange animate-pulse" />
                      <span className="text-xs text-siso-text-bold">{feature.highlight}</span>
                    </div>
                  </div>
                </div>

                {/* Corner decorative elements */}
                <div className="absolute top-0 right-0 w-8 sm:w-12 h-8 sm:h-12 pointer-events-none">
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-siso-orange/20 rounded-full animate-pulse" />
                  <div className="absolute top-3 sm:top-5 right-3 sm:right-5 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-siso-red/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
