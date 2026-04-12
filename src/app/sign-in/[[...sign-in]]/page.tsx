'use client';

import { SignIn } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInRoute() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace('/isso');
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020308]">
      <SignIn
        routing="path"
        path="/sign-in"
        forceRedirectUrl="/isso"
        fallbackRedirectUrl="/isso"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
