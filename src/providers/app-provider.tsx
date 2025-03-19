import React from 'react';
import ConvexClerkProvider from './convex-clerk-provider';
import ReactQueryProvider from './react-query-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClerkProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ConvexClerkProvider>
  );
}
