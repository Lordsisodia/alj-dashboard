'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, XAxis } from 'recharts';
import type { MappedCandidate } from '../data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/bar-chart';

interface Props {
  candidates: MappedCandidate[];
}

type Bucket = { label: string; value: number; fill: string };

function buildBuckets(candidates: MappedCandidate[]): Bucket[] {
  const buckets: [string, string, number][] = [
    ['Micro',  '#fca5a5', 0],
    ['Mid',    '#ef4444', 0],
    ['Macro',  '#991b1b', 0],
  ];
  for (const c of candidates) {
    const f = c.followersRaw;
    if      (f < 10_000)    buckets[0][2]++;
    else if (f < 100_000)   buckets[1][2]++;
    else                     buckets[2][2]++;
  }
  return buckets.map(([label, fill, value]) => ({ label, value, fill }));
}

const chartConfig = {
  followers: { label: 'creators', color: '#dc2626' },
} satisfies ChartConfig;

export function FollowerScaleChart({ candidates }: Props) {
  const data = buildBuckets(candidates);
  const totalCandidates = candidates.length;

  return (
    <Card className="border-[rgba(0,0,0,0.07)]">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-wide leading-none">Follower Scale</CardTitle>
          <Badge variant="outline" className="text-[10px] font-medium text-neutral-500 border-neutral-200">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            {totalCandidates} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <ChartContainer config={chartConfig} className="h-20 w-full">
          <BarChart data={data} barSize={24} barGap={3}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(220,38,38,0.04)' }}
              content={<ChartTooltipContent hideIndicator indicator="dot" />}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="flex justify-between mt-1 px-1">
          <span className="text-[8px] text-neutral-400">{'<10K'}</span>
          <span className="text-[8px] text-neutral-400">10–100K</span>
          <span className="text-[8px] text-neutral-400">{'100K+'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
