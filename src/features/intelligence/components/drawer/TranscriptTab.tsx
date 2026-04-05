import { FileText, Hash } from 'lucide-react';
import type { DrawerPost } from '../../types';

export function TranscriptTab({ post }: { post: DrawerPost }) {
  if (!post.caption && (!post.hashtags || post.hashtags.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <FileText size={24} className="text-neutral-300" />
        <p className="text-xs text-neutral-400">No caption available for this post.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {post.caption && (
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Caption</p>
          <p className="text-xs text-neutral-700 leading-relaxed">{post.caption}</p>
        </div>
      )}
      {post.hashtags && post.hashtags.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Hashtags</p>
          <div className="flex flex-wrap gap-1.5">
            {post.hashtags.map(tag => (
              <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: '#f3f4f6', color: '#555' }}>
                <Hash size={9} />{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
