"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import BottomNavbar from "../../components/BottomNavbar";

interface LeaderboardUser {
  id: string;
  username: string;
  character: string;
  xp: number;
  level: number;
  activitiesCompleted: number;
}

export default function Leaderboard() {
  // Mock data - in real app this would come from API/database
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
      username: "BlockchainRunner",
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
    {
      id: "9",
      username: "NFTAthlete",
      character: "runner",
      xp: 1050,
      level: 3,
      activitiesCompleted: 10,
    },
    {
      id: "10",
      username: "TokenRunner",
      character: "degen",
      xp: 900,
      level: 3,
      activitiesCompleted: 9,
    },
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-100 border-amber-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getCharacterEmoji = (character: string) => {
    return character === "degen" ? "🦍" : "🏃‍♂️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-8 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-600 text-sm">
              Top fitness champions ranked by XP
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {users.map((user, index) => {
            const rank = index + 1;
            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border-2 transition-all ${getRankStyle(
                  rank
                )} ${rank <= 3 ? "shadow-md" : "shadow-sm"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(rank)}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {user.username}
                        </h3>
                        <span className="text-lg">
                          {getCharacterEmoji(user.character)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span>{user.activitiesCompleted} activities</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        rank === 1
                          ? "text-yellow-600"
                          : rank === 2
                          ? "text-gray-600"
                          : rank === 3
                          ? "text-amber-600"
                          : "text-gray-700"
                      }`}
                    >
                      {user.xp.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                </div>

                {rank <= 3 && (
                  <div className="mt-3 pt-3 border-t border-opacity-30">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rank === 1
                            ? "bg-yellow-200 text-yellow-800"
                            : rank === 2
                            ? "bg-gray-200 text-gray-700"
                            : "bg-amber-200 text-amber-800"
                        }`}
                      >
                        {rank === 1
                          ? "🥇 Champion"
                          : rank === 2
                          ? "🥈 Runner-up"
                          : "🥉 Third Place"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-blue-900">Climb the Ranks!</h3>
            <p className="text-blue-700 text-sm">
              Complete more activities and earn XP to rise up the leaderboard
            </p>
            <Link
              href="/activity"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm mt-2"
            >
              Start Activity
            </Link>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}
