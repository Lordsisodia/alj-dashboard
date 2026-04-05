/**
 * BlogPostRelated — "Related Articles" carousel at the bottom of a post.
 * Mirrors the blog-related + product-carousel section from the Foreplay HTML.
 */

import Image from 'next/image';
import type { BlogPostData } from './data/sample-posts';

interface Props {
  posts: BlogPostData[];
}

export default function BlogPostRelated({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <aside className="section overflow-hidden">
      <div className="blog-related">
        <div className="container blog-container">
          <div className="blog-related-head">
            <div className="text-white">
              <h2 className="text-heading-l">Related Articles</h2>
            </div>
            <div className="text-alpha-100">
              <div className="text-body-m">You might also like these reads on similar themes.</div>
            </div>
          </div>
        </div>

        <div data-carousel="" className="product-carousel">
          <div className="container blog-container">
            <div className="product-carousel-viewport">
              <div className="w-dyn-list">
                <div data-track="" role="list" className="blog-related-list w-dyn-items">
                  {posts.map((post) => (
                    <div key={post.slug} role="listitem" className="blog-related-collection-item w-dyn-item">
                      <a href={`/post/${post.slug}`} className="blog-carousel-card w-inline-block">
                        <div className="blog-carousel-card-cover">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            width={400}
                            height={240}
                            loading="lazy"
                            className="blog-carousel-card-image"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </div>
                        <div className="blog-carousel-card-content">
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
                              <div className="text-label-s">{post.author}</div>
                            </div>
                          </div>
                          <div className="blog-carousel-card-text">
                            <div className="text-white">
                              <div className="text-label-l">{post.title}</div>
                            </div>
                            <div className="line-clamp-2">
                              <div className="text-alpha-100">
                                <div className="text-body-m">{post.description}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
