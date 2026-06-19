'use client';

import React, { useState } from 'react';

const COMMON_TOKENS = [
  { symbol: 'XLM', name: 'Stellar Lumens' },
  { symbol: 'USDC', name: 'USDC' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'EURC', name: 'Euro Coin' },
];

interface TokenSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TokenSelector({ value, onChange }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedToken = COMMON_TOKENS.find(t => t.symbol === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition text-sm font-medium"
      >
        {selectedToken?.symbol || 'Select'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {COMMON_TOKENS.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onChange(token.symbol);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-slate-700 transition border-b border-slate-700 last:border-b-0"
            >
              <p className="font-medium">{token.symbol}</p>
              <p className="text-xs text-slate-400">{token.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
