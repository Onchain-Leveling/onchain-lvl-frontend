"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, Users } from "lucide-react";
import { useAccount } from 'wagmi';
import { useGetProfile } from '../../hooks/useGetProfile';
import { useGetNextLevelXp } from '../../hooks/useGetNextLevelXP';
import { CHARACTER_TYPES } from '../../hooks/useRegister';
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import BottomNavbar from "../../components/BottomNavbar";

interface TaskData {
  name: string;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
}

interface FriendActivity {
  name: string;
  activity: string;
  xp: number;
  time: string;
  level: number;
  character: 'degen' | 'runner';
}

export default function Homepage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("degen");
  const { isConnected, address } = useAccount();
  const { profile, isLoading: isProfileLoading } = useGetProfile(address);
  const { nextLevelXp: nextLevelData, isLoading: isNextLevelLoading } = useGetNextLevelXp(address);
  
  // Calculate dynamic data from profile and smart contract
  const currentXp = profile?.xp ? Number(profile.xp) : 0;
  const remainingXp = nextLevelData?.remaining ? Number(nextLevelData.remaining) : 0;
  const nextLevelCumulativeXp = nextLevelData?.nextLevelCumulative ? Number(nextLevelData.nextLevelCumulative) : 1000;

  const [dailyTasks] = useState<TaskData[]>([
    { name: "Running", progress: 0.8, target: 1, unit: "km", completed: false },
    { name: "Walking", progress: 5, target: 5, unit: "km", completed: true },
    { name: "Sit-ups", progress: 7, target: 10, unit: "reps", completed: false }
  ]);

  const [friendsActivities] = useState<FriendActivity[]>([
    { name: "Dolin", activity: "Completed 5km walk", xp: 100, time: "2 min ago", level: 6, character: 'runner' },
    { name: "Sarah", activity: "Finished 15 sit-ups", xp: 45, time: "5 min ago", level: 4, character: 'degen' },
    { name: "Mike", activity: "Ran 3km distance", xp: 150, time: "12 min ago", level: 7, character: 'runner' },
    { name: "Emma", activity: "Daily walking goal", xp: 80, time: "18 min ago", level: 5, character: 'degen' },
    { name: "David", activity: "Completed 20 sit-ups", xp: 60, time: "25 min ago", level: 3, character: 'runner' }
  ]);

  useEffect(() => {
    if (profile?.isRegistered && profile.characterType) {
      // Set character based on profile data from contract
      const characterFromProfile = profile.characterType === CHARACTER_TYPES.DEGEN ? 'degen' : 'runner';
      setSelectedCharacter(characterFromProfile);
    } else if (typeof window !== 'undefined') {
      // Fallback to localStorage if profile not loaded yet
      const character = localStorage.getItem('selectedCharacter') || 'degen';
      setSelectedCharacter(character);
    }
  }, [profile?.characterType, profile?.isRegistered]);

  // Redirect to onboarding if wallet is not connected
  useEffect(() => {
    if (!isConnected) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/onboarding';
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Calculate XP percentage for progress bar
  const xpNeededForCurrentLevel = nextLevelCumulativeXp - remainingXp;
  const xpPercentage = remainingXp > 0 ? ((currentXp - xpNeededForCurrentLevel) / remainingXp) * 100 : 0;
  const completedTasks = dailyTasks.filter(task => task.completed).length;

  // Show loading state if not connected or profile loading
  if (!isConnected || isProfileLoading || isNextLevelLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Loading Homepage...</p>
            <p className="text-gray-600 text-sm">Fetching your profile data...</p>
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
            <p className="text-gray-900 font-medium">Please Register First</p>
            <p className="text-gray-600 text-sm">You need to register to access the homepage.</p>
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

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto p-6">
        <div className="flex items-center justify-between mb-8 p-4 border border-gray-100 rounded-xl bg-gray-200/30">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p>{profile?.name || "Anonymous User"}!</p>
            <p className="text-gray-500 text-sm mt-1">Level {profile?.level || 1} • {currentXp} XP</p>
          </div>
          <div className="w-16 h-16">
            <Lottie 
              animationData={selectedCharacter === "degen" ? degenCharacter : runnerCharacter} 
              loop={true} 
            />
          </div>
        </div>

        <div className="mb-8 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{currentXp} XP</span>
            <span className="text-sm text-gray-400">{nextLevelCumulativeXp} XP</span>
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

        <div className="mb-8 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Tasks</h2>
            <span className="text-sm text-gray-500">{completedTasks}/{dailyTasks.length}</span>
          </div>
          
          <div className="space-y-4">
            {dailyTasks.map((task, index) => {
              const progressPercentage = (task.progress / task.target) * 100;
              const isCompleted = task.progress >= task.target;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-300" />
                      )}
                      <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
                        {task.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {task.progress}/{task.target} {task.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Community Feed</h2>
          </div>
          <div className="space-y-3">
            {friendsActivities.map((friend, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8">
                  <Lottie 
                    animationData={friend.character === "degen" ? degenCharacter : runnerCharacter} 
                    loop={true} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 text-sm">{friend.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Lvl.{friend.level}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{friend.activity}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-green-600">+{friend.xp} XP</div>
                  <div className="text-xs text-gray-400">{friend.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-3 py-1">
              <p className="text-sm font-medium text-gray-900">Walked 5km</p>
              <p className="text-xs text-gray-500">Today • +100 XP</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="text-sm font-medium text-gray-900">Completed 0.8km run</p>
              <p className="text-xs text-gray-500">Today • +40 XP</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-3 py-1">
              <p className="text-sm font-medium text-gray-900">7 sit-ups completed</p>
              <p className="text-xs text-gray-500">Today • +21 XP</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}