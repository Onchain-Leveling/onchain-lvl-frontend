"use client";

import { useState } from "react";
import { Share2, Copy, X } from "lucide-react";

interface ShareProgressProps {
  activity: string;
  distance: number;
  minutes: number;
  character: string;
  onClose: () => void;
}

export default function ShareProgress({ activity, distance, minutes, character, onClose }: ShareProgressProps) {
  const [copied, setCopied] = useState(false);

  const activityEmoji = activity === "run" ? "🏃‍♂️" : "🚶‍♂️";
  const activityName = activity === "run" ? "Running" : "Walking";
  
  const shareText = `🎯 Just completed my ${activityName.toLowerCase()} quest! ${activityEmoji}

📊 Stats:
• Distance: ${distance}km
• Time: ${minutes} minutes
• Character: ${character === "degen" ? "Degen 🦍" : "Runner 🏃‍♂️"}

Building healthy habits onchain! 💪

#FitnessFi #OnchainFitness #HealthyHabits`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      farcaster: `https://warpcast.com/~/compose?text=${encodedText}`,
      telegram: `https://t.me/share/url?text=${encodedText}`
    };
    
    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Share Your Progress</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="text-center space-y-2">
              <div className="text-3xl">{activityEmoji}</div>
              <h3 className="font-semibold text-gray-900">{activityName} Quest Completed!</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold text-lg text-blue-600">{distance}km</div>
                  <div className="text-gray-600">Distance</div>
                </div>
                <div>
                  <div className="font-bold text-lg text-green-600">{minutes}min</div>
                  <div className="text-gray-600">Duration</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {shareText}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={copyToClipboard}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                copied 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => shareToSocial("twitter")}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <span>𝕏</span>
                <span>Twitter</span>
              </button>
              
              <button
                onClick={() => shareToSocial("farcaster")}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                <span>🟣</span>
                <span>Farcaster</span>
              </button>
              
              <button
                onClick={() => shareToSocial("telegram")}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium"
              >
                <span>✈️</span>
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}