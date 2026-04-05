'use client';

// WorkWithBrandsHero — page hero: overline + headline + paragraph + brand logos
// + lead capture form (Name, Phone, Email, Company Type, Budget, Message).

import { useState, FormEvent } from 'react';
import type { WorkWithBrandsData } from './data/work-with-brands';

interface Props {
  hero: WorkWithBrandsData['hero'];
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  companyType: string;
  budget: string;
  message: string;
}

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.6)',
  marginBottom: '8px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const INPUT: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export default function WorkWithBrandsHero({ hero }: Props) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    companyType: '',
    budget: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Brand form submitted:', form);
  };

  return (
    <div className="section">
      <div className="container section-container">
        <div className="work-hero">
          {/* Left: text + logos */}
          <div id="w-node-_422c71ff-1b8d-f477-95e5-c8eb41c93ac0-1934372c" className="work-hero-content">
            <div className="max-w-lg">
              <div className="flex-col-gap-5 text-balance">
                <div className="text-alpha-100">
                  <div className="text-overline">{hero.overline}</div>
                </div>
                <div className="flex-col-gap-3">
                  <div className="text-white">
                    <h1 className="text-display-h2">{hero.headline}</h1>
                  </div>
                  <div className="text-balance">
                    <div className="text-alpha-50">
                      <div className="text-body-l">{hero.paragraph}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="work-hero-logo-grid">
              {hero.logos.map((logo, idx) => (
                <div key={idx} className="work-hero-logo">
                  <img
                    src={logo.src}
                    loading="lazy"
                    alt={logo.alt}
                    height={60}
                    className="work-hero-logo-image"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: lead capture form */}
          <div className="work-hero-form-container">
            <form
              id="wf-form-Brand-Form"
              name="wf-form-Brand-Form"
              data-name="Brand Form"
              method="get"
              className="demo-hero-form w-form"
              onSubmit={handleSubmit}
            >
              <div className="demo-hero-form-content">
                {/* Row: Name + Phone */}
                <div className="demo-hero-form-line">
                  <div className="demo-hero-form-item">
                    <div className="demo-hero-form-item-label-wrapper">
                      <label htmlFor="name-3" className="demo-hero-form-label">Name</label>
                    </div>
                    <input
                      id="name-3"
                      className="demo-hero-form-input w-input"
                      maxLength={256}
                      name="name"
                      placeholder="John Smith"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      style={INPUT}
                    />
                  </div>
                  <div className="demo-hero-form-item">
                    <div className="demo-hero-form-item-label-wrapper">
                      <label htmlFor="phone-3" className="demo-hero-form-label">Phone</label>
                      <label htmlFor="phone-3" className="demo-hero-form-label form-label-secondary">(Optional)</label>
                    </div>
                    <input
                      id="phone-3"
                      className="demo-hero-form-input w-input"
                      maxLength={256}
                      name="phone"
                      placeholder="000-000-0000"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      style={INPUT}
                    />
                  </div>
                </div>

                {/* Row: Email + Company Type */}
                <div className="demo-hero-form-line">
                  <div className="demo-hero-form-item">
                    <div className="demo-hero-form-item-label-wrapper">
                      <label htmlFor="email-3" className="demo-hero-form-label">Email</label>
                    </div>
                    <input
                      id="email-3"
                      className="demo-hero-form-input w-input"
                      maxLength={256}
                      name="email"
                      placeholder="hello@company.com"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      style={INPUT}
                    />
                  </div>
                  <div className="demo-hero-form-item">
                    <div className="demo-hero-form-item-label-wrapper">
                      <label htmlFor="Company-Type" className="demo-hero-form-label">Company Type</label>
                    </div>
                    <select
                      id="Company-Type"
                      name="companyType"
                      data-name="Company Type"
                      required
                      className="demo-hero-form-input w-select"
                      value={form.companyType}
                      onChange={handleChange}
                      style={{ ...INPUT, color: form.companyType ? '#fff' : 'rgba(255,255,255,0.5)' }}
                    >
                      <option value="">Select</option>
                      <option value="individual">Individual</option>
                      <option value="brand">Brand</option>
                      <option value="agency">Agency</option>
                      <option value="Holding-co">Holding Co</option>
                      <option value="software">Software</option>
                    </select>
                  </div>
                </div>

                {/* Row: Budget */}
                <div className="demo-hero-form-line">
                  <div className="demo-hero-form-item">
                    <div className="demo-hero-form-item-label-wrapper">
                      <label htmlFor="Budget" className="demo-hero-form-label">Budget</label>
                      <label htmlFor="Budget" className="demo-hero-form-label form-label-secondary">(Optional)</label>
                    </div>
                    <select
                      id="Budget"
                      name="budget"
                      data-name="Budget"
                      className="demo-hero-form-input w-select"
                      value={form.budget}
                      onChange={handleChange}
                      style={{ ...INPUT, color: form.budget ? '#fff' : 'rgba(255,255,255,0.5)' }}
                    >
                      <option value="">Select</option>
                      <option value="u1">&lt; $1,000</option>
                      <option value="u3">$1,000 - $3,000</option>
                      <option value="u5">$3,000 - $5,000</option>
                      <option value="u10">$5,000 - $10,000</option>
                      <option value="a10">&gt;$10,000</option>
                    </select>
                  </div>
                </div>

                {/* Row: Message */}
                <div className="demo-hero-form-line">
                  <div className="demo-hero-form-item">
                    <div className="demo-hero-form-item-label-wrapper">
                      <label htmlFor="Additional" className="demo-hero-form-label">Additional requirements</label>
                      <label htmlFor="Additional" className="demo-hero-form-label form-label-secondary">(Optional)</label>
                    </div>
                    <textarea
                      id="Additional"
                      name="message"
                      maxLength={5000}
                      data-name="Additional"
                      placeholder="Enter your message"
                      required
                      className="demo-hero-form-input w-input"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      style={{ ...INPUT, resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="demo-hero-form-submit">
                  <input
                    type="submit"
                    data-wait="Please wait..."
                    className="button-dark button-primary w-button"
                    value="Continue"
                    style={{ width: '100%', padding: '14px', cursor: 'pointer' }}
                  />
                  <div className="demo-hero-form-terms">
                    <div className="text-alpha-100">
                      <div className="text-body-s">
                        By submitting this form, you agree to ISSO&apos;s Terms of Service and Privacy Policy.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success / error messages */}
              <div className="demo-hero-form-message success-message w-form-done">
                <div>Thank you! Your submission has been received!</div>
              </div>
              <div className="demo-hero-form-message w-form-fail">
                <div>Oops! Something went wrong while submitting the form.</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
