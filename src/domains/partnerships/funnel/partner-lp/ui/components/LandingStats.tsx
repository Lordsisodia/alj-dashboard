"use client";

import { Users, Wallet, Clock3, Target, TrendingUp } from "lucide-react";
import CountUp from "react-countup";
import { cn } from "@/domains/shared/utils/cn";

type Stat = {
  icon: "users" | "wallet" | "clock" | "target" | "trending";
  value: number | string;
  change?: string;
  label: string;
  prefix?: string;
};

const iconMap = {
  users: Users,
  wallet: Wallet,
  clock: Clock3,
  target: Target,
  trending: TrendingUp,
};

function StatCard({ icon, value, change, label, prefix }: Stat) {
  const Icon = iconMap[icon];
  const isNumber = typeof value === "number";
  const isPercent = typeof value === "string" && value.endsWith("%");
  const displayValue = isNumber ? (
    <>
      {prefix ? <span className="text-siso-orange text-xl md:text-2xl leading-none">{prefix}</span> : null}
      <CountUp end={value as number} duration={1.8} separator="," />
    </>
  ) : (
    value
  );

  return (
    <div className="flex gap-2 flex-col justify-between p-3 md:p-4 border border-siso-border-hover rounded-lg bg-siso-bg-secondary bg-opacity-95 shadow-[0_18px_38px_-24px_rgba(0,0,0,0.55)] hover:border-siso-orange/40 transition-all duration-300 text-siso-text">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-siso-orange" />
        <div className="text-2xl md:text-3xl tracking-tighter text-white flex items-end gap-1">
          {displayValue}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs md:text-sm text-siso-text-muted">
        <span>{label}</span>
        {change ? <span className="text-siso-orange font-medium">{change}</span> : null}
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  gridClassName?: string;
};

export function LandingStats({ className, gridClassName }: Props) {
  const stats: Stat[] = [
    { icon: "users", value: 42, change: "+9.2%", label: "Active partners this quarter" },
    { icon: "wallet", value: 1250000, prefix: "$", change: "+18.4%", label: "Total value paid out" },
    { icon: "clock", value: "12d", change: "-6.5%", label: "Avg time to first build" },
    { icon: "target", value: "68%", change: "+4.1%", label: "Win rate with partner squad" },
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mx-auto", gridClassName)}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
