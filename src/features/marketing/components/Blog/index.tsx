/**
 * Blog page assembly — composes BlogHero, BlogList, BlogCTA, and Footer.
 * Import this from app/blog/page.tsx.
 */

import Footer from '@/features/marketing/components/Footer';
import BlogHero from './BlogHero';
import BlogList from './BlogList';
import BlogCTA from './BlogCTA';

export default function BlogPage() {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        <BlogHero />
        <BlogList />
        <BlogCTA />
      </div>
      <Footer />
    </div>
  );
}
