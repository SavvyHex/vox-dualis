"use client";

import { useState, useEffect } from 'react';
import { checkHealthStatus } from '../lib/api';

interface ConnectionStatusProps {
  className?: string;
}

export default function ConnectionStatus({ className = "" }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await checkHealthStatus();
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null && !isChecking) {
    return null; // Don't show anything while initially loading
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isChecking
              ? 'bg-yellow-400 animate-pulse'
              : isConnected
              ? 'bg-green-400'
              : 'bg-red-400'
          }`}
        />
        <span className="text-xs text-stone-400">
          {isChecking
            ? 'Checking...'
            : isConnected
            ? 'Backend Connected'
            : 'Backend Offline'}
        </span>
      </div>
      
      {!isConnected && !isChecking && (
        <button
          onClick={checkConnection}
          className="text-xs text-amber-400 hover:text-amber-300 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}
