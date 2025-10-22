"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Trophy, Calendar, Activity } from "lucide-react";
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import BottomNavbar from "../../components/BottomNavbar";

function ProfileContent() {
  const searchParams = useSearchParams();
  const character = searchParams.get("character") || "degen";
  const [selectedCharacter, setSelectedCharacter] = useState<string>("degen");
  
  const [userData] = useState({
    name: "Bima Jadiva",
    username: "bimajdv7",
    level: 5,
    xp: 1250,
    nextLevelXp: 1500,
    joinDate: "October 2024",
    totalActivities: 28,
    streak: 7
  });

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
    if (typeof window !== 'undefined') {
      const savedCharacter = localStorage.getItem('selectedCharacter') || character || 'degen';
      setSelectedCharacter(savedCharacter);
    }
  }, [character]);

  const xpPercentage = (userData.xp / userData.nextLevelXp) * 100;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

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
          <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
          <p className="text-gray-500 text-sm">@{userData.username}</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
              {selectedCharacter === "degen" ? "Degen" : "Runner"}
            </span>
            <span className="text-xs text-gray-400">• {userData.joinDate}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Level {userData.level}</span>
            <span className="text-sm text-gray-400">{userData.xp}/{userData.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {userData.nextLevelXp - userData.xp} XP to Level {userData.level + 1}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">{userData.level}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">{userData.totalActivities}</div>
            <div className="text-xs text-gray-500">Activities</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900 mb-1">{userData.streak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
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