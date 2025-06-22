# Urban Hustle

Urban Hustle is a browser-based crime and city-themed game where you manage your character in an urban environment full of opportunities and dangers. The goal is to evolve your character, gain reputation, accumulate money, and complete missions using various actions and strategies.

## 🎮 Game Features

### 👤 Character Management

- **Player Status System:** Health, energy, addiction, reputation, money, and wanted level
- **Real-time Status Monitoring:** Visual indicators for all character attributes in organized 3x2 grid layout
- **Dynamic Status Effects:** Status affects available actions and gameplay
- **Player Avatar:** Customizable character image with name display
- **Status Bar:** Fixed top bar showing all player stats with icons and values

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

### State Management

- **Centralized Game State:** All game logic in GameInterface
- **Real-time Updates:** Immediate UI updates based on actions
- **Persistent State:** Game state maintained across sessions
- **Local Storage:** Daily rewards and user preferences persistence

### Performance

- **Optimized Rendering:** Efficient React components
- **Lazy Loading:** Components loaded as needed
- **Responsive Images:** Optimized for different screen sizes
- **Image Optimization:** High-quality Unsplash images with proper sizing

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

3. **Start the development server:**

   ```sh
   npm run dev
   ```

```

```

4. **Open your browser and navigate to:**

```

http://localhost:8080

```

## 📦 Deployment

You can deploy this project using your preferred platform (Vercel, Netlify, etc). Just make sure to build with:

```sh
npm run build
```

And serve the `dist/` folder.

## 🎯 Game Objectives

- **Survive:** Maintain your health and avoid imprisonment
- **Thrive:** Build reputation and accumulate wealth
- **Explore:** Discover all game features and mechanics
- **Compete:** Challenge yourself with missions and objectives
- **Empire Building:** Create and manage your business empire
- **Social Life:** Navigate the nightlife and build relationships

## 🔄 Recent Updates

- **Business Empire System:** Complete business management with 5 business types
- **Enhanced Status Bar:** Reorganized 3x2 grid layout for better visibility
- **Updated Images:** High-quality Unsplash images for all items and characters
- **Nightlife Improvements:** Three distinct sections with consumables and effects
- **Inventory Overhaul:** Complete 6x3 grid system with equipment slots
- **Daily Reward System:** Persistent daily rewards with countdown
- **Simplified Navigation:** Streamlined bottom navigation
- **Background System:** Dynamic background with overlay
- **Player Customization:** Avatar and name system

---

_Urban Hustle - Where the city never sleeps and neither should you!_
