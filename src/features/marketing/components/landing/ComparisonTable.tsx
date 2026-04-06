'use client';

import { useState } from 'react';

// ─── Icons ───────────────────────────────────────────────────────────────────

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

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComparisonRow {
  title: string;
  subtitle?: string;
  free: string | boolean;
  perModel: string | boolean;
  unlimited: string | boolean;
  enterprise: string | boolean;
  crown?: boolean;
  tooltipText?: string;
}

interface ComparisonCategory {
  name: string;
  rows: ComparisonRow[];
}

// ─── Data ───────────────────────────────────────────────────────────────────

const comparisonCategories: ComparisonCategory[] = [
  {
    name: 'Platform Access',
    rows: [
      { title: 'Hub', free: 'Browse only', perModel: 'Full', unlimited: 'Full', enterprise: 'Full' },
      { title: 'Intelligence', free: 'Limited tokens', perModel: 'Full', unlimited: 'Full', enterprise: 'Full' },
      { title: 'Recon', free: '-', perModel: 'Full', unlimited: 'Full', enterprise: 'Full' },
      { title: 'Agents', free: '-', perModel: 'Full', unlimited: 'Full', enterprise: 'Full' },
      { title: 'Content Gen', free: '2 videos/week', perModel: 'Slider (1-10/day)', unlimited: 'Unlimited', enterprise: 'Unlimited' },
    ],
  },
  {
    name: 'Content Generation',
    rows: [
      { title: 'AI Video Generation', free: '2/week', perModel: 'Per plan', unlimited: 'Unlimited (+$1 API)', enterprise: 'Unlimited (volume pricing)' },
      { title: 'AI Script Writer', free: true, perModel: true, unlimited: true, enterprise: true },
      { title: 'Storyboard Generator', free: '-', perModel: true, unlimited: true, enterprise: true },
      { title: 'Batch Generation', free: '-', perModel: '-', unlimited: true, enterprise: true, crown: true },
      { title: 'Model Profiles', free: '1', perModel: 'Unlimited', unlimited: 'Unlimited', enterprise: 'Unlimited' },
      { title: 'Multi-Language Output', free: '-', perModel: true, unlimited: true, enterprise: true },
    ],
  },
  {
    name: 'Intelligence & Tracking',
    rows: [
      { title: 'Trend Detection', free: 'Limited', perModel: 'Full', unlimited: 'Full', enterprise: 'Full' },
      { title: 'Competitor Tracking', free: '-', perModel: 'Up to 15', unlimited: 'Unlimited', enterprise: 'Unlimited' },
      { title: 'Performance Reports', free: '-', perModel: true, unlimited: true, enterprise: true },
      { title: 'Hook Analysis', free: '-', perModel: true, unlimited: true, enterprise: true },
      { title: 'Automated Transcription', free: '-', perModel: true, unlimited: true, enterprise: true },
      { title: 'Historical Data', free: '-', perModel: '90 days', unlimited: 'Unlimited', enterprise: 'Unlimited', crown: true },
    ],
  },
  {
    name: 'Team & Collaboration',
    rows: [
      { title: 'Users', free: '1', perModel: '3 included', unlimited: 'Unlimited', enterprise: 'Unlimited' },
      { title: 'Sharing & Collaboration', free: '-', perModel: true, unlimited: true, enterprise: true },
      { title: 'White-label Reports', free: '-', perModel: '-', unlimited: true, enterprise: true, crown: true },
      { title: 'Export & Download', free: '-', perModel: true, unlimited: true, enterprise: true },
    ],
  },
  {
    name: 'Support & API',
    rows: [
      { title: 'Community Support', free: true, perModel: true, unlimited: true, enterprise: true },
      { title: 'Priority Support', free: '-', perModel: '-', unlimited: true, enterprise: true, crown: true },
      { title: 'API Access', free: '-', perModel: '-', unlimited: true, enterprise: true },
      { title: 'Custom Agent Builds', free: '-', perModel: '-', unlimited: '72hr turnaround', enterprise: '24hr turnaround', crown: true },
      { title: 'Dedicated Account Manager', free: '-', perModel: '-', unlimited: '-', enterprise: true, crown: true },
      { title: 'Custom Integrations', free: '-', perModel: '-', unlimited: '-', enterprise: true, crown: true },
      { title: 'SLA', free: '-', perModel: '-', unlimited: '-', enterprise: true, crown: true },
    ],
  },
];

function InfoTooltip({ text }: { text: string }) {
  return (
    <span style={{ marginLeft: '4px', display: 'inline-flex', verticalAlign: 'middle', position: 'relative' }}>
      <span style={{ cursor: 'pointer', display: 'inline-flex', padding: '2px' }}>
        <InfoIcon />
      </span>
      <span style={{ visibility: 'hidden', position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '100%', padding: '8px 12px', background: '#1a1a1a', borderRadius: '8px', color: 'white', fontSize: '12px', whiteSpace: 'nowrap', zIndex: 50, marginBottom: '8px' }}>
        {text}
      </span>
    </span>
  );
}

