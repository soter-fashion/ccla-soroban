/// Utility functions for the frontend

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function calculatePriceImpact(amountIn: number, amountOut: number): number {
  if (amountIn === 0) return 0;
  return ((amountIn - amountOut) / amountIn) * 100;
}

export function calculateMinimumOutput(
  amountOut: number,
  slippagePercent: number
): number {
  return amountOut * (1 - slippagePercent / 100);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
