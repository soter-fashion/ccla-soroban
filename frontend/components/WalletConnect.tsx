'use client';

import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';

export default function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const { account, connect, disconnect, isConnecting } = useWallet();

  const handleConnect = async (walletId: string) => {
    try {
      await connect(walletId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnecting}
        className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleConnect('freighter')}
            className="w-full px-4 py-2 text-left hover:bg-slate-700 transition border-b border-slate-700"
          >
            🔐 Freighter
          </button>
          <button
            onClick={() => handleConnect('ledger')}
            className="w-full px-4 py-2 text-left hover:bg-slate-700 transition border-b border-slate-700"
          >
            💾 Ledger
          </button>
          <button
            onClick={() => handleConnect('lab')}
            className="w-full px-4 py-2 text-left hover:bg-slate-700 transition"
          >
            🧪 Stellar Lab
          </button>
        </div>
      )}
    </div>
  );
}
