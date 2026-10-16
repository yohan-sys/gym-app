import { UserStats, LeaderboardUser, ChatMessage, PresetFoodScan } from './types';

export const INITIAL_USER_STATS: UserStats = {
  pseudonym: "Monk_01",
  level: 4,
  xp: 910,
  xpTarget: 1000,
  streak: 11,
  maxStreak: 15,
  habitHistory: [
    { date: "2026-05-20", completed: true, intensity: "high" },
    { date: "2026-05-21", completed: true, intensity: "high" },
    { date: "2026-05-22", completed: true, intensity: "medium" },
    { date: "2026-05-23", completed: true, intensity: "high" },
    { date: "2026-05-24", completed: false, intensity: "none" },
    { date: "2026-05-25", completed: true, intensity: "low" },
    { date: "2026-05-26", completed: true, intensity: "high" },
    { date: "2026-05-27", completed: true, intensity: "medium" },
    { date: "2026-05-28", completed: true, intensity: "high" },
    { date: "2026-05-29", completed: true, intensity: "high" },
    { date: "2026-05-30", completed: true, intensity: "high" },
    { date: "2026-05-31", completed: true, intensity: "medium" },
    { date: "2026-06-01", completed: true, intensity: "high" },
    { date: "2026-06-02", completed: true, intensity: "high" },
    { date: "2026-06-03", completed: false, intensity: "none" }, // Current day starts incomplete, coach chat can complete it!
  ],
  targetCalories: 2600,
  consumedCalories: 1650,
  targetProtein: 160,
  consumedProtein: 95,
  targetWater: 3200, // ml
  consumedWater: 1800, // ml
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, pseudonym: "Sovereign_Vanguard", level: 5, points: 4210, streak: 28, archetype: "The Biohacker" },
  { rank: 2, pseudonym: "Iron_Matriarch", level: 4, points: 3990, streak: 25, archetype: "The Comeback Parent" },
  { rank: 3, pseudonym: "Monk_01", level: 4, points: 3910, streak: 11, isCurrentUser: true },
  { rank: 4, pseudonym: "Apex_Executive", level: 4, points: 3850, streak: 22, archetype: "The Biohacker" },
  { rank: 5, pseudonym: "Zen_Split_77", level: 4, points: 3620, streak: 21, archetype: "The Biohacker" },
  { rank: 6, pseudonym: "Sigma_Lift", level: 4, points: 3400, streak: 18, archetype: "The Corporate Monk" },
  { rank: 7, pseudonym: "Keto_Kratos", level: 4, points: 3120, streak: 19, archetype: "The Biohacker" },
  { rank: 8, pseudonym: "Chaos_Deficit", level: 3, points: 2980, streak: 3, archetype: "The Chaos Lifter" },
  { rank: 9, pseudonym: "Deep_Work_Out", level: 3, points: 2890, streak: 12, archetype: "The Corporate Monk" },
  { rank: 10, pseudonym: "5AM_Mat_Club", level: 3, points: 2670, streak: 15, archetype: "The Comeback Parent" },
  { rank: 11, pseudonym: "PR_Or_Bust", level: 3, points: 2540, streak: 1, archetype: "The Chaos Lifter" },
  { rank: 12, pseudonym: "Glitch_Physique", level: 3, points: 2450, streak: 14, archetype: "The Biohacker" },
  { rank: 13, pseudonym: "Null_Pointer_Fly", level: 3, points: 2340, streak: 13, archetype: "The Corporate Monk" },
  { rank: 14, pseudonym: "Resilient_Dad", level: 3, points: 2230, streak: 11, archetype: "The Comeback Parent" },
  { rank: 15, pseudonym: "Delta_Runner", level: 3, points: 2150, streak: 10, archetype: "The Biohacker" },
  { rank: 16, pseudonym: "Desk_Bound_Beast", level: 3, points: 2110, streak: 9, archetype: "The Corporate Monk" },
  { rank: 17, pseudonym: "Latte_Lifter", level: 2, points: 1920, streak: 4, archetype: "The Chaos Lifter" },
  { rank: 18, pseudonym: "Pacing_Mom", level: 2, points: 1810, streak: 8, archetype: "The Comeback Parent" },
  { rank: 19, pseudonym: "Quarterly_Gains", level: 2, points: 1750, streak: 7, archetype: "The Corporate Monk" },
  { rank: 20, pseudonym: "Fast_And_Furious", level: 2, points: 1600, streak: 2, archetype: "The Chaos Lifter" },
  { rank: 21, pseudonym: "Macro_Hawk", level: 2, points: 1490, streak: 6, archetype: "The Corporate Monk" },
  { rank: 22, pseudonym: "Midnight_Reps", level: 2, points: 1420, streak: 6, archetype: "The Comeback Parent" },
  { rank: 23, pseudonym: "Code_And_Iron", level: 2, points: 1200, streak: 5, archetype: "The Corporate Monk" },
  { rank: 24, pseudonym: "Iron_Legacy", level: 2, points: 1110, streak: 4, archetype: "The Comeback Parent" },
  { rank: 25, pseudonym: "Velo_Viking", level: 1, points: 920, streak: 1, archetype: "The Chaos Lifter" },
  { rank: 26, pseudonym: "Overdrive_99", level: 1, points: 850, streak: 0, archetype: "The Chaos Lifter" },
];

