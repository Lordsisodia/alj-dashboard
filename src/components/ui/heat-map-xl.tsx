'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import CountUp from 'react-countup';
import {
  Heatmap,
  HeatmapSeries,
  HeatmapCell,
  ChartTooltip,
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearYAxisTickLabel,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  SequentialLegend,
  schemes,
} from 'reaviz';

interface HeatmapPoint {
  key: string | number;
  data: number;
}

interface HeatmapRow {
  key: string | number;
  data: HeatmapPoint[];
}

type HeatmapData = HeatmapRow[];

// ── SVG Icons ──────────────────────────────────────────────────────────────────

const StatTrendIcon: React.FC<{ trend: 'up' | 'down'; className?: string }> = ({ trend, className = "w-5 h-[21px]" }) => {
  const color = trend === 'up' ? '#F08083' : '#40E5D1';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 21" fill="none">
      {trend === 'up' ? (
        <path d="M5.50134 9.11119L10.0013 4.66675M10.0013 4.66675L14.5013 9.11119M10.0013 4.66675L10.0013 16.3334" stroke={color} strokeWidth="2" strokeLinecap="square" />
      ) : (
        <path d="M14.4987 11.8888L9.99866 16.3333M9.99866 16.3333L5.49866 11.8888M9.99866 16.3333V4.66658" stroke={color} strokeWidth="2" strokeLinecap="square" />
      )}
    </svg>
  );
};

const MetricTrendIndicatorIcon: React.FC<{
  direction: 'up' | 'down';
  baseColor: string;
  strokeColor: string;
}> = ({ direction, baseColor, strokeColor }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="14" fill={baseColor} fillOpacity="0.4" />
    {direction === 'up' ? (
      <path d="M9.50134 12.6111L14.0013 8.16663M14.0013 8.16663L18.5013 12.6111M14.0013 8.16663L14.0013 19.8333" stroke={strokeColor} strokeWidth="2" strokeLinecap="square" />
    ) : (
      <path d="M18.4987 15.3889L13.9987 19.8334M13.9987 19.8334L9.49866 15.3889M13.9987 19.8334V8.16671" stroke={strokeColor} strokeWidth="2" strokeLinecap="square" />
    )}
  </svg>
);

