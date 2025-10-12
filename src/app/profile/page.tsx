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
  
  // Mock user data - in real app this would come from user session/API
  const mockUserData = {
    username: character === "degen" ? "CryptoDegen123" : "FitnessRunner",
    name: character === "degen" ? "Alex Chen" : "Sarah Johnson",
    joinDate: "Oct 2024"
  };
  
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
    { id: 2, title: "Task Master", description: "Complete all Daily Onchain Tasks", unlocked: xp >= 300 },
    { id: 3, title: "Dedicated", description: "Reach level 5", unlocked: level >= 5 },
    { id: 4, title: "Champion", description: "Reach level 10", unlocked: level >= 10 },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="min-h-screen bg-white p-6 pb-20">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 mx-auto">
            <Lottie animationData={currentCharacter.animation} loop={true} />
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {mockUserData.name}
            </h1>
            <p className="text-sm text-gray-600">@{mockUserData.username}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {currentCharacter.name} {currentCharacter.name === "Degen" ? "🦍" : "🏃‍♂️"}
              </span>
              <span className="text-xs text-gray-500">• {mockUserData.joinDate}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-semibold text-gray-900">Level {level}</h2>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{xp} XP</span>
            </div>
            
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600">
              {xpForNextLevel} XP to level {level + 1}
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center space-x-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-semibold text-gray-900">Achievements</h2>
            </div>
            
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-2 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? "border-amber-200 bg-amber-50"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-medium ${
                        achievement.unlocked ? "text-amber-800" : "text-gray-500"
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-xs ${
                        achievement.unlocked ? "text-amber-600" : "text-gray-400"
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <Trophy className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 p-2 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-medium text-gray-900">
                  {unlockedAchievements.length}/{achievements.length} Unlocked
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Today's Stats</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-lg font-bold text-slate-700">0</div>
                <div className="text-xs text-gray-600">Activities</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-lg font-bold text-slate-700">{xp}</div>
                <div className="text-xs text-gray-600">XP Earned</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-lg font-bold text-slate-700">{level}</div>
                <div className="text-xs text-gray-600">Level</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={`/activity?character=${character}`}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold text-sm shadow-md"
          >
            Start New Activity
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/tasks?character=${character}`}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Daily Tasks
            </Link>
            
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium text-sm shadow-md"
            >
              🏆 Leaderboard
            </Link>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}