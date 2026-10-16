export interface HabitDay {
  date: string; // ISO string or simple YYYY-MM-DD
  completed: boolean;
  intensity: 'none' | 'low' | 'medium' | 'high'; // color density for heat map
}

export interface UserStats {
  pseudonym: string;
  level: number;
  xp: number;
  xpTarget: number;
  streak: number;
  maxStreak: number;
  habitHistory: HabitDay[]; // For the fire/streak grid
  
  // Nutrition & Fitness
  targetCalories: number;
  consumedCalories: number;
  targetProtein: number;
  consumedProtein: number;
  targetWater: number; // in ml
  consumedWater: number; // in ml
}

export interface LeaderboardUser {
  rank: number;
  pseudonym: string;
  level: number;
  points: number;
  streak: number;
  isCurrentUser?: boolean;
  archetype?: 'The Biohacker' | 'The Corporate Monk' | 'The Comeback Parent' | 'The Chaos Lifter';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string; // HH:MM or ISO string
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  statsEffect?: {
    calories?: number;
    protein?: number;
    water?: number;
    xpGained?: number;
    streakUpdated?: boolean;
  };
}

export interface PresetFoodScan {
  name: string;
  calories: number;
  protein: number;
  water?: number;
  description: string;
  imageUrl: string;
  response: string;
}
