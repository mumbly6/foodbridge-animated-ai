# Smart FoodBridge - Hackathon Project Documentation

## 🌟 Project Overview

**Smart FoodBridge** is an innovative community-driven platform that bridges the gap between food donors and those in need, reducing food waste while fighting hunger. By leveraging AI, real-time mapping, and gamification, we've created a seamless ecosystem for food redistribution that benefits the entire community.

### Mission Statement
"Transforming surplus food into shared abundance through technology and community collaboration."

---

## 🎯 Problem Statement

- **40% of food** produced globally goes to waste
- **1 in 8 people** face food insecurity
- Lack of efficient coordination between donors and recipients
- No visibility of available food donations in real-time
- Limited engagement and motivation for sustained community participation

---

## 💡 Our Solution

Smart FoodBridge provides:

1. **Real-Time Food Donation Mapping** - Live visualization of available donations, community fridges, and drop-off locations
2. **AI-Powered Matching** - Intelligent donation concierge that matches requests with available supplies based on dietary needs, urgency, proximity, and volume
3. **Gamified Community Engagement** - Points, badges, and leaderboards to motivate and celebrate community heroes
4. **Smart Notifications** - In-app alerts for donors and recipients
5. **Profile Progression System** - Animated progress tracking with custom achievements

---

## 🚀 Key Features

### 1. Interactive Real-Time Map 🗺️
- **Live donation tracking** with animated markers
- **Community fridges** locations across the city
- **Drop-off points** for convenient food donation
- **Auto-zoom** to fit all available points
- **Custom markers** with emoji icons (🍎 for donations, ❄️ for fridges, 📦 for drop-offs)
- **Popup details** showing food type, quantity, and pickup windows
- **Powered by**: Leaflet + OpenStreetMap (100% free, no API keys required)

### 2. AI Donation Concierge 🤖
Our intelligent matching system considers:
- **Dietary restrictions** (vegan, gluten-free, halal, etc.)
- **Urgency level** (immediate need vs. flexible)
- **Geographic proximity** (nearest donations first)
- **Volume matching** (quantity requested vs. available)
- **Historical patterns** (user preferences and past requests)
- **Predicted needs** (AI learns from community trends)

**Technology**: Powered by Lovable AI Gateway using Google Gemini 2.5 Flash

### 3. Gamification & Community Engagement 🏆

#### Points System
- **Donate food**: +10 points
- **Fulfill a request**: +15 points
- **Create pickup location**: +5 points
- **Profile completion**: +20 points

#### Badge Achievements
| Badge | Icon | Requirement | Points |
|-------|------|-------------|--------|
| Food Hero | 🦸 | First donation | 10 |
| Generous Giver | 🎁 | 5 donations | 50 |
| Community Champion | 👑 | 10 donations | 100 |
| Hunger Warrior | ⚔️ | 25 donations | 250 |
| Change Maker | ✨ | 50 donations | 500 |

#### Leaderboard Categories
- **Top Donors** - Most donations made
- **Top Organizers** - Most community engagement
- **Top Helpers** - Most requests fulfilled

### 4. Smart Profile System 👤
- **Animated progress bars** showing profile completion
- **Custom avatar** system
- **Achievement showcase**
- **Reveal transitions** for milestone celebrations
- **Activity history** tracking

### 5. Donation & Request Forms 📝
- **Location capture** with latitude/longitude
- **Food categorization** (fresh produce, packaged goods, prepared meals, beverages)
- **Dietary information** tagging
- **Pickup time windows** with datetime picker
- **Expiry time tracking**
- **Image upload** support
- **Quantity specification**

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **Mapping**: Leaflet + React-Leaflet + OpenStreetMap
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns

### Backend (Lovable Cloud)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (email/password)
- **Real-time**: Supabase Realtime subscriptions
- **Edge Functions**: Deno-based serverless functions
- **AI Integration**: Lovable AI Gateway (Google Gemini 2.5 Flash)
- **Notifications**: In-app notification system

