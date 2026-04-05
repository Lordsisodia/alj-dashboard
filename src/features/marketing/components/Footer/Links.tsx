import CategorySection from './ui/CategorySection';
import AdCount from './AdCount';

export default function Links() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <CategorySection
        label="Product"
        links={[
          { href: '/hub', children: 'Hub' },
          { href: '/discovery', children: 'Intelligence' },
          { href: '/recon', children: 'Recon' },
          { href: '/agents', children: 'Agents' },
          { href: '/content-gen', children: 'Content Gen' },
          { href: 'https://chromewebstore.google.com/detail/ad-library-save-facebook/eaancnanphggbfliooildilcnjocggjm', children: 'Chrome Extension', external: true },
          { href: '/mobile-app', children: 'Mobile App' },
          { href: '/api', children: 'API' },
        ]}
      />

      <CategorySection
        label="Resources"
        links={[
          { href: '/university', children: 'University' },
          { href: '/', children: 'Knowledge Base', external: true },
          { href: '/api', children: 'API Docs', external: true },
          { href: '/blog', children: 'Blog' },
          { href: '/bounties', children: 'Bounties' },
          { href: '/fireside', children: 'Events & Webinars' },
          { href: '/agency-directory', children: 'Agency Directory' },
          { href: '/experts', children: 'Experts' },
        ]}
      />

      <CategorySection
        label="Solutions"
        links={[
          { href: '/industries/ecommerce', children: 'E-Commerce & Retail' },
          { href: '/industries/agencies', children: 'Agencies' },
          { href: '/industries/mobile-apps', children: 'Mobile Apps & Gaming' },
          { href: '/industries/b2b-saas', children: 'B2B & SaaS' },
          { href: '/industries/info-education-community', children: 'Info, Education & Community' },
          { href: '/industries/freelancers-creators', children: 'Freelancers & Creators' },
        ]}
      />

      <div className="flex flex-col gap-4">
        <CategorySection
          label="Company"
          links={[
            { href: '/pricing', children: 'Pricing' },
            { href: '/book-demo', children: 'Book a Demo' },
            { href: '/careers', children: 'Careers' },
            { href: '/adlibrary', children: 'Public Library' },
          ]}
        />
        <CategorySection
          label="Community"
          links={[
            { href: '/affiliates', children: 'Affiliate Program' },
            { href: '/reviews', children: 'Wall of Love' },
            { href: '/', children: 'Feature Requests', external: true },
            { href: '/', children: 'Public Road Map', external: true },
            { href: '/', children: 'Merch Store', external: true },
          ]}
        />
      </div>

      <AdCount />
    </div>
  );
}
