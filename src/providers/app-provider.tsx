import React from 'react';
import ConvexProvider from './convex-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider>{children}</ConvexProvider>;
}
