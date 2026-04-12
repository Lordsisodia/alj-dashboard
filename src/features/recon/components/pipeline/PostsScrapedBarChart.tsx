'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/bar-chart';

const chartConfig = {
  total: {
    label: 'Posts scraped',
    color: '#ef4444',
  },
} satisfies ChartConfig;

export function PostsScrapedBarChart() {
  const data = useQuery(api.intelligence.getDailyScrapedVolume, { days: 14 });

  return (
    <div
      className="flex flex-col bg-white rounded-xl overflow-hidden w-full"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
          Posts Scraped
        </p>
        <p className="text-[10px] text-neutral-300">Last 14 days</p>
      </div>

      <div className="px-2 pb-2">
        <ChartContainer config={chartConfig} className="h-[110px] w-full">
          <BarChart data={data ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              interval={1}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