### Database Schema

#### Tables
1. **donations**
   - id, user_id, title, description, food_type
   - quantity, dietary_info[], pickup_window
   - expiry_time, latitude, longitude
   - status (available/claimed/fulfilled)
   - created_at, updated_at

2. **profiles**
   - id, user_id, full_name, phone
   - role (donor/requester/organizer)
   - avatar_url, created_at, updated_at

3. **user_stats**
   - id, user_id, points, donations_count
   - requests_fulfilled, created_at, updated_at

4. **badges**
   - id, name, description, icon
   - points_required, created_at

5. **user_badges**
   - id, user_id, badge_id, earned_at

6. **community_fridges**
   - id, name, description, address
   - latitude, longitude, created_at

7. **dropoff_locations**
   - id, name, description, address
   - hours, latitude, longitude, created_at

8. **notifications**
   - id, user_id, type, title
   - message, read, created_at

### Security Features
- **Row Level Security (RLS)** on all tables
- **Authenticated requests** only
- **User-scoped data access**
- **Auto-confirm email** for development
- **Secure password hashing**

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Smart FoodBridge                         │
│                      React Frontend                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    Map     │  │ Dashboard  │  │   Auth     │            │
│  │  (Leaflet) │  │ (Gamified) │  │  System    │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
└────────┼────────────────┼────────────────┼───────────────────┘
         │                │                │
         ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Lovable Cloud Backend                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                      │  │
│  │  ┌──────┐ ┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐ │  │
│  │  │Donati│ │Profiles│ │Stats │ │Badges  │ │Fridges │ │  │
│  │  │ons   │ │        │ │      │ │        │ │        │ │  │
│  │  └──────┘ └────────┘ └──────┘ └────────┘ └────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Supabase Realtime Subscriptions              │  │
│  │    (Live updates for map & leaderboard)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Edge Functions (Serverless)                 │  │
│  │  ┌────────────────┐  ┌──────────────────────────┐   │  │
│  │  │ AI Donation    │  │ Send Notification        │   │  │
│  │  │ Concierge      │  │                          │   │  │
│  │  └────────┬───────┘  └──────────────────────────┘   │  │
│  └───────────┼──────────────────────────────────────────┘  │
│              │                                              │
└──────────────┼──────────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Lovable AI Gateway  │
    │  (Gemini 2.5 Flash)  │
    └──────────────────────┘
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Green (hsl(142, 76%, 36%)) - Growth, sustainability
- **Secondary**: Orange (hsl(38, 92%, 50%)) - Energy, community
- **Accent**: Orange (matching secondary) - Highlights
- **Background**: White/Dark green (theme-aware)

### Typography
- Clean, accessible fonts
- Semantic heading hierarchy
- Responsive text sizing

### Components
- Custom shadcn/ui components
- Animated transitions (cubic-bezier easing)
- Soft shadows and glows
- Gradient backgrounds
- Pulse animations for live markers

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd smart-foodbridge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
The project uses Lovable Cloud, so no manual environment configuration is needed. The following are auto-configured:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `LOVABLE_API_KEY` (for AI features)

### Database Setup
Database migrations run automatically. Tables and RLS policies are pre-configured.

---

## 📖 User Guide

### For Donors

1. **Sign Up/Login**
   - Create account with email and password
   - Complete your profile for bonus points

2. **Make a Donation**
   - Click "Donate Food" tab on dashboard
   - Fill in food details (type, quantity, dietary info)
   - Allow location access or manually enter coordinates
   - Set pickup window and expiry time
   - Submit to earn points!

3. **Track Your Impact**
   - View your donation count on dashboard
   - Earn badges as you reach milestones
   - Climb the leaderboard
   - See your donations on the live map

### For Recipients

1. **Browse Available Donations**
   - View live map showing all available food
   - See nearby community fridges
   - Check drop-off locations

