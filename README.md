# Urban Hustle

Urban Hustle is a browser-based crime and city-themed game where you manage your character in an urban environment full of opportunities and dangers. The goal is to evolve your character, gain reputation, accumulate money, and complete missions using various actions and strategies.

## 🎮 Game Features

### 👤 Character Management

- **Player Status System:** Health, energy, addiction, reputation, money, and wanted level
- **Real-time Status Monitoring:** Visual indicators for all character attributes in organized 3x2 grid layout
- **Dynamic Status Effects:** Status affects available actions and gameplay
- **Player Avatar:** Customizable character image with name display
- **Status Bar:** Fixed top bar showing all player stats with icons and values
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

- **Prison Interface:** Complete prison management system
- **Dual States:**
  - **Imprisoned State:** When wanted level is too high
  - **Visitor State:** When visiting other prisoners
- **Escape Options:**
  - **Bribe Guards:** 10% success chance to escape
  - **Start Riot:** 30% success chance to escape during chaos
- **Prisoner Interaction:** Visit and interact with other inmates
- **Automatic Detection:** System automatically detects when player should be imprisoned

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

- **Main Action Grid:** Quick access to all major game features
- **Daily Reward System:** Daily login rewards with countdown timer
- **Surprise Rewards:** Random rewards with localStorage persistence
- **Quick Navigation:** Direct access to all game sections
- **Responsive Design:** Optimized for both desktop and mobile

### 🛒 Shop System

- **Complete Shopping Interface:** Full-featured shop with categories
- **Item Categories:** Weapons, armor, consumables, accessories, style items
- **Shopping Cart:** Add multiple items before purchase
- **Item Details:** Detailed modal with item information and images
- **Purchase Confirmation:** Secure buying process
- **Inventory Management:** Track purchased items
- **High-Quality Images:** Real Unsplash images for all items
- **Real Database Integration:** All items loaded from `items` table

### 🎰 Casino & Gambling

- **Casino Interface:** Complete gambling system
- **Multiple Games:** Various games of chance
- **Risk Management:** Balance risk vs reward
- **Lucky Wheel:** Daily spinning for prizes

### 🏦 Banking System

- **Bank Interface:** Money management and storage
- **Account Security:** Protect your earnings
- **Transaction History:** Track all financial activities

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

- **Robbery Interface:** Complete crime system
- **Multiple Targets:** Various locations to rob
- **Risk vs Reward:** Balance danger with potential gains
- **Equipment Requirements:** Need proper gear for different jobs
- **Wanted Level Management:** Avoid getting caught

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
  - Basic info: name, level, experience, avatar_url
  - Stats: health, energy, addiction, reputation, money, wanted_level
  - Status: is_imprisoned, is_hospitalized
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

### Database Unification (Latest)

- **Unified Player Data:** Merged `players` and `player_stats` tables for better performance
- **Simplified Schema:** Reduced complexity and eliminated data duplication
- **Real-time Data:** All player stats now load directly from database
- **Optimized Queries:** Faster data access with unified structure

### Previous Updates

- **Complete UI Overhaul:** Modern cyberpunk theme with responsive design
- **Real Database Integration:** All game data now comes from Supabase
- **Enhanced Security:** Row Level Security implemented
- **Performance Improvements:** Optimized rendering and data loading

---

_Urban Hustle - Where the city never sleeps and neither should you!_
