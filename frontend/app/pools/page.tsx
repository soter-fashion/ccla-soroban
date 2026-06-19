'use client';

import React, { useState, useEffect } from 'react';

interface Pool {
  id: number;
  dex: string;
  token_a: string;
  token_b: string;
  tvl: number;
  apr: number;
}

export default function PoolsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'tvl' | 'apr'>('tvl');

  useEffect(() => {
    // Simulate fetching pools
    setLoading(false);
    setPools([
      { id: 1, dex: 'Stellar Swap', token_a: 'XLM', token_b: 'USDC', tvl: 5000000, apr: 15 },
      { id: 2, dex: 'Phoenix', token_a: 'XLM', token_b: 'ETH', tvl: 3000000, apr: 22 },
      { id: 3, dex: 'Aqua', token_a: 'USDC', token_b: 'ETH', tvl: 8000000, apr: 18 },
    ]);
  }, []);

  const sortedPools = [...pools].sort((a, b) => {
    if (sortBy === 'tvl') return b.tvl - a.tvl;
    return b.apr - a.apr;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Liquidity Pools</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSortBy('tvl')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === 'tvl'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Sort by TVL
          </button>
          <button
            onClick={() => setSortBy('apr')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              sortBy === 'apr'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Sort by APR
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-20">Loading pools...</p>
        ) : (
          <div className="grid gap-4">
            {sortedPools.map((pool) => (
              <div key={pool.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-cyan-500 transition">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-sm text-slate-400">Pool</p>
                    <p className="text-lg font-bold">{pool.token_a}/{pool.token_b}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">DEX</p>
                    <p className="text-lg font-bold">{pool.dex}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">TVL</p>
                    <p className="text-lg font-bold text-cyan-400">
                      ${(pool.tvl / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">APR</p>
                    <p className="text-lg font-bold text-green-400">{pool.apr}%</p>
                  </div>
                  <button className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition font-medium">
                    Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
