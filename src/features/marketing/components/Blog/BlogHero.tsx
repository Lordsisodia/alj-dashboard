/**
 * BlogHero - mirrors the `fireside-hero` section from the HTML source.
 *
 * Layout:
 *   - Left (featured-blog-wrapper): large image card linking to the featured post
 *   - Right (blog-feed-wrapper): "Popular Blogs" list of 4 text-only entries
 *
 * CSS classes come from foreplay.css (foreplay-3-0.shared.be2f89f77.min.css).
 */

import Image from 'next/image';
import { FEATURED_POST, POPULAR_POSTS } from './data';

export default function BlogHero() {
  return (
    <section id="product-hero-section" className="section relative">
      <div className="fireside-hero">
        <div className="container section-container">

          {/* Hero text */}
          <div className="product-hero-content">
            <div className="hero-text">
              <div>
                <h1 className="text-overline text-white-68">Blog</h1>
              </div>
              <h2 className="text-display-h1 hero-title">
                Free insights and guides for better ad creative
              </h2>
            </div>
          </div>

          {/* Featured post + popular sidebar grid */}
          <div className="section-content-main">
            <div className="w-layout-grid blog-header-grid">

              {/* Left: featured post - spans 4 of 6 columns */}
              <div className="featured-blog-wrapper" style={{ gridColumn: 'span 4' }}>
                <a href={FEATURED_POST.href} className="featured-blog-link w-inline-block">
                  <div className="featured-blog-cover">
                    <Image
                      src={FEATURED_POST.image}
                      alt="featured blog image"
                      width={720}
                      height={360}
                      loading="eager"
                      className="featured-blog-image"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                  <div className="featured-blog-content">
                    <h2 className="text-display-h3 mobile-landscape-text-display-h4">
                      {FEATURED_POST.title}
                    </h2>
                    <div className="text-alpha-100">
                      <p className="text-body-m">{FEATURED_POST.excerpt}</p>
                    </div>
                  </div>
                </a>

                {/* Author row */}
                <div className="blog-feed-author">
                  <a href={FEATURED_POST.authorHref} className="blog-thumbnail-author-link w-inline-block">
                    <div
                      className="thumbnail-author-avatar"
                      style={{ backgroundImage: `url("${FEATURED_POST.authorAvatar}")` }}
                    />
                    <div className="text-body-s">{FEATURED_POST.author}</div>
                  </a>
                  <div className="text-seperator" />
                </div>
              </div>

              {/* Right: popular blogs sidebar - spans 2 of 6 columns */}
              <div className="blog-feed-wrapper" style={{ gridColumn: 'span 2' }}>
                <div className="text-alpha-100">
                  <h2 className="text-overline">Popular Blogs</h2>
                </div>

                <div>
                  {POPULAR_POSTS.map((post) => (
                    <div key={post.slug} className="text-white" style={{ marginBottom: 4 }}>
                      <div className="blog-feed-content">
                        <a href={post.href} className="blog-feed-link w-inline-block">
                          <h3 className="text-label-m">{post.title}</h3>
                          <div className="blog-feed-subttext">
                            <div className="text-alpha-100">
                              <div className="text-body-s line-clamp-2">{post.excerpt}</div>
                            </div>
                          </div>
                        </a>
                      </div>

                      <div className="blog-feed-author">
                        <a href={post.authorHref} className="blog-feed-author-link w-inline-block">
                          <div className="text-body-s">{post.author}</div>
                        </a>
                        <div className="text-seperator" />
                        <div className="flex-gap-1">
                          <div className="text-body-s">{post.minRead}</div>
                          <div className="text-body-s">min read</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
