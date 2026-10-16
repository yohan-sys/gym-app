import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  Dumbbell, 
  Zap, 
  ChevronRight, 
  Check, 
  Lock, 
  Mail,
  AlertTriangle,
  Flame,
  Clock,
  Calendar,
  MapPin,
  Moon,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface OnboardingPaywallProps {
  onComplete: (onboardingData: {
    pseudonym: string;
    trainingArsenal: 'Full Commercial Gym' | 'Home Dumbbells Only' | 'Bodyweight Only';
    injuries: string;
  }) => void;
  startAtQuiz?: boolean;
}

export const OnboardingPaywall: React.FC<OnboardingPaywallProps> = ({ onComplete, startAtQuiz = false }) => {
  // Phase of onboarding: 'splash' | 'quiz' | 'processing_loading' | 'paywall'
  const [phase, setPhase] = useState<'splash' | 'quiz' | 'processing_loading' | 'paywall'>(() => {
    return startAtQuiz ? 'quiz' : 'splash';
  });
  
  useEffect(() => {
    if (startAtQuiz) {
      setPhase('quiz');
    }
  }, [startAtQuiz]);
  
  // Quiz steps: 1 (Target & Experience), 2 (Schedule Constraints), 3 (Logistics & Equipment), 4 (Limitations), 5 (Recovery Baseline), 6 (Email & Secure)
  const [quizStep, setQuizStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  
  // STEP 1: THE TARGET & EXPERIENCE
  const [pseudonym, setPseudonym] = useState('Sovereign_Executive');
  const [primaryGoal, setPrimaryGoal] = useState<'Fat Loss' | 'Strength & Muscle' | 'General Fitness'>('Fat Loss');
  const [trainingExperience, setTrainingExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [ageRange, setAgeRange] = useState<'25-34' | '35-44' | '45-54' | '55+'>('35-44');

  // STEP 2: THE SCHEDULE CONSTRAINTS
  const [daysAvailablePerWeek, setDaysAvailablePerWeek] = useState<number>(4);
  const [sessionDuration, setSessionDuration] = useState<'30 mins' | '45 mins' | '60 mins'>('45 mins');

  // STEP 3: LOGISTICS & EQUIPMENT
  const [trainingLocation, setTrainingLocation] = useState<'Home' | 'Commercial Gym' | 'Traveling/Hotels'>('Commercial Gym');
  const [equipmentAvailable, setEquipmentAvailable] = useState<string[]>(['Full Gym']);

  // STEP 4: MOVEMENT LIMITATIONS
  const [movementLimitations, setMovementLimitations] = useState<string[]>(['None']);

  // STEP 5: RECOVERY BASELINE
  const [typicalSleep, setTypicalSleep] = useState<'< 6 hours' | '6-7 hours' | '8+ hours'>('6-7 hours');
  const [activityLevel, setActivityLevel] = useState<'Sedentary (Desk job)' | 'Lightly Active' | 'Highly Active'>('Sedentary (Desk job)');

  // STEP 6: EMAIL CAPTURE
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Terminal loading log sequence
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);

  // Form errors
  const [pNameError, setPNameError] = useState('');

  // Auto formats pseudonym
  const handlePseudonymChange = (val: string) => {
    const formatted = val
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    
    setPseudonym(formatted);
    if (formatted.length >= 3) {
      setPNameError('');
    }
  };

  const generateRandomPseudonym = () => {
    const prefixes = ['Executive', 'Apex', 'Sovereign', 'Ronin', 'Vanguard', 'Sigma', 'Cyber', 'Iron', 'Zen', 'Vector'];
    const suffixes = ['Leader', 'Grit', 'Protocol', 'Kratos', 'Monk', 'Alpha', 'Pro', 'Core', 'Striker', 'Titan'];
    const randomNum = Math.floor(Math.random() * 90) + 10;
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    setPseudonym(`${randomPrefix}_${randomSuffix}_${randomNum}`);
    setPNameError('');
  };

  // Redirect to Stripe checkout matching plans
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  // Toggle equipment selection
  const handleToggleEquipment = (item: string) => {
    setEquipmentAvailable(prev => {
      if (prev.includes(item)) {
        const next = prev.filter(e => e !== item);
        return next.length === 0 ? ['Bodyweight'] : next;
      } else {
        return [...prev, item];
      }
    });
  };

  // Toggle movement limitations
  const handleToggleLimitations = (limitation: string) => {
    if (limitation === 'None') {
      setMovementLimitations(['None']);
    } else {
      setMovementLimitations(prev => {
        const filtered = prev.filter(i => i !== 'None');
        if (filtered.includes(limitation)) {
          const next = filtered.filter(i => i !== limitation);
          return next.length === 0 ? ['None'] : next;
        } else {
          return [...filtered, limitation];
        }
      });
    }
  };

  // Onboarding quiz step navigation
  const handleQuizNext = () => {
    if (quizStep === 1) {
      if (pseudonym.trim().length < 3) {
        setPNameError('Pseudonym must be at least 3 characters.');
        return;
      }
      setPNameError('');
      setQuizStep(2);
    } else if (quizStep === 2) {
      setQuizStep(3);
    } else if (quizStep === 3) {
      setQuizStep(4);
    } else if (quizStep === 4) {
      setQuizStep(5);
    } else if (quizStep === 5) {
      setQuizStep(6);
    } else if (quizStep === 6) {
      handleEmailSubmit();
    }
  };

  // Step 6: Email Submission & Start Processing Illusion
  const handleEmailSubmit = () => {
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    // Save detailed payload to 'sovereignty_user_profile' in localStorage
    const profilePayload = {
      pseudonym: pseudonym.trim() || 'Sovereign_Executive',
      email: email.trim(),
      primaryGoal,
      trainingExperience,
      ageRange,
      daysAvailablePerWeek,
      sessionDuration,
      trainingLocation,
      equipmentAvailable,
      movementLimitations,
      typicalSleep,
      activityLevel,
      // Compatibility mappings for downstream modules
      trainingSetting: trainingLocation === 'Commercial Gym' ? 'Full Commercial Gym' : (trainingLocation === 'Home' ? 'Home Dumbbells Only' : 'Bodyweight Only'),
      timeAllocation: sessionDuration === '30 mins' ? '30m' : (sessionDuration === '45 mins' ? '45m' : '60m'),
      injuries: movementLimitations,
      primaryDirective: primaryGoal === 'Fat Loss' ? 'Aggressive Deficit' : (primaryGoal === 'Strength & Muscle' ? 'Absolute Hypertrophy' : 'Tactical Recomposition'),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sovereignty_user_profile', JSON.stringify(profilePayload));

    // Execute silent webhook trigger
    try {
      fetch('https://hook.us1.make.com/YOUR_WEBHOOK_ID_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      }).catch(err => {
        console.warn('Abandoned cart webhook silent error:', err);
      });
    } catch (err) {
      console.warn('Abandoned cart webhook silent catch:', err);
    }

    // Transition to 4-second Terminal Processing Screen
    setPhase('processing_loading');
    setProcessingLogs([]);

    // Sequential 4-second animation sequence
    setTimeout(() => {
      setProcessingLogs(prev => [...prev, "> Analyzing schedule constraints... [OK]"]);
    }, 500);

    setTimeout(() => {
      setProcessingLogs(prev => [...prev, "> Mapping equipment... [OK]"]);
    }, 2000);

    setTimeout(() => {
      setProcessingLogs(prev => [...prev, "> Generating adaptive protocol... [IN PROGRESS]"]);
    }, 3200);

    // After 4 seconds, reveal the Single Tier Paywall Gateway
    setTimeout(() => {
      setPhase('paywall');
    }, 4000);
  };

  // Teaser values for background preview
  const teaserCal = primaryGoal === 'Fat Loss' ? 2100 : (primaryGoal === 'Strength & Muscle' ? 2600 : 2350);
  const teaserProtein = primaryGoal === 'Strength & Muscle' ? 190 : 175;

  if (phase === 'splash') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-gray-300 font-sans">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          
          {/* Premium Constrained Logo */}
          <div className="w-32 h-32 mb-8 relative">
             <img
               src="/logo.png"
               alt="Sovereignty Logo"
               className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(0,255,135,0.4)]"
             />
          </div>

          {/* Tactical Typography */}
          <h2 className="text-[#00ff87] text-sm font-bold tracking-[0.2em] mb-2 uppercase">
            Sovereignty Executive Fitness Protocol
          </h2>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wider mb-6 uppercase">
            Deep Calibration Wizard
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            A grounded, high-utility protocol designed for busy professionals. Calibrate your schedule constraints, available equipment, and movement flags in under 2 minutes.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 w-full sm:w-auto">
            <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-lg text-sm text-gray-300 shadow-lg">
              <span className="text-[#00ff87]">🗓️</span> Schedule Adaptation
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-lg text-sm text-gray-300 shadow-lg">
              <span className="text-[#00ff87]">🛠️</span> Equipment Matching
            </div>
            <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-lg text-sm text-gray-300 shadow-lg">
              <span className="text-[#00ff87]">🛡️</span> Joint Safeguards
            </div>
          </div>

          {/* The Neon CTA Button */}
          <button
            onClick={() => {
              setPhase('quiz');
              setQuizStep(1);
            }}
            className="bg-[#00ff87] text-black font-extrabold text-lg uppercase px-12 py-5 rounded-md tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:shadow-[0_0_35px_rgba(0,255,135,0.7)] hover:scale-105 hover:bg-[#10ff95] w-full sm:w-auto cursor-pointer"
          >
            Initiate Deep Calibration
          </button>

          <p className="mt-8 text-xs text-gray-500 tracking-widest uppercase">
            Takes &lt; 120 seconds • Practical & Adaptive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="onboarding-paywall-wrapper" className="min-h-screen bg-black text-gray-300 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Visual cyber mesh background */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/10 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(18,24,38,1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0"></div>

      {/* SPECIAL SCREEN: 4-SECOND PURE BLACK TERMINAL PROCESSING ILLUSION */}
      {phase === 'processing_loading' && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-gray-300">
          <div className="text-center space-y-6 max-w-md w-full">
            <div className="flex justify-center max-w-[100px] mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
              <img
                src="/logo.png"
                alt="Sovereignty Shield Logo"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-w-[100px] object-contain drop-shadow-[0_0_20px_rgba(0,255,135,0.6)] animate-pulse relative z-10"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-white font-bold uppercase tracking-widest text-sm">
                COMPILING ADAPTIVE PROTOCOL
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">
                Sovereignty Schedule & Equipment Calibration
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 font-mono text-left text-xs space-y-2 h-36 flex flex-col justify-center shadow-2xl">
              {processingLogs.map((log, idx) => (
                <p key={idx} className={`text-emerald-400 font-mono text-[11px] tracking-wide flex items-center ${idx === processingLogs.length - 1 ? 'animate-pulse' : ''}`}>
                  {log}
                </p>
              ))}
              {processingLogs.length === 0 && (
                <p className="text-slate-600 italic text-[11px] animate-pulse">&gt; INITIALIZING PARAMETERS...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER FOR SPLASH, QUIZ AND PAYWALL */}
      {phase !== 'processing_loading' && (
        <div 
          id="onboarding-paywall-card" 
          className={
            phase === 'quiz'
              ? "w-full max-w-3xl mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm mt-12"
              : `w-full transition-all duration-300 ${
                  phase === 'paywall' ? 'max-w-5xl' : 'max-w-xl'
                } bg-black border border-slate-800 rounded-3xl p-6 shadow-2xl relative z-10 backdrop-blur-md overflow-hidden`
          }
        >
          <AnimatePresence mode="wait">
            
            {/* PHASE 2: DEEP CALIBRATION WIZARD (STEPS 1 - 6) */}
            {phase === 'quiz' && (
              <motion.div
                key="quiz-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Step Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div className="text-[#00ff87] text-sm font-bold tracking-[0.2em] uppercase">
                    STEP {quizStep} OF 6: {
                      quizStep === 1 ? 'TARGET & EXPERIENCE' :
                      quizStep === 2 ? 'SCHEDULE CONSTRAINTS' :
                      quizStep === 3 ? 'LOGISTICS & EQUIPMENT' :
                      quizStep === 4 ? 'MOVEMENT LIMITATIONS' :
                      quizStep === 5 ? 'RECOVERY BASELINE' :
                      'PROFILE SECURITY'
                    }
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5, 6].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          quizStep === step
                            ? 'w-6 bg-[#00ff87] shadow-[0_0_10px_rgba(0,255,135,0.7)]'
                            : quizStep > step
                            ? 'w-2.5 bg-[#00ff87]/50'
                            : 'w-2.5 bg-slate-900 border border-slate-800'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Step content */}
                <div className="min-h-[290px]">
                  
                  {/* STEP 1: THE TARGET & EXPERIENCE */}
                  {quizStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      {/* Pseudonym Handle */}
                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">
                          Executive Handle / Pseudonym
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={pseudonym}
                            onChange={(e) => handlePseudonymChange(e.target.value)}
                            placeholder="e.g. Sovereign_Executive"
                            maxLength={22}
                            className="w-full bg-black border border-slate-700 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] transition-all font-mono uppercase"
                          />
                          <button
                            type="button"
                            onClick={generateRandomPseudonym}
                            className="bg-slate-800 text-gray-300 px-4 py-4 rounded-lg text-sm font-bold hover:text-white hover:bg-slate-700 transition-colors ml-2 cursor-pointer shrink-0"
                          >
                            RANDOM
                          </button>
                        </div>
                        {pNameError && (
                          <p className="text-[10px] font-mono text-red-400 flex items-center mt-2">
                            <AlertTriangle className="w-3 h-3 text-red-500 mr-1 shrink-0" />
                            {pNameError}
                          </p>
                        )}
                      </div>

                      {/* Primary Goal */}
                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Primary Goal
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'Fat Loss', title: 'Fat Loss', desc: 'Accelerated lipid deficit & tone' },
                            { id: 'Strength & Muscle', title: 'Strength & Muscle', desc: 'Mechanical hypertrophy & power' },
                            { id: 'General Fitness', title: 'General Fitness', desc: 'Longevity, mobility & endurance' }
                          ].map((item) => {
                            const isSelected = primaryGoal === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setPrimaryGoal(item.id as any)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{item.title}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{item.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Training Experience */}
                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Training Experience
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'Beginner', title: 'Beginner', desc: '< 1 Yr' },
                            { id: 'Intermediate', title: 'Intermediate', desc: '1 - 3 Yrs' },
                            { id: 'Advanced', title: 'Advanced', desc: '3+ Yrs' }
                          ].map((item) => {
                            const isSelected = trainingExperience === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setTrainingExperience(item.id as any)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{item.title}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{item.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Age Range */}
                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Age Bracket Range
                        </label>
                        <select
                          value={ageRange}
                          onChange={(e) => setAgeRange(e.target.value as any)}
                          className="w-full bg-black border border-slate-700 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] transition-all cursor-pointer"
                        >
                          <option value="25-34">25 - 34 Years</option>
                          <option value="35-44">35 - 44 Years</option>
                          <option value="45-54">45 - 54 Years</option>
                          <option value="55+">55+ Years</option>
                        </select>
                      </div>

                    </div>
                  )}

                  {/* STEP 2: THE SCHEDULE CONSTRAINTS */}
                  {quizStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block">
                            Days Available Per Week
                          </label>
                          <span className="text-xs font-mono font-black text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/20 px-2.5 py-0.5 rounded-full">
                            {daysAvailablePerWeek} DAYS / WEEK
                          </span>
                        </div>
                        
                        <input
                          type="range"
                          min="2"
                          max="6"
                          step="1"
                          value={daysAvailablePerWeek}
                          onChange={(e) => setDaysAvailablePerWeek(parseInt(e.target.value))}
                          className="w-full accent-[#00ff87] bg-black h-2 rounded-lg cursor-pointer mb-4"
                        />

                        <div className="grid grid-cols-5 gap-2">
                          {[2, 3, 4, 5, 6].map((num) => {
                            const isSelected = daysAvailablePerWeek === num;
                            return (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setDaysAvailablePerWeek(num)}
                                className={`bg-black border rounded-xl p-3 text-center cursor-pointer hover:border-slate-500 transition-all font-bold text-sm ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] text-[#00ff87]'
                                    : 'border-slate-700 text-gray-400'
                                }`}
                              >
                                {num} Days
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Normal Session Duration Target
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(['30 mins', '45 mins', '60 mins'] as const).map((dur) => {
                            const isSelected = sessionDuration === dur;
                            return (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => setSessionDuration(dur)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{dur}</span>
                                <span className="text-xs text-gray-500 mt-1 block">Target duration</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 3: LOGISTICS & EQUIPMENT */}
                  {quizStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">
                          Primary Training Location
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'Home', title: 'Home', desc: 'Home setup' },
                            { id: 'Commercial Gym', title: 'Commercial Gym', desc: 'Full facility' },
                            { id: 'Traveling/Hotels', title: 'Traveling / Hotels', desc: 'On the road' }
                          ].map((item) => {
                            const isSelected = trainingLocation === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setTrainingLocation(item.id as any)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{item.title}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{item.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3 mt-8">
                          <label className="text-gray-400 text-xs font-bold uppercase tracking-widest block">
                            Equipment Available (Multi-Select)
                          </label>
                          <span className="text-xs text-gray-500 uppercase font-mono">Select all that apply</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { id: 'Full Gym', title: 'Full Gym Cages' },
                            { id: 'Dumbbells Only', title: 'Dumbbells' },
                            { id: 'Kettlebells', title: 'Kettlebells' },
                            { id: 'Bodyweight', title: 'Bodyweight' },
                            { id: 'Bands', title: 'Resistance Bands' }
                          ].map((eq) => {
                            const isSelected = equipmentAvailable.includes(eq.id);
                            return (
                              <button
                                key={eq.id}
                                type="button"
                                onClick={() => handleToggleEquipment(eq.id)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{eq.title}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{isSelected ? 'Selected' : 'Click to select'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 4: MOVEMENT LIMITATIONS */}
                  {quizStep === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs font-sans leading-relaxed">
                          We do not diagnose injuries. Please select any areas requiring caution during exercise selection.
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Areas Requiring Caution (Select All That Apply)
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { id: 'Shoulders', label: 'Shoulders' },
                            { id: 'Knees', label: 'Knees' },
                            { id: 'Lower Back', label: 'Lower Back' },
                            { id: 'Wrists', label: 'Wrists' },
                            { id: 'None', label: 'None (Clear)' }
                          ].map((lim) => {
                            const isSelected = movementLimitations.includes(lim.id);
                            return (
                              <button
                                key={lim.id}
                                type="button"
                                onClick={() => handleToggleLimitations(lim.id)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{lim.label}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{isSelected ? 'Caution Flagged' : 'Normal'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 5: RECOVERY BASELINE */}
                  {quizStep === 5 && (
                    <div className="space-y-4 animate-fadeIn">
                      
                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">
                          Typical Sleep Recovery
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(['< 6 hours', '6-7 hours', '8+ hours'] as const).map((sleep) => {
                            const isSelected = typicalSleep === sleep;
                            return (
                              <button
                                key={sleep}
                                type="button"
                                onClick={() => setTypicalSleep(sleep)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{sleep}</span>
                                <span className="text-xs text-gray-500 mt-1 block">Nightly recovery</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Daily Activity Level (Outside Gym)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'Sedentary (Desk job)', title: 'Sedentary', desc: 'Desk job / Mostly seated' },
                            { id: 'Lightly Active', title: 'Lightly Active', desc: 'Standing / Walking daily' },
                            { id: 'Highly Active', title: 'Highly Active', desc: 'Physical work / Constant motion' }
                          ].map((act) => {
                            const isSelected = activityLevel === act.id;
                            return (
                              <button
                                key={act.id}
                                type="button"
                                onClick={() => setActivityLevel(act.id as any)}
                                className={`bg-black border rounded-xl p-4 text-left cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-center ${
                                  isSelected
                                    ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                                    : 'border-slate-700'
                                }`}
                              >
                                <span className="text-white font-bold block">{act.title}</span>
                                <span className="text-xs text-gray-500 mt-1 block">{act.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 6: PROFILE SECURITY & EMAIL CAPTURE */}
                  {quizStep === 6 && (
                    <div className="space-y-5 animate-fadeIn py-2">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
                          <Mail className="w-6 h-6 text-[#00ff87]" />
                        </div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">
                          SECURE YOUR PROFILE
                        </h3>
                        <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed font-sans">
                          Enter your email to secure your profile and generate your adaptive protocol.
                        </p>
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block mt-8">
                          Professional Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (e.target.value.includes('@')) setEmailError('');
                          }}
                          placeholder="executive@company.com"
                          className="w-full bg-black border border-slate-700 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87] transition-all"
                        />
                        {emailError ? (
                          <p className="text-[10px] font-mono text-red-400 flex items-center pt-1">
                            <AlertTriangle className="w-3 h-3 text-red-500 mr-1 shrink-0" />
                            {emailError}
                          </p>
                        ) : (
                          <p className="text-[10px] font-mono text-gray-500 mt-1">
                            *Your adaptive protocol matrix will be permanently linked to this email address.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Navigation (Cancel & Next) */}
                <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-800">
                  {quizStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setQuizStep((prev) => (prev - 1) as any)}
                      className="text-gray-500 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPhase('splash')}
                      className="text-gray-500 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleQuizNext}
                    className="bg-[#00ff87] text-black font-extrabold text-sm uppercase px-8 py-4 rounded-md tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:shadow-[0_0_25px_rgba(0,255,135,0.6)] hover:scale-105 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{quizStep === 6 ? 'GENERATE ADAPTIVE PROTOCOL' : 'NEXT PARAMETERS'}</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PHASE 3: SINGLE OFFERING PAYWALL ($15/MO FOUNDING BETA PROTOCOL) */}
            {phase === 'paywall' && (
              <motion.div
                key="paywall-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative space-y-6"
              >
                {/* BLURRED BACKGROUND OF TODAY SCREEN DASHBOARD */}
                <div className="absolute -inset-6 opacity-25 blur-[4px] pointer-events-none select-none overflow-hidden z-0 flex flex-col p-6 space-y-3 bg-[#06080d]">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">TODAY SCREEN • {pseudonym || 'OPERATOR'}</span>
                    <span className="text-[10px] font-mono text-slate-500">ADAPTIVE PROTOCOL v2.0</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-400 block mb-1">CALORIC TARGET</span>
                      <span className="text-xl font-mono font-black text-white">{teaserCal} KCAL</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-400 block mb-1">PROTEIN TARGET</span>
                      <span className="text-xl font-mono font-black text-emerald-400">{teaserProtein}G</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">DAILY DIRECTIVES (3 HABITS)</span>
                      <span className="text-[8px] font-mono text-emerald-400">0/3 DONE</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-emerald-500/20 rounded-full w-full"></div>
                      <div className="h-2 bg-emerald-500/20 rounded-full w-4/5"></div>
                      <div className="h-2 bg-emerald-500/20 rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>

                {/* FOREGROUND SHARP SINGLE PAYWALL CARD */}
                <div className="relative z-10 bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl space-y-6 max-w-xl mx-auto border border-slate-900 shadow-2xl">
                  
                  <div className="text-center space-y-2">
                    <div className="flex justify-center">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold uppercase">
                        <Check className="w-3.5 h-3.5" /> Protocol Compiled for {pseudonym || 'Operator'}
                      </span>
                    </div>
                    <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                      FOUNDING BETA PROTOCOL
                    </h2>
                    <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                      High-utility, grounded fitness architecture for busy professionals. Auto-adapts to your real schedule and equipment.
                    </p>
                  </div>

                  {/* SINGLE FOCUSED OFFERING CARD */}
                  <div className="bg-slate-950/95 p-6 rounded-2xl border-2 border-emerald-500/60 flex flex-col justify-between relative overflow-visible shadow-xl shadow-emerald-950/40 space-y-5">
                    
                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-slate-950 text-[8px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
                      Early Adopter Exclusive
                    </div>

                    <div className="flex items-end justify-between border-b border-slate-900 pb-4 pt-1">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block tracking-wider">FOUNDING BETA</span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <span className="text-3xl font-mono font-black text-white">$15</span>
                          <span className="text-xs font-mono text-slate-400">/ month</span>
                        </div>
                        <p className="text-[9px] text-emerald-400/90 font-mono mt-1 font-bold">
                          Locked-in rate for early adopters
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg uppercase">
                          7-DAY FREE TRIAL
                        </span>
                      </div>
                    </div>

                    {/* High-utility feature checklist */}
                    <div className="space-y-2.5">
                      {[
                        `Adaptive Workout Matrix calibrated to ${daysAvailablePerWeek} days/week (${sessionDuration}/session)`,
                        `Equipment tailored to ${trainingLocation} (${equipmentAvailable.join(', ')})`,
                        "Daily Directives Retention Matrix (Hydration, protein, and circadian sleep)",
                        "24/7 Sovereign Coach support for real-time tactical adjustments"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200 font-sans">
                          <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Single CTA Button */}
                    <button
                      type="button"
                      onClick={() => handleRedirect("https://buy.stripe.com/test_founding_beta_15_mo")}
                      className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-[#00ff87] to-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.01] transition-transform shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>START 7-DAY FREE TRIAL ($15/MO)</span>
                      <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-1.5 text-[9px] font-mono text-slate-500 pt-1">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>Cancel anytime • 7-Day Free Trial • Encrypted Standard Stripe Checkout</span>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
