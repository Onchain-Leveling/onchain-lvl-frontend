"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useFarcaster } from "../../components/FarcasterProvider";
import { useRegister, CHARACTER_TYPES } from "../../hooks/useRegister";
import { useRegistrationStatus } from "../../hooks/useRegistrationStatus";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";

export default function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { isReady, navigateToHome } = useFarcaster();
  const { isConnected } = useAccount();
  const { register, isPending, isConfirming, isSuccess, error } = useRegister();
  const { isRegistered, isLoading: isCheckingRegistration, profile } = useRegistrationStatus();

  // Progress simulation for better UX on mobile
  useEffect(() => {
    if (!isReady) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      // Much shorter fallback timeout to prevent infinite loading on mobile
      const timeout = setTimeout(() => {
        console.log('Loading timeout reached, forcing progress to 100');
        setLoadingProgress(100);
      }, 3000); // Reduced to 3 seconds for mobile

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setLoadingProgress(100);
    }
  }, [isReady]);

  // Additional safety timeout to force progress after a short time regardless of Farcaster status
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout: Forcing loading completion for mobile devices');
      setLoadingProgress(100);
    }, 2000); // 2 second safety net

    return () => clearTimeout(safetyTimeout);
  }, []);

  // Redirect to homepage if user is already registered (immediate redirect)
  useEffect(() => {
    if (isConnected && !isCheckingRegistration && isRegistered && profile) {
      // Immediate redirect without showing welcome screen
      console.log('User already registered, redirecting immediately to Homepage...');
      navigateToHome();
    }
  }, [navigateToHome, isConnected, isCheckingRegistration, isRegistered, profile]);

  // Show loading only if both conditions are met AND we're within the first few seconds
  if (loadingProgress < 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="flex justify-center">
            <Image
              src="/Assets/Logo/logo-onchain-leveling.png"
              alt="Onchain Leveling"
              width={80}
              height={64}
              className="object-contain animate-pulse"
              priority
            />
          </div>
          
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-sm">Loading Onchain Leveling...</p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            
            <p className="text-gray-400 text-xs">
              {loadingProgress < 30 ? 'Connecting to Farcaster...' :
               loadingProgress < 60 ? 'Loading Web3 providers...' :
               loadingProgress < 90 ? 'Preparing interface...' :
               'Almost ready!'}
            </p>
            
            {/* Show skip button after 3 seconds for mobile users */}
            {loadingProgress > 50 && (
              <button 
                onClick={() => {
                  console.log('User manually skipped loading');
                  setLoadingProgress(100);
                }}
                className="text-blue-600 text-xs underline hover:text-blue-800 transition-colors mt-2"
              >
                Skip loading →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking registration status (only if fully ready)
  if (isReady && isConnected && isCheckingRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="flex justify-center">
            <Image
              src="/Assets/Logo/logo-onchain-leveling.png"
              alt="Onchain Leveling"
              width={80}
              height={64}
              className="object-contain animate-pulse"
              priority
            />
          </div>
          
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-sm">Checking registration status...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is already registered, show minimal loading while redirecting
  if (isReady && isConnected && !isCheckingRegistration && isRegistered && profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 text-sm">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  // Show wallet connection step first (only when fully ready)
  if (isReady && !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Image
                src="/Assets/Logo/logo-onchain-leveling.png"
                alt="Onchain Leveling"
                width={100}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-gray-900">
                Welcome to Onchain Leveling
              </h1>
              <p className="text-gray-600">
                Connect your wallet to start your fitness and crypto journey
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <ConnectButton />
            </div>
            <p className="text-sm text-gray-500">
              Your wallet will be used to track your onchain achievements and rewards
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show registration form only when ready, connected, and not registered
  if (!isReady || !isConnected || isCheckingRegistration || isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="flex justify-center">
            <Image
              src="/Assets/Logo/logo-onchain-leveling.png"
              alt="Onchain Leveling"
              width={80}
              height={64}
              className="object-contain animate-pulse"
              priority
            />
          </div>
          
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <Image
              src="/Assets/Logo/logo-onchain-leveling.png"
              alt="Onchain Leveling"
              width={100}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900">
              Create Your Profile
            </h1>
            <p className="text-gray-600">
              Enter your name and choose a character to start your journey
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-900">
              Player Name
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your player name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 text-center">Choose Your Character</h3>
            <div className="grid grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedCharacter === "degen"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedCharacter("degen")}
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <Lottie animationData={degenCharacter} loop={true} />
            </div>
            <h3 className="font-medium text-gray-900">Degen</h3>
            <p className="text-sm text-gray-600 mt-1">The crypto enthusiast</p>
          </div>

          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedCharacter === "runner"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedCharacter("runner")}
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <Lottie animationData={runnerCharacter} loop={true} />
            </div>
            <h3 className="font-medium text-gray-900">Runner</h3>
            <p className="text-sm text-gray-600 mt-1">The fitness lover</p>
          </div>
            </div>
          </div>
        </div>

        {!selectedCharacter && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            Your character represents your journey in both fitness and the crypto world.
          </div>
        )}

        {selectedCharacter && playerName.trim() && !isSuccess && (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error.message || "Registration failed. Please try again."}
              </div>
            )}
            
            <button
              onClick={() => {
                const characterType = selectedCharacter === "degen" ? CHARACTER_TYPES.DEGEN : CHARACTER_TYPES.RUNNER;
                register(playerName.trim(), characterType);
              }}
              disabled={isPending || isConfirming}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && "Preparing transaction..."}
              {isConfirming && "Confirming registration..."}
              {!isPending && !isConfirming && `Register as ${selectedCharacter === "degen" ? "Degen" : "Runner"}`}
            </button>
          </div>
        )}

        {isSuccess && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
              <h3 className="font-medium">Registration Successful!</h3>
              <p className="text-sm mt-1">Welcome to Onchain Leveling, {playerName}!</p>
            </div>
            <button
              onClick={() => {
                console.log('Start Journey button clicked');
                navigateToHome();
              }}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Start Your Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}