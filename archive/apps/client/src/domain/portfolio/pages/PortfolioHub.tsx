/**
 * Portfolio Domain - Portfolio Hub Page
 * Route: /portfolio
 *
 * Main portfolio landing page with:
 * - Hero section with gradient title
 * - Industry grid navigation
 * - Featured projects carousel
 * - Partner CTA section
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Waves } from '@/components/ui/waves-background';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GradientText } from '@/components/ui/gradient-text';
import {
  FolderOpen,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import { usePortfolioData } from '../hooks';
import { industries } from '../data/industries';
import { IndustryCategoryCard } from '../components/shared';
import { Helmet } from 'react-helmet-async';
import AnimatedNumberCountdown from '@/components/ui/countdown-number';
import { PortfolioStatsSection } from '../components/PortfolioStatsSection';

// Animation variants
const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export function PortfolioHub() {
  const navigate = useNavigate();
  const { stats } = usePortfolioData();

  // Count-up since agency creation date: December 10, 2024
  const AGENCY_CREATED_AT = React.useMemo(() => new Date(2024, 11, 10), []); // months are 0-indexed
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Portfolio - AI-Powered Websites & PWAs | SISO</title>
        <meta
          name="description"
          content="See how we've transformed businesses across industries with AI-powered development. Websites and PWAs delivered in 48-72 hours."
        />
        <meta
          name="keywords"
          content="portfolio, AI development, websites, PWAs, case studies, SISO projects"
        />
        <meta property="og:title" content="Portfolio - AI-Powered Websites & PWAs | SISO" />
        <meta
          property="og:description"
          content="Browse our portfolio of AI-powered websites and PWAs across industries."
        />
        <link rel="canonical" href="https://siso.com/portfolio" />
      </Helmet>

      <main className="portfolio-hub main-scroll-container bg-siso-bg">
        {/* Hero Section */}
        <section className="min-h-[50vh] flex items-center justify-center relative overflow-hidden py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 z-10 px-4"
          >
            {/* Agency founding date badge */}
            <Badge variant="outline" className="border-siso-orange/40 text-siso-orange bg-siso-orange/10">
              Founded on Dec 10, 2024
            </Badge>

            {/* Agency founding date live counter (count-up) */}
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <AnimatedNumberCountdown startDate={AGENCY_CREATED_AT} endDate={now} />
            </div>

            <GradientText
              colors={["#FF5722", "#FFA726", "#FF5722"]}
              animationSpeed={5}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-bold"
            >
              Our Portfolio
            </GradientText>
            <p className="text-lg sm:text-xl md:text-2xl text-siso-text max-w-3xl mx-auto leading-relaxed">
              See how we transform businesses across industries.
            </p>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8"
            >
              <div className="flex items-center gap-2 text-siso-text">
                <FolderOpen className="w-5 h-5 text-siso-orange" />
                <span className="font-semibold">{stats.totalProjects}+</span>
                <span className="text-siso-text-muted">Projects</span>
              </div>
              <div className="flex items-center gap-2 text-siso-text">
                <Clock className="w-5 h-5 text-siso-orange" />
                <span className="font-semibold">48-72h</span>
                <span className="text-siso-text-muted">Demo</span>
              </div>
              <div className="flex items-center gap-2 text-siso-text">
                <Star className="w-5 h-5 text-siso-orange" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-siso-text-muted">Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Waves Background */}
          <Waves
            lineColor="rgba(255, 87, 34, 0.2)"
            backgroundColor="transparent"
            waveSpeedX={0.018}
            waveSpeedY={0.015}
            waveAmpX={70}
            waveAmpY={35}
            friction={0.92}
            tension={0.012}
            maxCursorMove={180}
            xGap={22}
            yGap={55}
          />
        </section>

        {/* Portfolio Stats Section */}
        <PortfolioStatsSection stats={stats} />

        {/* Industry Grid Section */}
        <section className="py-10 md:py-16 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <GradientText
              colors={["#FF5722", "#FFA726", "#FF5722"]}
              animationSpeed={5}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              Browse by Industry
            </GradientText>
            <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
              Explore our work across {industries.length} diverse industries
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {industries.map((industry) => (
              <IndustryCategoryCard
                key={industry.id}
                industry={industry.id}
              />
            ))}
          </motion.div>
        </section>

        {/* Partner CTA Section */}
        <section className="py-12 md:py-20 bg-siso-bg-alt/80">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="max-w-4xl mx-auto border border-siso-border bg-siso-bg shadow-2xl shadow-black/40 overflow-hidden relative">
                {/* Subtle overlay for depth without washing out dark theme */}
                <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(circle_at_30%_20%,rgba(255,87,34,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,167,38,0.12),transparent_40%)]" />

                <CardContent className="p-6 sm:p-10 lg:p-12 relative z-10 space-y-8">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex justify-center">
                      <div className="bg-siso-orange/15 p-4 rounded-full border border-siso-orange/30">
                        <TrendingUp className="w-10 h-10 text-siso-orange" />
                      </div>
                    </div>

                    <div className="space-y-2 max-w-2xl">
                      <Badge className="bg-siso-orange/20 text-siso-orange border-siso-orange/40 text-xs tracking-wide px-3 py-1">
                        Partner Program
                      </Badge>
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">Earn 30% Commission</h3>
                      <p className="text-base sm:text-lg text-siso-text-muted">
                        Refer clients and earn <span className="font-semibold text-white">20% commission</span> on every project.
                        Team leaders earn an additional <span className="font-semibold text-white">10%</span>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-siso-bg-alt border border-siso-border">
                      <Users className="w-6 h-6 text-siso-orange" />
                      <span className="font-semibold text-white text-sm">No Quotas</span>
                      <span className="text-xs text-siso-text-muted">Refer at your pace</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-siso-bg-alt border border-siso-border">
                      <Award className="w-6 h-6 text-siso-orange" />
                      <span className="font-semibold text-white text-sm">Recurring Income</span>
                      <span className="text-xs text-siso-text-muted">Lifetime commissions</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-siso-bg-alt border border-siso-border">
                      <Star className="w-6 h-6 text-siso-orange" />
                      <span className="font-semibold text-white text-sm">Full Support</span>
                      <span className="text-xs text-siso-text-muted">We close the deals</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
                    <Button
                      size="lg"
                      onClick={() => navigate('/client/dashboard')}
                      className="w-full sm:w-auto bg-siso-orange hover:bg-siso-orange/90 text-black font-semibold px-8 py-4 h-auto"
                    >
                      Become a Partner
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-xs sm:text-sm text-siso-text-muted text-center sm:text-left w-full sm:w-auto">
                      Join 100+ partners already earning with SISO
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
