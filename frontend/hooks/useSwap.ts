'use client';

import { useState, useCallback } from 'react';

export function useSwap() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swap = useCallback(
    async (
      tokenIn: string,
      tokenOut: string,
      amountIn: string,
      minAmountOut: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        // Simulate swap execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Swap: ${amountIn} ${tokenIn} → ${tokenOut}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Swap failed');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { swap, loading, error };
}
