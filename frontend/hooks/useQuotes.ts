'use client';

import { useState, useEffect } from 'react';

interface QuoteData {
  amount_out: number;
  min_amount_out: number;
  price_impact: number;
}

export function useQuotes(tokenIn: string, tokenOut: string, amountIn: string) {
  const [quotes, setQuotes] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenIn || !tokenOut || !amountIn) {
      setQuotes(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      // Simulate quote fetching
      const amount = parseFloat(amountIn);
      setQuotes({
        amount_out: amount * 0.95,
        min_amount_out: amount * 0.94,
        price_impact: 0.3,
      });
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [tokenIn, tokenOut, amountIn]);

  return { quotes, loading };
}
