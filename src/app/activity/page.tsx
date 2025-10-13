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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 pb-20">
      <div className="max-w-sm w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Choose Activity
          </h1>
          <p className="text-sm text-gray-600">
            What would you like to do?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedActivity === "run"
                ? "border-emerald-300 bg-emerald-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedActivity("run")}
          >
            <div className="w-16 h-16 mx-auto mb-2">
              <Lottie animationData={hamsterRun} loop={true} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Run</h3>
            <p className="text-xs text-gray-500">High intensity</p>
          </div>

          <div
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedActivity === "walk"
                ? "border-blue-300 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedActivity("walk")}
          >
            <div className="w-16 h-16 mx-auto mb-2">
              <Lottie animationData={boxWalking} loop={true} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Walk</h3>
            <p className="text-xs text-gray-500">Low intensity</p>
          </div>
        </div>

        {selectedActivity && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Minutes
                </label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setMinutes(0);
                    } else {
                      const num = Number(value);
                      if (num >= 0 && num <= 120) {
                        setMinutes(num);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  min="0"
                  max="120"
                  step="0.1"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance === 0 ? '' : distance}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setDistance(0);
                    } else {
                      const num = Number(value);
                      if (num >= 0 && num <= 50) {
                        setDistance(num);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || Number(e.target.value) < 0.1) {
                      setDistance(0.1);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  min="0.1"
                  max="50"
                  step="0.1"
                  placeholder="5"
                />
              </div>
            </div>

            <Link
              href={`/quest?character=${character}&activity=${selectedActivity}&minutes=${minutes}&distance=${distance}`}
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-900 hover:to-black transition-all font-semibold text-sm shadow-lg"
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