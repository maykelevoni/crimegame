# Urban Hustle

Urban Hustle is a browser-based crime and city-themed game where you manage your character in an urban environment full of opportunities and dangers. The goal is to evolve your character, gain reputation, accumulate money, and complete missions using various actions and strategies.

## 🎮 Game Features

### 👤 Character Management

- **Player Status System:** Health, energy, addiction, reputation, money, and wanted level
- **Real-time Status Monitoring:** Visual indicators for all character attributes
- **Dynamic Status Effects:** Status affects available actions and gameplay

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
  - **High Addiction:** "Viciado do caramba! Vai se desintoxicar, seu verme!"
  - **High Wanted Level:** "Tá mais procurado que bandido em filme! Faz uma cirurgia plástica!"
- **Direct Action Buttons:** Quick navigation to relevant sections
- **Dismissible Alerts:** Close individual alerts with X button
- **Color-coded System:** Different colors for different alert types

### 🏠 Home Interface

- **Main Action Grid:** Quick access to all major game features
- **Lucky Wheel:** Daily prize spinning system with exclusive rewards
- **News Feed:** Real-time game world updates and events
- **Quick Navigation:** Direct access to all game sections
- **Responsive Design:** Optimized for both desktop and mobile

### 🛒 Shop System

- **Complete Shopping Interface:** Full-featured shop with categories
- **Item Categories:** Weapons, consumables, equipment
- **Shopping Cart:** Add multiple items before purchase
- **Item Details:** Detailed modal with item information
- **Purchase Confirmation:** Secure buying process
- **Inventory Management:** Track purchased items

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

- **Entertainment Options:** Clubs, parties, and social activities
- **Energy Recovery:** Restore energy through social activities
- **Addiction Management:** Reduce addiction levels
- **Social Interactions:** Meet other characters

### 🎯 Mission System

- **Daily Missions:** Regular objectives for rewards
- **Mission Types:** Various mission categories
- **Reward System:** Earn bonuses and experience

### 🎨 User Interface

- **Cyberpunk Theme:** Futuristic, neon-styled interface
- **Responsive Design:** Works on all device sizes
- **Smooth Animations:** Polished user experience
- **Intuitive Navigation:** Easy-to-use interface
- **Status Bars:** Visual representation of all character stats

## 🛠️ Technical Features

### Frontend

- **React 18:** Modern React with hooks and functional components
- **TypeScript:** Type-safe development
- **Vite:** Fast build tool and development server
- **Tailwind CSS:** Utility-first CSS framework
- **shadcn/ui:** High-quality UI components

### State Management

- **Centralized Game State:** All game logic in GameInterface
- **Real-time Updates:** Immediate UI updates based on actions
- **Persistent State:** Game state maintained across sessions

### Performance

- **Optimized Rendering:** Efficient React components
- **Lazy Loading:** Components loaded as needed
- **Responsive Images:** Optimized for different screen sizes

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

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
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

## 🔄 Recent Updates

- **Prison System:** Complete prison management with escape mechanics
- **Hospital System:** Comprehensive medical treatment options
- **Smart Alerts:** Intelligent status monitoring with personality
- **Enhanced UI:** Improved navigation and user experience
- **Shop Integration:** Full shopping system with cart functionality

---

_Urban Hustle - Where the city never sleeps and neither should you!_
