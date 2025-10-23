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
  const { isReady } = useFarcaster();
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

      // Fallback timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoadingProgress(100);
      }, 5000); // 5 second timeout

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setLoadingProgress(100);
    }
  }, [isReady]);

  // Redirect to homepage if user is already registered
  useEffect(() => {
    if (isConnected && isRegistered && profile) {
      // Small delay to ensure proper loading states
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isConnected, isRegistered, profile]);

  if (!isReady && loadingProgress < 100) {
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
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking registration status
  if (isConnected && isCheckingRegistration) {
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

  // Show welcome message if user is already registered
  if (isConnected && isRegistered && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
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
              Welcome back, {profile.name}!
            </h1>
            <p className="text-gray-600">
              You're already registered. Redirecting to your dashboard...
            </p>
          </div>

          <div className="space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 text-sm">Taking you to your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  // Show wallet connection step first
  if (!isConnected) {
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
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
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