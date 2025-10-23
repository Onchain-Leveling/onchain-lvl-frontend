"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Calendar, Activity, Wallet } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useGetProfile } from '../../hooks/useGetProfile';
import { useGetNextLevelXp } from '../../hooks/useGetNextLevelXP';
import { CHARACTER_TYPES } from '../../hooks/useRegister';
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import BottomNavbar from "../../components/BottomNavbar";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const character = searchParams.get("character") || "degen";
  const [selectedCharacter, setSelectedCharacter] = useState<string>("degen");
  const [mounted, setMounted] = useState(false);
  const { isConnected, address } = useAccount();
  const { profile, isLoading: isProfileLoading, error: profileError } = useGetProfile(address);
  const { nextLevelXp: nextLevelData, isLoading: isNextLevelLoading } = useGetNextLevelXp(address);
  
  // Remove mock data - will use real profile data

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const [achievements] = useState([
    { id: 1, title: "First Steps", description: "Complete your first activity", unlocked: true },
    { id: 2, title: "Consistent", description: "7-day activity streak", unlocked: true },
    { id: 3, title: "Level Master", description: "Reach level 5", unlocked: true },
    { id: 4, title: "XP Hunter", description: "Earn 1000 XP", unlocked: true },
    { id: 5, title: "Task Master", description: "Complete 100 tasks", unlocked: false },
    { id: 6, title: "Champion", description: "Reach level 10", unlocked: false }
  ]);

  const [weeklyStats] = useState([
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: false },
    { day: "Thu", completed: true },
    { day: "Fri", completed: true },
    { day: "Sat", completed: true },
    { day: "Sun", completed: false }
  ]);

  useEffect(() => {
    if (profile?.isRegistered && profile.characterType) {
      // Set character based on profile data from contract
      const characterFromProfile = profile.characterType === CHARACTER_TYPES.DEGEN ? 'degen' : 'runner';
      setSelectedCharacter(characterFromProfile);
      
      // Update URL parameter to match profile character
      const currentCharacter = searchParams.get("character");
      if (currentCharacter !== characterFromProfile) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("character", characterFromProfile);
        router.replace(`/profile?${newSearchParams.toString()}`, { scroll: false });
      }
    } else if (typeof window !== 'undefined') {
      // Fallback to localStorage if profile not loaded yet
      const savedCharacter = localStorage.getItem('selectedCharacter') || character || 'degen';
      setSelectedCharacter(savedCharacter);
    }
  }, [character, profile?.characterType, profile?.isRegistered, router, searchParams]);

  // Redirect to onboarding if wallet is disconnected
  useEffect(() => {
    if (!isConnected) {
      // Small delay to ensure proper state updates
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/onboarding';
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Calculate dynamic data from profile and smart contract
  const currentXp = profile?.xp ? Number(profile.xp) : 0;
  const remainingXp = nextLevelData?.remaining ? Number(nextLevelData.remaining) : 0;
  const nextLevelCumulativeXp = nextLevelData?.nextLevelCumulative ? Number(nextLevelData.nextLevelCumulative) : 1000;
  const xpNeededForCurrentLevel = nextLevelCumulativeXp - remainingXp;
  const xpPercentage = nextLevelCumulativeXp > 0 ? ((currentXp - xpNeededForCurrentLevel) / remainingXp) * 100 : 0;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching profile
  if (isConnected && (isProfileLoading || isNextLevelLoading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Loading Profile...</p>
            <p className="text-gray-600 text-sm">Fetching your onchain data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if profile failed to load
  if (isConnected && profileError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Profile Load Failed</p>
            <p className="text-gray-600 text-sm">Unable to fetch your profile data. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if user is not registered
  if (isConnected && profile && !profile.isRegistered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-blue-600 text-xl">ℹ</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Profile Not Found</p>
            <p className="text-gray-600 text-sm">You need to register first to access your profile.</p>
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state when wallet is disconnected and redirecting
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Wallet Disconnected</p>
            <p className="text-gray-600 text-sm">Redirecting to connect wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <Lottie 
              animationData={selectedCharacter === "degen" ? degenCharacter : runnerCharacter} 
              loop={true} 
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{profile?.name || "Anonymous User"}</h1>
          <p className="text-gray-500 text-sm">@{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
              {selectedCharacter === "degen" ? "Degen" : "Runner"}
            </span>
            <span className="text-xs text-gray-400">• Registered User</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Level {profile?.level || 1}</span>
            <span className="text-sm text-gray-400">{currentXp} XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(xpPercentage, 0), 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {remainingXp > 0 ? `${remainingXp} XP to Level ${(profile?.level || 1) + 1}` : 'Max Level Reached'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">{profile?.level || 1}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">{currentXp}</div>
            <div className="text-xs text-gray-500">Total XP</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-lg font-bold text-gray-900 mb-1">{selectedCharacter === "degen" ? "DEGEN" : "RUNNER"}</div>
            <div className="text-xs text-gray-500">Character</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
          </div>
          <div className="flex justify-between space-x-2">
            {weeklyStats.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="text-xs text-gray-500 font-medium">{day.day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  day.completed ? 'bg-black' : 'bg-gray-200'
                }`}>
                  {day.completed && <Activity className="w-4 h-4 text-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
            </div>
            <span className="text-sm text-gray-500">{unlockedAchievements}/{achievements.length}</span>
          </div>
          
          <div className="space-y-3">
            {achievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-black' : 'bg-gray-200'
                }`}>
                  <Trophy className={`w-4 h-4 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-xs ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-full">
            <div className="flex items-center space-x-2 mb-3">
              <Wallet className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Wallet Connection</span>
            </div>
            <div className="w-full">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                            >
                              <Wallet className="w-4 h-4" />
                              <span>Connect Wallet</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={openAccountModal}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                          >
                            <Wallet className="w-4 h-4" />
                            <span>
                              {account.displayName}
                              {account.displayBalance ? ` (${account.displayBalance})` : ''}
                            </span>
                          </button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
          
          <Link
            href="/leaderboard"
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Trophy className="w-4 h-4" />
            <span>View Leaderboard</span>
          </Link>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}