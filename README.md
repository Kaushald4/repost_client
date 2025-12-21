# Repost - Modern Social Media Platform

A modern, Reddit-inspired social platform built with Next.js 15, featuring a beautiful UI, real-time interactions, and community-driven content.

**Backend Repository:** [https://github.com/Kaushald4/repost_server](https://github.com/Kaushald4/repost_server)

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Networking**: Axios

## 📁 Project Structure

```
client/
├── app/                      # Next.js app directory (Routes)
│   ├── communities/         # Community browsing
│   ├── explore/             # Discovery page
│   ├── login/               # Authentication
│   ├── messages/            # Direct messaging
│   ├── notifications/       # User notifications
│   ├── post/                # Post details
│   ├── r/                   # Community pages (dynamic)
│   ├── search/              # Search functionality
│   ├── settings/            # User settings
│   ├── u/                   # User profiles (dynamic)
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── auth/                # Authentication forms & modals
│   ├── header/              # Navigation & actions
│   ├── ui/                  # Reusable UI components (Shadcn)
│   └── ...                  # Feature-specific components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & helpers
├── services/                # API service integration
├── stores/                  # Global state management (Zustand)
└── types/                   # TypeScript definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd repost/client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add necessary variables (API endpoints, etc.).

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ✅ Implementation Status

### User Accounts & Identity

- [x] Register (Email signup)
- [x] Login
- [x] Token Refresh
- [ ] OAuth signup (Google, Apple, etc.)
- [ ] Username system
- [ ] User profiles
- [ ] Avatar & profile banner
- [ ] Short bio
- [ ] Privacy settings
- [ ] Block users
- [ ] Mute users

### 🏘️ Communities (Subreddits)

- [ ] Create communities
- [ ] Join / leave communities
- [ ] Community rules
- [ ] Community descriptions
- [ ] Community banners & icons
- [ ] Follow communities
- [ ] Moderator roles & permissions
- [ ] Community health score

### 📝 Posts

- [ ] Text posts
- [ ] Image posts
- [ ] Poll posts
- [ ] Short video posts (future)
- [ ] Multi-format posts (text + poll + media)
- [ ] Edit / delete posts
- [ ] Anonymous posting (per post)
- [ ] Post flair / tags
- [ ] Post views counter

### 💬 Comments & Discussions

- [ ] Nested comment threads
- [ ] Edit / delete comments
- [ ] Upvote / downvote comments
- [ ] Quote / reply to comments
- [ ] AI-assisted reply suggestions
- [ ] Respectful counter-argument suggestions

### 📰 Feed & Discovery

- [ ] Home feed
- [ ] Community feeds
- [ ] Sorting options (Hot, New, Top)
- [ ] Personalized feed
- [ ] AI feed curator
- [ ] Trending topics
- [ ] Topic-based discovery
- [ ] Rabbit Hole mode (endless related content)
- [ ] Topic maps (visual relationship graph)

### 🔍 Search

- [ ] Search posts
- [ ] Search communities
- [ ] Search users
- [ ] Filter by popularity / time

### 💬 Chat & Messaging

- [ ] 1-on-1 direct messages
- [ ] Community group chats
- [ ] Topic-based live chats
- [ ] Temporary / disappearing chats
- [ ] Voice chat (future)
- [ ] Mute conversations
- [ ] Block users in chat

### 🔔 Notifications

- [ ] Post replies
- [ ] Comment replies
- [ ] Mentions
- [ ] Upvotes
- [ ] Chat messages
- [ ] Community announcements
- [ ] Notification settings

### 🤖 AI Features

- [ ] AI thread summaries (TL;DR)
- [ ] Pros vs Cons summaries
- [ ] AI post improvement
- [ ] AI title suggestions
- [ ] AI comment suggestions
- [ ] AI-generated visuals (memes, cards, infographics)
- [ ] AI debate assistant
- [ ] AI research assistant
- [ ] Personal AI learning agent

### 🧠 Agent Integrations

- [ ] Research agent (summarize discussions & sources)
- [ ] Moderator agent (flags issues, suggests rule updates)
- [ ] Feed curation agent
- [ ] Personal interest & learning agent

### 🏆 Reputation & Gamification

- [ ] Reputation / karma system
- [ ] Helper score
- [ ] Debate score
- [ ] Creative score
- [ ] Profile badges
- [ ] Levels & progression
- [ ] Feature unlocks via levels
- [ ] Community quests
- [ ] Achievements

### 🛡️ Moderation & Safety

- [ ] Report posts/comments
- [ ] Remove posts/comments
- [ ] Ban / mute users
- [ ] Temporary bans
- [ ] AI spam detection
- [ ] AI toxicity detection
- [ ] Moderator dashboards
- [ ] Mod action logs

### 🎨 Creator Tools

- [ ] Post drafts
- [ ] Content scheduling
- [ ] Post analytics
- [ ] Remix / quote post feature
- [ ] Cross-posting tools
- [ ] AI content enhancement

### ⚙️ General Platform Features

- [ ] Mobile-first responsive UI
- [ ] Dark / light mode
- [ ] Fast caching & performance optimization
- [ ] Accessibility support
- [ ] Screen-time reminders (optional)
- [ ] Quality-focused feed mode
- [ ] App analytics
- [ ] Admin dashboard
