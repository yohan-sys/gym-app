import React, { useState, useEffect } from 'react';

interface ProfileState {
  handle: string;
  goal: string;
  daysPerWeek: string;
  sessionLength: string;
  environment: string[];
  jointFlags: string[];
  ageRange: string;
  weight: string;
  sleep: string;
  email: string;
}

interface FeedbackState {
  difficulty: number;
  pain: string;
}

export default function SovereigntyApp() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState(0); 
  const [profile, setProfile] = useState<ProfileState>({
    handle: 'Sovereign_Executive',
    goal: 'Fat Loss',
    daysPerWeek: '4 Days',
    sessionLength: '45 Minutes',
    environment: ['Commercial Gym'],
    jointFlags: ['None'],
    ageRange: '30 - 39',
    weight: '185',
    sleep: '6 - 7 Hours',
    email: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalText, setTerminalText] = useState('Encrypting Biometric Data...');
  const [showPaywall, setShowPaywall] = useState(false);

  // DASHBOARD & WORKOUT STATE
  const [timeMode, setTimeMode] = useState('Full Protocol');
  const [scheduleWarning, setScheduleWarning] = useState(true);
  const [isAdapting, setIsAdapting] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ difficulty: 5, pain: 'None' });

  useEffect(() => {
    const savedProfile = localStorage.getItem('sovereignty_profile');
    const savedStep = localStorage.getItem('sovereignty_step');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session') === 'success') {
       setStep(6);
       window.history.replaceState({}, document.title, window.location.pathname);
    } else if (savedProfile) {
       try {
         setProfile(JSON.parse(savedProfile));
       } catch (e) {
         console.error('Failed to parse saved profile:', e);
       }
       if (savedStep) {
         const parsed = parseInt(savedStep, 10);
         if (!isNaN(parsed)) setStep(parsed);
       }
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && step !== 6) {
      localStorage.setItem('sovereignty_profile', JSON.stringify(profile));
      localStorage.setItem('sovereignty_step', step.toString());
    }
  }, [profile, step, isLoaded]);

  const updateProfile = (key: keyof ProfileState, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'environment' | 'jointFlags', value: string) => {
    const currentArray = profile[key];
    if (key === 'jointFlags' && value === 'None') {
      updateProfile(key, ['None']);
      return;
    }
    let newArray = currentArray.filter(item => item !== 'None');
    if (newArray.includes(value)) {
      newArray = newArray.filter(item => item !== value);
      if (newArray.length === 0 && key === 'jointFlags') newArray = ['None'];
    } else {
      newArray.push(value);
    }
    updateProfile(key, newArray);
  };

  const handleAnalysis = () => {
    if (!profile.email || !profile.email.includes('@')) return;
    setIsAnalyzing(true);
    
    // Webhook Placeholder - This is where the data goes to n8n
    // fetch('YOUR_WEBHOOK_URL', { method: 'POST', body: JSON.stringify(profile) });

    setTimeout(() => setTerminalText('Calibrating Schedule Matrix...'), 1500);
    setTimeout(() => setTerminalText('Cross-referencing Equipment Profile...'), 3000);
    setTimeout(() => setTerminalText('Applying Joint Safeguard Algorithms...'), 4500);
    setTimeout(() => setTerminalText('Protocol Generated Successfully.'), 6000);
    setTimeout(() => setShowPaywall(true), 7000);
  };

  const handleAdaptWeek = () => {
    setIsAdapting(true);
    setTimeout(() => {
      setIsAdapting(false);
      setScheduleWarning(false);
    }, 2500);
  };

  const handleCompleteWorkout = () => {
    setShowFeedback(false);
    setActiveWorkout(false);
    alert("Protocol logged successfully. Tomorrow's matrix will be calibrated based on this feedback.");
  };

  const logoFallback = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpolygon points='50,10 90,85 10,85' stroke='%2300ff87' stroke-width='6' fill='%2300ff8715' /%3E%3Ccircle cx='50' cy='55' r='16' stroke='%2300ff87' stroke-width='4' fill='none' /%3E%3Cpath d='M50 25 L50 40 M38 62 L62 62' stroke='%2300ff87' stroke-width='4' stroke-linecap='round' /%3E%3C/svg%3E";
  };

  if (!isLoaded) return null;

  // --- THE FUNNEL STEPS (0 - 5) --- 
  if (step >= 0 && step <= 5) {
     return (
       <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-gray-300 font-sans relative overflow-x-hidden p-4">
         <style>{`
           @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
           .animate-fade-in { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
         `}</style>
         
         {step > 0 && step < 6 && (
           <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-900 z-50">
             <div className="h-full bg-[#00ff87] shadow-[0_0_15px_#00ff87] transition-all duration-700 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
           </div>
         )}

         {step === 0 && (
            <div className="w-full max-w-3xl flex flex-col items-center text-center p-6 animate-fade-in">
              <div className="mb-10 relative flex justify-center">
                 <img src="/logo.png" alt="Sovereignty Logo" onError={logoFallback} className="h-24 sm:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,255,135,0.6)]" />
              </div>
              <h2 className="text-[#00ff87] text-xs sm:text-sm font-bold tracking-[0.2em] mb-2 uppercase">Sovereignty Executive Fitness Protocol</h2>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-wider mb-6 uppercase">Deep Calibration Wizard</h1>
              <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">No 38-question quizzes. No generic PDF plans. Calibrate your schedule constraints, available equipment, and joint flags in under 60 seconds.</p>
              
              <button onClick={() => setStep(1)} className="bg-[#00ff87] text-black font-extrabold text-lg uppercase px-12 py-5 rounded-md tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:scale-105 mt-8 w-full sm:w-auto cursor-pointer">Initiate Deep Calibration</button>
              <button onClick={() => setStep(6)} className="mt-12 text-gray-700 text-xs hover:text-white uppercase tracking-widest transition-colors cursor-pointer">[DEV] Skip to Dashboard</button>
            </div>
         )}

         {step === 1 && (
            <div className="w-full max-w-3xl p-4 pt-16 animate-fade-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                <h2 className="text-[#00ff87] text-sm font-bold tracking-[0.2em] mb-8 uppercase">Step 1 of 5: Target Vector</h2>
                
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Executive Handle / Pseudonym</label>
                <div className="flex gap-3 mb-10">
                  <input type="text" value={profile.handle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('handle', e.target.value)} className="w-full bg-black border border-slate-700 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-[#00ff87] transition-colors" />
                  <button onClick={() => updateProfile('handle', 'Protocol_Alpha_' + Math.floor(Math.random() * 1000))} className="bg-slate-800 text-gray-300 px-6 py-4 rounded-lg text-sm font-bold hover:text-white hover:bg-slate-700 transition-colors uppercase cursor-pointer">Random</button>
                </div>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Primary Matrix Goal</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  {['Fat Loss', 'Strength & Muscle', 'General Fitness'].map((goalOption) => (
                    <div key={goalOption} onClick={() => updateProfile('goal', goalOption)} className={`bg-black border rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-center ${profile.goal === goalOption ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] scale-[1.02]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className="text-white font-bold text-lg">{goalOption}</span>
                      <span className="text-xs text-gray-500 mt-2 leading-relaxed">
                        {goalOption === 'Fat Loss' ? 'Accelerated lipid deficit & tone' : goalOption === 'Strength & Muscle' ? 'Mechanical hypertrophy & power' : 'Longevity, mobility & endurance'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                  <button onClick={() => setStep(0)} className="text-gray-500 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer">Cancel</button>
                  <button onClick={() => setStep(2)} className="bg-[#00ff87] text-black font-extrabold text-sm uppercase px-8 py-4 rounded-md tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:scale-105 flex items-center gap-2 cursor-pointer">Next Parameters ❯</button>
                </div>
              </div>
            </div>
         )}

         {step === 2 && (
            <div className="w-full max-w-3xl p-4 pt-16 animate-fade-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                <h2 className="text-[#00ff87] text-sm font-bold tracking-[0.2em] mb-8 uppercase">Step 2 of 5: Schedule Constraints</h2>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Training Frequency (Days/Week)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {['3 Days', '4 Days', '5 Days', '6 Days'].map((days) => (
                    <div key={days} onClick={() => updateProfile('daysPerWeek', days)} className={`bg-black border rounded-xl p-4 text-center cursor-pointer transition-all ${profile.daysPerWeek === days ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] scale-[1.05]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className="text-white font-bold text-lg">{days}</span>
                    </div>
                  ))}
                </div>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Maximum Session Length</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  {['30 Minutes', '45 Minutes', '60+ Minutes'].map((time) => (
                    <div key={time} onClick={() => updateProfile('sessionLength', time)} className={`bg-black border rounded-xl p-5 text-center cursor-pointer transition-all ${profile.sessionLength === time ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] scale-[1.05]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className="text-white font-bold text-lg">{time}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer">❮ Back</button>
                  <button onClick={() => setStep(3)} className="bg-[#00ff87] text-black font-extrabold text-sm uppercase px-8 py-4 rounded-md tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:scale-105 flex items-center gap-2 cursor-pointer">Next Parameters ❯</button>
                </div>
              </div>
            </div>
         )}

         {step === 3 && (
            <div className="w-full max-w-3xl p-4 pt-16 animate-fade-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                <h2 className="text-[#00ff87] text-sm font-bold tracking-[0.2em] mb-2 uppercase">Step 3 of 5: Logistics & Safeguards</h2>
                <p className="text-gray-500 text-sm mb-8 italic">You may select multiple options for this section.</p>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Available Training Environments</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  {['Commercial Gym', 'Home Gym (Dumbbells)', 'Bodyweight Only'].map((env) => (
                    <div key={env} onClick={() => toggleArrayItem('environment', env)} className={`bg-black border rounded-xl p-5 text-center cursor-pointer transition-all flex items-center justify-center min-h-[80px] ${profile.environment.includes(env) ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] scale-[1.02]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className="text-white font-bold text-md">{env}</span>
                    </div>
                  ))}
                </div>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Joint Safeguard Flags</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {['None', 'Lower Back', 'Knees', 'Shoulders'].map((joint) => (
                    <div key={joint} onClick={() => toggleArrayItem('jointFlags', joint)} className={`bg-black border rounded-xl p-4 text-center cursor-pointer transition-all flex items-center justify-center min-h-[60px] ${profile.jointFlags.includes(joint) ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-[1.05]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className={`font-bold text-sm ${profile.jointFlags.includes(joint) ? 'text-red-400' : 'text-white'}`}>{joint}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                  <button onClick={() => setStep(2)} className="text-gray-500 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer">❮ Back</button>
                  <button onClick={() => setStep(4)} className="bg-[#00ff87] text-black font-extrabold text-sm uppercase px-8 py-4 rounded-md tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:scale-105 flex items-center gap-2 cursor-pointer">Next Parameters ❯</button>
                </div>
              </div>
            </div>
         )}

         {step === 4 && (
            <div className="w-full max-w-3xl p-4 pt-16 animate-fade-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                <h2 className="text-[#00ff87] text-sm font-bold tracking-[0.2em] mb-8 uppercase">Step 4 of 5: Biometrics & Recovery</h2>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Age Bracket</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {['20 - 29', '30 - 39', '40 - 49', '50+'].map((age) => (
                    <div key={age} onClick={() => updateProfile('ageRange', age)} className={`bg-black border rounded-xl p-4 text-center cursor-pointer transition-all ${profile.ageRange === age ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] scale-[1.05]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className="text-white font-bold text-lg">{age}</span>
                    </div>
                  ))}
                </div>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Current Weight (LBS)</label>
                <div className="mb-8">
                   <input type="number" value={profile.weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('weight', e.target.value)} className="w-full md:w-1/2 bg-black border border-slate-700 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-[#00ff87] transition-colors text-lg font-bold" placeholder="e.g. 185" />
                </div>

                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">Average Nightly Sleep</label>
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {['< 5 Hours', '5 - 6 Hours', '6 - 7 Hours', '7+ Hours'].map((sleepTime) => (
                    <div key={sleepTime} onClick={() => updateProfile('sleep', sleepTime)} className={`bg-black border rounded-xl p-4 text-center cursor-pointer transition-all ${profile.sleep === sleepTime ? 'border-[#00ff87] shadow-[0_0_15px_rgba(0,255,135,0.15)] scale-[1.05]' : 'border-slate-700 hover:border-slate-500'}`}>
                      <span className="text-white font-bold text-md">{sleepTime}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-800">
                  <button onClick={() => setStep(3)} className="text-gray-500 hover:text-white text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer">❮ Back</button>
                  <button onClick={() => setStep(5)} className="bg-[#00ff87] text-black font-extrabold text-sm uppercase px-8 py-4 rounded-md tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:scale-105 flex items-center gap-2 cursor-pointer">Finalize Profile ❯</button>
                </div>
              </div>
            </div>
         )}

         {step === 5 && (
            <div className="w-full max-w-2xl p-4 pt-16 animate-fade-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-12 shadow-2xl backdrop-blur-md text-center">
                {!isAnalyzing ? (
                  <div className="animate-fade-in">
                    <h2 className="text-[#00ff87] text-sm font-bold tracking-[0.2em] mb-4 uppercase">Step 5 of 5: Secure Protocol</h2>
                    <h1 className="text-3xl font-extrabold text-white mb-6">Data Calibrated.</h1>
                    <p className="text-gray-400 mb-8 text-sm">Enter your email to secure your biometric profile and generate your adaptive schedule.</p>
                    <input type="email" value={profile.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProfile('email', e.target.value)} className="w-full bg-black border border-slate-700 text-white rounded-lg px-6 py-5 focus:outline-none focus:border-[#00ff87] transition-colors text-lg mb-8 text-center" placeholder="executive@domain.com" />
                    <button onClick={handleAnalysis} disabled={!profile.email.includes('@')} className={`font-extrabold text-sm uppercase px-10 py-5 rounded-md tracking-wider transition-all w-full ${profile.email.includes('@') ? 'bg-[#00ff87] text-black shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:scale-105 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>Generate Protocol</button>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center animate-fade-in">
                     {!showPaywall ? (
                       <>
                         <div className="w-16 h-16 border-4 border-slate-800 border-t-[#00ff87] rounded-full animate-spin mb-8"></div>
                         <h2 className="text-[#00ff87] text-xl font-mono tracking-widest uppercase animate-pulse">{terminalText}</h2>
                       </>
                     ) : (
                       <div className="animate-fade-in w-full">
                         <div className="w-20 h-20 bg-[#00ff87]/20 rounded-full flex items-center justify-center mb-6 mx-auto"><span className="text-[#00ff87] text-4xl">✓</span></div>
                         <h1 className="text-3xl font-extrabold text-white mb-4 uppercase tracking-wider">Protocol Ready</h1>
                         <p className="text-gray-400 mb-6 text-sm">Everything you need to execute. No hidden fees. No junk PDFs.</p>
                         
                         {/* ACTIVE STRIPE LINK INJECTED HERE */}
                         <button onClick={() => window.location.href = 'https://buy.stripe.com/3cI28q2A2dbU6Vw0D14Ja03'} className="bg-[#00ff87] text-black font-extrabold text-xl uppercase px-12 py-6 rounded-md tracking-widest transition-all shadow-[0_0_25px_rgba(0,255,135,0.5)] hover:scale-105 w-full mt-2 cursor-pointer">Unlock Protocol • $19/mo</button>
                         <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-6">7-Day Free Trial • Cancel Anytime</p>
                       </div>
                     )}
                  </div>
                )}
              </div>
            </div>
         )}
       </div>
     );
  }

  // --- STEP 6: THE DASHBOARD (THE ACTUAL PRODUCT) ---
  if (step === 6) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans relative">
        <style>{`
           @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
           .animate-fade-in { animation: fadeInUp 0.4s ease-out forwards; }
        `}</style>

        {/* FEEDBACK SLIDE-UP MODAL */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 w-full sm:w-auto sm:min-w-[500px] rounded-t-3xl sm:rounded-2xl p-8 shadow-2xl">
              <h2 className="text-[#00ff87] font-extrabold text-2xl uppercase tracking-wider mb-2">Post-Action Report</h2>
              <p className="text-gray-400 text-sm mb-8">This data calibrates your next protocol.</p>
              
              <label className="text-gray-300 font-bold uppercase tracking-widest text-xs mb-3 block">Overall Difficulty (1-10)</label>
              <input type="range" min="1" max="10" value={feedback.difficulty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedback({...feedback, difficulty: Number(e.target.value)})} className="w-full accent-[#00ff87] mb-8 cursor-pointer" />
              
              <label className="text-gray-300 font-bold uppercase tracking-widest text-xs mb-3 block">Joint Discomfort</label>
              <div className="flex gap-2 mb-10">
                {['None', 'Mild', 'Severe'].map(level => (
                  <button key={level} onClick={() => setFeedback({...feedback, pain: level})} className={`flex-1 py-3 rounded-lg text-sm font-bold uppercase transition-all cursor-pointer ${feedback.pain === level ? 'bg-slate-700 text-white shadow-inner' : 'bg-black border border-slate-800 text-gray-500'}`}>
                    {level}
                  </button>
                ))}
              </div>

              <button onClick={handleCompleteWorkout} className="w-full bg-[#00ff87] text-black font-extrabold uppercase py-4 rounded-lg tracking-widest hover:scale-[1.02] transition-all cursor-pointer">Submit Feedback</button>
            </div>
          </div>
        )}

        {/* ACTIVE WORKOUT HUD (Focus Mode) */}
        {activeWorkout && !showFeedback ? (
          <div className="absolute inset-0 bg-[#0a0a0a] z-40 p-4 sm:p-8 animate-fade-in flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
               <button onClick={() => setActiveWorkout(false)} className="text-gray-500 text-sm font-bold uppercase tracking-widest hover:text-white cursor-pointer">❮ Abort</button>
               <span className="text-[#00ff87] font-mono tracking-widest animate-pulse">PROTOCOL ACTIVE</span>
               <div className="w-16"></div>
            </div>
            
            <div className="max-w-3xl mx-auto w-full flex-1">
              <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider mb-8">Upper Body Core</h1>
              
              <div className="space-y-4 mb-12">
                 <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-white font-bold text-xl mb-1">Dumbbell Bench Press</h3>
                    <p className="text-[#00ff87] text-sm font-bold tracking-widest uppercase mb-4">4 Sets • 8-10 Reps</p>
                    <div className="flex gap-4">
                       {[1, 2, 3, 4].map(set => (
                         <div key={set} className="w-12 h-12 bg-black border-2 border-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#00ff87] hover:bg-[#00ff87]/10 transition-colors"></div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-white font-bold text-xl mb-1">Bent-Over Rows</h3>
                    <p className="text-[#00ff87] text-sm font-bold tracking-widest uppercase mb-4">4 Sets • 10-12 Reps</p>
                    <div className="flex gap-4">
                       {[1, 2, 3, 4].map(set => (
                         <div key={set} className="w-12 h-12 bg-black border-2 border-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#00ff87] hover:bg-[#00ff87]/10 transition-colors"></div>
                       ))}
                    </div>
                 </div>
              </div>

              <button onClick={() => setShowFeedback(true)} className="w-full bg-[#00ff87] text-black font-extrabold text-xl uppercase px-12 py-6 rounded-md tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:scale-[1.02] cursor-pointer">
                Complete Protocol
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD DASHBOARD VIEW */
          <div className="p-4 sm:p-8 animate-fade-in">
            <header className="max-w-4xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6 mt-4">
              <div className="flex items-center gap-4">
                 <img src="/logo.png" alt="Logo" onError={logoFallback} className="h-10 w-auto object-contain" />
                 <div>
                   <h1 className="text-white font-extrabold text-xl tracking-wider uppercase">Sovereignty HUD</h1>
                   <p className="text-[#00ff87] text-xs font-bold tracking-[0.2em] uppercase">Protocol Active • {profile.handle}</p>
                 </div>
              </div>
              <button onClick={() => setStep(0)} className="text-gray-500 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase cursor-pointer">
                 Re-Calibrate
              </button>
            </header>

            <main className="max-w-4xl mx-auto">
              
              {scheduleWarning && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-8 flex justify-between items-center">
                   <div>
                     <h3 className="text-white font-bold text-sm">Schedule Deviation Detected</h3>
                     <p className="text-gray-400 text-xs mt-1">You missed Tuesday's session. Volume requires redistribution.</p>
                   </div>
                   <button onClick={handleAdaptWeek} disabled={isAdapting} className={`border ${isAdapting ? 'border-gray-600 text-gray-500' : 'border-[#00ff87] text-[#00ff87] hover:bg-[#00ff87] hover:text-black'} transition-colors px-4 py-2 rounded font-bold text-xs uppercase tracking-wider min-w-[140px] cursor-pointer`}>
                     {isAdapting ? 'Recalculating...' : 'Adapt My Week'}
                   </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                 <div>
                    <h2 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                    <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide">Upper Body Core</h1>
                 </div>
                 
                 <div className="bg-black border border-slate-800 rounded-lg p-1 flex">
                    {['Full Protocol', 'Tactical Short', 'Emergency'].map(mode => (
                      <button 
                        key={mode}
                        onClick={() => setTimeMode(mode)}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${timeMode === mode ? 'bg-slate-800 text-[#00ff87] shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {mode}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md mb-12">
                 <p className="text-gray-400 text-sm mb-6 border-b border-slate-800 pb-4">
                   {timeMode === 'Full Protocol' ? 'Est. Time: 45 Minutes • Full hypertrophy sequencing.' : timeMode === 'Tactical Short' ? 'Est. Time: 25 Minutes • Accessory lifts removed. Core compounds only.' : 'Est. Time: 10 Minutes • Survival mode. High-intensity bodyweight density block.'}
                 </p>
                 
                 <div className="space-y-4">
                    <div className="bg-black border border-slate-800 p-4 rounded-xl flex justify-between items-center hover:border-slate-600 transition-colors">
                       <div>
                         <h3 className="text-white font-bold text-lg">Dumbbell Bench Press</h3>
                         <p className="text-gray-500 text-sm">4 Sets • 8-10 Reps • 90s Rest</p>
                       </div>
                    </div>
                    <div className="bg-black border border-slate-800 p-4 rounded-xl flex justify-between items-center hover:border-slate-600 transition-colors">
                       <div>
                         <h3 className="text-white font-bold text-lg">Bent-Over Rows</h3>
                         <p className="text-gray-500 text-sm">4 Sets • 10-12 Reps • 90s Rest</p>
                       </div>
                    </div>
                    {timeMode === 'Full Protocol' && (
                      <div className="bg-black border border-slate-800 p-4 rounded-xl flex justify-between items-center hover:border-slate-600 transition-colors">
                         <div>
                           <h3 className="text-white font-bold text-lg">Lateral Raises</h3>
                           <p className="text-gray-500 text-sm">3 Sets • 15 Reps • 60s Rest</p>
                         </div>
                      </div>
                    )}
                 </div>

                 <button onClick={() => setActiveWorkout(true)} className="mt-8 w-full bg-[#00ff87] text-black font-extrabold text-lg uppercase px-12 py-5 rounded-md tracking-widest transition-all shadow-[0_0_20px_rgba(0,255,135,0.4)] hover:scale-[1.02] cursor-pointer">
                    Commence Session
                 </button>
              </div>
            </main>
          </div>
        )}
      </div>
    );
  }

  return null;
}
