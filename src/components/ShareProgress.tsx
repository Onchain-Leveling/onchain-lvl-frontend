"use client";

import { useState } from "react";
import { Share2, Copy, X, Download, Image as ImageIcon } from "lucide-react";
import ShareImageTemplate from "./ShareImageTemplate";

interface ShareProgressProps {
  activity: string;
  distance: number;
  minutes: number;
  character: string;
  onClose: () => void;
}

export default function ShareProgress({ activity, distance, minutes, character, onClose }: ShareProgressProps) {
  const [copied, setCopied] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const activityEmoji = activity === "run" ? "🏃‍♂️" : "🚶‍♂️";
  const activityName = activity === "run" ? "Running" : "Walking";
  
  const shareText = `🎯 Just completed my ${activityName.toLowerCase()} quest! ${activityEmoji}

📊 Stats:
• Distance: ${distance}km
• Time: ${minutes} minutes
• Character: ${character === "degen" ? "Degen 🦍" : "Runner 🏃‍♂️"}

Building healthy habits onchain! 💪

#OnchainLeveling #Fitness #Crypto #Web3`;

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

  const handleImageReady = (url: string) => {
    setImageUrl(url);
  };

  const downloadImage = async () => {
    if (imageUrl) {
      try {
        // Fetch the blob from the URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Create download link
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `onchain-leveling-${activity}-quest-${Date.now()}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download image:", error);
        // Fallback to simple download
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `onchain-leveling-${activity}-quest.png`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                  copied 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>

              <button
                onClick={() => setShowImage(!showImage)}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors font-medium text-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{showImage ? "Hide Image" : "Show Image"}</span>
              </button>
            </div>

            {showImage && imageUrl && (
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Progress Share Image" 
                    className="w-full h-auto"
                  />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            )}

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
        
        <ShareImageTemplate
          activity={activity}
          distance={distance}
          minutes={minutes}
          character={character}
          onImageReady={handleImageReady}
        />
      </div>
    </div>
  );
}