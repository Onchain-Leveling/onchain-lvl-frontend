"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import Lottie from "lottie-react";
import degenCharacter from "../../../public/Assets/Animation/degen-character.json";
import runnerCharacter from "../../../public/Assets/Animation/runner-character.json";
import BottomNavbar from "../../components/BottomNavbar";

interface LeaderboardUser {
  id: string;
  username: string;
  character: "degen" | "runner";
  xp: number;
  level: number;
  activitiesCompleted: number;
}

export default function Leaderboard() {
  const [users] = useState<LeaderboardUser[]>([
    {
      id: "1",
      username: "CryptoRunner",
      character: "runner",
      xp: 2400,
      level: 8,
      activitiesCompleted: 24,
    },
    {
      id: "2",
      username: "DegenFitness",
      character: "degen",
      xp: 2100,
      level: 7,
      activitiesCompleted: 21,
    },
    {
      id: "3",
      username: "OnchainAthlete",
      character: "runner",
      xp: 1950,
      level: 6,
      activitiesCompleted: 19,
    },
    {
      id: "4",
      username: "FitnessDegen",
      character: "degen",
      xp: 1800,
      level: 6,
      activitiesCompleted: 18,
    },
    {
      id: "5",
      username: "Runner",
      character: "runner",
      xp: 1650,
      level: 5,
      activitiesCompleted: 16,
    },
    {
      id: "6",
      username: "Web3Walker",
      character: "degen",
      xp: 1500,
      level: 5,
      activitiesCompleted: 15,
    },
    {
      id: "7",
      username: "MetaFitness",
      character: "runner",
      xp: 1350,
      level: 4,
      activitiesCompleted: 13,
    },
    {
      id: "8",
      username: "DeFiRunner",
      character: "degen",
      xp: 1200,
      level: 4,
      activitiesCompleted: 12,
    },
  ]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-500 text-sm mt-1">Top fitness champions ranked by XP</p>
        </div>

        <div className="space-y-3">
          {users.map((user, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;
            
            return (
              <div
                key={user.id}
                className={`flex items-center space-x-4 p-4 ${
                  isTopThree ? 'bg-gray-50' : 'bg-white'
                } border border-gray-100 rounded-xl transition-all hover:border-gray-200`}
              >
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-gray-600">
                  {rank}
                </div>

                <div className="w-10 h-10">
                  <Lottie 
                    animationData={user.character === "degen" ? degenCharacter : runnerCharacter} 
                    loop={true} 
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {user.username}
                    </h3>
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                      Lv.{user.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {user.activitiesCompleted} activities completed
                  </p>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    rank === 1 ? 'text-black' : 'text-gray-700'
                  }`}>
                    {user.xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Join the Competition</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete activities and earn XP to climb the leaderboard
          </p>
          <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Start Training
          </button>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}