"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAccount } from 'wagmi';
import { useGetTaskList } from '../../hooks/useGetTaskList';
import { useCompleteTask } from '../../hooks/useCompleteTask';
import { useGetProfile } from '../../hooks/useGetProfile';
import { CHARACTER_TYPES } from '../../hooks/useRegister';
import Lottie from "lottie-react";
import { Circle } from "lucide-react";
import dailyTaskAnimation from "../../../public/Assets/Animation/daily-task.json";
import BottomNavbar from "../../components/BottomNavbar";
import SuccessModal from "../../components/SuccessModal";


function DailyTasksContent() {
  const { isConnected, address } = useAccount();
  const { tasks: contractTasks, isLoading: isTasksLoading, error: tasksError } = useGetTaskList();
  const { completeTask, isPending, isConfirming, isSuccess, error: completeError } = useCompleteTask();
  const { profile } = useGetProfile(address);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimedExp, setClaimedExp] = useState(0);
  const [completingTaskId, setCompletingTaskId] = useState<bigint | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("degen");

  const searchParams = useSearchParams();
  const character = searchParams.get("character");
  const activity = searchParams.get("activity");
  const minutes = searchParams.get("minutes");
  const distance = searchParams.get("distance");

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

  // Handle successful task completion
  useEffect(() => {
    if (isSuccess && completingTaskId) {
      const completedTask = contractTasks.find(task => task.id === completingTaskId);
      if (completedTask) {
        setClaimedExp(completedTask.xp);
        setShowSuccessModal(true);
        setCompletingTaskId(null);
      }
    }
  }, [isSuccess, completingTaskId, contractTasks]);

  // Set character based on profile data
  useEffect(() => {
    if (profile?.isRegistered && profile.characterType) {
      const characterFromProfile = profile.characterType === CHARACTER_TYPES.DEGEN ? 'degen' : 'runner';
      setSelectedCharacter(characterFromProfile);
    } else if (character) {
      setSelectedCharacter(character);
    }
  }, [profile?.characterType, profile?.isRegistered, character]);

  // Handle complete task
  const handleCompleteTask = (taskId: bigint) => {
    setCompletingTaskId(taskId);
    completeTask(taskId);
  };

  // Calculate stats from contract tasks
  const enabledTasks = contractTasks.filter(task => task.enabled);
  const totalXP = enabledTasks.reduce((sum, task) => sum + task.xp, 0);

  // Show loading state
  if (!isConnected || isTasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (tasksError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Failed to Load Tasks</p>
            <p className="text-gray-600 text-sm">Unable to fetch task data. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-8 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-30 h-20">
              <Lottie animationData={dailyTaskAnimation} loop={true} />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">Daily Onchain Tasks</h1>
            {activity && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-emerald-700 text-sm font-medium">
                  ✨ Completed {distance}km {activity}ing in {minutes} minutes!
                </p>
              </div>
            )}
            <div className="inline-flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                {enabledTasks.length} tasks available
              </span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Up to {totalXP} XP
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {enabledTasks.map((task) => {
            const isProcessing = isPending && completingTaskId === task.id;
            const isConfirmingTx = isConfirming && completingTaskId === task.id;
            
            return (
              <div
                key={task.id.toString()}
                className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Circle className="w-5 h-5 text-gray-300" />
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                    +{task.xp} XP
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Goal: {task.goal} {task.type === 1 ? 'steps' : task.type === 2 ? 'minutes' : 'units'}
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>

                {completeError && completingTaskId === task.id && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-xs">
                      {completeError.message || "Failed to complete task. Please try again."}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={isProcessing || isConfirmingTx}
                    className="w-full px-4 py-2 rounded-xl transition-all text-sm font-semibold bg-black text-white hover:bg-gray-800 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing && "Preparing transaction..."}
                    {isConfirmingTx && "Confirming completion..."}
                    {!isProcessing && !isConfirmingTx && "Complete Task"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <Link
            href={`/profile?character=${selectedCharacter}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View Profile & Progress
          </Link>
          
          <Link
            href={`/activity?character=${selectedCharacter}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Add Another Activity
          </Link>
        </div>
      </div>
      
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        exp={claimedExp}
      />
      
      <BottomNavbar />
    </div>
  );
}

export default function DailyTasks() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    }>
      <DailyTasksContent />
    </Suspense>
  );
}