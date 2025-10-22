"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import hamsterRun from "../../../public/Assets/Animation/hamster-run.json";
import boxWalking from "../../../public/Assets/Animation/box-walking.json";
import BottomNavbar from "../../components/BottomNavbar";
import ShareProgress from "../../components/ShareProgress";
import { Play, Pause, Square, Share2 } from "lucide-react";

function QuestContent() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const character = searchParams.get("character") || "degen";
  const activity = searchParams.get("activity") || "run";
  const minutes = Number(searchParams.get("minutes")) || 30;
  const distance = Number(searchParams.get("distance")) || 5;
  // const weight = Number(searchParams.get("weight")) || 70;
  const calories = Number(searchParams.get("calories")) || 0;
  const steps = Number(searchParams.get("steps")) || 0;

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 pb-20">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentActivity.name} Quest
          </h1>
          <p className="text-sm text-gray-600">
            Target: {distance}km in {minutes} minutes
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32">
            <Lottie 
              animationData={currentActivity.animation} 
              loop={isActive && !isPaused} 
              autoplay={isActive && !isPaused}
            />
          </div>

          <div className={`text-center p-6 rounded-2xl border-4 ${
            isCompleted 
              ? "border-black bg-gray-50" 
              : isActive 
                ? "border-black bg-gray-50"
                : "border-gray-300 bg-gray-50"
          }`}>
            <div className={`text-4xl font-mono font-bold ${
              isCompleted 
                ? "text-black" 
                : isActive 
                  ? "text-black"
                  : "text-gray-600"
            }`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {isCompleted ? "Completed!" : isActive ? "In Progress" : "Ready to Start"}
            </p>
          </div>

          {isCompleted ? (
            <div className="space-y-3 w-full">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-300 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  🎉 Quest Completed!
                </h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{distance}km</div>
                    <div className="text-xs text-gray-500">Target Distance</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{minutes}min</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{calories}</div>
                    <div className="text-xs text-gray-500">Calories</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{steps.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Steps</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors font-medium text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleComplete}
                  className="flex items-center justify-center px-3 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Earn XP
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {!isActive ? (
                <button
                  onClick={handleStart}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-xl transition-colors font-semibold bg-black hover:bg-gray-800 shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Quest</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePause}
                    className="flex items-center justify-center space-x-1 px-3 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold text-sm"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{isPaused ? "Resume" : "Pause"}</span>
                  </button>
                  <button
                    onClick={handleStop}
                    className="flex items-center justify-center space-x-1 px-3 py-3 bg-gray-800 text-white rounded-xl hover:bg-black transition-colors font-semibold text-sm"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{distance}</div>
              <div className="text-xs text-gray-600">km target</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{minutes}</div>
              <div className="text-xs text-gray-600">min target</div>
            </div>
          </div>
        </div>
      </div>
      
      {showShareModal && (
        <ShareProgress
          activity={activity}
          distance={distance}
          minutes={minutes}
          character={character}
          calories={calories}
          steps={steps}
          onClose={() => setShowShareModal(false)}
        />
      )}
      
      <BottomNavbar />
    </div>
  );
}

export default function QuestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600">Loading quest...</p>
        </div>
      </div>
    }>
      <QuestContent />
    </Suspense>
  );
}