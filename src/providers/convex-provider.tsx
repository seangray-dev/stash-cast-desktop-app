import React from 'react';

import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const CLERK_SIGN_IN_FALLBACK_REDIRECT_URL = import.meta.env
  .VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL;
const CLERK_SIGN_UP_FALLBACK_REDIRECT_URL = import.meta.env
  .VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL;
const CLERK_SIGN_IN_FORCE_REDIRECT_URL = import.meta.env
  .VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL;
const CLERK_SIGN_UP_FORCE_REDIRECT_URL = import.meta.env
  .VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL;

if (
  !PUBLISHABLE_KEY ||
  !CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ||
  !CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ||
  !CLERK_SIGN_IN_FORCE_REDIRECT_URL ||
  !CLERK_SIGN_UP_FORCE_REDIRECT_URL
) {
  throw new Error('Missing environment variables');
}

export default function ConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInFallbackRedirectUrl={CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
      signUpFallbackRedirectUrl={CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
      signInForceRedirectUrl={CLERK_SIGN_IN_FORCE_REDIRECT_URL}
      signUpForceRedirectUrl={CLERK_SIGN_UP_FORCE_REDIRECT_URL}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
