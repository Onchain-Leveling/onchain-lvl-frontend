"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import { Trophy, Target, Zap } from "lucide-react";
import BottomNavbar from "../../components/BottomNavbar";

export default function Profile() {
  const searchParams = useSearchParams();
  const character = searchParams.get("character") || "degen";
  const xp = Number(searchParams.get("xp")) || 0;
  
  const level = Math.floor(xp / 300) + 1;
  const xpForNextLevel = (level * 300) - xp;
  const xpProgress = ((xp % 300) / 300) * 100;

  const characterData = {
    degen: {
      name: "Degen",
      description: "The crypto enthusiast",
      animation: degenCharacter,
      color: "blue"
    },
    runner: {
      name: "Runner", 
      description: "The fitness lover",
      animation: runnerCharacter,
      color: "green"
    }
  };

  const currentCharacter = characterData[character as keyof typeof characterData] || characterData.degen;

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first activity", unlocked: xp > 0 },
    { id: 2, title: "Task Master", description: "Complete all daily tasks", unlocked: xp >= 300 },
    { id: 3, title: "Dedicated", description: "Reach level 5", unlocked: level >= 5 },
    { id: 4, title: "Champion", description: "Reach level 10", unlocked: level >= 10 },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="min-h-screen bg-white p-8 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto">
            <Lottie animationData={currentCharacter.animation} loop={true} />
          </div>
          
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {currentCharacter.name}
            </h1>
            <p className="text-gray-600">{currentCharacter.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Level {level}</h2>
              </div>
              <span className="text-sm text-gray-600">{xp} XP</span>
            </div>
            
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              {xpForNextLevel} XP to level {level + 1}
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
            </div>
            
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-100 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        achievement.unlocked ? "text-yellow-800" : "text-gray-500"
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? "text-yellow-600" : "text-gray-400"
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  {unlockedAchievements.length}/{achievements.length} Unlocked
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Activities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{xp}</div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href={`/activity?character=${character}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Start New Activity
          </Link>
          
          <Link
            href={`/tasks?character=${character}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            View Daily Tasks
          </Link>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}