'use client';

import React, { useState } from 'react';
import TokenSelector from './TokenSelector';
import { useSwap } from '@/hooks/useSwap';
import { useQuotes } from '@/hooks/useQuotes';

export default function SwapForm() {
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [slippage, setSlippage] = useState(1);

  const { quotes, loading: quotesLoading } = useQuotes(tokenIn, tokenOut, amountIn);
  const { swap, loading: swapLoading } = useSwap();

  const handleSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const minAmountOut = quotes?.min_amount_out || 0;
      await swap(tokenIn, tokenOut, amountIn, minAmountOut);
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const minAmountOut = quotes ? Math.floor(quotes.amount_out * (1 - slippage / 100)) : 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>

      <div className="space-y-4">
        {/* Input Token */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.0"
              className="flex-1"
            />
            <TokenSelector value={tokenIn} onChange={setTokenIn} />
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={() => {
            const temp = tokenIn;
            setTokenIn(tokenOut);
            setTokenOut(temp);
          }}
          className="w-full py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition font-medium"
        >
          ⇅ Swap
        </button>

        {/* Output Token */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={quotes?.amount_out || '0'}
              disabled
              className="flex-1 bg-slate-700"
            />
            <TokenSelector value={tokenOut} onChange={setTokenOut} />
          </div>
        </div>

        {/* Slippage Tolerance */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Slippage Tolerance: {slippage}%
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-400 mt-1">
            Min output: {minAmountOut.toFixed(2)}
          </p>
        </div>

        {/* Price Impact */}
        {quotes && (
          <div className="bg-slate-700 p-3 rounded-lg">
            <p className="text-sm text-slate-400">Price Impact</p>
            <p className={`text-lg font-bold ${quotes.price_impact > 5 ? 'text-red-400' : 'text-green-400'}`}>
              {quotes.price_impact.toFixed(2)}%
            </p>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={swapLoading || !tokenIn || !tokenOut || !amountIn}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {swapLoading ? 'Swapping...' : quotesLoading ? 'Loading Quote...' : 'Swap'}
        </button>
      </div>
    </div>
  );
}
