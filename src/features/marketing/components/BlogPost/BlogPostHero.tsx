/**
 * BlogPostHero - breadcrumb, post title, description, author row, and featured image.
 * Mirrors the blog-breadcrumb + blog-top + blog-head sections from the Foreplay HTML.
 */

import Image from 'next/image';
import type { BlogPostData } from './data/sample-posts';

interface Props {
  post: BlogPostData;
}

export default function BlogPostHero({ post }: Props) {
  return (
    <>
      {/* Breadcrumb */}
      <section className="section">
        <div className="container blog-container">
          <div className="blog-breadcrumb">
            <a href="/blog" className="blog-breadcrumb-link flex-none w-inline-block">
              <div>Blog</div>
            </a>
            <div className="blog-breadcrumb-separator">
              <div className="text-body-s">/</div>
            </div>
            <a href="#" className="blog-breadcrumb-link w-inline-block">
              <div className="text-ellipsis">{post.title}</div>
            </a>
          </div>
        </div>
      </section>

      {/* Post title + description */}
      <section className="section">
        <div className="container blog-container">
          <div className="blog-top">
            <div className="blog-head">
              <div className="text-white">
                <div className="text-balance">
                  <h1 className="text-display-h4">{post.title}</h1>
                </div>
              </div>
            </div>
            <div className="blog-body">
              <div>
                <div className="text-alpha-100">
                  <p className="text-body-m">{post.description}</p>
                </div>
              </div>
            </div>
            <div className="blog-line" />
          </div>
        </div>
      </section>

    </>
  );
}

/** BlogPostHead - cover image + author row, rendered inside blog-main */
export function BlogPostHead({ post }: Props) {
  return (
    <div className="blog-head">
      {/* Cover image */}
      <div className="blog-cover">
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={752}
          height={440}
          loading="eager"
          sizes="(max-width: 768px) 100vw, 752px"
          className="blog-image"
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="blog-image-border" />
      </div>

      {/* Author row */}
      <div className="blog-author">
        <div className="blog-author-avatar">
          <Image
            src={post.authorAvatar}
            alt={post.author}
            width={40}
            height={40}
            className="blog-author-avatar-image"
          />
          <div className="blog-author-avatar-border" />
        </div>

        <div className="flex-1">
          <div className="flex-col-gap-1 align-start">
            <div className="text-alpha-25">
              <div className="text-label-m">{post.author}</div>
            </div>
            <div className="text-alpha-200">
              <div className="text-body-s">{post.authorRole}</div>
            </div>
          </div>
        </div>

        <div className="blog-author-links">
          {post.authorLinkedIn && (
            <a
              aria-label="Author LinkedIn Link"
              href={post.authorLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-author-social-link w-inline-block"
            >
              <div className="icon-24">
                <div className="svg w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.28 17.28h-2.22V13.8c0-.83-.02-1.9-1.16-1.9-1.16 0-1.33.9-1.33 1.84v3.54h-2.23v-7.16h2.14v.98h.03a2.34 2.34 0 0 1 2.1-1.16c2.25 0 2.67 1.49 2.67 3.41v3.93ZM7.84 9.15a1.29 1.29 0 1 1 0-2.58 1.29 1.29 0 0 1 0 2.58Zm1.1 8.13H6.73v-7.16h2.23v7.16ZM18.4 4.5H5.61c-.62 0-1.11.48-1.11 1.08v12.84c0 .6.5 1.08 1.1 1.08H18.4a1.1 1.1 0 0 0 1.11-1.08V5.58c0-.6-.5-1.08-1.11-1.08Z" />
                  </svg>
                </div>
              </div>
            </a>
          )}

          <a href="/blog" className="button-dark button-ghost w-inline-block">
            <div className="button-text-block">
              <div className="text-heading-m">More Articles</div>
            </div>
            <div className="button-icon-block icon-right">
              <div className="icon-24">
                <svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                    <path
                      d="M13 8.5L10.5303 10.9697C10.2374 11.2626 9.76255 11.2626 9.46968 10.9697L7 8.5"
                      fill="none" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="currentColor"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
