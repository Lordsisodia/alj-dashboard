'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell } from 'recharts';
import type { MappedCandidate } from './data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/bar-chart';

interface Props {
  candidates: MappedCandidate[];
  trackedCount?: number;
}

const chartConfig = {
  pipeline: { label: 'candidates', color: '#dc2626' },
} satisfies ChartConfig;

export function PipelineStats({ candidates, trackedCount = 0 }: Props) {
  const pending  = candidates.filter(c => c.status === 'pending').length;
  const approved = candidates.filter(c => c.status === 'approved').length;
  const rejected = candidates.filter(c => c.status === 'rejected').length;

  const chartData = [
    { status: 'Unapproved', value: pending,  fill: '#fca5a5' },
    { status: 'Approved',   value: approved, fill: '#f87171' },
    { status: 'Rejected',  value: rejected, fill: '#ef4444' },
    { status: 'Tracked',   value: trackedCount, fill: '#991b1b' },
  ];

  return (
    <Card className="border-[rgba(0,0,0,0.07)]">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-xs font-semibold text-neutral-500 uppercase tracking-wide leading-none">Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <ChartContainer config={chartConfig} className="h-16 w-full">
          <BarChart data={chartData} barSize={16}>
            <ChartTooltip
              cursor={{ fill: 'rgba(220,38,38,0.04)' }}
              content={<ChartTooltipContent hideIndicator indicator="dot" />}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {/* Stat row */}
        <div className="mt-2 grid grid-cols-4 gap-1">
          {chartData.map(s => (
            <div key={s.status} className="flex flex-col items-center gap-0.5">
              <span className="text-[13px] font-bold text-neutral-800 leading-none tabular-nums">{s.value}</span>
              <span className="text-[7px] text-neutral-400 leading-none text-center">{s.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
