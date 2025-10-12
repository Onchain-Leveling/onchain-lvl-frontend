"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";
import hamsterRun from "../../../public/Assets/Animation/hamster-run.json";
import boxWalking from "../../../public/Assets/Animation/box-walking.json";
import BottomNavbar from "../../components/BottomNavbar";

export default function ActivitySelection() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(30);
  const [distance, setDistance] = useState(5);
  const searchParams = useSearchParams();
  const character = searchParams.get("character");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 pb-20">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Choose Your Activity
          </h1>
          <p className="text-gray-600">
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedActivity === "run"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedActivity("run")}
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <Lottie animationData={hamsterRun} loop={true} />
            </div>
            <h3 className="font-medium text-gray-900">Run</h3>
            <p className="text-sm text-gray-600 mt-1">High intensity workout</p>
          </div>

          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedActivity === "walk"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedActivity("walk")}
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <Lottie animationData={boxWalking} loop={true} />
            </div>
            <h3 className="font-medium text-gray-900">Walk</h3>
            <p className="text-sm text-gray-600 mt-1">Low intensity exercise</p>
          </div>
        </div>

        {selectedActivity && (
          <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minutes
                </label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0.1"
                  max="50"
                  step="0.1"
                />
              </div>
            </div>

            <Link
              href={`/quest?character=${character}&activity=${selectedActivity}&minutes=${minutes}&distance=${distance}`}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Start Quest
            </Link>
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
}