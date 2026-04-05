'use client';

import { useSignUp } from '@clerk/nextjs/legacy';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpRoute() {
  const { signUp, isLoaded } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'form' | 'verify'>('form');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    const data = new FormData(e.currentTarget);
    const emailVal = data.get('email') as string;
    setLoading(true);
    setError('');
    try {
      await signUp.create({
        emailAddress: emailVal,
        password: data.get('password') as string,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setEmail(emailVal);
      setStage('verify');
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? 'Verification failed. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020308', fontFamily: 'Inter, sans-serif' }}>
      {stage === 'form' ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Start free trial</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: 0 }}>Create your ISSO account.</p>
          {error && <p style={{ color: '#ef4444', fontSize: 13, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500 }}>Email Address</label>
            <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
              <input name="email" type="email" placeholder="Enter your email address"
                style={{ width: '100%', background: 'transparent', padding: '14px 16px', borderRadius: 16, border: 'none', outline: 'none', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500 }}>Password</label>
            <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
              <input name="password" type="password" placeholder="Create a password"
                style={{ width: '100%', background: 'transparent', padding: '14px 16px', borderRadius: 16, border: 'none', outline: 'none', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '14px', borderRadius: 16, background: '#fff', color: '#020308', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 14, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', margin: 0 }}>
            Already have an account?{' '}
            <button type="button" onClick={() => router.push('/sign-in')}
              style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: 13, padding: 0 }}>
              Sign in
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Check your email</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: 0 }}>We sent a code to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{email}</strong></p>
          {error && <p style={{ color: '#ef4444', fontSize: 13, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', margin: 0 }}>{error}</p>}
          <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
            <input type="text" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)}
              style={{ width: '100%', background: 'transparent', padding: '14px 16px', borderRadius: 16, border: 'none', outline: 'none', color: '#fff', fontSize: 22, letterSpacing: '0.3em', textAlign: 'center', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '14px', borderRadius: 16, background: '#fff', color: '#020308', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 14, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>
      )}
    </div>
  );
}
