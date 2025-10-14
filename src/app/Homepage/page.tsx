"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import BottomNavbar from "../../components/BottomNavbar";

interface ActivityData {
  type: string;
  progress: number;
  target: number;
  unit: string;
  completed: boolean;
}

interface LevelData {
  level: number;
  xp: number;
  nextLevelXp: number;
  character: string;
}

export default function Homepage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("degen");
  const [levelData] = useState<LevelData>({
    level: 5,
    xp: 1250,
    nextLevelXp: 1500,
    character: "degen"
  });

  const [dailyTasks] = useState<ActivityData[]>([
    { type: "Running", progress: 0.3, target: 1, unit: "km", completed: false },
    { type: "Walking", progress: 2.5, target: 5, unit: "km", completed: false },
    { type: "Sit-ups", progress: 7, target: 10, unit: "reps", completed: false }
  ]);

  const [recentActivities] = useState([
    { date: "Today", activity: "Completed 0.8km run", xp: "+50 XP" },
    { date: "Yesterday", activity: "Walked 5km", xp: "+100 XP" },
    { date: "2 days ago", activity: "10 sit-ups completed", xp: "+30 XP" }
  ]);

  useEffect(() => {
    const character = localStorage.getItem('selectedCharacter') || 'degen';
    setSelectedCharacter(character);
  }, []);

  const xpPercentage = (levelData.xp / levelData.nextLevelXp) * 100;
  const completedTasks = dailyTasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/Assets/Logo/logo-onchain-leveling.png"
              alt="Onchain Leveling"
              width={40}
              height={32}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome back!</h1>
              <p className="text-sm text-gray-600">Level {levelData.level} " {levelData.xp} XP</p>
            </div>
          </div>
          <div className="w-12 h-12">
            <Lottie 
              animationData={selectedCharacter === "degen" ? degenCharacter : runnerCharacter} 
              loop={true} 
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-900">Onchain Level Progress</h2>
            <span className="text-sm font-medium text-blue-600">Level {levelData.level}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{levelData.xp} XP</span>
              <span>{levelData.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {levelData.nextLevelXp - levelData.xp} XP to next level
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Daily Tasks</h2>
            <span className="text-sm font-medium text-green-600">
              {completedTasks}/{dailyTasks.length} completed
            </span>
          </div>
          <div className="space-y-3">
            {dailyTasks.map((task, index) => {
              const progressPercentage = (task.progress / task.target) * 100;
              const isCompleted = task.progress >= task.target;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                      {task.type}
                    </span>
                    <span className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {task.progress}/{task.target} {task.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-orange-400 to-orange-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {activity.xp}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{levelData.level}</div>
            <div className="text-sm opacity-90">Current Level</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-sm opacity-90">Tasks Done Today</div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}