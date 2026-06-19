'use client';

import React from 'react';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';
import Navigation from '@/components/Navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <WalletProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