export const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "m0",
    role: "assistant",
    text: "Sovereignty Protocol initiated. I am your Sovereign Coach. I do not deal in quick-fixes, soft excuses, or temporary motivation. I deal in absolute, unyielding accountability.",
    timestamp: "08:00 AM",
  },
  {
    id: "m1",
    role: "user",
    text: "Trained fasted heavy squats this morning and finished 1.5 liters of mineral water.",
    timestamp: "08:15 AM",
  },
  {
    id: "m2",
    role: "assistant",
    text: "Excellent. Heavy spinal loading fasted triggers prime growth hormone response and mental grit. Hydration is logged. Fuel clean today, Monk_01. Maintain the discipline.",
    timestamp: "08:16 AM",
    statsEffect: {
      water: 1500,
      xpGained: 50,
    }
  },
  {
    id: "m3",
    role: "user",
    text: "Just completed lunch. Logged grilled chicken breast with organic steam avocado and brown rice.",
    timestamp: "01:30 PM",
  },
  {
    id: "m4",
    role: "assistant",
    text: "Scanning nutritional intake: Grilled Chicken Breast (50g protein) + Avocado + Rice. Logged approximately 650 kcal, 55g protein, clean healthy fats. Your energy levels are sustained. Keep driving.",
    timestamp: "01:32 PM",
    statsEffect: {
      calories: 650,
      protein: 55,
      xpGained: 40,
    }
  },
];

// Preset meal options for simulation
export const PRESET_FOOD_SCANS: PresetFoodScan[] = [
  {
    name: "Seared Premium Salmon Bowl",
    calories: 720,
    protein: 42,
    description: "Cold-water seared salmon, wild rice, sesame greens, broccoli, light tamari dressing.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    response: "DIETARY SCAN: High-density Omega-3 Salmon Bowl detected. Salmon provides essential polyunsaturated fats that downregulate arterial inflammation. Wild rice provides premium low-glycemic fuel. Logging: +720 Calories, +42g Protein. Extreme execution, Monk_01."
  },
  {
    name: "Grass-Fed Double Beef Burger",
    calories: 880,
    protein: 55,
    description: "Double grass-fed patties, organic cheddar, brioche bun, organic heirloom tomato.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    response: "DIETARY SCAN: Heavy Satiety Burger processed. Clean pasture-raised ground beef provides crucial zinc, creatine, and high-bioavailability protein. High calorie count makes this ideal for post-workout hypertrophy. Logging: +880 Calories, +55g Protein. Earn standard caloric load through physical output."
  },
  {
    name: "Elite Performance Protein Shake",
    calories: 320,
    protein: 40,
    water: 400,
    description: "2 scoops grass-fed whey isolate, unsweetened almond milk, organic chia seed.",
    imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80",
    response: "DIETARY SCAN: Hyper-recovery shake. Fast-acting whey isolate optimized for instant nitrogen balance restoration. Chia provides key fiber and electrolyte bounds. Logging: +320 Calories, +40g Protein, +400ml Hydration."
  },
  {
    name: "Greek Yogurt & Wild Berry Shield",
    calories: 280,
    protein: 24,
    description: "Thick unsweetened Greek yogurt, hand-picked wild blackberries, raw honey drizzle.",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    response: "DIETARY SCAN: Prebiotic Active Yogurt. Casein and whey distribution offers sustained amino release. Antioxidants from wild berries protect against active workout oxidation. Logging: +280 Calories, +24g Protein. Superb micro-profile."
  }
];

