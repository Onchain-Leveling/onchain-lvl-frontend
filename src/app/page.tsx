"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from 'wagmi';
import { useRegistrationStatus } from '../hooks/useRegistrationStatus';
import Homepage from "./Homepage/page";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { isRegistered, isLoading: isCheckingRegistration } = useRegistrationStatus();
  const [hasSelectedCharacter, setHasSelectedCharacter] = useState<boolean | null>(null);

  useEffect(() => {
    // If wallet is connected and user is registered, show homepage directly
    if (isConnected && !isCheckingRegistration && isRegistered) {
      setHasSelectedCharacter(true);
      return;
    }

    // If wallet is not connected or user is not registered, check localStorage
    if (typeof window !== 'undefined') {
      const selectedCharacter = localStorage.getItem('selectedCharacter');
      if (selectedCharacter) {
        setHasSelectedCharacter(true);
      } else {
        setHasSelectedCharacter(false);
        // Only redirect to onboarding if we're not still checking registration
        if (!isCheckingRegistration) {
          router.push("/onboarding");
        }
      }
    }
  }, [router, isConnected, isRegistered, isCheckingRegistration]);

  // Show loading while checking registration status
  if (isCheckingRegistration || hasSelectedCharacter === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <div className="text-gray-600 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (hasSelectedCharacter) {
    return <Homepage />;
  }

  return null;
}