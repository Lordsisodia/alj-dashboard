"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { IndustryCategory } from "../types";
import { getIndustryById } from "../data/industries";
import { useRouter } from "next/navigation";

interface IndustryCategoryCardProps {
  industry: IndustryCategory;
  className?: string;
  isActive?: boolean;
  onSelect?: (slug: string) => void;
}

type IndustryMetrics = {
  projectCount: number;
  avgValue: number;
  rating: number;
  topTech: string[];
  tokensUsed?: number;
  clientSlug?: string;
  featuredProject?: {
    name: string;
    date: string;
  };
};

const industryMetrics: Record<IndustryCategory, IndustryMetrics> = {
  "tourism-activities": {
    projectCount: 1,
    avgValue: 13000,
    rating: 4.8,
    topTech: ["Next.js", "Tailwind", "Stripe"],
    featuredProject: { name: "Elementary Restaurant", date: "Oct 2024" },
  },
  "fintech-crypto": {
    projectCount: 1,
    avgValue: 25000,
    rating: 4.9,
    topTech: ["React", "Web3.js", "Tailwind"],
    featuredProject: { name: "Uber Crypt", date: "Nov 2024" },
  },
  "health-wellness": {
    projectCount: 1,
    avgValue: 12000,
    rating: 4.8,
    topTech: ["React", "Node.js", "MongoDB"],
    featuredProject: { name: "Shout Health", date: "Oct 2024" },
  },
  "construction": {
    projectCount: 2,
    avgValue: 18000,
    rating: 4.9,
    topTech: ["React", "Tailwind", "Node.js"],
    featuredProject: { name: "Optimal Construction", date: "Dec 2024" },
  },
  saas: {
    projectCount: 2,
    avgValue: 35000,
    rating: 5.0,
    topTech: ["React", "TypeScript", "Supabase"],
    featuredProject: { name: "SISO Internal Platform", date: "Dec 2024" },
  },
  elearning: {
    projectCount: 1,
    avgValue: 20000,
    rating: 4.8,
    topTech: ["React", "Tailwind", "Video API"],
    featuredProject: { name: "Mooshin", date: "Oct 2024" },
  },
  "fitness-sports": {
    projectCount: 2,
    avgValue: 16000,
    rating: 4.9,
    topTech: ["React", "Next.js", "Tailwind"],
    featuredProject: { name: "Gritness Gym", date: "Dec 2024" },
  },
  transportation: {
    projectCount: 1,
    avgValue: 14000,
    rating: 4.7,
    topTech: ["React", "Tailwind", "Booking API"],
    featuredProject: { name: "5 Star Car Hire", date: "Nov 2024" },
  },
  "food-beverage": {
    projectCount: 1,
    avgValue: 13000,
    rating: 4.9,
    topTech: ["Next.js", "Stripe", "Tailwind"],
    tokensUsed: 200_000_000,
    clientSlug: "elementary",
    featuredProject: { name: "Elementary Restaurant", date: "Oct 2024" },
  },
  "internal-tools": {
    projectCount: 2,
    avgValue: 45000,
    rating: 5.0,
    topTech: ["React", "TypeScript", "Supabase"],
    featuredProject: { name: "SISO Internal Platform", date: "Dec 2024" },
  },
};

export function PublicIndustryCategoryCard({ industry, className, isActive = false, onSelect }: IndustryCategoryCardProps) {
  const router = useRouter();
  const industryData = getIndustryById(industry);
  const metrics = industryMetrics[industry];

  if (!industryData) return null;
  const Icon = industryData.icon;
  const handleSelect = () => onSelect?.(industryData.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={cn(
        "group cursor-pointer",
        className,
        isActive ? "shadow-[0_20px_45px_-25px_rgba(255,120,60,0.55)]" : ""
      )}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
    >
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-[26px] border border-siso-orange/50 bg-siso-bg-secondary shadow-[0_18px_38px_-24px_rgba(0,0,0,0.65)] transition-all duration-300",
          isActive ? "ring-2 ring-siso-orange/60 ring-offset-0 border-siso-orange/60" : "hover:border-siso-orange/60"
        )}
      >
        {/* Outer header image stays in the shell */}
        {industryData.headerImage ? (
          <div className="relative z-0 h-48 sm:h-52 overflow-hidden">
            <img
              src={industryData.headerImage}
              alt={industryData.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-transparent" />
          </div>
        ) : null}

        {/* Inner content (second callout) */}
        <div className="px-3 pb-3 relative z-10 -mt-6 sm:-mt-7">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-siso-bg-secondary shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-siso-orange",
                      industryData.color.replace("bg-", "text-")
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">{industryData.name}</p>
                    <p className="text-xs text-siso-text-muted leading-snug line-clamp-2">{industryData.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <Badge variant="outline" className="border-white/15 bg-white/10 text-[11px] font-semibold text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-siso-orange" /> {metrics.rating.toFixed(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-siso-text-muted">Avg value</p>
                  <p className="text-lg font-semibold text-white">${metrics.avgValue.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-siso-text-muted">Tokens used</p>
                  <p className="text-lg font-semibold text-white flex items-center gap-1">
                    {metrics.tokensUsed ? `${(metrics.tokensUsed / 1_000_000).toFixed(0)}M` : '—'}
                  </p>
                </div>
              </div>

              {metrics.featuredProject ? (
                <div className="rounded-lg border border-siso-orange/30 bg-siso-orange/10 p-3 text-sm text-white/90">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-siso-text-muted mb-1">Featured win</p>
                  <p className="font-semibold text-white leading-tight">Reservations + Stripe live</p>
                  <p className="text-xs text-siso-text-muted">Launched {metrics.featuredProject.date}</p>
                </div>
              ) : null}

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-siso-orange hover:text-siso-orange/80"
                onClick={(event) => {
                  event.stopPropagation();
                  const clientSlug = metrics?.clientSlug || "elementary";
                  router.push(`/portfolio/${industryData.slug}/${clientSlug}`);
                }}
              >
                View project
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
