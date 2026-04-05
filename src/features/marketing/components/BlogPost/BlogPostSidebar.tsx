'use client';

/**
 * BlogPostSidebar — sticky table-of-contents that mirrors the blog-toc aside
 * from the Foreplay HTML. Headings are extracted from the bodyHtml on mount
 * and tracked via IntersectionObserver for the active-highlight effect.
 */

import { useEffect, useRef, useState } from 'react';

interface TocItem {
  id: string;
  label: string;
}

interface Props {
  bodyHtml: string;
}

/** Parse h2 elements out of an HTML string and return id + text pairs. */
function extractHeadings(html: string): TocItem[] {
  // Runs only in the browser; safe to use DOMParser here because this is a
  // 'use client' component.
  if (typeof window === 'undefined') return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const h2s = Array.from(doc.querySelectorAll('h2'));
  return h2s
    .filter((el) => el.textContent?.trim())
    .map((el) => {
      const text = el.textContent!.trim();
      // Use the existing id attribute if present, otherwise generate one.
      const id =
        el.id ||
        text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 60);
      return { id, label: text };
    });
}

export default function BlogPostSidebar({ bodyHtml }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Parse headings once on mount
  useEffect(() => {
    setItems(extractHeadings(bodyHtml));
  }, [bodyHtml]);

  // Observe headings in the rendered article and track the active one
  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Use the first heading that is currently intersecting
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    const rtb = document.getElementById('blog-rtb');
    if (!rtb) return;

    items.forEach(({ id }) => {
      // Ensure each h2 inside blog-rtb has the right id so scroll links work.
      const headings = Array.from(rtb.querySelectorAll('h2'));
      for (const h of headings) {
        const normalised = h.textContent!
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 60);
        if (normalised === id && !h.id) {
          h.id = id;
        }
        if (h.id === id) {
          observerRef.current!.observe(h);
        }
      }
    });

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="blog-toc-wrapper">
      <aside id="blog-toc" className="blog-toc">
        <div className="text-white">
          <div className="text-label-m">Table of contents</div>
        </div>

        <style>{`
          .blog-toc-h3 .text-body-s::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            margin-right: 8px;
            opacity: 0.4;
          }
          .blog-toc-h3 .text-body-s:hover::before {
            opacity: 0.8;
          }
        `}</style>

        <ol id="blog-toc-list" role="list" className="blog-toc-list w-list-unstyled">
          {items.map(({ id, label }) => (
            <li key={id}>
              <a
                className={`blog-toc-h2 w-inline-block${activeId === id ? ' is-active' : ''}`}
                href={`#${id}`}
                data-id={id}
                aria-label={`Go to section "${label}"`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  setActiveId(id);
                }}
              >
                <div className="text-body-s">{label}</div>
              </a>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
