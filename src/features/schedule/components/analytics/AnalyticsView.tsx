import { motion } from 'framer-motion';
import { Heart, MessageSquare, Bookmark } from 'lucide-react';
import { EngagementChart } from '../charts/EngagementChart';
import { ENGAGEMENT_DATA, TOP_POSTS, RANK_COLORS, RANK_LABELS, containerVariants, fadeUp } from '../../constants';

export function AnalyticsView() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.08)' }}>
          <span className="text-neutral-900 font-semibold">28</span>
          <span className="text-neutral-500">posts this month</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,0,105,0.06)', border: '1px solid rgba(255,0,105,0.15)' }}>
          <span className="text-neutral-900 font-semibold">4.2%</span>
          <span className="text-neutral-500">avg engagement rate</span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="p-5 rounded-2xl" style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Engagement This Week</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Average interactions per day</p>
          </div>
          <span className="text-sm font-semibold text-neutral-500">
            {Math.round(ENGAGEMENT_DATA.reduce((s, d) => s + d.value, 0) / ENGAGEMENT_DATA.length)} avg
          </span>
        </div>
        <EngagementChart />
      </motion.div>

      <motion.div variants={fadeUp} className="p-5 rounded-2xl" style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-neutral-900">Top Posts This Month</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Best performing content</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {TOP_POSTS.map((post, i) => (
            <motion.div
              key={post.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff' }}
            >
              <div className="relative aspect-square">
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})`, opacity: 0.7 }}
                />
                <div
                  className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-lg"
                  style={{ backgroundColor: RANK_COLORS[i], color: '#000', boxShadow: `0 0 12px ${RANK_COLORS[i]}66` }}
                  title={RANK_LABELS[i]}
                >
                  {post.rank}
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-800">{post.likes.toLocaleString()}</span>
                  <span className="text-[10px] text-neutral-400">likes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-800">{post.comments}</span>
                  <span className="text-[10px] text-neutral-400">comments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-semibold text-neutral-800">{post.saves}</span>
                  <span className="text-[10px] text-neutral-400">saves</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
