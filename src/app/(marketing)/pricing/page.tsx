'use client';

import PricingHeader from "@/features/marketing/components/landing/PricingHeader";
import PricingCards from "@/features/marketing/components/landing/PricingCards";
import EnterpriseSection from "@/features/marketing/components/landing/EnterpriseSection";
import ComparisonTable from "@/features/marketing/components/landing/ComparisonTable";

import FAQSection from "@/features/marketing/components/landing/FAQSection";
import ReadyToShipCTA from "@/features/marketing/components/landing/ReadyToShipCTA";
import Footer from "@/features/marketing/components/Footer";

export default function PricingPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero */}
      <PricingHeader />

      {/* Cards */}
      <div className="pricing-content" style={{ paddingTop: 0, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24, width: '100%', boxSizing: 'border-box' }}>
          <div className="code-style w-embed">
            <style>{`
              .pricing-card-details-item.is-unavailable .sprite-image {
                pointer-events: none;
                filter: grayscale(100%);
              }
              .pricing-grid { overflow: visible !important; }
            `}</style>
          </div>
          <PricingCards />
        </div>
      </div>

      {/* Enterprise section */}
      <div className="pricing-content" style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24, width: '100%', boxSizing: 'border-box' }}>
          <EnterpriseSection />
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable />

      {/* FAQ */}
      <FAQSection />

      {/* Ready to ship more winning ads? */}
      <ReadyToShipCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
