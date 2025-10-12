"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Circle } from "lucide-react";
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-gray-900">Daily Tasks</h1>
          {activity && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                Great! You just completed {distance}km of {activity}ing in {minutes} minutes!
              </p>
            </div>
          )}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              Progress: {completedTasks}/{tasks.length} tasks completed
            </p>
            <p className="text-blue-600 text-sm">XP Earned: {totalXP}</p>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 rounded-lg border-2 transition-all ${
                task.completed
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                </div>
                <span className={`text-sm font-medium ${
                  task.completed ? "text-green-600" : "text-gray-600"
                }`}>
                  {task.current}/{task.target} {task.unit}
                </span>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      task.completed ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min((task.current / task.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                {!task.completed && (
                  <button
                    onClick={() => updateTask(task.id, task.id === "situps" ? 1 : 0.5)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    +{task.id === "situps" ? "1" : "0.5"} {task.unit}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!task.completed) {
                      updateTask(task.id, task.target - task.current);
                    } else {
                      // TODO: Implement onchain transaction
                      console.log("Claim EXP:", task.title);
                    }
                  }}
                  className={`${!task.completed ? "flex-1" : "w-full"} px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    task.completed
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
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