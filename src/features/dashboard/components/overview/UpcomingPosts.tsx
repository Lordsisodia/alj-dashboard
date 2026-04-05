import { UPCOMING_POSTS } from '../../constants';

export function UpcomingPosts() {
  return (
    <div>
      <p className="text-sm font-semibold text-neutral-900 mb-3">Upcoming Posts</p>
      <div className="rounded-xl bg-white overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
        {UPCOMING_POSTS.map((post, i) => (
          <div
            key={post.id}
            className="flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 transition-colors"
            style={{ borderBottom: i < UPCOMING_POSTS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : undefined }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${post.typeColor}18`, color: post.typeColor }}
            >
              {post.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-neutral-900 truncate">{post.account}</p>
              <p className="text-[10px] text-neutral-400">{post.time}</p>
            </div>
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: `${post.typeColor}12`, color: post.typeColor }}
            >
              {post.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
