import type { Level, LevelReward } from "../types/game";

// Dynamic level titles
const LEVEL_TITLES = [
  "Street Rookie", "Hustler", "Small Time Crook", "Enforcer", "Gang Member",
  "Lieutenant", "Underboss", "Crime Boss", "Kingpin", "Criminal Mastermind",
  "Overlord", "Shadow King", "Underworld Emperor", "Crime Legend", "Master Criminal",
  "Syndicate Leader", "Criminal Genius", "Mob Patriarch", "Crime Titan", "Ultimate Boss"
];

// Calculate reputation required for any level  
function calculateReputationForLevel(level: number): number {
  if (level <= 1) return 0;
  // Exponential growth: level 2 = 100, level 3 = 150, level 4 = 250, etc.
  return Math.floor(100 * Math.pow(1.5, level - 2));
}

// Calculate total reputation needed to reach a level
function calculateTotalReputationForLevel(level: number): number {
  if (level <= 1) return 0;
  
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += calculateReputationForLevel(i);
  }
  return total;
}

// Generate level data dynamically
function generateLevelData(level: number): Level {
  const reputationRequired = calculateReputationForLevel(level);
  const totalReputation = calculateTotalReputationForLevel(level);
  
  
  // Get title (cycle through titles if level exceeds array)
  const titleIndex = Math.min(level - 1, LEVEL_TITLES.length - 1);
  const title = level > LEVEL_TITLES.length 
    ? `${LEVEL_TITLES[LEVEL_TITLES.length - 1]} ${level - LEVEL_TITLES.length + 1}`
    : LEVEL_TITLES[titleIndex];

  // Calculate rewards based on level
  const moneyReward = Math.floor(500 * Math.pow(1.8, level - 2));
  const healthReward = level <= 5 ? 10 : Math.floor(10 * Math.pow(1.2, level - 5));
  const energyReward = level <= 5 ? 10 : Math.floor(10 * Math.pow(1.2, level - 5));

  const rewards: LevelReward[] = [];
  
  // Money reward every level
  if (level > 1) {
    rewards.push({
      type: "money",
      amount: moneyReward,
      description: `+$${moneyReward.toLocaleString()} bonus`
    });
  }

  // Health reward every 2 levels (capped at 150 total)
  if (level > 1 && level % 2 === 0) {
    const currentMaxHealth = 100 + (Math.floor((level - 2) / 2) * 10);
    if (currentMaxHealth < 150) {
      rewards.push({
        type: "health",
        amount: healthReward,
        description: `+${healthReward} max health`
      });
    }
  }

  // Energy reward every 3 levels (capped at 150 total)
  if (level > 1 && level % 3 === 0) {
    const currentMaxEnergy = 100 + (Math.floor((level - 3) / 3) * 10);
    if (currentMaxEnergy < 150) {
      rewards.push({
        type: "energy", 
        amount: energyReward,
        description: `+${energyReward} max energy`
      });
    }
  }

  // Feature unlocks for early levels
  const unlocks: string[] = [];
  switch (level) {
    case 1: unlocks.push("robberies", "shop"); break;
    case 2: unlocks.push("nightlife"); break;
    case 3: unlocks.push("bank"); break;
    case 4: unlocks.push("businesses"); break;
    case 5: unlocks.push("casino"); break;
  }

  return {
    level,
    reputationRequired,
    totalReputation,
    title,
    rewards,
    unlocks
  };
}

// Get level information by level number (dynamically generated)
export function getLevelInfo(level: number): Level | null {
  if (level < 1) return null;
  return generateLevelData(level);
}

// Calculate current level based on total reputation
export function calculateLevelFromReputation(totalReputation: number): number {
  let currentLevel = 1;
  
  // Keep checking levels until we find the highest one the player can achieve
  while (currentLevel < 100) { // Prevent infinite loop
    const nextLevel = currentLevel + 1;
    const nextLevelData = generateLevelData(nextLevel);
    
    
    if (totalReputation >= nextLevelData.totalReputation) {
      currentLevel = nextLevel;
    } else {
      break;
    }
  }
  
  return currentLevel;
}

// Calculate reputation needed for next level
export function getReputationToNextLevel(totalReputation: number): {
  currentLevel: number;
  nextLevel: number;
  reputationNeeded: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevelFromReputation(totalReputation);
  const nextLevel = currentLevel + 1;
  
  const currentLevelData = getLevelInfo(currentLevel);
  const nextLevelData = getLevelInfo(nextLevel);
  
  if (!currentLevelData || !nextLevelData) {
    return {
      currentLevel,
      nextLevel,
      reputationNeeded: 0,
      progressPercent: 100
    };
  }
  
  const reputationInCurrentLevel = totalReputation - currentLevelData.totalReputation;
  const reputationNeededForNextLevel = nextLevelData.reputationRequired;
  const reputationNeeded = reputationNeededForNextLevel - reputationInCurrentLevel;
  const progressPercent = (reputationInCurrentLevel / reputationNeededForNextLevel) * 100;
  
  return {
    currentLevel,
    nextLevel,
    reputationNeeded: Math.max(0, reputationNeeded),
    progressPercent: Math.min(100, Math.max(0, progressPercent))
  };
}

// Check if a feature is unlocked at current level
export function isFeatureUnlocked(currentLevel: number, feature: string): boolean {
  for (let i = 1; i <= currentLevel; i++) {
    const levelData = getLevelInfo(i);
    if (levelData && levelData.unlocks.includes(feature)) {
      return true;
    }
  }
  return false;
}

// Get all unlocked features for a level
export function getUnlockedFeatures(currentLevel: number): string[] {
  const unlockedFeatures: string[] = [];
  
  for (let i = 1; i <= currentLevel; i++) {
    const levelData = getLevelInfo(i);
    if (levelData) {
      unlockedFeatures.push(...levelData.unlocks);
    }
  }
  
  return [...new Set(unlockedFeatures)]; // Remove duplicates
}