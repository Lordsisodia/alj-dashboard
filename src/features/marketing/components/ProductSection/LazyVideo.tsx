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

  return (
    <video ref={ref} {...props} preload="none" poster={poster}>
      {active && <source src={src} />}
    </video>
  );
}
