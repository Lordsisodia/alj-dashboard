/**
 * BlogList - mirrors the "Explore More Blogs" section from the HTML source.
 *
 * Sections:
 *   1. Section header ("Explore More Blogs")
 *   2. Category tag filter strip (blog-categories)
 *   3. 3-column card grid (blog-list / blog-list-card)
 *   4. Pagination row (blog-pagination)
 *
 * Uses 'use client' for the active-category filter state.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BLOG_POSTS, CATEGORIES } from './data';

const POSTS_PER_PAGE = 9;

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = activeCategory
    ? BLOG_POSTS.filter((p) => p.category === activeCategory)
    : BLOG_POSTS;

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const pagePosts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleCategory = (label: string) => {
    setActiveCategory((prev) => (prev === label ? null : label));
    setPage(1);
  };

  return (
    <div className="section">
      <div className="container section-container">
        <div className="blog-feed">

          {/* Section header */}
          <div className="blog-related-head">
            <div className="text-white">
              <h2 className="text-heading-l">Explore More Blogs</h2>
            </div>
            <div className="text-alpha-100">
              <div className="text-body-m">
                Learn more about how to get the most from your advertising.
              </div>
            </div>
          </div>

          {/* Category filter strip */}
          <div className="blog-categories">
            <div className="categories-title">
              <div className="text-alpha-100">
                <div className="text-body-m">Topics &amp; Categories:</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleCategory(cat.label)}
                  className="blog-tag w-inline-block"
                  style={{
                    background: activeCategory === cat.label
                      ? 'rgba(255,255,255,0.15)'
                      : undefined,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div className="text-body-s">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Blog card grid */}
          <div className="blog-list-wrapper">
            <div role="list" className="blog-list">
              {pagePosts.map((post) => (
                <div
                  key={post.slug}
                  role="listitem"
                  className="block-list-item"
                >
                  <a href={post.href} className="blog-list-card w-inline-block">
                    <div className="blog-carousel-card-cover">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={600}
                        height={340}
                        loading="lazy"
                        className="blog-carousel-card-image"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>

                    <div className="blog-carousel-card-content">
                      {/* Author row */}
                      <div className="blog-carousel-card-author">
                        <div className="blog-carousel-card-author-avatar">
                          <Image
                            src={post.authorAvatar}
                            alt={post.author}
                            width={28}
                            height={28}
                            loading="lazy"
                          />
                        </div>
                        <div className="text-white">
                          <div className="text-label-m">{post.author}</div>
                        </div>
                      </div>

                      {/* Title + excerpt */}
                      <div className="blog-carousel-card-text">
                        <div className="text-white">
                          <div className="text-label-l line-clamp-2">{post.title}</div>
                        </div>
                        <div className="line-clamp-2">
                          <div className="text-alpha-100">
                            <div className="text-body-m">{post.excerpt}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              role="navigation"
              aria-label="Blog pages"
              className="blog-pagination"
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              {page > 1 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  className="button-dark button-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <svg height="12px" width="12px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" transform="translate(0,1) rotate(180)">
                    <path fill="none" stroke="currentColor" fillRule="evenodd" d="M4 2l4 4-4 4" />
                  </svg>
                  <div className="w-inline-block">Prev</div>
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="text-label-m">
                  <div className="text-white">
                    <div className="page-count">
                      {page} / {totalPages}
                    </div>
                  </div>
                </div>
              </div>

              {page < totalPages && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="button-dark button-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div className="w-inline-block">Next</div>
                  <svg height="12px" width="12px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" transform="translate(0,1)">
                    <path fill="none" stroke="currentColor" fillRule="evenodd" d="M4 2l4 4-4 4" />
                  </svg>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