export const GENERAL_COACH_RESPONSES = [
  {
    keywords: ["water", "drink", "hydrated", "sip", "fluid"],
    text: "HYDRO PROTOCOL: Water molecule integration verified. Maintaining high intracellular hydration maximizes your muscular output, ATP cycle recovery, and cognitive focus. Logging +500ml pure water and updating your status grid.",
    effect: { water: 500, xpGained: 20 }
  },
  {
    keywords: ["run", "cardio", "jog", "sprint", "cycle", "hill"],
    text: "AEROBIC ENGINE ACTIVATED: Sprints or zone 2 aerobic conditioning triggers cardiovascular efficiency, oxygen blood volume, and elite lipid utilization. Logging standard activity reward. Habit streak fortified. Keep building that grit.",
    effect: { calories: -300, xpGained: 50, streakUpdated: true }
  },
  {
    keywords: ["lift", "weight", "gym", "squat", "bench", "deadlift", "pushup", "pullup", "workout"],
    text: "MECHANICAL TENSION LOGGED: Resistance stimulus triggers myofibrillar protein synthesis. Ensure protein thresholds are strictly met tonight to reconstruct micro-tears. Logging effort. Streak integrity updated.",
    effect: { calories: -400, xpGained: 60, streakUpdated: true }
  },
  {
    keywords: ["chicken", "steak", "egg", "meat", "protein", "tuna", "turkey"],
    text: "ANABOLIC NITROGEN logged: High bioavailability complete protein ingested. Leucine pool saturated. Excellent for skeletal tissue adaptation and recovery. Logging +30g protein, +350 Calories.",
    effect: { protein: 30, calories: 350, xpGained: 30 }
  },
  {
    keywords: ["fasting", "fast", "black coffee", "hunger", "willpower"],
    text: "AUTOPHAGY CYCLE LOGGED: Intentional caloric deprival triggers cellular recycling, high-focus growth-hormone spikes, and supreme self-sovereignty. Respect the void. Logging standard discipline reward.",
    effect: { xpGained: 40, streakUpdated: true }
  },
  {
    keywords: ["sleep", "asleep", "circadian", "bed"],
    text: "RESTORATION WINDOW: Optimizing your 8-hour circadian rhythm is the single highest leverage performance protocol. Ensure complete dark state, zero blue light, and cool air temperature. Logging standard sleep compliance standard.",
    effect: { xpGained: 25 }
  },
  {
    keywords: ["cheat", "pizza", "cookie", "cake", "ice cream", "beer", "sugar"],
    text: "DEVIATION DETECTED: Refined carbs/processed sugar trigger hyperinsulinemia spikes and downregulate dopamine cell receptors. Do not panic, but you must redeem this metabolic tax. Logging extra training load. Go execute 100 burpees.",
    effect: { calories: 500, xpGained: 10 }
  }
];

export const DEFAULT_FALLBACK_RESPONSES = [
  "Message processed. Your Sovereign Coach reminds you: Every action is a vote for who you are. No standard is too high. If you logged physical training, state the layout.",
  "Understood. Ensure your total caloric deficit/surplus is aligned with current hypertrophy or fat-burning regimes. Avoid soft choices.",
  "Commitment registered. Habit state audited. Keep building, Monk_01. True growth is boring and requires hyper-repetition of clean, elite habits.",
  "Data logged. Your daily targets are dynamic. Feed the metabolic fire with organic sources. Filter out industrial sugars.",
];
