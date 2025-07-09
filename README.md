# Urban Hustle

Urban Hustle is a browser-based crime and city-themed game where you manage your character in an urban environment full of opportunities and dangers. The goal is to evolve your character, gain reputation, accumulate money, and complete missions using various actions and strategies.

## 🎮 Game Features

### 👤 Character Management

- **Advanced Level System:** Reputation-based progression with 50 unique levels
- **Level Titles:** From "Street Rookie" to "Crime Legend" with distinct names for each level
- **Level Rewards:** Money, health, and energy bonuses for reaching new levels
- **Progress Tracking:** Visual progress bars showing reputation needed for next level
- **Player Status System:** Health, energy, addiction, reputation, money, wanted level, and prison status
- **Real-time Status Monitoring:** Visual indicators for all character attributes
- **Dynamic Status Effects:** Status affects available actions and gameplay
- **Player Avatar:** Customizable character image with name display
- **Unified Data Structure:** All player stats stored in single `players` table for optimal performance

### 🏢 Business Empire System

- **Business Management:** Buy, upgrade, and manage various business types
- **Business Types:**
  - **Restaurants:** Food service businesses with moderate income
  - **Nightclubs:** Entertainment venues with high income potential
  - **Convenience Stores:** 24/7 retail with steady income
  - **Weapon Factories:** High-risk, high-reward illegal operations
  - **Casinos:** Luxury gambling establishments with massive profits
- **Upgrade System:** Improve business level, employees, and security
- **Income Generation:** Passive income from owned businesses
- **Investment Strategy:** Balance risk vs reward in business decisions

### 🏥 Hospital System

- **Complete Medical Interface:** Full hospital view with detailed treatment options
- **Treatment Types:**
  - **Health Recovery:** Restore health to maximum
  - **Detox Treatment:** Reduce addiction levels
  - **Plastic Surgery:** Lower wanted level
  - **Energy Boost:** Restore energy with medical treatment
- **Treatment History:** Track all medical procedures performed
- **Cooldown System:** Prevents spam of treatments
- **Cost Management:** Each treatment has specific costs
- **Dual States:**
  - **Hospitalized State:** Forced treatment when health is critically low
  - **Voluntary Visit:** Optional treatments when visiting normally

### 🔒 Prison System

- **Enhanced Prison Interface:** Complete prison management system with timer-based sentences
- **Realistic Prison Activities:**
  - **Exercise:** Improve health (+5 HP) while serving time
  - **Work:** Earn money ($50-150) in the prison kitchen
  - **Sleep:** Restore energy (+10 Energy) and rest
- **Smart Timer System:** MM:SS format countdown with automatic release
- **Crime-Based Sentences:** Different sentence lengths based on crime type (5-20 minutes)
- **Activity Timers:** Each activity takes 5 minutes to complete
- **Force Release:** Automatic detection and release when timer reaches 00:00
- **Real-time Status:** Live countdown with visual feedback

### 🚨 Smart Alert System

- **Intelligent Monitoring:** Real-time status monitoring with personality
- **Humorous Alerts:** Fun, sarcastic messages based on player status:
  - **Low Health:** "Tá quase morto, seu zumbi! Vai pro hospital antes que vire pó!"
  - **Low Energy:** "Tá mais lento que lesma na areia! Vai curtir na nightlife pra pegar energia!"
  - **High Addiction:** "Tá viciado que nem rato em laboratório! Vai pro hospital se tratar!"
  - **High Wanted Level:** "A polícia tá te caçando que nem cachorro atrás de osso! Vai se esconder!"
- **Direct Action Buttons:** Quick navigation to relevant sections
- **Dismissible Alerts:** Close individual alerts with X button
- **Color-coded System:** Different colors for different alert types

### 🏠 Home Interface

- **Main Action Grid:** Quick access to all major game features with 8 main action buttons
- **Enhanced Daily Reward System:** 
  - **Real Rewards:** Actual $500 money, +20 HP, +30 energy given to player stats
  - **24-Hour Timer:** Precise countdown showing hours:minutes:seconds until next reward
  - **Simplified UI:** Clean button with 🎁 emoticon and bounce animation
  - **Auto-Reset:** Timer automatically resets and enables button after 24 hours
  - **LocalStorage Persistence:** Reward timing maintained across sessions
- **Comprehensive Navigation:** Direct access to Crimes, Nightlife, Hospital, Business, Bank, Casino, Shop, and Prison
- **Visual Design:** Gradient backgrounds with hover effects and scale animations
- **Responsive Design:** Optimized for both desktop and mobile with 2-column grid layout

### 🛒 Shop System

- **Complete Shopping Interface:** Full-featured shop with categories and crime integration
- **Item Categories:** Weapons, vehicles, protection, and consumables
- **Equipment Effects:** Items boost crime success rates and provide protection
- **Crime Integration:** Better equipment = higher success rates in robberies
- **Equipment Bonuses:**
  - **Weapons:** Increase damage and success rates
  - **Vehicles:** Improve escape chances
  - **Protection:** Reduce health loss during crimes
  - **Consumables:** Temporary stat boosts
