function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 4.5L12.5 10L7.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 10.5L8.5 14.5L15.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SavingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
      <path stroke="#EBBE7A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 6.625v-.75m0 7.5v.75m1.624-6.375C11.05 7.302 10.444 7 9.75 7h-.208c-.92 0-1.667.597-1.667 1.333v.058c0 .526.372 1.008.96 1.243l1.83.732c.588.235.96.717.96 1.243 0 .768-.778 1.391-1.738 1.391H9.75c-.694 0-1.3-.302-1.624-.75M16.5 10A6.75 6.75 0 1 1 3 10a6.75 6.75 0 0 1 13.5 0Z" style={{ stroke: '#ebbe7a' }} />
    </svg>
  );
}

const ENTERPRISE_EXTRAS = [
  'Dedicated account manager',
  'Custom integrations',
  '24hr agent build turnaround',
  'SLA guarantee',
  'Dedicated Slack channel',
  'Volume pricing',
];

export default function EnterpriseSection() {
  return (
    <div className="pricing-footer">
      <div className="pricing-footer-enterprise">
        <div className="pricing-footer-head">
          <div className="text-alpha-0">
            <div className="text-overline">ENTERPRISE</div>
          </div>
          <div className="text-alpha-100">
            <div className="text-body-s">For large agencies and scaling brand organizations.</div>
          </div>
        </div>

        <div className="horizontal_divider" />

        <div className="pricing-footer-custom">
          <div className="text-white">
            <h4 className="text-display-h5">Custom Pricing</h4>
          </div>
          <div className="flex-gap-1">
            <div className="icon-20">
              <SavingsIcon />
            </div>
            <div className="text-white">
              <div className="text-label-s">Save up-to 80%</div>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        <a href="/book-demo" className="button-dark button-secondary w-inline-block">
          <div className="button-text-block">
            <div className="text-heading-m">Talk with an Expert</div>
          </div>
          <div className="button-icon-block icon-right">
            <div className="icon-24">
              <ChevronIcon />
            </div>
          </div>
        </a>
      </div>

      <div className="pricing-footer-vertical_divider" />

      <div className="pricing-footer-extra">
        <div className="text-alpha-100" style={{ marginBottom: 16 }}>
          <div className="text-label-s">Let&apos;s discuss a tailored solution that covers unique needs.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
          {ENTERPRISE_EXTRAS.map((feature) => (
            <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="text-white" style={{ flexShrink: 0 }}>
                <div className="icon-20"><CheckIcon /></div>
              </div>
              <div className="text-white">
                <div className="text-body-s">{feature}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
