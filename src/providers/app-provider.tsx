import React from 'react';
import { MediaConfigProvider } from './media-config-provider';
import ReactQueryProvider from './react-query-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <MediaConfigProvider>{children}</MediaConfigProvider>
    </ReactQueryProvider>
  );
}
