"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface FarcasterContextType {
  isReady: boolean;
  user: unknown;
  error: string | null;
  isInFarcaster: boolean;
  navigateToHome: () => void;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isReady: false,
  user: null,
  error: null,
  isInFarcaster: false,
  navigateToHome: () => {},
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
  const [isInFarcaster, setIsInFarcaster] = useState(false);

  // Navigation function that works in Farcaster
  const navigateToHome = () => {
    console.log('navigateToHome called, isInFarcaster:', isInFarcaster);
    
    // Try multiple methods in sequence for Farcaster mini apps
    if (isInFarcaster) {
      console.log('Attempting Farcaster navigation...');
      
      // Method 1: Direct window.location methods
      try {
        console.log('Trying window.location.href to Homepage...');
        window.location.href = '/Homepage';
        return;
      } catch (e1) {
        console.log('window.location.href failed:', e1);
      }
      
      // Method 2: Try window.location.replace
      try {
        console.log('Trying window.location.replace to Homepage...');
        window.location.replace('/Homepage');
        return;
      } catch (e2) {
        console.log('window.location.replace failed:', e2);
      }
      
      // Method 3: Try to navigate to the full URL
      try {
        console.log('Trying full URL navigation to Homepage...');
        window.location.href = window.location.origin + '/Homepage';
        return;
      } catch (e3) {
        console.log('Full URL navigation failed:', e3);
      }
      
      // Method 4: Try history API
      try {
        console.log('Trying history.pushState to Homepage...');
        window.history.pushState(null, '', '/Homepage');
        window.location.reload();
        return;
      } catch (e4) {
        console.log('History API failed:', e4);
      }
      
      // Method 5: Force refresh with new path
      console.log('Forcing page refresh...');
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } else {
      // Regular web environment
      console.log('Using regular navigation to Homepage...');
      window.location.href = '/Homepage';
    }
  };

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        // Check if we're on mobile and handle differently
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('Mobile device detected:', isMobile);

        // Check if we're in Farcaster environment
        const isFarcaster = (() => {
          try {
            const checks = {
              windowTop: window.top !== window.self,
              userAgent: navigator.userAgent.includes('Farcaster'),
              locationCheck: window.location !== window.parent.location,
              referrer: document.referrer.includes('warpcast.com'),
              ancestorOrigins: window.location.ancestorOrigins?.length > 0
            };
            console.log('Farcaster detection checks:', checks);
            
            return checks.windowTop || 
                   checks.userAgent ||
                   checks.locationCheck ||
                   checks.referrer ||
                   checks.ancestorOrigins;
          } catch (e) {
            console.log('Farcaster detection error (assuming iframe):', e);
            // If we can't access window.top, we're likely in an iframe
            return true;
          }
        })();
        console.log('Farcaster environment detected:', isFarcaster);
        setIsInFarcaster(isFarcaster);

        // For mobile devices, use shorter timeout and fallback faster
        const mobileTimeout = isMobile ? 2000 : 5000;
        const timeoutId = setTimeout(() => {
          console.log('Farcaster SDK timeout reached, setting ready to true');
          setIsReady(true);
        }, mobileTimeout);

        try {
          // Wait for SDK to be ready with timeout
          await Promise.race([
            sdk.actions.ready(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('SDK timeout')), mobileTimeout)
            )
          ]);
          
          clearTimeout(timeoutId);
          setIsReady(true);

          // Get user context if available
          const context = await sdk.context;
          if (context?.user) {
            setUser(context.user);
          }
        } catch (sdkError) {
          console.log('SDK initialization failed or timed out:', sdkError);
          clearTimeout(timeoutId);
          setIsReady(true); // Continue anyway
        }
        
      } catch (err) {
        console.error('Failed to initialize Farcaster SDK:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Always set ready to true to prevent infinite loading
        setIsReady(true);
      }
    };

    initializeFarcaster();
  }, []);

  return (
    <FarcasterContext.Provider value={{ isReady, user, error, isInFarcaster, navigateToHome }}>
      {children}
    </FarcasterContext.Provider>
  );
}