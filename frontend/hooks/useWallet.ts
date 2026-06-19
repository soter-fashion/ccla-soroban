'use client';

import { useState, useCallback } from 'react';

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (walletId: string) => {
    setIsConnecting(true);
    try {
      // In production, use actual Stellar wallet integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccount(`G${Math.random().toString(36).substring(7).toUpperCase()}`);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
  }, []);

  return { account, isConnecting, connect, disconnect };
}
