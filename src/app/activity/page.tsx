"use client";

import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";
// import { Calculator, Clock, MapPin, Footprints, Flame } from "lucide-react";
import hamsterRun from "../../../public/Assets/Animation/hamster-run.json";
import boxWalking from "../../../public/Assets/Animation/box-walking.json";
import BottomNavbar from "../../components/BottomNavbar";

// Activity calculation utilities
const calculateMetrics = (activity: string, minutes: number, weight: number) => {
  // Speed estimates (km/h)
  const walkingSpeed = 5; // Average walking speed
  const runningSpeed = 10; // Average running speed
  
  // Distance calculation based on time and activity
  const speed = activity === "run" ? runningSpeed : walkingSpeed;
  const estimatedDistance = (speed * minutes) / 60; // Convert minutes to hours
  
  // Calorie calculation (MET values)
  const walkingMET = 3.8; // Moderate walking
  const runningMET = 8.0; // Moderate running
  const met = activity === "run" ? runningMET : walkingMET;
  const calories = Math.round((met * weight * minutes) / 60);
  
  // Step calculation
  const averageStepLength = 0.7; // Average step length in meters
  const steps = Math.round((estimatedDistance * 1000) / averageStepLength);
  
  return {
    estimatedDistance: Math.round(estimatedDistance * 10) / 10, // Round to 1 decimal
    calories,
    steps
  };
};

function ActivitySelectionContent() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>("run");
  const [minutes, setMinutes] = useState<number | string>(30);
  const [weight, setWeight] = useState(70); // Default weight in kg
  const [customDistance, setCustomDistance] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const character = searchParams.get("character");

  // Calculate metrics based on current inputs
  const metrics = useMemo(() => {
    if (!selectedActivity) return null;
    const minutesNum = typeof minutes === 'string' ? parseFloat(minutes) || 0 : minutes;
    return calculateMetrics(selectedActivity, minutesNum, weight);
  }, [selectedActivity, minutes, weight]);

  // Use custom distance if provided, otherwise use estimated
  const finalDistance = customDistance || metrics?.estimatedDistance || 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Activity</h1>
          <p className="text-gray-500 text-sm">Track your fitness journey</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedActivity === "run"
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedActivity("run")}
          >
            <div className="w-16 h-16 mx-auto mb-3">
              <Lottie animationData={hamsterRun} loop={true} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Running</h3>
            <p className="text-xs text-gray-500">High intensity</p>
          </div>

          <div
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedActivity === "walk"
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedActivity("walk")}
          >
            <div className="w-16 h-16 mx-auto mb-3">
              <Lottie animationData={boxWalking} loop={true} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Walking</h3>
            <p className="text-xs text-gray-500">Low intensity</p>
          </div>
        </div>

        {selectedActivity && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Activity Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target (minutes)
                  </label>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setMinutes('');
                      } else {
                        const num = parseFloat(value);
                        if (!isNaN(num) && num >= 0 && num <= 180) {
                          setMinutes(value);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === '' || parseFloat(value) < 0.1) {
                        setMinutes(0.1);
                      } else {
                        setMinutes(parseFloat(value));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    min="0"
                    max="180"
                    step="0.1"
                    placeholder="30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 30 && value <= 200) {
                        setWeight(value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                    min="30"
                    max="200"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Distance (km) - Optional
                </label>
                <input
                  type="number"
                  value={customDistance || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setCustomDistance(null);
                    } else {
                      const num = Number(value);
                      if (num >= 0.1 && num <= 50) {
                        setCustomDistance(num);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  placeholder={`Auto: ${metrics?.estimatedDistance || 0}km`}
                  min="0.1"
                  max="50"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use estimated distance based on time
                </p>
              </div>
            </div>

            {/* {metrics && (
              <div className="bg-white border border-gray-200 p-6 rounded-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Calculator className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Calculated Metrics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {finalDistance}km
                        </div>
                        <div className="text-xs text-gray-500">Target Distance</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {typeof minutes === 'string' ? parseFloat(minutes) || 0 : minutes}min
                        </div>
                        <div className="text-xs text-gray-500">Duration</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Flame className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.calories}
                        </div>
                        <div className="text-xs text-gray-500">Calories</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Footprints className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metrics.steps.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Steps</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            <Link
              href={`/quest?character=${character}&activity=${selectedActivity}&minutes=${typeof minutes === 'string' ? parseFloat(minutes) || 0.1 : minutes}&distance=${finalDistance}&weight=${weight}&calories=${metrics?.calories}&steps=${metrics?.steps}`}
              className="block w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-center"
            >
              Start {selectedActivity === "run" ? "Running" : "Walking"} Quest
            </Link>
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
}

export default function ActivitySelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    }>
      <ActivitySelectionContent />
    </Suspense>
  );
}