- **Shopping Cart:** Add multiple items before purchase
- **Item Details:** Detailed modal with stat bonuses and effects
- **Purchase System:** Secure buying with money validation
- **Inventory Management:** Track purchased items with local storage backup

### 🎰 Casino & Gambling

- **Complete Casino System:** Professional gambling platform with real money mechanics
- **Five Casino Games:**
  - **Blackjack:** Classic card game with 2% house edge and 2.5x max payout
  - **Roulette:** Wheel spinning with single number (35x) and color bets
  - **Slots:** Slot machines with jackpot potential (1000x max payout)
  - **Poker:** High-stakes poker with variable multipliers (1-10x)
  - **Baccarat:** Elegant card game for high rollers with low house edge
- **Realistic Betting System:**
  - **Variable Bet Limits:** Each game has different min/max bet amounts
  - **House Edge Calculations:** Proper mathematical odds (1.2% - 5% house edge)
  - **Energy Costs:** Games require energy to play (2-20 energy per game)
  - **Reputation Rewards:** Gain reputation for successful gambling sessions
- **Interactive Gameplay:**
  - **Betting Modal:** Detailed bet placement with validation
  - **Real-Time Results:** Live game outcomes with winning/losing animations
  - **Toast Notifications:** Immediate feedback on wins and losses
  - **Balance Integration:** Real money transactions with game store
- **Game Mechanics:**
  - **Progressive Difficulty:** Easy to hard games with varying risk levels
  - **Win Animations:** Visual feedback for successful bets
  - **Loss Prevention:** Insufficient funds and energy validation

### 🏦 Banking System

- **Complete Banking Interface:** Professional money management system with comprehensive financial services
- **Deposit & Withdrawal:** Secure money storage with validation and real-time synchronization
- **Interest System:** 5% daily interest on deposited funds with automatic calculation
- **24-Hour Timer:** Interest earned every 24 hours after deposit with countdown display
- **Advanced Loan System:** 
  - **Credit Score System:** Dynamic credit scoring (0-850) based on payment history and defaults
  - **Multiple Loan Types:** Small loans ($1K-10K), business loans ($10K-100K), high-risk loans ($50K-500K)
  - **Interest & Fees:** Realistic interest rates (5-25% APR) and origination fees
  - **Payment Tracking:** Daily payment requirements with late payment penalties
  - **Level-Based Limits:** Loan amounts increase 50% per player level
  - **Default Protection:** Automatic loan default handling for missed payments
- **Investment System:**
  - **High-Risk Investments:** Stocks, crypto, and bonds with varying risk levels
  - **Real-Time Progress:** Live progress bars and countdown timers for active investments
  - **Expected Returns:** 5-25% returns over 1-7 days based on investment type
  - **Portfolio Tracking:** Monitor all active investments with completion notifications
- **Account Protection:** Keep money safe from theft during crimes
- **Balance Display:** Real-time cash and bank balance tracking with loan debt visibility
- **Financial Strategy:** Complex money management with loans, investments, and savings

### 🌃 Nightlife System

- **Three Distinct Sections:**
  - **Bar:** Social drinking with various beverages
  - **Brothel:** Adult entertainment with character interactions
  - **Rave:** High-energy party scene with drugs and effects
- **Consumable Items:** Drinks, drugs, and other consumables with effects
- **Character Photos:** High-quality images for all nightlife characters
- **Effect System:** Temporary status boosts and changes
- **Notification System:** Real-time feedback on actions

### 🎯 Robbery System

- **Advanced Crime System:** Power-based success calculation
- **10 Different Targets:** From convenience stores to federal reserve
- **Power Calculation:** Player power = Reputation + (Level × 10) + Equipment - (Wanted × 5)
- **Dynamic Success Rates:** 5-95% success based on player vs crime power requirements
- **Equipment Integration:** Weapons, vehicles, and protection affect success rates
- **Energy Requirements:** Each crime consumes energy based on difficulty
- **Risk vs Reward:** Higher difficulty crimes offer better rewards but higher requirements
- **Real-time Feedback:** Success rates calculated and displayed before attempting crimes

### 🎨 Inventory & Profile System

- **Complete Inventory:** 6x3 grid system for item management
- **Equipment Slots:** Weapon, armor, style, and accessory slots
- **Item Categories:** Weapons, armor, style, accessories, consumables, special items
- **Rarity System:** Common, rare, and legendary items
- **Equipment Effects:** Items provide stat bonuses
- **High-Quality Images:** Real Unsplash images for all inventory items
- **Character Stats:** Intelligence, strength, charisma, resistance
- **Real Database Integration:** Inventory items loaded from `inventory` table

