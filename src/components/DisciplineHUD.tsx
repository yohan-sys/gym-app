import React, { useState, useEffect } from 'react';
import { UserStats, LeaderboardUser } from '../types';
import { 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Check, 
  Plus, 
  Trophy, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  X, 
  Flame, 
  Sliders, 
  RotateCcw,
  Play,
  Activity,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DisciplineHUDProps {
  stats: UserStats;
  leaderboard?: LeaderboardUser[];
  onQuickAddWater?: (amount: number) => void;
  onQuickAddProtein?: (proteinGrams: number, caloriesAmount: number) => void;
  onLogWorkout: () => void;
}

interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  muscle: string;
  cues: string;
}

interface PersonalBest {
  id: string;
  name: string;
  record: string;
  date: string;
}

export const DisciplineHUD: React.FC<DisciplineHUDProps> = ({
  stats,
  onLogWorkout
}) => {
  // Today's date formatting
  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // 1. TIME-CONSTRAINT TOGGLE STATE ('full' | 'short' | 'emergency')
  const [workoutMode, setWorkoutMode] = useState<'full' | 'short' | 'emergency'>('full');

  // Active workout timer & state
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  
  // Set completion tracker state per exercise
  const [completedSets, setCompletedSets] = useState<{ [exerciseId: string]: boolean[] }>({});

  // Expandable exercise accordion
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>('ex_1');

  // Post-Workout Feedback Drawer state
  const [showFeedbackDrawer, setShowFeedbackDrawer] = useState<boolean>(false);
  const [setsCompletedOption, setSetsCompletedOption] = useState<'Yes' | 'Modified' | 'No'>('Yes');
  const [difficultyRating, setDifficultyRating] = useState<number>(7);
  const [jointDiscomfort, setJointDiscomfort] = useState<'None' | 'Mild' | 'Severe'>('None');
  const [actualTimeMinutes, setActualTimeMinutes] = useState<number>(45);

  // Success confirmation notification banner
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // 2. PROGRESS TRACKING STATES
  // Weekly Consistency (e.g. 2 of 4 workouts completed)
  const [completedCountThisWeek, setCompletedCountThisWeek] = useState<number>(() => {
    const saved = localStorage.getItem('sovereignty_weekly_completed_count');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [weeklyDays, setWeeklyDays] = useState([
    { id: 1, dayName: 'MON', label: 'Lower Body', done: true },
    { id: 2, dayName: 'WED', label: 'Upper Body Core', done: true },
    { id: 3, dayName: 'FRI', label: 'Push/Pull Density', done: false },
    { id: 4, dayName: 'SAT', label: 'Full Body Mobility', done: false }
  ]);

  // Sync weekly days with completed count
  useEffect(() => {
    setWeeklyDays(prev => 
      prev.map((d, index) => ({
        ...d,
        done: index < completedCountThisWeek
      }))
    );
  }, [completedCountThisWeek]);

  // Personal Bests State
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>(() => {
    const saved = localStorage.getItem('sovereignty_personal_bests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse personal bests", e);
      }
    }
    return [
      { id: 'pb_1', name: 'Incline Dumbbell Press', record: '85 lbs x 8 reps', date: 'Jul 18, 2026' },
      { id: 'pb_2', name: 'Weighted Pull-Ups', record: '+35 lbs x 6 reps', date: 'Jul 20, 2026' },
      { id: 'pb_3', name: 'Barbell Overhead Press', record: '135 lbs x 5 reps', date: 'Jul 12, 2026' },
      { id: 'pb_4', name: 'Plank Hold', record: '3:00 mins', date: 'Jul 15, 2026' }
    ];
  });

  // Modal to add a new Personal Best
  const [showAddPbModal, setShowAddPbModal] = useState<boolean>(false);
  const [newPbName, setNewPbName] = useState<string>('');
  const [newPbRecord, setNewPbRecord] = useState<string>('');

  // Elapsed Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  // Sync mode with estimated actual duration default
  useEffect(() => {
    if (workoutMode === 'full') setActualTimeMinutes(45);
    else if (workoutMode === 'short') setActualTimeMinutes(25);
    else if (workoutMode === 'emergency') setActualTimeMinutes(10);
  }, [workoutMode]);

  // Format timer
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Workout data definitions by mode
  const workoutData = React.useMemo(() => {
    if (workoutMode === 'full') {
      return {
        focusTitle: 'Upper Body Core',
        badge: 'FULL PROTOCOL • 45 MINS',
        exercises: [
          {
            id: 'ex_1',
            name: 'Incline Dumbbell Bench Press',
            sets: 4,
            reps: '8 - 10 Reps',
            rest: '90s Rest',
            muscle: 'Upper Chest & Anterior Delts',
            cues: 'Maintain 3-second controlled eccentric descent. Pause 1s at stretch position before pressing.'
          },
          {
            id: 'ex_2',
            name: 'Weighted Pull-Ups / Heavy Lat Pulldowns',
            sets: 4,
            reps: '8 - 10 Reps',
            rest: '90s Rest',
            muscle: 'Latissimus Dorsi & Rhomboids',
            cues: 'Drive elbows straight down to ribcage. Squeeze lats hard at peak contraction.'
          },
          {
            id: 'ex_3',
            name: 'Standing Barbell Overhead Press',
            sets: 3,
            reps: '8 - 10 Reps',
            rest: '75s Rest',
            muscle: 'Anterior & Lateral Deltoids',
            cues: 'Brace glutes and abs tightly. Press vertical trajectory close to the chin.'
          },
          {
            id: 'ex_4',
            name: 'Dumbbell Incline Hammer Curls',
            sets: 3,
            reps: '12 - 15 Reps',
            rest: '60s Rest',
            muscle: 'Biceps Brachii & Brachialis',
            cues: 'Keep upper arms fixed against bench. Squeeze biceps forcefully at the top.'
          },
          {
            id: 'ex_5',
            name: 'Hanging Leg Raises & Core Hold',
            sets: 3,
            reps: '15 Reps / 45s',
            rest: '60s Rest',
            muscle: 'Rectus Abdominis & Obliques',
            cues: 'Curl pelvis upward without momentum. Squeeze abdominal wall at top.'
          }
        ] as ExerciseItem[]
      };
    } else if (workoutMode === 'short') {
      return {
        focusTitle: 'Upper Body Core (Tactical Short)',
        badge: 'TACTICAL SHORT • 25 MINS',
        exercises: [
          {
            id: 'ex_1',
            name: 'Incline Dumbbell Bench Press',
            sets: 4,
            reps: '8 - 10 Reps',
            rest: '75s Rest',
            muscle: 'Upper Chest & Shoulders',
            cues: 'High tension compound movement. Focus on steady, explosive pressing power.'
          },
          {
            id: 'ex_2',
            name: 'Weighted Pull-Ups / Lat Pulldowns',
            sets: 4,
            reps: '8 - 10 Reps',
            rest: '75s Rest',
            muscle: 'Back & Biceps',
            cues: 'Full extension at the top, pull chest to bar with strict control.'
          },
          {
            id: 'ex_3',
            name: 'Standing Barbell Overhead Press',
            sets: 3,
            reps: '8 - 10 Reps',
            rest: '60s Rest',
            muscle: 'Shoulders & Core Stability',
            cues: 'Strict press execution with minimal rest intervals to maximize density.'
          }
        ] as ExerciseItem[]
      };
    } else {
      return {
        focusTitle: 'Emergency AMRAP (Survival Mode)',
        badge: 'EMERGENCY AMRAP • 10 MINS',
        exercises: [
          {
            id: 'ex_1',
            name: 'Explosive Push-Ups / Dumbbell Floor Press',
            sets: 4,
            reps: '15 Reps / AMRAP',
            rest: '15s Rest',
            muscle: 'Chest, Shoulders & Triceps',
            cues: 'High-density density overload. Perform sets of 15 reps with brief 15s breathing pauses.'
          },
          {
            id: 'ex_2',
            name: 'Dumbbell Gorilla Rows / Inverted Rows',
            sets: 4,
            reps: '15 Reps / AMRAP',
            rest: '15s Rest',
            muscle: 'Upper Back, Lats & Grip',
            cues: 'Continuous alternating rows. Maintain flat back and braced core throughout.'
          }
        ] as ExerciseItem[]
      };
    }
  }, [workoutMode]);

  // Toggle set completion
  const handleToggleSet = (exerciseId: string, setIndex: number, totalSets: number) => {
    setCompletedSets(prev => {
      const current = prev[exerciseId] || new Array(totalSets).fill(false);
      const next = [...current];
      next[setIndex] = !next[setIndex];
      return { ...prev, [exerciseId]: next };
    });
  };

  // Start protocol
  const handleStartProtocol = () => {
    setIsWorkoutActive(true);
    setElapsedSeconds(0);
    setToastNotification("PROTOCOL INITIALIZED • Timer Active");
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Open Feedback Drawer on Complete Protocol
  const handleTriggerCompleteProtocol = () => {
    // Calculate actual elapsed minutes or default
    const calculatedMins = Math.max(1, Math.round(elapsedSeconds / 60)) || (
      workoutMode === 'full' ? 45 : (workoutMode === 'short' ? 25 : 10)
    );
    setActualTimeMinutes(calculatedMins);
    setShowFeedbackDrawer(true);
  };

  // Submit Post-Workout Feedback
  const handleSubmitFeedback = () => {
    // Save feedback payload
    const feedbackPayload = {
      timestamp: new Date().toISOString(),
      mode: workoutMode,
      setsCompleted: setsCompletedOption,
      difficulty: difficultyRating,
      jointDiscomfort,
      actualTimeMinutes
    };
    localStorage.setItem('sovereignty_last_workout_feedback', JSON.stringify(feedbackPayload));

    // Update weekly consistency count if < 4
    if (completedCountThisWeek < 4) {
      const nextCount = completedCountThisWeek + 1;
      setCompletedCountThisWeek(nextCount);
      localStorage.setItem('sovereignty_weekly_completed_count', nextCount.toString());
    }

    // Call parent handler
    onLogWorkout();

    // Reset active states
    setIsWorkoutActive(false);
    setElapsedSeconds(0);
    setShowFeedbackDrawer(false);

    // Trigger toast
    setToastNotification("PROTOCOL COMPLETED • Calibrating tomorrow's session!");
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Add Personal Best
  const handleAddPersonalBest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPbName.trim() || !newPbRecord.trim()) return;

    const newEntry: PersonalBest = {
      id: `pb_${Date.now()}`,
      name: newPbName.trim(),
      record: newPbRecord.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newEntry, ...personalBests];
    setPersonalBests(updated);
    localStorage.setItem('sovereignty_personal_bests', JSON.stringify(updated));

    setNewPbName('');
    setNewPbRecord('');
    setShowAddPbModal(false);

    setToastNotification("PERSONAL BEST LOGGED!");
    setTimeout(() => setToastNotification(null), 3000);
  };

  // Remove Personal Best
  const handleRemovePb = (id: string) => {
    const filtered = personalBests.filter(pb => pb.id !== id);
    setPersonalBests(filtered);
    localStorage.setItem('sovereignty_personal_bests', JSON.stringify(filtered));
  };

  // Rating labels helper
  const getDifficultyLabel = (val: number) => {
    if (val <= 3) return '1-3: Easy / Recovery';
    if (val <= 6) return '4-6: Moderate Stimulus';
    if (val <= 8) return '7-8: Optimal Challenge';
    return '9-10: Absolute Failure';
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-4 md:p-6 pb-32 max-w-4xl mx-auto space-y-6 font-sans relative">
      
      {/* Toast Banner Notification */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#00ff87] text-black px-5 py-2.5 rounded-full font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(0,255,135,0.6)] flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{toastNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TODAY'S HEADER */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00ff87] text-[10px] font-mono font-bold uppercase">
                <Calendar className="w-3 h-3" />
                <span>{todayDateString}</span>
              </span>
              {isWorkoutActive && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>SESSION ACTIVE ({formatTimer(elapsedSeconds)})</span>
                </span>
              )}
            </div>

            <h1 className="text-white font-bold uppercase tracking-widest text-xl md:text-2xl flex items-center gap-2">
              <span>TODAY'S WORKOUT:</span>
              <span className="text-[#00ff87] font-mono">{workoutData.focusTitle}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl font-bold">
              {workoutData.badge}
            </span>
          </div>
        </div>

        {/* TIME-CONSTRAINT TOGGLE (CRUCIAL FEATURE) */}
        <div className="pt-4 space-y-2">
          <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
            Select Time Constraint Protocol:
          </label>

          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-900">
            {/* Full Protocol */}
            <button
              type="button"
              disabled={isWorkoutActive}
              onClick={() => setWorkoutMode('full')}
              className={`py-3 px-2 rounded-xl text-center transition-all font-mono font-bold text-xs cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                workoutMode === 'full'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(0,255,135,0.4)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              } ${isWorkoutActive ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="uppercase text-[11px] block tracking-wide font-black">Full Protocol</span>
              <span className={`text-[9px] block ${workoutMode === 'full' ? 'text-slate-950 font-mono font-extrabold' : 'text-slate-500'}`}>
                45 mins • Complete
              </span>
            </button>

            {/* Tactical Short */}
            <button
              type="button"
              disabled={isWorkoutActive}
              onClick={() => setWorkoutMode('short')}
              className={`py-3 px-2 rounded-xl text-center transition-all font-mono font-bold text-xs cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                workoutMode === 'short'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(0,255,135,0.4)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              } ${isWorkoutActive ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="uppercase text-[11px] block tracking-wide font-black">Tactical Short</span>
              <span className={`text-[9px] block ${workoutMode === 'short' ? 'text-slate-950 font-mono font-extrabold' : 'text-slate-500'}`}>
                25 mins • Core Lifts
              </span>
            </button>

            {/* Emergency AMRAP */}
            <button
              type="button"
              disabled={isWorkoutActive}
              onClick={() => setWorkoutMode('emergency')}
              className={`py-3 px-2 rounded-xl text-center transition-all font-mono font-bold text-xs cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                workoutMode === 'emergency'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(0,255,135,0.4)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              } ${isWorkoutActive ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="uppercase text-[11px] block tracking-wide font-black">Emergency</span>
              <span className={`text-[9px] block ${workoutMode === 'emergency' ? 'text-slate-950 font-mono font-extrabold' : 'text-slate-500'}`}>
                10 mins • Survival AMRAP
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXERCISE LIST (EXPANDABLE ITEMS) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Target Exercises ({workoutData.exercises.length})</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            Click item to expand cues & track sets
          </span>
        </div>

        <div className="space-y-2.5">
          {workoutData.exercises.map((ex, idx) => {
            const isExpanded = expandedExerciseId === ex.id;
            const exSetsCompleted = completedSets[ex.id] || new Array(ex.sets).fill(false);
            const allSetsDone = exSetsCompleted.length === ex.sets && exSetsCompleted.every(Boolean);

            return (
              <div
                key={ex.id}
                className={`bg-black border rounded-2xl overflow-hidden transition-all ${
                  allSetsDone 
                    ? 'border-emerald-500/50 bg-emerald-950/10' 
                    : isExpanded 
                    ? 'border-emerald-500/40 shadow-lg shadow-emerald-950/20' 
                    : 'border-slate-900 hover:border-slate-800'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                  className="p-4 cursor-pointer flex items-center justify-between select-none"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                      allSetsDone
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {allSetsDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    <div>
                      <h3 className="text-sm font-mono font-black text-white flex items-center space-x-2">
                        <span>{ex.name}</span>
                        {allSetsDone && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            DONE
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Target: {ex.muscle}
                      </p>
                    </div>
                  </div>

                  {/* Badges for Sets, Reps, Rest */}
                  <div className="flex items-center space-x-2">
                    <div className="hidden sm:flex items-center space-x-1.5 font-mono text-[10px]">
                      <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-bold">
                        {ex.sets} Sets
                      </span>
                      <span className="bg-slate-900 border border-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg font-bold">
                        {ex.reps}
                      </span>
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {ex.rest}
                      </span>
                    </div>

                    <button className="text-slate-500 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Mobile Badges Row */}
                <div className="sm:hidden px-4 pb-3 flex items-center space-x-1.5 font-mono text-[9px]">
                  <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                    {ex.sets} Sets
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    {ex.reps}
                  </span>
                  <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-emerald-400" />
                    {ex.rest}
                  </span>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-900 p-4 bg-slate-950/80 space-y-3"
                    >
                      {/* Form Cues */}
                      <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
                        <span className="text-[9px] text-emerald-400 font-bold uppercase block tracking-wider">
                          EXECUTION CUES & FORM
                        </span>
                        <p className="leading-relaxed text-[11px] text-slate-300">
                          {ex.cues}
                        </p>
                      </div>

                      {/* Interactive Set Checklist */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                          CHECK OFF COMPLETED SETS:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Array.from({ length: ex.sets }).map((_, setIdx) => {
                            const isSetDone = exSetsCompleted[setIdx] || false;
                            return (
                              <button
                                key={setIdx}
                                type="button"
                                onClick={() => handleToggleSet(ex.id, setIdx, ex.sets)}
                                className={`p-2.5 rounded-xl border text-center font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                                  isSetDone
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_10px_rgba(0,255,135,0.3)]'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <span>Set {setIdx + 1}</span>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isSetDone ? 'bg-slate-950 text-emerald-400 border-slate-950' : 'border-slate-700'
                                }`}>
                                  {isSetDone && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PROGRESS TRACKING SECTION (NO SOCIAL/FAKES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Weekly Consistency Progress Bar */}
        <div className="bg-black border border-slate-900 p-5 rounded-3xl space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Weekly Consistency</span>
            </h3>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {completedCountThisWeek} of 4 Completed
            </span>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Maintain 4 weekly sessions to maintain peak neural conditioning.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-[#00ff87] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,255,135,0.5)]"
              style={{ width: `${(completedCountThisWeek / 4) * 100}%` }}
            ></div>
          </div>

          {/* Day badges */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {weeklyDays.map((day) => (
              <div
                key={day.id}
                className={`p-2 rounded-xl border text-center font-mono ${
                  day.done
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-950 border-slate-900 text-slate-600'
                }`}
              >
                <span className="text-[9px] font-black block">{day.dayName}</span>
                <span className="text-[8px] block opacity-80 truncate">{day.label}</span>
                <div className="mt-1 flex justify-center">
                  {day.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-800"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Bests Log */}
        <div className="bg-black border border-slate-900 p-5 rounded-3xl space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Personal Bests</span>
            </h3>

            <button
              type="button"
              onClick={() => setShowAddPbModal(true)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Log PB</span>
            </button>
          </div>

          {personalBests.length === 0 ? (
            <p className="text-xs text-slate-600 font-mono italic py-4 text-center">
              No personal records logged yet. Click "Log PB" above.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {personalBests.map((pb) => (
                <div
                  key={pb.id}
                  className="bg-slate-950 p-2.5 rounded-2xl border border-slate-900 flex items-center justify-between hover:border-slate-800 transition-all"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200 block">{pb.name}</span>
                    <span className="text-[9px] font-mono text-slate-500">{pb.date}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {pb.record}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePb(pb.id)}
                      className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                      title="Remove Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. MASSIVE GLOWING NEON-EMERALD BUTTON AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          {!isWorkoutActive ? (
            <button
              id="start-protocol-btn"
              type="button"
              onClick={handleStartProtocol}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#00ff87] via-emerald-400 to-[#00ff87] text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,255,135,0.5)] hover:shadow-[0_0_40px_rgba(0,255,135,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2 font-mono"
            >
              <Play className="w-5 h-5 fill-slate-950 stroke-none" />
              <span>START PROTOCOL ({workoutMode === 'full' ? '45 MINS' : (workoutMode === 'short' ? '25 MINS' : '10 MINS')})</span>
            </button>
          ) : (
            <button
              id="complete-protocol-btn"
              type="button"
              onClick={handleTriggerCompleteProtocol}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#00ff87] via-emerald-400 to-[#00ff87] text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_35px_rgba(0,255,135,0.6)] hover:shadow-[0_0_45px_rgba(0,255,135,0.8)] animate-pulse hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2 font-mono"
            >
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <span>COMPLETE PROTOCOL ({formatTimer(elapsedSeconds)})</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. POST-WORKOUT FEEDBACK DRAWER (SLIDE-UP MODAL) */}
      <AnimatePresence>
        {showFeedbackDrawer && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-xl bg-slate-950 border-2 border-emerald-500/60 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                    POST-WORKOUT CALIBRATION
                  </span>
                  <h3 className="text-base font-black text-white uppercase tracking-tight font-display">
                    PROTOCOL FEEDBACK
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFeedbackDrawer(false)}
                  className="text-slate-500 hover:text-white p-1.5 rounded-full hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4 Quick Calibration Questions */}
              <div className="space-y-5">
                
                {/* Q1: Did you complete all sets? */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider block">
                    1. Did you complete all sets?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Yes', 'Modified', 'No'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSetsCompletedOption(opt)}
                        className={`py-2.5 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer ${
                          setsCompletedOption === opt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {opt === 'Yes' ? 'Yes (All Sets)' : (opt === 'Modified' ? 'Modified Sets' : 'No (Cut Short)')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Overall Difficulty (1 - 10) */}
                <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider block">
                      2. Overall Difficulty (1 - 10)
                    </label>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {difficultyRating} / 10 • {getDifficultyLabel(difficultyRating)}
                    </span>
                  </div>

                  <div className="grid grid-cols-10 gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDifficultyRating(num)}
                        className={`py-2 rounded-lg border text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                          difficultyRating === num
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_8px_rgba(0,255,135,0.4)]'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Any joint discomfort? */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider block">
                    3. Any joint discomfort?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['None', 'Mild', 'Severe'] as const).map((disc) => (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => setJointDiscomfort(disc)}
                        className={`py-2.5 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer ${
                          jointDiscomfort === disc
                            ? (disc === 'Severe' 
                                ? 'bg-red-500 text-white border-red-500' 
                                : disc === 'Mild' 
                                ? 'bg-amber-500 text-slate-950 border-amber-500' 
                                : 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-[0_0_12px_rgba(0,255,135,0.3)]')
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {disc === 'None' ? 'None (Clear)' : (disc === 'Mild' ? 'Mild Tension' : 'Severe Pain')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4: Actual time to complete? */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider block">
                    4. Actual time to complete (Minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={actualTimeMinutes}
                      onChange={(e) => setActualTimeMinutes(parseInt(e.target.value) || 0)}
                      className="w-full text-xs bg-slate-900 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all font-mono font-bold"
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#00ff87] to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:scale-[1.01] transition-transform cursor-pointer font-mono"
                >
                  SUBMIT & CALIBRATE NEXT WORKOUT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ADD PERSONAL BEST MODAL */}
      <AnimatePresence>
        {showAddPbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>LOG PERSONAL BEST</span>
                </h3>

                <button
                  type="button"
                  onClick={() => setShowAddPbModal(false)}
                  className="text-slate-500 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPersonalBest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={newPbName}
                    onChange={(e) => setNewPbName(e.target.value)}
                    placeholder="e.g. Barbell Deadlift"
                    className="w-full text-xs bg-slate-900 text-slate-200 placeholder-slate-600 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                    Record Metric (Weight / Reps / Time)
                  </label>
                  <input
                    type="text"
                    value={newPbRecord}
                    onChange={(e) => setNewPbRecord(e.target.value)}
                    placeholder="e.g. 315 lbs x 5 reps"
                    className="w-full text-xs bg-slate-900 text-slate-200 placeholder-slate-600 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all font-mono"
                    required
                  />
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPbModal(false)}
                    className="w-1/3 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs py-2.5 rounded-xl uppercase font-mono font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs py-2.5 rounded-xl uppercase font-mono font-black tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
