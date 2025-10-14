"use client";

import { useState } from "react";
import { Sparkles, Send, Activity, Target, TrendingUp, Heart } from "lucide-react";
import BottomNavbar from "../../components/BottomNavbar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface HealthInsight {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function AIAnalyzer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Health Assistant. I can help you analyze your onchain leveling progress, provide health insights, and suggest improvements to reach your fitness goals. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const healthInsights: HealthInsight[] = [
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Activity Analysis",
      description: "Track your daily movement patterns and optimize your workout routine",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Goal Setting",
      description: "Set realistic fitness goals based on your current progress",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Progress Tracking",
      description: "Monitor your onchain leveling and XP growth over time",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Health Tips",
      description: "Personalized recommendations for your wellness journey",
      color: "bg-red-50 text-red-600"
    }
  ];

  const suggestedQuestions = [
    "How can I improve my daily activity?",
    "What's my progress this week?",
    "Tips for weight loss?",
    "Analyze my onchain level"
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputText("");
  };

  const getAIResponse = (question: string): string => {
    const responses = {
      "activity": "Based on your current progress, I recommend increasing your daily walking target by 0.5km and adding 2 more sit-ups to your routine. This will help you earn more XP while building sustainable habits.",
      "progress": "Great progress this week! You've completed 4/7 daily tasks and earned 280 XP. You're 220 XP away from Level 6. Keep up the consistency!",
      "weight": "For healthy weight loss, focus on consistent daily activities. Your current walking routine is excellent - try to maintain it and gradually increase intensity. Remember, sustainable progress is key!",
      "level": "Your onchain level reflects consistent engagement! At Level 5 with 1250 XP, you're showing great dedication. Focus on completing daily tasks to reach Level 6 faster."
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes("activity") || lowerQuestion.includes("improve")) return responses.activity;
    if (lowerQuestion.includes("progress") || lowerQuestion.includes("week")) return responses.progress;
    if (lowerQuestion.includes("weight") || lowerQuestion.includes("loss") || lowerQuestion.includes("tips")) return responses.weight;
    if (lowerQuestion.includes("level") || lowerQuestion.includes("analyze") || lowerQuestion.includes("onchain")) return responses.level;
    
    return "I'm here to help with your health and fitness journey! Ask me about your activity progress, goal setting, or health tips.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-white border-b border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Health Analyzer</h1>
              <p className="text-sm text-gray-600">Your personal fitness assistant</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {healthInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${insight.color} mb-3`}>
                  {insight.icon}
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">{insight.title}</h3>
                <p className="text-xs text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">Chat with AI Assistant</h2>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2 mb-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(question)}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your health and progress..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}