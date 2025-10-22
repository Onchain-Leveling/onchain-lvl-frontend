"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface ShareImageTemplateProps {
  activity: string;
  distance: number;
  minutes: number;
  character: string;
  calories?: number;
  steps?: number;
  onImageReady: (imageUrl: string) => void;
}

export default function ShareImageTemplate({ 
  activity, 
  distance, 
  minutes, 
  character,
  calories,
  steps,
  onImageReady 
}: ShareImageTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const activityEmoji = activity === "run" ? "🏃‍♂️" : "🚶‍♂️";
  const activityName = activity === "run" ? "Running" : "Walking";
  const characterEmoji = character === "degen" ? "🦍" : "🏃‍♂️";
  const characterName = character === "degen" ? "Degen" : "Runner";

  const generateImage = useCallback(async () => {
    if (hasGenerated) return; // Prevent regeneration
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 500;

    // Create simple white background with black border for black/white theme
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add black border for black/white theme
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${activityName} Quest Completed!`, canvas.width / 2, 80);

    // Activity emoji
    ctx.font = "48px system-ui";
    ctx.fillText(activityEmoji, canvas.width / 2, 140);

    // Stats section - 2x2 grid layout
    const firstRowY = 200;
    const secondRowY = 280;
    const leftX = canvas.width / 2 - 100;
    const rightX = canvas.width / 2 + 100;
    
    // First Row: Distance and Duration
    // Distance
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${distance}km`, leftX, firstRowY);
    
    ctx.fillStyle = "#6B7280";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText("Target Distance", leftX, firstRowY + 22);

    // Duration
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${minutes}min`, rightX, firstRowY);
    
    ctx.fillStyle = "#6B7280";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText("Duration", rightX, firstRowY + 22);

    // Second Row: Calories and Steps
    if (calories !== undefined) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
      ctx.fillText(`${calories}`, leftX, secondRowY);
      
      ctx.fillStyle = "#6B7280";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText("Calories", leftX, secondRowY + 20);
    }
    
    if (steps !== undefined) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
      ctx.fillText(steps.toLocaleString(), rightX, secondRowY);
      
      ctx.fillStyle = "#6B7280";
      ctx.font = "14px system-ui, -apple-system, sans-serif";
      ctx.fillText("Steps", rightX, secondRowY + 20);
    }

    // Character info
    ctx.fillStyle = "#374151";
    ctx.font = "18px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    const characterY = calories || steps ? 360 : 320;
    ctx.fillText(`Playing as ${characterName} ${characterEmoji}`, canvas.width / 2, characterY);

    // Motivation text
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    const motivationY = calories || steps ? 390 : 350;
    ctx.fillText("Building healthy habits onchain! 💪", canvas.width / 2, motivationY);

    // Branding
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "16px system-ui, -apple-system, sans-serif";
    const brandingY = calories || steps ? 430 : 390;
    ctx.fillText("Onchain Leveling", canvas.width / 2, brandingY);

    // Convert canvas to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        onImageReady(imageUrl);
        setHasGenerated(true); // Mark as generated
      }
    }, "image/png");
  }, [hasGenerated, distance, minutes, calories, steps, onImageReady, activityEmoji, activityName, characterEmoji, characterName]);

  useEffect(() => {
    // Reset generation state when props change
    setHasGenerated(false);
  }, [activity, distance, minutes, calories, steps, character]);

  useEffect(() => {
    generateImage();
  }, [generateImage]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: "none" }}
      width={600}
      height={500}
    />
  );
}