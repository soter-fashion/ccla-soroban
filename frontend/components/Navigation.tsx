'use client';

import React from 'react';
import Link from 'next/link';
import WalletConnect from './WalletConnect';

export default function Navigation() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
          CCLA
        </Link>

        <div className="flex gap-8">
          <Link href="/swap" className="text-slate-300 hover:text-cyan-400 transition">
            Swap
          </Link>
          <Link href="/pools" className="text-slate-300 hover:text-cyan-400 transition">
            Pools
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-cyan-400 transition">
            Dashboard
          </Link>
        </div>

        <WalletConnect />
      </div>
    </nav>
  );
}
