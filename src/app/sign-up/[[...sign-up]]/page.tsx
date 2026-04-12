'use client';

import { SignUp } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpRoute() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) router.replace('/content-gen');
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020308]">
      <SignUp
        routing="path"
        path="/sign-up"
        forceRedirectUrl="/content-gen"
        fallbackRedirectUrl="/content-gen"
        signInUrl="/sign-in"
      />
    </div>
  );
}
