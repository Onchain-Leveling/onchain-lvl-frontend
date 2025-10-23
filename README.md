# Onchain Leveling — Frontend Application

![Onchain Leveling](https://img.shields.io/badge/Onchain-Leveling-blue)
![Status](https://img.shields.io/badge/Status-Alpha-orange)
![Framework](https://img.shields.io/badge/Next.js-14-black)
![Blockchain](https://img.shields.io/badge/Base-On--Chain-green)

<div align="center">
  <img width="100" height="100" alt="logo-onchain-leveling" src="https://github.com/user-attachments/assets/72cc78aa-90bd-453d-a1f2-319dfb43146b" />
  
  **Level up in real life and on-chain.**
</div>

## 🚀 Overview

**Onchain Leveling** is a revolutionary Farcaster mini-app and web application that transforms your real-world activities and on-chain interactions into verifiable XP and achievement levels. Experience gamified personal growth with blockchain-powered progression tracking.

> **Current Status**: Alpha Release (Hackathon Demo)  
> **Note**: Platform focuses on achievement tracking only — no token rewards or financial incentives.

## ✨ Key Features

### 🏆 Achievement System
- **Real-World Quests**: Convert running, walking, and fitness activities into verifiable XP
- **On-Chain Actions**: Bridge your digital and physical accomplishments
- **Verifiable Progress**: Fully on-chain XP system with transparent tracking

### 🌐 Social Integration
- **Farcaster Frames**: One-tap achievement sharing to Warpcast
- **Multi-Platform Support**: Share progress to X (Twitter) and Telegram
- **Social Proof**: Verifiable on-chain accomplishments

### 📊 Progress Analytics
- **Level Progression**: Visual XP tracking and milestone achievements
- **Streak System**: Consistency tracking and motivation maintenance
- **Weekly Insights**: Comprehensive activity statistics and trends
- **AI-Powered Guidance**: Personalized recommendations for improvement

### 🏅 Competitive Elements
- **Global Leaderboard**: XP-based ranking system
- **Achievement Badges**: Unlockable rewards for milestones
- **Healthy Competition**: Community-driven motivation

## 🛠 Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Modern React patterns

### Web3 Integration
- **Blockchain Interaction**: Viem/Wagmi libraries
- **Wallet Support**: RainbowKit integration
- **Social Features**: Farcaster Frames implementation
- **Deployment**: Vercel platform

### Smart Contracts
- **XP Controller**: On-chain experience point management
- **Task Manager**: Quest completion and verification system
- **User Registry**: Player profile and achievement storage

## 🎯 Application Flow

### On-Chain XP Integration
1. **Quest Completion**: User finishes activity (timer/distance/reps)
2. **Smart Contract Interaction**: Frontend calls `TaskManager` → emits `TaskCompleted` event
3. **XP Minting**: `XPController` updates on-chain experience points
4. **UI Update**: Real-time state refresh and progress visualization
5. **Social Sharing**: Integrated sharing with transaction proof

> **All XP and level progression are permanently recorded on-chain — no off-chain counters or centralized tracking.**

## 📱 Core Application Pages

### 🏠 Dashboard
- Level summary and current progression
- XP progress visualization
- Quick navigation to key features

### 🏃 Activity Center
- Activity type selection (running, walking, exercises)
- Target setting and goal configuration
- Quest initiation and completion flow

### ✅ Task Management
- Daily IRL and on-chain task overview
- Completion workflow and verification
- Progress tracking interface

### 📢 Social Sharing
- "Share Your Progress" with customizable captions
- Auto-generated achievement images
- Multi-platform distribution (Farcaster/X/Telegram)

### 👤 Profile Management
- Comprehensive level statistics
- Streak tracking and achievement display
- Weekly activity visualization

### 🏆 Leaderboard
- Global user ranking by XP
- Competitive positioning
- Community engagement features

## 📸 Application Preview

<div align="center">
  <img width="232" height="450" alt="Onchain Leveling Mobile Interface" src="https://github.com/user-attachments/assets/308d342f-39b0-40be-a013-d360bea20cd3" />
  <p><em>Mobile-optimized interface showing activity tracking and progression</em></p>
</div>

## 🔗 Smart Contract Integration

The frontend seamlessly interacts with our on-chain infrastructure:

- **Immutable Progression**: All user levels and XP permanently stored on Base blockchain
- **Transparent Verification**: Every achievement publicly verifiable via transaction history
- **Gas-Optimized**: Efficient contract design for minimal transaction costs

## 🎮 Usage Guide

1. **Connect Wallet**: Link your Web3 wallet to Base network
2. **Select Activity**: Choose from available real-world quests
3. **Complete Quest**: Finish your chosen activity with verified metrics
4. **Claim XP**: Execute on-chain transaction to record your progress
5. **Share Achievement**: Broadcast your success to social networks
6. **Track Growth**: Monitor your level progression and leaderboard position

## 🤝 Contributing

We welcome contributions during our alpha phase! Please see our contributing guidelines for details on reporting issues, suggesting features, and submitting pull requests.

## 📄 License

This project is released under the MIT License.

---

<div align="center">
  <strong>Start your on-chain fitness journey today — where every step counts, on-chain.</strong>
</div>
