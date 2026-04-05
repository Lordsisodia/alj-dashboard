// OnboardingForm — Dark card with form fields (Name, Email, Website, Ad Spend, Help text, Submit).
// Uses React state for all fields and a submit handler.

'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  fullName: string;
  email: string;
  website: string;
  adSpend: string;
  helpText: string;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.6)',
  marginBottom: '8px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function OnboardingForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    website: '',
    adSpend: '',
    helpText: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Onboarding form submitted:', formData);
  };

  return (
    <div
      style={{
        maxWidth: '560px',
        width: '100%',
        margin: '40px auto 0',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Smith"
            value={formData.fullName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Company Website</label>
          <input
            type="url"
            name="website"
            placeholder="https://yourcompany.com"
            value={formData.website}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Monthly Ad Spend</label>
          <select
            name="adSpend"
            value={formData.adSpend}
            onChange={handleChange}
            style={{
              ...inputStyle,
              color: formData.adSpend ? '#fff' : 'rgba(255,255,255,0.5)',
              appearance: 'none',
            }}
          >
            <option value="">Select range...</option>
            <option value="0-5k">&pound;0 &ndash; &pound;5,000</option>
            <option value="5k-20k">&pound;5,000 &ndash; &pound;20,000</option>
            <option value="20k-50k">&pound;20,000 &ndash; &pound;50,000</option>
            <option value="50k+">&pound;50,000+</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>What do you need help with?</label>
          <textarea
            name="helpText"
            placeholder="Tell us about your goals..."
            rows={3}
            value={formData.helpText}
            onChange={handleChange}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: '#fff',
            color: '#020308',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Book Your Call
        </button>
      </form>
    </div>
  );
}
