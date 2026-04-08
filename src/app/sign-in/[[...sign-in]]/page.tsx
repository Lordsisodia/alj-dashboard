'use client';

import { useSignIn, useAuth, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SignInPage } from '@/isso/ui/sign-in';
import type { Testimonial } from '@/isso/ui/sign-in';

const testimonials: Testimonial[] = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    name: 'Sarah Chen',
    handle: '@sarahcreates',
    text: 'ORACLE has completely transformed how we manage content for our models. 10× faster.'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    name: 'Marcus J.',
    handle: '@marcusofm',
    text: 'The AI agents run 24/7 so our team can focus on growth, not scheduling.'
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    name: 'Alicia Rivera',
    handle: '@alicia_mgmt',
    text: 'Recon alone is worth it - we track every competitor automatically.'
  },
];

export default function SignInRoute() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { signIn } = useSignIn() as any;
  const { setActive } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already signed in - go straight to dashboard
  useEffect(() => {
    if (isSignedIn) router.replace('/isso');
  }, [isSignedIn, router]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signIn) return;
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({
        identifier: data.get('email') as string,
        password: data.get('password') as string,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/isso');
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] };
      setError(clerkErr?.errors?.[0]?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: '/isso',
      });
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  }

  return (
    <SignInPage
      title={<span className="font-light text-white tracking-tighter">Welcome back</span>}
      description="Sign in to your ORACLE account to continue."
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={testimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={() => router.push('/sign-in?reset=true')}
      onCreateAccount={() => router.push('/sign-up')}
      error={error}
      loading={loading}
    />
  );
}
