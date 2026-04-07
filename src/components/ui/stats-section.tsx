/**
 * Client Stats Section Component
 * Displays key metrics for client portfolio performance
 */

import { MoveDownLeft, MoveUpRight, Users, Package, TrendingUp } from "lucide-react";
import CountUp from 'react-countup';
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: 'up' | 'down' | 'users' | 'package' | 'trending';
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  label: string;
}

function StatCard({ icon, value, change, changeType, label }: StatCardProps) {
  const iconComponents = {
    up: MoveUpRight,
    down: MoveDownLeft,
    users: Users,
    package: Package,
    trending: TrendingUp,
  };

  const Icon = iconComponents[icon];

  const iconColorClass = changeType === 'positive'
    ? 'text-siso-orange'
    : 'text-red-500';

  const renderValue = () => {
    if (typeof value === 'number') {
      return <CountUp end={value} duration={2.5} separator="," />;
    }

    const currencyMatch = String(value).match(/^([$£€])([\d,]+)$/);
    if (currencyMatch) {
      const symbol = currencyMatch[1];
      const numericValue = parseInt(currencyMatch[2].replace(/,/g, ''), 10);
      return (
        <>
          <span className="text-siso-orange text-xl md:text-2xl leading-none">{symbol}</span>
          <CountUp end={numericValue} duration={2.5} separator="," />
        </>
      );
    }

    return value;
  };

  return (
    <div className="flex gap-2 flex-col justify-between p-3 md:p-4 border border-siso-border-hover rounded-lg bg-siso-bg-secondary bg-opacity-95 shadow-[0_18px_38px_-24px_rgba(0,0,0,0.55)] hover:border-siso-orange/40 transition-all duration-300 text-siso-text">
      <h2 className="text-2xl md:text-3xl tracking-tighter max-w-xl text-left font-regular flex flex-row items-center gap-2 md:gap-3 text-white">
        <Icon className={`w-4 h-4 ${iconColorClass}`} />
        <span className="flex items-end gap-2 md:gap-3">
          {renderValue()}
        </span>
      </h2>
      <p className="flex items-center justify-between text-xs md:text-sm leading-relaxed tracking-tight text-siso-text-muted max-w-xl text-left">
        <span>{label}</span>
        {change ? (
          <span className={changeType === 'positive' ? 'text-siso-orange font-medium' : 'text-red-400 font-medium'}>
            {change}
          </span>
        ) : null}
      </p>
    </div>
  );
}

interface ClientStatsProps {
  className?: string;
  containerClassName?: string;
  gridClassName?: string;
  stats?: {
    appsCreated?: { value: number; change: string };
    totalRevenue?: { value: number; change: string; currency?: string };
    avgAppSize?: { value: string; change: string };
    dailyActiveUsers?: { value: number; change: string };
  };
}

function ClientStats({ stats, className, containerClassName, gridClassName }: ClientStatsProps) {
  const defaultStats = {
    appsCreated: { value: 47, change: '+12.5%' },
    totalRevenue: { value: 2847500, change: '+28.3%', currency: 'USD' },
    avgAppSize: { value: '256k', change: '+5.2%' },
    dailyActiveUsers: { value: 125840, change: '+18.7%' },
  };

  const finalStats = { ...defaultStats, ...stats };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${value.toLocaleString()}`;
  };

  return (
    <div className={cn("w-full py-8 md:py-10 lg:py-12", className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full max-w-4xl mx-auto", gridClassName)}>
          <StatCard
            icon="package"
            value={finalStats.appsCreated.value}
            change={finalStats.appsCreated.change}
            changeType="positive"
            label="Apps delivered to clients"
          />
          <StatCard
            icon="trending"
            value={formatCurrency(finalStats.totalRevenue.value, finalStats.totalRevenue.currency)}
            change={finalStats.totalRevenue.change}
            changeType="positive"
            label="Total value delivered"
          />
          <StatCard
            icon="trending"
            value={finalStats.avgAppSize.value}
            change={finalStats.avgAppSize.change}
            changeType="positive"
            label="Average delivery time"
          />
          <StatCard
            icon="users"
            value={finalStats.dailyActiveUsers.value.toLocaleString()}
            change={finalStats.dailyActiveUsers.change}
            changeType="positive"
            label="Combined user reach"
          />
        </div>
      </div>
    </div>
  );
}

export { ClientStats, StatCard };
