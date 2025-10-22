"use client";

import { useState } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useFarcaster } from "../../components/FarcasterProvider";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";

export default function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const { isReady } = useFarcaster();
  const { isConnected } = useAccount();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">Loading...</div>
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
              Choose Your Character
            </h1>
            <p className="text-gray-600">
              Select a character to start your Onchain Leveling journey
            </p>
          </div>
        </div>

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

        {!selectedCharacter && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            Your character represents your journey in both fitness and the crypto world.
          </div>
        )}

        {selectedCharacter && (
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('selectedCharacter', selectedCharacter);
                window.location.href = '/';
              }
            }}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Continue with {selectedCharacter === "degen" ? "Degen" : "Runner"}
          </button>
        )}
      </div>
    </div>
  );
}