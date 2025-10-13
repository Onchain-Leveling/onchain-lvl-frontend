"use client";

import { useRef, useEffect } from "react";

interface ShareImageTemplateProps {
  activity: string;
  distance: number;
  minutes: number;
  character: string;
  onImageReady: (imageUrl: string) => void;
}

export default function ShareImageTemplate({ 
  activity, 
  distance, 
  minutes, 
  character, 
  onImageReady 
}: ShareImageTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activityEmoji = activity === "run" ? "🏃‍♂️" : "🚶‍♂️";
  const activityName = activity === "run" ? "Running" : "Walking";
  const characterEmoji = character === "degen" ? "🦍" : "🏃‍♂️";
  const characterName = character === "degen" ? "Degen" : "Runner";

  useEffect(() => {
    generateImage();
  }, [activity, distance, minutes, character]);

  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, activity === "run" ? "#10B981" : "#3B82F6");
    gradient.addColorStop(0.5, "#FFFFFF");
    gradient.addColorStop(1, activity === "run" ? "#059669" : "#1D4ED8");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${activityName} Quest Completed!`, canvas.width / 2, 80);

    // Activity emoji
    ctx.font = "48px system-ui";
    ctx.fillText(activityEmoji, canvas.width / 2, 140);

    // Stats section
    const statsY = 200;
    
    // Distance
    ctx.fillStyle = activity === "run" ? "#059669" : "#1D4ED8";
    ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${distance}km`, canvas.width / 2 - 100, statsY);
    
    ctx.fillStyle = "#6B7280";
    ctx.font = "16px system-ui, -apple-system, sans-serif";
    ctx.fillText("Distance", canvas.width / 2 - 100, statsY + 25);

    // Duration
    ctx.fillStyle = activity === "run" ? "#059669" : "#1D4ED8";
    ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${minutes}min`, canvas.width / 2 + 100, statsY);
    
    ctx.fillStyle = "#6B7280";
    ctx.font = "16px system-ui, -apple-system, sans-serif";
    ctx.fillText("Duration", canvas.width / 2 + 100, statsY + 25);

    // Character info
    ctx.fillStyle = "#374151";
    ctx.font = "18px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Playing as ${characterName} ${characterEmoji}`, canvas.width / 2, 280);

    // Motivation text
    ctx.fillStyle = "#059669";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.fillText("Building healthy habits onchain! 💪", canvas.width / 2, 320);

    // Branding
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "16px system-ui, -apple-system, sans-serif";
    ctx.fillText("Onchain Leveling", canvas.width / 2, 360);

    // Convert canvas to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        onImageReady(imageUrl);
      }
    }, "image/png");
  };

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: "none" }}
      width={600}
      height={400}
    />
  );
}