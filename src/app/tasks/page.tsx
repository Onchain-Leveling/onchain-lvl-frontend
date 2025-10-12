"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Lottie from "lottie-react";
import { CheckCircle, Circle } from "lucide-react";
import dailyTaskAnimation from "../../../public/Assets/Animation/daily-task.json";
import BottomNavbar from "../../components/BottomNavbar";

interface Task {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  completed: boolean;
}

export default function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "running", title: "Running", current: 0, target: 1, unit: "km", completed: false },
    { id: "walking", title: "Walking", current: 0, target: 5, unit: "km", completed: false },
    { id: "situps", title: "Sit-ups", current: 0, target: 10, unit: "reps", completed: false },
  ]);

  const searchParams = useSearchParams();
  const character = searchParams.get("character");
  const activity = searchParams.get("activity");
  const minutes = searchParams.get("minutes");
  const distance = searchParams.get("distance");

  useEffect(() => {
    if (activity && distance) {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          const taskActivityMap = {
            "run": "running",
            "walk": "walking"
          };
          
          if (task.id === taskActivityMap[activity as keyof typeof taskActivityMap]) {
            const newCurrent = Math.min(task.current + Number(distance), task.target);
            return {
              ...task,
              current: newCurrent,
              completed: newCurrent >= task.target
            };
          }
          return task;
        })
      );
    }
  }, [activity, distance]);

  const updateTask = (taskId: string, increment: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCurrent = Math.min(task.current + increment, task.target);
          return {
            ...task,
            current: newCurrent,
            completed: newCurrent >= task.target
          };
        }
        return task;
      })
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalXP = completedTasks * 100;

  return (
    <div className="min-h-screen bg-white p-8 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-30 h-20">
              <Lottie animationData={dailyTaskAnimation} loop={true} />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">Daily Onchain Tasks</h1>
            {activity && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-emerald-700 text-sm font-medium">
                  ✨ Completed {distance}km {activity}ing in {minutes} minutes!
                </p>
              </div>
            )}
            <div className="inline-flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                {completedTasks}/{tasks.length} completed
              </span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                {totalXP} XP
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                task.completed
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  task.completed 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {task.current}/{task.target} {task.unit}
                </span>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      task.completed ? "bg-emerald-400" : "bg-gradient-to-r from-blue-400 to-purple-500"
                    }`}
                    style={{ width: `${Math.min((task.current / task.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                {!task.completed && (
                  <button
                    onClick={() => updateTask(task.id, task.id === "situps" ? 1 : 0.5)}
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
                  >
                    +{task.id === "situps" ? "1" : "0.5"} {task.unit}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!task.completed) {
                      updateTask(task.id, task.target - task.current);
                    } else {
                      console.log("Claim EXP:", task.title);
                    }
                  }}
                  className={`${!task.completed ? "flex-1" : "w-full"} px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
                    task.completed
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
                  }`}
                >
                  {task.completed ? "Claim EXP" : "Complete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Link
            href={`/profile?character=${character}&xp=${totalXP}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            View Profile & Progress
          </Link>
          
          <Link
            href={`/activity?character=${character}`}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Add Another Activity
          </Link>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}