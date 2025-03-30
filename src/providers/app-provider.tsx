import React from 'react';
import ConvexClerkProvider from './convex-clerk-provider';
import { MediaConfigProvider } from './media-config-provider';
import ReactQueryProvider from './react-query-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClerkProvider>
      <ReactQueryProvider>
        <MediaConfigProvider>{children}</MediaConfigProvider>
      </ReactQueryProvider>
    </ConvexClerkProvider>
  );
}