const ViewsIcon: React.FC<{ fill?: string }> = ({ fill = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10.0001 1.66663C5.40511 1.66663 1.66675 5.40499 1.66675 9.99996C1.66675 14.5949 5.40511 18.3333 10.0001 18.3333C14.5951 18.3333 18.3334 14.5949 18.3334 9.99996C18.3334 5.40499 14.5951 1.66663 10.0001 1.66663ZM10.0001 2.91663C13.9195 2.91663 17.0834 6.08054 17.0834 9.99996C17.0834 13.9194 13.9195 17.0833 10.0001 17.0833C6.08066 17.0833 2.91675 13.9194 2.91675 9.99996C2.91675 6.08054 6.08066 2.91663 10.0001 2.91663ZM9.99032 5.82434C9.8247 5.82693 9.66688 5.89515 9.55152 6.01401C9.43616 6.13288 9.37271 6.29267 9.37508 6.45829V10.625C9.37391 10.7078 9.38921 10.79 9.42009 10.8669C9.45098 10.9437 9.49683 11.0137 9.55498 11.0726C9.61313 11.1316 9.68243 11.1785 9.75884 11.2104C9.83525 11.2424 9.91725 11.2589 10.0001 11.2589C10.0829 11.2589 10.1649 11.2424 10.2413 11.2104C10.3177 11.1785 10.387 11.1316 10.4452 11.0726C10.5033 11.0137 10.5492 10.9437 10.5801 10.8669C10.611 10.79 10.6263 10.7078 10.6251 10.625V6.45829C10.6263 6.37464 10.6107 6.2916 10.5792 6.21409C10.5477 6.13658 10.501 6.06618 10.4418 6.00706C10.3826 5.94794 10.3121 5.9013 10.2346 5.86992C10.157 5.83853 10.074 5.82303 9.99032 5.82434ZM10.0001 12.5C9.77907 12.5 9.56711 12.5878 9.41083 12.744C9.25455 12.9003 9.16675 13.1123 9.16675 13.3333C9.16675 13.5543 9.25455 13.7663 9.41083 13.9225C9.56711 14.0788 9.77907 14.1666 10.0001 14.1666C10.2211 14.1666 10.4331 14.0788 10.5893 13.9225C10.7456 13.7663 10.8334 13.5543 10.8334 13.3333C10.8334 13.1123 10.7456 12.9003 10.5893 12.744C10.4331 12.5878 10.2211 12.5 10.0001 12.5Z" fill={fill} />
  </svg>
);

const SavesIcon: React.FC<{ fill?: string }> = ({ fill = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5.00008 2.5C4.00552 2.5 3.05161 2.89509 2.34833 3.59835C1.64506 4.30161 1.25 5.25552 1.25 6.25V15.8333C1.25 16.2907 1.46021 16.7292 1.83579 17.0403C2.21136 17.3515 2.72186 17.5 3.25008 17.5H16.7501C17.2783 17.5 17.7888 17.3515 18.1644 17.0403C18.54 16.7292 18.7501 16.2907 18.7501 15.8333V6.25C18.7501 5.25552 18.355 4.30161 17.6518 3.59835C16.9485 2.89509 15.9946 2.5 15.0001 2.5H5.00008ZM5.00008 4.16666H15.0001C15.442 4.16666 15.8659 4.33331 16.1785 4.6317C16.4911 4.93009 16.6667 5.33572 16.6667 5.75833V15.8333H3.25008V5.75833C3.25008 5.33572 3.42572 4.93009 3.73832 4.6317C4.05092 4.33331 4.4748 4.16666 4.91675 4.16666H5.00008ZM6.66675 7.5V12.5H13.3334V7.5H6.66675Z" fill={fill} />
  </svg>
);

const LikesIcon: React.FC<{ fill?: string }> = ({ fill = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10.0001 17.5C9.85821 17.5 9.71656 17.4799 9.57784 17.44L2.81573 15.2117C2.0425 14.9639 1.5625 14.2171 1.5625 13.4033V7.59667C1.5625 6.78289 2.0425 6.03609 2.81573 5.78828L9.57784 3.55998C9.71704 3.52009 9.85844 3.5 10.0001 3.5C10.1417 3.5 10.2831 3.52009 10.4223 3.55998L17.1844 5.78828C17.9576 6.03609 18.4375 6.78289 18.4375 7.59667V13.4033C18.4375 14.2171 17.9576 14.9639 17.1844 15.2117L10.4223 17.44C10.2836 17.4799 10.1419 17.5 10.0001 17.5ZM3.33337 7.59667V13.4033L10.0001 15.5867L16.6667 13.4033V7.59667L10.0001 5.41333L3.33337 7.59667Z" fill={fill} />
  </svg>
);

// ── Custom tooltip cell ─────────────────────────────────────────────────────────

const HeatmapCellWithTooltip: typeof HeatmapCell = (props: any) => {
  const { data, ...rest } = props;
  return (
    <HeatmapCell
      {...rest}
      data={data}
      tooltip={
        <ChartTooltip
          content={() => (
            <div className="px-2 py-1 text-xs">
              <div className="font-medium text-gray-900 dark:text-white">{data.key}</div>
              <div className="text-gray-600 dark:text-gray-300">{data.data}% engagement</div>
            </div>
          )}
        />
      }
    />
  );
};

// ── Colours ─────────────────────────────────────────────────────────────────────

const HEATMAP_SERIES_COLOR_SCHEME = [
  { fill: '#FFD440', filter: 'drop-shadow(0px 0px 5px #FFD44090)' },
  { fill: '#F8A340' },
  { fill: '#E84045' },
];

const LEGEND_COLOR_SCHEME = schemes.unifyvizWarm;

// ── Skeleton ───────────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <div className="flex gap-3 items-center animate-pulse">
    <div className="h-4 w-24 bg-white/10 rounded" />
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-10 w-full bg-white/10 rounded" />
    ))}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────────

