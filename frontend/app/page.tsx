'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
          Cross-Chain Liquidity Aggregator
        </h1>
        
        <p className="text-xl text-slate-300 mb-8 max-w-2xl">
          Find and execute optimal swap prices across all Soroban DEXes with minimal slippage. 
          Trade with confidence using our intelligent routing algorithm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition">
            <h3 className="text-2xl font-bold mb-3 text-cyan-400">💱 Smart Routing</h3>
            <p className="text-slate-400">
              Automatically find the best path through multiple DEXes to maximize your output.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition">
            <h3 className="text-2xl font-bold mb-3 text-purple-400">⚡ Atomic Swaps</h3>
            <p className="text-slate-400">
              Execute swaps atomically with guaranteed slippage protection and transparent fees.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition">
            <h3 className="text-2xl font-bold mb-3 text-pink-400">📊 Real-time Quotes</h3>
            <p className="text-slate-400">
              Get instant quotes with price impact analysis before executing any swap.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/swap"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105"
          >
            Start Trading
          </Link>
          
          <Link
            href="/pools"
            className="px-8 py-3 bg-slate-700 rounded-lg font-bold hover:bg-slate-600 transition"
          >
            Explore Pools
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl font-bold text-cyan-400">1000+</p>
            <p className="text-slate-400">Active Pools</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">$50M+</p>
            <p className="text-slate-400">Total Liquidity</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-400">0.3%</p>
            <p className="text-slate-400">Max Fee</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-400">50k+</p>
            <p className="text-slate-400">Daily Swaps</p>
          </div>
        </div>
      </div>
    </div>
  );
}
