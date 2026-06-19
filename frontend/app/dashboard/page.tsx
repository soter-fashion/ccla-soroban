'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SwapHistory {
  id: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

export default function DashboardPage() {
  const [swaps, setSwaps] = useState<SwapHistory[]>([]);
  const [stats, setStats] = useState({ totalSwaps: 0, totalVolume: 0, totalFees: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setStats({
      totalSwaps: 1523,
      totalVolume: 12500000,
      totalFees: 37500,
    });

    setSwaps([
      {
        id: '1',
        tokenIn: 'XLM',
        tokenOut: 'USDC',
        amountIn: 1000,
        amountOut: 0.5,
        timestamp: new Date(),
        status: 'success',
      },
      {
        id: '2',
        tokenIn: 'USDC',
        tokenOut: 'ETH',
        amountIn: 500,
        amountOut: 0.25,
        timestamp: new Date(),
        status: 'success',
      },
    ]);

    setChartData([
      { time: '12:00', volume: 100000 },
      { time: '13:00', volume: 120000 },
      { time: '14:00', volume: 98000 },
      { time: '15:00', volume: 150000 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Swaps</p>
            <p className="text-3xl font-bold text-cyan-400">{stats.totalSwaps}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Volume</p>
            <p className="text-3xl font-bold text-purple-400">
              ${(stats.totalVolume / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Fees Earned</p>
            <p className="text-3xl font-bold text-green-400">
              ${(stats.totalFees / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-12">
          <h2 className="text-xl font-bold mb-4">Trading Volume (24h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Swaps */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Swaps</h2>
          <div className="space-y-2">
            {swaps.map((swap) => (
              <div
                key={swap.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">
                    {swap.amountIn} {swap.tokenIn} → {swap.amountOut} {swap.tokenOut}
                  </p>
                  <p className="text-sm text-slate-400">
                    {swap.timestamp.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    swap.status === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
