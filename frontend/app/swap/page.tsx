'use client';

import React from 'react';
import SwapForm from '@/components/SwapForm';

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center py-20">
      <div className="w-full max-w-md px-4">
        <SwapForm />
      </div>
    </div>
  );
}
