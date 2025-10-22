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
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        // Simple Farcaster environment detection
        const isFarcaster = typeof window !== 'undefined' && (
          // Only try SDK if we're in an iframe or on Farcaster domains
          (window.parent !== window && window.location.href.includes('warpcast.com')) ||
          window.location.href.includes('farcaster.xyz') ||
          navigator.userAgent.includes('Farcaster')
        );

        // Only try SDK if we're definitely in Farcaster environment
        if (isFarcaster) {
          try {
            // Add timeout for SDK initialization
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error('SDK initialization timeout')), 2000);
            });

            // Race between SDK ready and timeout
            await Promise.race([
              sdk.actions.ready(),
              timeoutPromise
            ]);

            // Get user context if available
            const context = await sdk.context;
            if (context?.user) {
              setUser(context.user);
            }
          } catch (sdkError) {
            console.warn('Farcaster SDK not available or timed out:', sdkError);
            // Continue without SDK
          }
        }

        setIsReady(true);
      } catch (err) {
        console.warn('Farcaster initialization failed:', err);
        // Always set ready to true - don't block the app
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