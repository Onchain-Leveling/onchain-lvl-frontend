"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import hamsterRun from "../../../public/Assets/Animation/hamster-run.json";
import boxWalking from "../../../public/Assets/Animation/box-walking.json";
import BottomNavbar from "../../components/BottomNavbar";
import { Play, Pause, Square } from "lucide-react";

export default function QuestPage() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const character = searchParams.get("character") || "degen";
  const activity = searchParams.get("activity") || "run";
  const minutes = Number(searchParams.get("minutes")) || 30;
  const distance = Number(searchParams.get("distance")) || 5;

  useEffect(() => {
    setTimeLeft(minutes * 60); // Convert minutes to seconds
  }, [minutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsCompleted(true);
            setIsActive(false);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isActive || timeLeft === 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(minutes * 60);
  };

  const handleComplete = () => {
    router.push(`/tasks?character=${character}&activity=${activity}&minutes=${minutes}&distance=${distance}`);
  };

  const activityData = {
    run: {
      name: "Running",
      animation: hamsterRun,
      color: "green",
      icon: "🏃‍♂️"
    },
    walk: {
      name: "Walking", 
      animation: boxWalking,
      color: "blue",
      icon: "🚶‍♂️"
    }
  };

  const currentActivity = activityData[activity as keyof typeof activityData] || activityData.run;

  return (
    <div className="min-h-screen bg-white p-8 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            {currentActivity.name} Quest
          </h1>
          <p className="text-gray-600">
            Target: {distance}km in {minutes} minutes
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <div className="w-48 h-48">
            <Lottie 
              animationData={currentActivity.animation} 
              loop={isActive && !isPaused} 
              autoplay={isActive && !isPaused}
            />
          </div>

          <div className={`text-center p-8 rounded-full border-8 ${
            isCompleted 
              ? "border-green-500 bg-green-50" 
              : isActive 
                ? currentActivity.color === "blue" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50"
          }`}>
            <div className={`text-6xl font-mono font-bold ${
              isCompleted 
                ? "text-green-600" 
                : isActive 
                  ? currentActivity.color === "blue" 
                    ? "text-blue-600" 
                    : "text-green-600"
                  : "text-gray-600"
            }`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {isCompleted ? "Completed!" : isActive ? "In Progress" : "Ready to Start"}
            </p>
          </div>

          {isCompleted ? (
            <div className="space-y-4 w-full">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 Quest Completed!
                </h3>
                <p className="text-green-600">
                  Great job! You completed your {distance}km {activity}ing session.
                </p>
              </div>
              <button
                onClick={handleComplete}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
              >
                Complete Quest & Earn XP
              </button>
            </div>
          ) : (
            <div className="flex space-x-4 w-full">
              {!isActive ? (
                <button
                  onClick={handleStart}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-white rounded-lg transition-colors font-medium ${
                    currentActivity.color === "blue" 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <Play className="w-5 h-5" />
                  <span>Start Quest</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                  >
                    <Pause className="w-5 h-5" />
                    <span>{isPaused ? "Resume" : "Pause"}</span>
                  </button>
                  <button
                    onClick={handleStop}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Square className="w-5 h-5" />
                    <span>Stop</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{distance}</div>
            <div className="text-sm text-gray-600">Target Distance (km)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{minutes}</div>
            <div className="text-sm text-gray-600">Target Time (min)</div>
          </div>
        </div>
      </div>
      
      <BottomNavbar />
    </div>
  );
}