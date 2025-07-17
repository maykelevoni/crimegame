# Crime Game

A browser-based crime-themed strategy game where you build your criminal empire through business management, criminal activities, and strategic decision-making in an urban environment.

## 🎮 Game Features

### 👤 Character System
- **Player Profile:** Name, avatar, and reputation-based progression
- **Statistics:** Health, energy, money, bank balance, addiction, and wanted level
- **Avatar Selection:** Choose from 20 different character avatars with database persistence
- **Status Management:** Track and manage all character attributes with visual indicators

### 🏢 Business Empire
- **Business Management:** Purchase and manage various business types from database
- **Business Types:** Restaurants, nightclubs, convenience stores, and more illegal operations
- **Upgrade System:** Improve business level, employees, and security
- **Income Generation:** Earn passive income from owned businesses
- **Database Integration:** All business data stored and managed in Supabase

### 🛒 Shop & Inventory
- **Item Categories:** Weapons, vehicles, protection gear, and consumables
- **Equipment System:** Equip items to boost crime success rates and provide bonuses
- **Inventory Management:** 18-slot inventory with item rarity system
- **Database Persistence:** All items and inventory data stored in database
- **Real Images:** High-quality item images for immersive experience

### 🎯 Crime System
- **Robbery Activities:** Various crime types with different risk/reward levels
- **Success Calculation:** Dynamic success rates based on player stats and equipment
- **Energy System:** Crimes consume energy and require strategic planning
- **Equipment Integration:** Better gear improves success chances

### 🏦 Banking & Finance
- **Bank Account:** Secure money storage with deposit/withdrawal system
- **Interest System:** Earn daily interest on deposited funds
- **Loan System:** Borrow money with credit score tracking and payment history
- **Investment Platform:** Invest in stocks, crypto, and bonds with real returns

### 🎰 Casino Games
- **Multiple Games:** Blackjack, Roulette, Slots, Poker, and Baccarat
- **Real Betting:** Actual money wagering with realistic odds
- **Energy Requirements:** Games consume energy to prevent spam
- **Professional Interface:** Casino-style UI with win/loss feedback

### 🏥 Hospital System
- **Medical Treatments:** Health recovery, detox, plastic surgery, and energy restoration
- **Treatment History:** Track all medical procedures
- **Cost Management:** Each treatment has specific costs and cooldowns
- **Dual States:** Voluntary visits vs forced hospitalization

### 🔒 Prison System
- **Timed Sentences:** Real-time prison sentences with countdown timers
- **Prison Activities:** Exercise, work, and sleep to improve stats while incarcerated
- **Crime-Based Sentences:** Different sentence lengths based on crime severity
- **Automatic Release:** Players are released when sentence is complete

### 🌃 Nightlife
- **Bar System:** Purchase drinks and socialize
- **Entertainment:** Various nightlife activities and interactions
- **Status Effects:** Temporary boosts and changes from activities

### 🎯 Avatar Management
- **Admin Panel:** Comprehensive avatar management system for administrators
- **Database CRUD:** Create, read, update, and delete avatar options
- **Image Management:** Upload and manage avatar images
- **Category System:** Organize avatars by male, female, and neutral categories

### 🏢 Business Type Management
- **Admin Controls:** Manage business types, pricing, and availability
- **Category System:** Legal, semi-legal, and illegal business classifications
- **Risk Assessment:** Risk levels and profitability settings
- **Database Integration:** Full CRUD operations for business types

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for consistent iconography
- **React Query** for efficient data fetching and caching

### Backend & Database
- **Supabase** for real-time database and authentication
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live data updates
- **Secure authentication** with user management

### Database Schema
- **Players Table:** Core player data including stats, money, and status
- **Business Tables:** Business types and player-owned businesses
- **Inventory System:** Items, shop inventory, and player items
- **Avatar System:** Avatar options and management
- **Admin Tables:** Business type management and configuration

### State Management
- **Zustand** for centralized game state management
- **Local Storage** for offline persistence and backup
- **Real-time Sync** between database and local state
- **Type-safe Interfaces** throughout the application

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd crimegame
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup:**
   - Set up Supabase project
   - Run the SQL schema files to create tables
   - Configure Row Level Security policies
   - Enable real-time subscriptions

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the Game:**
   Open `http://localhost:5173` in your browser

## 🎮 How to Play

1. **Create Account:** Sign up through Supabase authentication
2. **Character Setup:** Choose your avatar and start with basic stats
3. **Earn Money:** Complete crimes, manage businesses, or gamble in the casino
4. **Build Empire:** Purchase and upgrade businesses for passive income
5. **Manage Resources:** Balance health, energy, and money strategically
6. **Avoid Prison:** Manage your wanted level to stay out of jail
7. **Progress:** Build reputation and expand your criminal empire

## 🔧 Admin Features

- **Avatar Management:** Add, edit, and delete player avatar options
- **Business Management:** Configure business types, pricing, and availability
- **Player Monitoring:** View and manage player accounts and statistics
- **Database Administration:** Direct access to all game data and settings

## 📈 Game Balance

- **Energy System:** Prevents spam and encourages strategic planning
- **Risk/Reward:** Higher risk activities offer better rewards
- **Equipment Progression:** Better gear improves success rates
- **Financial Management:** Banking and investment systems for advanced players
- **Status Effects:** Addiction, wanted level, and health create meaningful choices

---

*Crime Game - Build your empire, manage your resources, and dominate the criminal underworld!*