/**
 * Dynamic blog post route — /post/[slug]
 * Looks up the post by slug from sample data and renders the BlogPost template.
 * Returns a 404-style message if the slug is not found.
 */

import type { Metadata } from 'next';
import BlogPostPage from '@/features/marketing/components/BlogPost';
import { getPostBySlug, SAMPLE_POSTS } from '@/features/marketing/components/BlogPost/data/sample-posts';
import Footer from '@/features/marketing/components/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SAMPLE_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found | ISSO Blog' };
  return {
    title: `${post.title} | ISSO Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.featuredImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div style={{ background: '#020308', minHeight: '100vh' }}>
        <div className="main">
          <section className="section">
            <div className="container blog-container" style={{ paddingTop: 120, paddingBottom: 120 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="text-white">
                  <h1 className="text-display-h3" style={{ marginBottom: 16 }}>Post not found</h1>
                </div>
                <div className="text-alpha-100">
                  <p className="text-body-l" style={{ marginBottom: 40 }}>
                    The post <code style={{ opacity: 0.6 }}>/post/{slug}</code> does not exist yet.
                  </p>
                </div>
                <a href="/blog" className="button-dark button-primary w-inline-block" style={{ display: 'inline-flex' }}>
                  <div className="button-text-block">
                    <div className="text-heading-m">Back to Blog</div>
                  </div>
                </a>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  return <BlogPostPage post={post} />;
}
