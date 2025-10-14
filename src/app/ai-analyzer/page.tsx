"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import aiAnalyzerAnimation from "../../../public/Assets/Animation/ai-analyzer.json";
import BottomNavbar from "../../components/BottomNavbar";

interface TaskProgress {
  name: string;
  completed: number;
  target: number;
  unit: string;
  xpEarned: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface AIAnalysis {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

export default function AIAnalyzer() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("degen");
  
  const [levelData] = useState({
    level: 5,
    xp: 1250,
    nextLevelXp: 1500,
    completionRate: 78
  });

  const [todayTasks] = useState<TaskProgress[]>([
    { name: "Running", completed: 0.8, target: 1, unit: "km", xpEarned: 40, status: 'in-progress' as const },
    { name: "Walking", completed: 5, target: 5, unit: "km", xpEarned: 100, status: 'completed' as const },
    { name: "Sit-ups", completed: 7, target: 10, unit: "reps", xpEarned: 21, status: 'in-progress' as const }
  ]);

  const [aiAnalyses] = useState<AIAnalysis[]>([
    {
      type: 'success',
      title: 'Great Progress Today!',
      message: 'You\'re on track to reach Level 6. Complete your running goal to earn bonus XP.'
    },
    {
      type: 'info',
      title: 'Consistency Streak',
      message: 'You\'ve maintained an 78% completion rate. Keep this momentum for optimal results.'
    },
    {
      type: 'warning',
      title: 'Quick Win Available',
      message: 'Only 0.2km left to complete your running goal. A 2-minute effort will earn +10 XP.'
    }
  ]);

  useEffect(() => {
    const character = localStorage.getItem('selectedCharacter') || 'degen';
    setSelectedCharacter(character);
  }, []);

  const xpPercentage = (levelData.xp / levelData.nextLevelXp) * 100;
  const completedTasks = todayTasks.filter(task => task.status === 'completed').length;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Analyzer</h1>
              <p className="text-gray-500 text-sm mt-1">Level {levelData.level} • {levelData.completionRate}% complete</p>
            </div>
            <div className="w-16 h-16">
              <Lottie animationData={aiAnalyzerAnimation} loop={true} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{levelData.xp} XP</span>
              <span className="text-sm text-gray-400">{levelData.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              {levelData.nextLevelXp - levelData.xp} XP to Level {levelData.level + 1}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
              <span className="text-sm text-gray-500">{completedTasks}/{todayTasks.length}</span>
            </div>
            
            <div className="space-y-4">
              {todayTasks.map((task, index) => {
                const progressPercentage = (task.completed / task.target) * 100;
                const isCompleted = task.status === 'completed';
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-300" />
                        )}
                        <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
                          {task.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          {task.completed}/{task.target} {task.unit}
                        </span>
                      </div>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h2>
            <div className="space-y-3">
              {aiAnalyses.map((analysis, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{analysis.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{analysis.message}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10">
                <Lottie 
                  animationData={selectedCharacter === "degen" ? degenCharacter : runnerCharacter} 
                  loop={true} 
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">AI Recommendation:</span> Focus on completing your running goal for maximum XP efficiency.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-1">{levelData.level}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-1">{completedTasks}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900 mb-1">{levelData.completionRate}%</div>
              <div className="text-xs text-gray-500">Success</div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}