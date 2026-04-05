/**
 * BlogPost page assembly — composes all BlogPost sub-components.
 * Import this from app/post/[slug]/page.tsx.
 *
 * Layout mirrors the Foreplay HTML structure:
 *   breadcrumb → blog-top → blog-main-wrapper (toc sidebar + blog-main) →
 *   blog-cta sidebar → related articles → bottom CTA → footer
 */

import Footer from '@/features/marketing/components/Footer';
import BlogPostHero, { BlogPostHead } from './BlogPostHero';
import BlogPostContent from './BlogPostContent';
import BlogPostSidebar from './BlogPostSidebar';
import BlogPostRelated from './BlogPostRelated';
import BlogPostCTA, { BlogPostSidebarCTA } from './BlogPostCTA';
import type { BlogPostData } from './data/sample-posts';
import { getRelatedPosts } from './data/sample-posts';

interface Props {
  post: BlogPostData;
}

export default function BlogPostPage({ post }: Props) {
  const relatedPosts = getRelatedPosts(post.relatedSlugs);

  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        {/* Breadcrumb + title + description (renders outside the two-column layout) */}
        <BlogPostHero post={post} />

        {/* Two-column layout: TOC sidebar left + article right */}
        <div className="section">
          <div className="container">
            <div className="blog-main-wrapper">
              {/* Left: sticky table of contents */}
              <BlogPostSidebar bodyHtml={post.bodyHtml} />

              {/* Right: cover image + author + article content + sidebar CTA */}
              <div className="blog-main">
                <BlogPostHead post={post} />
                <BlogPostContent bodyHtml={post.bodyHtml} />
                <BlogPostSidebarCTA />
              </div>
            </div>
          </div>
        </div>

        {/* Related articles carousel */}
        <BlogPostRelated posts={relatedPosts} />

        {/* Bottom CTA */}
        <BlogPostCTA />
      </div>

      <Footer />
    </div>
  );
}