2. **Submit a Request**
   - Click "Request Food" tab
   - Describe your needs
   - Specify dietary requirements
   - Set urgency level
   - AI will match you with best donations

3. **Pick Up Food**
   - View matched donations
   - Contact donor through platform
   - Follow pickup instructions
   - Mark as fulfilled

### For Community Organizers

1. **Monitor Activity**
   - Track community impact metrics
   - View leaderboard trends
   - Identify high-traffic areas

2. **Add Resources**
   - Register new community fridges
   - Add drop-off locations
   - Coordinate donation drives

---

## 🌍 Community Impact

### Metrics We Track
- **Total Donations Made** - Every meal saved from waste
- **Active Donors** - Community members giving back
- **Meals Distributed** - Estimated meals from donated food
- **Locations Covered** - Geographic reach of platform

### Expected Outcomes
- **Reduce food waste** by 30% in participating areas
- **Feed 1000+ people** in first 6 months
- **Build community** through gamified engagement
- **Raise awareness** about food insecurity and waste

### Environmental Impact
- **Lower carbon emissions** from reduced food waste
- **Decrease landfill burden**
- **Promote sustainable practices**
- **Circular economy** approach to food

---

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] **Mobile App** (React Native)
- [ ] **SMS Notifications** for low-tech users
- [ ] **QR Code Scanning** for quick pickup verification
- [ ] **Corporate Partnerships** (restaurants, grocery stores)
- [ ] **Volunteer Coordination** for delivery services
- [ ] **Analytics Dashboard** for organizations
- [ ] **Multi-language Support**

### Phase 3 Features
- [ ] **Blockchain Verification** for donation tracking
- [ ] **AI Demand Forecasting** to predict food needs
- [ ] **Nutrition Tracking** for recipients
- [ ] **Automated Tax Receipts** for donors
- [ ] **Integration with Food Banks** nationwide
- [ ] **Weather-based Predictions** for food demand
- [ ] **Social Media Sharing** of impact

---

## 🏅 Hackathon Highlights

### Innovation
- **AI-powered matching** using advanced algorithms
- **Real-time mapping** without paid APIs
- **Gamification** for sustained engagement
- **Edge computing** for scalable performance

### Technical Excellence
- **Type-safe** codebase with TypeScript
- **Responsive design** for all devices
- **Accessible** UI components (WCAG compliant)
- **Performance optimized** with lazy loading and code splitting
- **Secure** with RLS and authenticated requests

### Social Impact
- **Addresses UN SDG #2** (Zero Hunger)
- **Supports SDG #12** (Responsible Consumption)
- **Community-driven** solution
- **Scalable** to any city or region

### User Experience
- **Intuitive interface** for all age groups
- **Instant feedback** with animations
- **Clear visual hierarchy**
- **Engaging** gamification mechanics

---

## 👥 Team & Acknowledgments

Built with ❤️ using [Lovable](https://lovable.dev) - the AI-powered full-stack development platform.

### Technologies Powered By
- Supabase (via Lovable Cloud)
- OpenStreetMap & Leaflet
- Google Gemini AI (via Lovable AI Gateway)
- Shadcn UI
- Tailwind CSS

---

## 📄 License

This project is open source and available for community use.

---

## 📞 Contact & Demo

- **Live Demo**: [Your Deployed URL]
- **GitHub**: [Your Repo URL]
- **Video Demo**: [YouTube/Vimeo Link]

---

## 🎬 Demo Script

1. **Landing Page** - Show hero section with call-to-action
2. **Sign Up** - Quick registration flow
3. **Dashboard** - Overview of community impact
4. **Make Donation** - Complete donation form with location
5. **Live Map** - Show real-time markers appearing
6. **AI Matching** - Submit request and see AI recommendations
7. **Leaderboard** - Show gamification and badges
8. **Profile** - Display progress and achievements

---

**Built to make the world a better place, one meal at a time.** 🌍🍽️
