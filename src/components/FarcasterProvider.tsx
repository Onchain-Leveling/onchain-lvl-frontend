"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface FarcasterContextType {
  isReady: boolean;
  user: unknown;
  error: string | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isReady: false,
  user: null,
  error: null,
});

export const useFarcaster = () => {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error('useFarcaster must be used within FarcasterProvider');
  }
  return context;
};

interface FarcasterProviderProps {
  children: ReactNode;
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        // Wait for SDK to be ready
        await sdk.actions.ready();
        setIsReady(true);

        // Get user context if available
        const context = await sdk.context;
        if (context?.user) {
          setUser(context.user);
        }
      } catch (err) {
        console.error('Failed to initialize Farcaster SDK:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Still set ready to true for non-Farcaster environments
        setIsReady(true);
      }
    };

    initializeFarcaster();
  }, []);

  return (
    <FarcasterContext.Provider value={{ isReady, user, error }}>
      {children}
    </FarcasterContext.Provider>
  );
}