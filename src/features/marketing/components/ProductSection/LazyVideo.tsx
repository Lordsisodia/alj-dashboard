'use client';
import { useRef, useEffect, useState } from 'react';

/** Defers loading a <video> src until the element scrolls into view (200px margin). */
export default function LazyVideo({
  src,
  poster,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ext = src.split('?')[0].split('.').pop()?.toLowerCase();
  const mimeType =
    ext === 'webm' ? 'video/webm' :
    ext === 'mov'  ? 'video/mp4' :   // .mov served as video/mp4 (H.264 container trick)
    ext === 'mp4'  ? 'video/mp4' :
    'video/mp4';

  return (
    <video ref={ref} {...props} preload="none" poster={poster}>
      {active && <source src={src} type={mimeType} />}
    </video>
  );
}