### 🎯 Mission System

- **Daily Missions:** Regular objectives for rewards
- **Mission Types:** Various mission categories
- **Reward System:** Earn bonuses and experience

### 🎨 User Interface

- **Cyberpunk Theme:** Futuristic, neon-styled interface
- **Responsive Design:** Works on all device sizes
- **Smooth Animations:** Polished user experience
- **Intuitive Navigation:** Easy-to-use interface with bottom navigation
- **Status Display:** Organized 3x2 grid showing all character stats
- **Background System:** Dynamic background with dark overlay
- **Bottom Navigation:** Simplified 4-icon navigation (Home, Robbery, Shop, Profile)

## 🛠️ Technical Features

### Frontend

- **React 18:** Modern React with hooks and functional components
- **TypeScript:** Type-safe development
- **Vite:** Fast build tool and development server
- **Tailwind CSS:** Utility-first CSS framework
- **shadcn/ui:** High-quality UI components
- **Lucide React:** Beautiful icon library

### Backend & Database

- **Supabase:** Real-time database and authentication
- **PostgreSQL:** Robust relational database
- **Row Level Security (RLS):** Secure data access
- **Real-time Subscriptions:** Live updates across clients
- **Unified Data Structure:** Optimized schema with single `players` table

### Database Schema

- **Players Table:** Unified table containing all player data and stats
  - Basic info: name, level, experience, avatar_url, user_id
  - Core stats: health, energy, addiction, reputation, money, wanted_level
  - Banking: bank_balance, last_interest_claim
  - Loan system: credit_score, total_debt, active_loans[], loan_history[]
  - Investment system: active_investments[]
  - Status: is_imprisoned, is_hospitalized, prison_sentence, imprisoned_at
- **Loans Table:** Complete loan management with RLS policies
  - Loan details: amount, interest_rate, term_days, daily_payment
  - Payment tracking: total_paid, late_payments, last_payment_date
  - Status management: active, paid, defaulted
- **Items Table:** Complete item catalog with categories and properties
- **Inventory Table:** Player item ownership with quantities
- **Businesses Table:** Business management and ownership
- **Crime History Table:** Track all criminal activities

### State Management

- **Centralized Game State:** All game logic in GameInterface
- **Real-time Updates:** Immediate UI updates based on actions
- **Persistent State:** Game state maintained across sessions
- **Local Storage:** Daily rewards and user preferences persistence
- **Database Integration:** All data synchronized with Supabase

### Performance

- **Optimized Rendering:** Efficient React components
- **Lazy Loading:** Components loaded as needed
- **Responsive Images:** Optimized for different screen sizes
- **Image Optimization:** High-quality Unsplash images with proper sizing
- **Database Optimization:** Efficient queries and indexing

## 🚀 Getting Started

1. **Clone the repository:**

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**

   ```sh
   npm run dev
   ```

5. **Open your browser and navigate to:**

   ```
   http://localhost:8080
   ```

## 📊 Recent Updates

### Major Financial System Overhaul (Latest)

- **Advanced Banking System:** Complete loan and investment system implementation
  - **Comprehensive Loan System:** Credit scoring, multiple loan types, payment tracking, and default handling
  - **High-Risk Investment Platform:** Stocks, crypto, and bonds with real-time progress tracking
  - **Database Migration:** Added loan fields and loans table with proper UUID handling
  - **Type Mapping Fixes:** Resolved bank balance synchronization issues on page refresh
- **Casino System Complete Rebuild:** Professional gambling platform
  - **Five Casino Games:** Blackjack, Roulette, Slots, Poker, and Baccarat with realistic mechanics
  - **Real Money Integration:** Actual betting system connected to player money and energy
  - **House Edge Calculations:** Proper mathematical odds and win/loss probabilities
  - **Toast Notifications:** Immediate feedback on game results (wins/losses)
- **Enhanced Daily Reward System:**
  - **Real Stat Updates:** Rewards now actually give money, health, and energy to player
  - **Fixed Timer System:** Proper 24-hour countdown with automatic reset
  - **Simplified UI:** Clean design with 🎁 emoticon and bounce animation
- **Database Synchronization Fixes:** Resolved critical issues with bank balance disappearing on refresh

### Previous Major Updates

- **Enhanced Prison System:** Timer-based sentences with realistic activities (exercise, work, sleep)
- **Advanced Shop System:** Crime-integrated equipment with success rate bonuses
- **50-Level Progression:** Comprehensive reputation-based level system with unique titles
- **Power-Based Crimes:** Dynamic success calculation using player power vs crime requirements
- **Database Unification:** Merged `players` and `player_stats` tables for better performance
- **Complete UI Overhaul:** Modern cyberpunk theme with responsive design
- **Enhanced Security:** Row Level Security implemented with proper user authentication

---

_Urban Hustle - Where the city never sleeps and neither should you!_