function renderCellValue(value: string | boolean | undefined) {
  if (value === true) return <div className="icon-24"><CheckIcon /></div>;
  if (value === false || value === '-') return <div className="text-solid-300"><div>-</div></div>;
  return <div className="text-body-m">{value}</div>;
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 18 18" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path strokeLinecap="square" strokeLinejoin="round" fill="none" strokeWidth="1.5" d="M3.13 13.06 1.5 5.25 6 7.5 9 3l3 4.5 4.5-2.25-1.63 7.8a1.5 1.5 0 0 1-1.46 1.2H4.59a1.5 1.5 0 0 1-1.46-1.2Z" stroke="#8b8d95" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ComparisonTable() {

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Platform Access': true,
    'Content Generation': true,
    'Intelligence & Tracking': true,
    'Team & Collaboration': true,
    'Support & API': true,
  });

  const [selectedPlan, setSelectedPlan] = useState<'free' | 'perModel' | 'unlimited' | 'enterprise'>('free');

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const plans = ['Free', 'Per Model', 'Unlimited', 'Enterprise'];
  const planKeys: Array<'free' | 'perModel' | 'unlimited' | 'enterprise'> = ['free', 'perModel', 'unlimited', 'enterprise'];

  const planCTALabel: Record<string, string> = {
    Free: 'Get Started',
    'Per Model': 'Start',
    Unlimited: 'Start',
    Enterprise: 'Talk to Us',
  };

  const planCTAHref: Record<string, string> = {
    Free: 'https://app.isso.co/sign-up',
    'Per Model': 'https://app.isso.co/sign-up',
    Unlimited: 'https://app.isso.co/sign-up',
  };

  return (
    <div className="section-white-block overflow-visible">
        <div className="section">
          <div className="container">
            <style>{`
              .comparison-grid .text-label-m, .comparison-grid .text-body-m { font-size: .875rem; line-height: 1.25rem; }
              @media screen and (max-width: 479px) {
                .comparison-grid .text-label-m, .comparison-grid .text-body-m { font-size: .75rem; line-height: 1.125rem; }
                .comparison-grid .text-label-s, .comparison-grid .text-body-s { font-size: .7rem; line-height: 1.0625rem; }
                .comparison-grid .text-heading-l { font-size: 0.75rem; }
                .comparison .text-display-h4 { font-size: 1.375rem; }
              }
              .comparison-th .comparison-tr-cell { padding: 8px 16px; }
              .comparison-th .comparison-tr-title { padding: 8px 16px; }
              .comparison-th { position: static !important; }
              .comparison-category-rows { overflow: visible !important; }
              .comparison-grid-scroll { padding-left: 48px !important; }
              .comparison-grid { grid-template-columns: 1.75fr 1fr 1fr 1fr 1fr; }
              .comparison-tr { grid-template-columns: 1.75fr 1fr 1fr 1fr 1fr; }
              .comparison-th { grid-template-columns: 1.75fr 1fr 1fr 1fr 1fr; }
              .mobile-only { display: none !important; }
              .desktop-only { display: flex !important; }
              @media screen and (max-width: 768px) {
                .mobile-only { display: flex !important; }
                .desktop-only { display: none !important; }
                .plan-selector-tabs { display: flex; }
                .comparison-grid-scroll { margin-right: 0; padding-left: 0; padding-right: 0; left: 0; overflow: visible; }
                .comparison-grid { overflow: hidden; }
                .comparison-th { grid-template-columns: 1fr 200px !important; }
                .comparison-tr { grid-template-columns: 1fr 200px !important; }
                .comparison-tr-title { grid-column: 1; }
                .comparison-tr-cell.mobile-only { grid-column: 2; display: flex !important; }
              }
            `}</style>
            <div className="comparison">
              <div className="comparison-head">
                <div className="max-w-2xl">
                  <div className="flex-col-gap-2">
                    <div className="text-solid-900">
                      <h2 className="text-display-h3">Compare Plans</h2>
                    </div>
                    <div className="text-solid-500">
                      <p className="text-body-m">See exactly what you get with each plan.</p>
                    </div>
                  </div>
                </div>
              </div>

              <style>{`.comparison-tooltip .comparison-tooltip-body-container { opacity: 0; pointer-events: none; transition: opacity 0.15s; } .comparison-tooltip:hover .comparison-tooltip-body-container { opacity: 1; pointer-events: auto; }`}</style>
              <div className="comparison-tooltip">
                <div className="comparison-tooltip-body-container">
                  <div className="comparison-tooltip-body">
                    <div className="text-balance">
                      <div className="text-label-s">Features Tagged with <CrownIcon /> are only available with ISSO</div>
                    </div>
                  </div>
                </div>
                <div className="comparison-tooltip-trigger">
                  <div className="comparison-badge">
                    <div className="comparison-badge-icon">
                      <div className="icon-18">
                        <svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="square" strokeLinejoin="round" fill="none" strokeWidth="1.5" d="M3.13 13.06 1.5 5.25 6 7.5 9 3l3 4.5 4.5-2.25-1.63 7.8a1.5 1.5 0 0 1-1.46 1.2H4.59a1.5 1.5 0 0 1-1.46-1.2Z" stroke="currentColor" /></svg>
                      </div>
                    </div>
                    <div className="comparison-badge-label">
                      <div className="text-solid-600">
                        <div className="text-label-m">Only with ISSO</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Plan Selector Tabs */}
              <div className="plan-selector-tabs">
                {plans.map((plan) => {
                  const planKey = planKeys[plans.indexOf(plan)];
                  return (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(planKey)}
                      className={`plan-tab-button ${selectedPlan === planKey ? 'plan-tab-active' : ''}`}
                    >
                      {plan}
                    </button>
                  );
                })}
              </div>

              <div className="comparison-grid-scroll">
                <div className="comparison-grid">
                  {/* Header Row */}
                  <div className="comparison-th">
                    <div className="comparison-tr-title" />
                    {/* Desktop: all plan headers */}
                    {plans.map((plan) => (
                      <div key={plan} className="comparison-tr-cell start-trial-cell desktop-only">
                        <div className="text-heading-l">{plan}</div>
                        <div className="pricing-sticky-header-button">
                          <a href={planCTAHref[plan]} className="button-light button-primary w-inline-block">
                            <div className="button-text-block">
                              <div className="text-heading-m">{planCTALabel[plan]}</div>
                            </div>
                            <div className="button-icon-block icon-right">
                              <div className="icon-24">
                                <ChevronIcon />
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
                    {/* Mobile: selected plan header */}
                    <div className="comparison-tr-cell start-trial-cell mobile-only">
                      <div className="text-heading-l">{plans[planKeys.indexOf(selectedPlan)]}</div>
                      <div className="pricing-sticky-header-button">
                        <a href={planCTAHref[plans[planKeys.indexOf(selectedPlan)]]} className="button-light button-primary w-inline-block">
                          <div className="button-text-block">
                            <div className="text-heading-m">{planCTALabel[plans[planKeys.indexOf(selectedPlan)]]}</div>
                          </div>
                          <div className="button-icon-block icon-right">
                            <div className="icon-24">
                              <ChevronIcon />
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  {comparisonCategories.map((category) => (
                    <div key={category.name} className="comparison-category">
                      <div className="comparison-category-head" onClick={() => toggleCategory(category.name)} style={{ cursor: 'pointer' }}>
                        <div className="flex-1">
                          <h3 className="text-heading-l">{category.name}</h3>
                        </div>
                        <div style={{ transform: openCategories[category.name] ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s ease' }}>
                          <ChevronIcon />
                        </div>
                      </div>

                      {openCategories[category.name] && (
                      <div className="comparison-category-rows">
                        {category.rows.map((row, idx) => (
                          <div key={idx} className="comparison-tr">
                            <div className="comparison-tr-title">
                              <div className="text-label-s">{row.title}</div>
                              {row.subtitle && (
                                <div className="text-solid-500">
                                  <div className="text-body-s">{row.subtitle}</div>
                                </div>
                              )}
                              {row.tooltipText && <InfoTooltip text={row.tooltipText} />}
                              {row.crown && <CrownIcon />}
                            </div>
                            {/* Desktop: show all plan columns */}
                            <div className="comparison-tr-cell desktop-only">
                              {renderCellValue(row.free)}
                            </div>
                            <div className="comparison-tr-cell desktop-only">
                              {renderCellValue(row.perModel)}
                            </div>
                            <div className="comparison-tr-cell desktop-only">
                              {renderCellValue(row.unlimited)}
                            </div>
                            <div className="comparison-tr-cell desktop-only">
                              {renderCellValue(row.enterprise)}
                            </div>
                            {/* Mobile: show only selected plan */}
                            <div className="comparison-tr-cell mobile-only">
                              {renderCellValue(row[selectedPlan])}
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                    </div>
                  ))}

                  {/* CTA Footer Row */}
                  <div className="comparison-grid-footer">
                    <div className="text-solid-900">
                      <h3 className="text-display-h4">
                        Need enterprise volume?
                      </h3>
                    </div>
                    <div className="comparison-footer-button">
                      <a href="/contact" className="new-button new-button-secondary w-inline-block">
                        <div className="button-text-block">
                          <div className="text-heading-m">
                            Talk to Us
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
