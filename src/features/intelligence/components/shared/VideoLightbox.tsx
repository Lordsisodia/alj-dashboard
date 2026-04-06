'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Post } from '../../types';

interface Props {
  post:    Post;
  onClose: () => void;
}

export function VideoLightbox({ post, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div className="relative" onClick={e => e.stopPropagation()}>
        <button
          className="absolute -top-10 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <X size={14} />
        </button>

        {post.videoUrl
          ? (
            <video
              src={post.videoUrl}
              width={340}
              autoPlay
              controls
              playsInline
              className="rounded-2xl"
              style={{ maxHeight: '85vh', display: 'block', background: '#000' }}
            />
          ) : (
            <iframe
              src={`https://www.instagram.com/p/${post.externalId}/embed/`}
              width={340}
              height={600}
              frameBorder={0}
              scrolling="no"
              allowTransparency
              className="rounded-2xl"
              style={{ display: 'block' }}
            />
          )
        }
      </div>
    </div>,
    document.body,
  );
}
