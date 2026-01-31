

# Nexus: Knowledge OS for Indian Exam Prep
## Complete Implementation Plan

### Project Overview
A premium, macOS-inspired collaborative study platform that transforms exam preparation into an immersive, AI-powered experience. Designed specifically for JEE, NEET, and UPSC aspirants.

---

## Phase 1: Foundation & Visual Identity
**The Event Horizon Landing + Core Navigation**

### 1.1 The Landing Portal
- **3D Knowledge Graph** using Three.js/React Three Fiber
  - Interactive nodes representing subjects (Physics, Chemistry, Biology, etc.)
  - Animated connections showing relationships between topics
  - Hover effects reveal topic previews, click navigates to Goal Rooms
  - Subtle particle effects for ambient energy
- **Glassmorphic Hero Section**
  - Frosted glass cards with backdrop blur
  - Semantic search bar with intent parsing
  - "Connect with Google" authentication (mock initially)
- **Live Activity Ticker**
  - Scrolling HUD-style feed showing recent uploads and activity
  - Simulated real-time updates for demo

### 1.2 Design System
- **Dark mode primary** with macOS-inspired aesthetics
- **Glassmorphism tokens**: backdrop-blur, semi-transparent backgrounds
- **Typography**: SF Pro Display vibes with Inter/Geist fonts
- **Cmd+K Command Palette**: Global spotlight search for quick navigation

---

## Phase 2: Mission Control Dashboard
**The Personal Command Center**

### 2.1 Bento Box Layout
- **Focus Graph**: GitHub-style contribution heatmap showing study intensity
- **Priority Deck**: AI-surfaced "what to study next" cards
- **Quick Stats**: Topics covered, streak days, room participation
- **Recent Activity**: Your latest uploads, notes, and interactions

### 2.2 Room Discovery
- **Browse Goal Rooms**: JEE Main, NEET, UPSC organized by category
- **Room Cards**: Show member count, content volume, activity level
- **Personal Room Shortcuts**: Pin your most-used rooms

---

## Phase 3: The Goal Room Engine
**The Three-Pane IDE Experience**

### 3.1 Pane 1: The Living Syllabus (Left Rail)
- **Dynamic Tree View** with collapsible chapters/topics
- **Traffic Light System**:
  - 🟢 Green: Well-documented topics
  - 🟡 Yellow: Needs more content
  - 🔴 Red (Pulsing): Content bounty active
- **Personal Progress Overlay**: Visual fill as you mark topics learned
- **Exam Selector**: Toggle between JEE/NEET/UPSC syllabi

### 3.2 Pane 2: The Knowledge Stream (Center)
- **Rich Media Feed** (not a boring list)
- **Smart Cards** for each uploaded resource:
  - File preview with thumbnails
  - AI-generated summary
  - Read time estimate
  - Trust Score badge
  - Version history (fork/improve notes)
- **Filters**: By topic, file type, rating, recency

### 3.3 Pane 3: The Hive (Right Rail)
- **Presence Indicators**: Avatars of currently active users
- **Voice Channels** (UI only initially):
  - "Quiet Study Room"
  - "Discussion Table"
- **Study Buddy Matcher**: Button to find a partner at same progress level

---

## Phase 4: File Upload & AI Processing
**The Gatekeeper Pipeline**

### 4.1 Upload Experience
- **Drag & Drop Zone** with visual feedback
- **Image Enhancement Preview**: Before/after for handwritten notes
- **Progress Indicators**: Upload → Processing → Tagged → Live

### 4.2 AI Processing Features (Mock → Real)
- **Handwriting OCR**: Convert scribbles to searchable text
- **Auto-Taxonomy**: AI reads content and files under correct syllabus topic
- **Duplicate Detection**: Warn if similar content exists
- **Quality Check**: Basic spam/junk filtering

---

## Phase 5: The Socratic Bot
**AI-Powered Deep Learning**

### 5.1 Deep Focus Reader
- **Distraction-Free Mode**: Sidebars slide away
- **Split-Screen Layout**:
  - Left: PDF/Image viewer
  - Right: Socratic Bot chat interface

### 5.2 Active Interrogation
- **Highlight-to-Ask**: Select text, get contextual options:
  - "Explain like I'm 5"
  - "Turn into Flashcard"
  - "Find related concepts"
  - "Quiz me on this"
- **RAG-Powered Answers**: Bot cites sources from the community library

### 5.3 Semantic Search
- **Natural Language Queries**: "Compare the 1919 and 1935 Acts"
- **Source Citations**: "According to Rahul's Notes, pg 4..."
- **Cross-Reference**: Links to related content in the knowledge graph

---

## Phase 6: Gamification Layer
**The Reputation Ledger**

### 6.1 Points & Progression
- **Reputation System**: Earn points for uploads, helpful answers
- **Streak Tracking**: Daily study streaks with freeze protection
- **Bounty System**: Post requests with point rewards

### 6.2 Status Unlocks
- **Contributor → Moderator → Mentor** progression
- **Badges**: Topic expertise, quality uploads, community helper

---

## Technical Architecture

### Frontend Stack
- **React + Vite + TypeScript** (Lovable's foundation)
- **Tailwind CSS** with custom glassmorphism utilities
- **React Three Fiber** for 3D knowledge graph
- **Zustand** for state management
- **React Router** for navigation

### Data Layer (Phase 1: Mock)
- Local state with realistic sample data
- Simulated AI responses
- Pre-built syllabus trees for JEE/NEET/UPSC

### Backend Integration (Later Phase)
- **Lovable Cloud** for database & auth
- **Lovable AI** (Gemini) for OCR, summarization, chat
- **Supabase Storage** for file uploads

---

## Key User Flows

1. **New User Journey**
   Landing → Google Sign-in → Dashboard → Join First Room → Upload First Note

2. **Daily Study Session**
   Dashboard → Priority Deck suggestion → Goal Room → Deep Focus Reader

3. **Upload & Contribute**
   Drag file → AI processes → Auto-tags to topic → Community votes on quality

4. **Get Help**
   Highlight text → Ask Socratic Bot → Receive cited answer → Save as flashcard

---

## Success Metrics
- Time to first upload < 2 minutes
- Notes organized without manual tagging
- AI answers cite real community content
- Feels like a "desktop app" not a website

