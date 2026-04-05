// @ts-nocheck
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock,
  FolderOpen,
  Sparkles,
  Star,
  Shield,
  Zap,
  Palmtree,
  Wallet,
  HeartPulse,
  HardHat,
  GraduationCap,
  BookOpen,
  Dumbbell,
  Car,
  UtensilsCrossed,
  Rocket,
} from "lucide-react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import type { PortfolioClient } from "../types";
import type { Industry } from "../types/industry.types";
import { trackPortfolioEvent } from "./analytics";
import { mapClientToPublicProject } from "../lib";
import { PORTFOLIO_ROUTES } from "../constants";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const valueProps = [
  {
    icon: Sparkles,
    title: "Lightning Fast Delivery",
    description: (name: string) => `Get your ${name.toLowerCase()} project live in 48-72 hours, not weeks or months.`,
  },
  {
    icon: Zap,
    title: "AI-Powered Execution",
    description: () => "Our agent-powered pipeline keeps strategy, copy, and code in sync end-to-end.",
  },
  {
    icon: Shield,
    title: "Industry Best Practices",
    description: (name: string) => `We know ${name.toLowerCase()} inside out. Your proof ships with the right flows built in.`,
  },
];

const industryIconMap: Record<string, LucideIcon> = {
  "tourism-activities": Palmtree,
  "fintech-crypto": Wallet,
  "health-wellness": HeartPulse,
  construction: HardHat,
  saas: Rocket,
  elearning: BookOpen,
  "fitness-sports": Dumbbell,
  transportation: Car,
  "food-beverage": UtensilsCrossed,
  "internal-tools": GraduationCap,
};

export type PublicIndustryPageProps = {
  industry: Omit<Industry, "icon">;
  projects: PortfolioClient[];
  isLoading?: boolean;
  error?: string | null;
};

export function PublicIndustryPage({ industry, projects, isLoading = false, error = null }: PublicIndustryPageProps) {
  const router = useRouter();

  if (!industry) {
    return (
      <main className="container mx-auto px-4 py-12 text-center text-siso-text-muted">
        Industry not found.
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12 text-center text-amber-100">
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-6">{error}</div>
      </main>
    );
  }

  const handleProjectClick = (client: PortfolioClient) => {
    trackPortfolioEvent("project_click", { surface: "industry", clientId: client.id, industry: industry.slug });
    router.push(PORTFOLIO_ROUTES.publicClient(industry.slug, client.id));
  };

  const Icon = industryIconMap[industry.id];

  return (
    <main className="main-scroll-container min-h-screen bg-siso-bg text-white">
      <div className="bg-siso-bg-alt border-b border-siso-border">
        <div className="container mx-auto px-4 py-4 text-sm text-siso-text-muted">
          <Link href={PORTFOLIO_ROUTES.publicHub} className="hover:text-white transition">
            Portfolio
          </Link>
          <span className="px-2">/</span>
          <span className="text-white">{industry.name}</span>
        </div>
      </div>

      <section className="relative overflow-hidden">
        {industry.headerImage && (
          <div className="relative h-[360px] md:h-[460px]">
            <img
              src={industry.headerImage}
              alt={`${industry.name} header`}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6 px-4 max-w-4xl"
              >
                <div className="flex items-center justify-center gap-3">
                  {Icon ? <Icon className="w-16 h-16 text-siso-orange" /> : null}
                </div>

                <GradientText
                  colors={["#FF5722", "#FFA726", "#FF5722"]}
                  animationSpeed={5}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold"
                >
                  {industry.name} Portfolio
                </GradientText>

                <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  {industry.description}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8"
                >
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                    <FolderOpen className="w-5 h-5 text-siso-orange" />
                    <span className="font-semibold">{projects.length}</span>
                    <span className="text-white/70">Projects</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                    <Clock className="w-5 h-5 text-siso-orange" />
                    <span className="font-semibold">48-72h</span>
                    <span className="text-white/70">Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                    <Star className="w-5 h-5 text-siso-orange" />
                    <span className="font-semibold">4.9/5</span>
                    <span className="text-white/70">Rating</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <GradientText
            colors={["#FF5722", "#FFA726", "#FF5722"]}
            animationSpeed={5}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Why it works
          </GradientText>
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
            Every build includes on-brand creative, proof-ready copy, and conversion-focused flows.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {valueProps.map((prop) => (
            <motion.div
              key={prop.title}
              variants={itemVariants}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <prop.icon className="w-10 h-10 text-siso-orange mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{prop.title}</h3>
              <p className="text-siso-text-muted">
                {typeof prop.description === "function" ? prop.description(industry.name) : prop.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-12 bg-gradient-to-b from-transparent to-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-siso-text-muted">Case studies</p>
              <h2 className="text-3xl font-bold">Recent wins</h2>
            </div>
            <Button
              variant="secondary"
              className="inline-flex items-center gap-2"
              onClick={() => {
                trackPortfolioEvent("cta_click", { surface: "industry", cta: "book_strategy", industry: industry.slug });
                router.push("/partners");
              }}
            >
              Book a strategy session <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-48 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-siso-text-muted">
              New proofs are generating for this industry. Check back shortly.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <PortfolioCard
                  key={project.id}
                  project={mapClientToPublicProject(project)}
                  onProjectClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
