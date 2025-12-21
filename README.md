# Repost - Modern Social Media Platform

A modern, Reddit-inspired social platform built with Next.js 15, featuring a beautiful UI, real-time interactions, and community-driven content.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
repost/
├── app/                      # Next.js app directory
│   ├── explore/             # Community discovery page
│   ├── messages/            # Direct messaging interface
│   ├── notifications/       # Notifications center
│   ├── post/[id]/          # Individual post view
│   ├── r/[community]/      # Community pages
│   ├── submit/              # Create post page
│   ├── u/[username]/       # User profile pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home feed
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   ├── app-header.tsx      # Navigation header
│   ├── app-layout.tsx      # Main layout wrapper
│   ├── comment-item.tsx    # Comment component
│   ├── feed-filters.tsx    # Feed sorting controls
│   ├── post-card.tsx       # Post display component
│   ├── sidebar.tsx         # Navigation sidebar
│   └── theme-toggle.tsx    # Dark/light mode toggle
├── data/                    # Mock data
│   └── mock-data.ts        # Dummy data for development
├── services/               # API service layer
│   ├── comment.service.ts  # Comment operations
│   ├── community.service.ts # Community operations
│   ├── message.service.ts  # Messaging operations
│   ├── notification.service.ts # Notification operations
│   └── post.service.ts     # Post operations
├── stores/                 # Zustand state stores
│   ├── community.store.ts  # Community state
│   ├── notification.store.ts # Notification state
│   ├── post.store.ts       # Post state
│   └── user.store.ts       # User authentication state
├── types/                  # TypeScript type definitions
│   └── index.ts           # Core type definitions
└── lib/                   # Utility functions
    └── utils.ts          # Helper functions
```

## ✨ Features Implemented

### Core Features

- ✅ **Home Feed** - Dynamic post feed with multiple sorting options (Hot, New, Top, Trending)
- ✅ **Communities** - Browse, join, and participate in communities
- ✅ **Posts** - Create and interact with text, image, and poll posts
- ✅ **Comments** - Nested comment threads with voting
- ✅ **User Profiles** - View user stats, reputation, and post history
- ✅ **Direct Messaging** - Real-time conversation interface
- ✅ **Notifications** - Activity notifications with read/unread states
- ✅ **Search & Discovery** - Explore communities page

### UI/UX Features

- ✅ **Responsive Design** - Mobile-first approach with desktop optimization
- ✅ **Dark Mode** - Full dark/light theme support
- ✅ **Sidebar Navigation** - Persistent navigation with community shortcuts
- ✅ **Vote System** - Upvote/downvote functionality for posts and comments
- ✅ **Post Interactions** - Save, share, and comment features

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Available Pages

- `/` - Home feed
- `/explore` - Discover communities
- `/r/[community]` - Community pages
- `/post/[id]` - Individual post view
- `/u/[username]` - User profiles
- `/submit` - Create new post (Now a modal)
- `/messages` - Direct messages
- `/notifications` - Notification center

## 🎯 Key Features

### Post Types

- **Text Posts** - Rich text content
- **Image Posts** - Image upload with captions
- **Poll Posts** - Interactive polls with real-time results

### Interaction

- Upvote/Downvote system
- Nested comments
- Save posts
- Share functionality

### Community

- Join/Leave communities
- Community rules and moderation
- Health score tracking

### User System

- Reputation scores (Helper, Debate, Creative)
- Karma system
- Level progression
- Achievement badges

## 🔄 State Management

The app uses **Zustand** for state management with the following stores:

- **User Store** - Authentication and profile
- **Post Store** - Feed and post data
- **Community Store** - Community membership
- **Notification Store** - Notifications

## 🎨 Customization

The app uses Tailwind CSS and Shadcn/ui components. You can customize:

- Colors in `tailwind.config.ts`
- Component styles in `components/ui/`
- Theme in `app/globals.css`

## 📝 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