const IncidentHeatmapReportCard: React.FC = () => {
  const data = useQuery(api.intelligence.getHeatmapData, { days: 30 });

  if (!data) {
    return (
      <div className="flex flex-col justify-between pt-4 pb-4 bg-white dark:bg-black rounded-3xl shadow-[11px_21px_3px_rgba(0,0,0,0.06),14px_27px_7px_rgba(0,0,0,0.10),19px_38px_14px_rgba(0,0,0,0.13),27px_54px_27px_rgba(0,0,0,0.16),39px_78px_50px_rgba(0,0,0,0.20),55px_110px_86px_rgba(0,0,0,0.26)] w-full overflow-hidden text-black dark:text-white">
        <div className="flex justify-between items-center p-7 pt-6 pb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="px-7 space-y-3 flex-grow">
          {[...Array(7)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
        <div className="flex w-full pl-8 pr-8 justify-between pb-2 pt-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 w-2/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { heatmapData, stats, metrics } = data;
  const trend = stats.pctChange >= 0 ? 'up' : 'down';
  const pctDisplay = `${stats.pctChange >= 0 ? '+' : ''}${stats.pctChange}%`;

  const metricItems = [
    { id: 'views', icon: <ViewsIcon fill="#E84045" />, label: 'Avg Views / post', value: metrics.avgViews, trendDirection: 'up' as const, trendColor: '#E84045', trendStrokeColor: '#F08083' },
    { id: 'likes', icon: <LikesIcon fill="#E84045" />, label: 'Avg Likes / post', value: metrics.avgLikes, trendDirection: 'up' as const, trendColor: '#E84045', trendStrokeColor: '#F08083' },
    { id: 'saves', icon: <SavesIcon fill="#E84045" />, label: 'Avg Saves / post', value: metrics.avgSaves, trendDirection: 'up' as const, trendColor: '#40E5D1', trendStrokeColor: '#40E5D1' },
  ];

  return (
    <div className="font-sans flex flex-col justify-between pt-3 pb-3 bg-white dark:bg-black rounded-3xl w-full overflow-hidden text-black dark:text-white transition-colors duration-300" style={{ border: '1px solid rgba(0,0,0,0.10)' }}>

      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-4 pb-4">
        <div>
          <h3 className="text-xl text-left font-bold tracking-tight">Engagement Heatmap</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Avg engagement rate by day &amp; hour · last 30 days</p>
        </div>
        <select
          aria-label="Select time range"
          className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-800 dark:bg-[#262631] dark:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="last-7-days">Last 7 Days</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="last-90-days">Last 90 Days</option>
        </select>
      </div>

      {/* Heatmap + Legend */}
      <div className="flex w-full px-2" style={{ height: 200 }}>
        <div className="flex-grow h-full min-w-0">
          <Heatmap
            data={heatmapData as any}
            yAxis={
              <LinearYAxis
                type="category"
                axisLine={null}
                tickSeries={
                  <LinearYAxisTickSeries
                    line={null}
                    label={<LinearYAxisTickLabel padding={10} className="fill-gray-600 dark:fill-gray-400 text-xs transition-colors duration-300" />}
                  />
                }
              />
            }
            xAxis={
              <LinearXAxis
                axisLine={null}
                tickSeries={
                  <LinearXAxisTickSeries
                    line={null}
                    label={<LinearXAxisTickLabel padding={10} rotation={-60} className="fill-gray-600 dark:fill-gray-400 text-xs transition-colors duration-300" />}
                    tickSize={10}
                  />
                }
              />
            }
            series={
              <HeatmapSeries
                colorScheme={HEATMAP_SERIES_COLOR_SCHEME as any}
                padding={0.12}
                cell={<HeatmapCellWithTooltip />}
              />
            }
          />
        </div>
        <SequentialLegend
          data={heatmapData as any}
          colorScheme={LEGEND_COLOR_SCHEME}
          gradientClassName="!w-[20px]"
          className="pl-1 pr-1 mt-6 !h-[160px] text-gray-600 dark:text-gray-400 transition-colors duration-300 text-xs"
        />
      </div>

      {/* Stats row */}
      <div className="flex w-full px-6 justify-between pb-2 pt-4">
        <div className="flex flex-col gap-1.5 w-1/2">
          <span className="text-sm font-medium text-gray-500">Posts Scraped</span>
          <div className="flex items-center gap-2">
            <CountUp
              className="text-3xl font-bold tabular-nums"
              start={0}
              end={stats.totalPosts}
              duration={2.5}
            />
            <div className={`flex px-2 py-0.5 items-center gap-0.5 rounded-full text-xs font-medium ${trend === 'up' ? 'bg-red-500/20 text-red-600 dark:text-[#F08083]' : 'bg-teal-500/20 text-teal-600 dark:text-[#40E5D1]'} transition-colors duration-300`}>
              <StatTrendIcon trend={trend} className="w-3.5 h-3.5" />
              {pctDisplay}
            </div>
          </div>
          <span className="text-gray-400 dark:text-[#9A9AAF] text-xs transition-colors duration-300">
            {stats.postsThisWeek} this week vs {stats.postsLastWeek} last week
          </span>
        </div>

        <div className="flex flex-col gap-1.5 w-1/2">
          <span className="text-sm font-medium text-gray-500">Avg Engagement</span>
          <div className="flex items-center gap-2">
            <CountUp
              className="text-3xl font-bold tabular-nums"
              start={0}
              end={stats.avgEngagementRate}
              duration={2.5}
              decimals={2}
              suffix="%"
            />
          </div>
          <span className="text-gray-400 dark:text-[#9A9AAF] text-xs transition-colors duration-300">
            Top niche: {stats.topNiche}
          </span>
        </div>
      </div>

      {/* Metric list */}
      <div className="flex flex-col px-6 divide-y divide-gray-100 dark:divide-[#262631] transition-colors duration-300">
        {metricItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex w-full py-2 items-center gap-2"
          >
            <div className="flex flex-row gap-2 items-center text-xs w-1/2 text-gray-500 dark:text-[#9A9AAF] transition-colors duration-300">
              {item.icon}
              <span className="truncate" title={item.label}>
                {item.label}
              </span>
            </div>
            <div className="flex gap-2 w-1/2 justify-end items-center">
              <span className="font-semibold text-base tabular-nums">{item.value}</span>
              <MetricTrendIndicatorIcon
                direction={item.trendDirection}
                baseColor={item.trendColor}
                strokeColor={item.trendStrokeColor}
              />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default IncidentHeatmapReportCard;
