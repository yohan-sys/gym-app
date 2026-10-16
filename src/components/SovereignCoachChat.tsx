import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PresetFoodScan } from '../types';
import { PRESET_FOOD_SCANS } from '../data';
import { Send, Camera, Mic, Volume2, ShieldAlert, Sparkles, Terminal, X, Play, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SovereignCoachChatProps {
  chatHistory: ChatMessage[];
  isEvaluating: boolean;
  evaluationLogs: string[];
  onSendMessage: (text: string) => void;
  onSendPresetMeal: (meal: PresetFoodScan) => void;
  onSendVoiceMock: (voiceTranscript: string) => void;
}

export const SovereignCoachChat: React.FC<SovereignCoachChatProps> = ({
  chatHistory,
  isEvaluating,
  evaluationLogs,
  onSendMessage,
  onSendPresetMeal,
  onSendVoiceMock
}) => {
  const [inputText, setInputText] = useState('');
  const [showPhotoScanner, setShowPhotoScanner] = useState(false);
  const [micActiveState, setMicActiveState] = useState<'idle' | 'recording' | 'transcribing'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when chat updates or during evaluation typing state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isEvaluating, evaluationLogs]);

  // Voice note timer simulation
  useEffect(() => {
    let interval: any;
    if (micActiveState === 'recording') {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 4) {
            // Trigger auto finish recording after 4s
            handleFinishVoiceRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [micActiveState]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendText();
    }
  };

  const handleStartVoiceRecording = () => {
    setMicActiveState('recording');
  };

  const handleFinishVoiceRecording = () => {
    setMicActiveState('transcribing');
    setTimeout(() => {
      // Pick a fun fitness transcript
      const transcripts = [
        "Heavy sprint conditioning completed: 5x 400m intervals at max effort.",
        "Crucial hydration update: Just absorbed 1L of chilled mineral water.",
        "Refueling complete: Logged clean Greek yogurt with wild blackberries.",
        "Force-fed cold double espresso shot. Prepared for fasted lift discipline session.",
      ];
      const randomTranscript = transcripts[Math.floor(Math.random() * transcripts.length)];
      onSendVoiceMock(randomTranscript);
      setMicActiveState('idle');
    }, 1800);
  };

  const handleCancelVoice = () => {
    setMicActiveState('idle');
  };

  // Helper trigger for food select
  const selectFoodMeal = (meal: PresetFoodScan) => {
    onSendPresetMeal(meal);
    setShowPhotoScanner(false);
  };

  return (
    <div id="sovereign-coach-container" className="flex flex-col h-[calc(100vh-92px)] max-w-md mx-auto bg-[#04060b] border-x border-slate-900 overflow-hidden relative">
      
      {/* 2A. CHAT SUB-HEADER */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-950 to-emerald-950 border border-emerald-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-display font-bold text-xs tracking-tight text-slate-100">SOVEREIGN_COACH_V1.9</span>
              <span className="text-[8px] bg-red-500/10 text-red-400 font-mono scale-90 px-1 rounded uppercase tracking-wider font-semibold">Live AI Host</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono">Strict Accountability Protocol Active</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
          99.1% Compliance
        </span>
      </div>

      {/* 2B. ACTIVE CONVERSATION HISTORY */}
      <div 
        id="chat-messages-scroller"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      >
        <div className="bg-gradient-to-br from-slate-950 to-[#060a12] border border-slate-900 rounded-xl p-3 text-center space-y-2 mb-6">
          <ShieldAlert className="w-5 h-5 text-emerald-400 mx-auto animate-pulse" />
          <p className="font-sans font-medium text-xs text-slate-200">
            Sovereign Protocol Core Communication Portal
          </p>
          <p className="font-mono text-[9px] text-slate-500 max-w-[280px] mx-auto leading-relaxed">
            Upload pictures of food for instant calorie/macronutrient deduction. State physical achievements, water intake, or workouts to increase daily XP and consistency scores.
          </p>
        </div>

        {chatHistory.map((msg, index) => {
          const isCoach = msg.role === 'assistant';
          const isVoice = msg.mediaType === 'audio';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isCoach ? 'justify-start' : 'justify-end'} items-end space-x-2`}
            >
              {/* Coach Avatar (only next to coach messages) */}
              {isCoach && (
                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-emerald-500/20 flex items-center justify-center p-0.5 shrink-0 self-start mt-0.5">
                  <div className="w-full h-full rounded bg-emerald-950/20 flex items-center justify-center font-mono text-[10px] font-bold text-emerald-400">
                    S
                  </div>
                </div>
              )}

              {/* Chat Bubble content */}
              <div 
                className={`max-w-[80%] rounded-2xl p-3 shadow-lg relative overflow-hidden flex flex-col ${
                  isCoach 
                    ? "bg-slate-950 text-slate-200 rounded-bl-none border border-slate-900" 
                    : "bg-gradient-to-r from-emerald-950/80 to-emerald-900/95 text-emerald-50 border border-emerald-800/40 rounded-br-none"
                }`}
              >
                {/* Media Image display */}
                {msg.mediaUrl && msg.mediaType === 'image' && (
                  <div className="rounded-lg overflow-hidden border border-slate-900/85 mb-2 bg-slate-950">
                    <img src={msg.mediaUrl} alt="Logged dietary fuel" className="w-full max-h-48 object-cover" referrerPolicy="no-referrer" />
                    <div className="bg-slate-900/80 px-2 py-1 flex items-center justify-between text-[8px] font-mono text-slate-400">
                      <span>PIXEL_RESOLUTION_OK</span>
                      <span className="text-emerald-400 font-bold">MEAL PRESENCE CONFIRMED</span>
                    </div>
                  </div>
                )}

                {/* Simulated Voice note indicator */}
                {isVoice && (
                  <div className="rounded-lg bg-emerald-950/40 p-2 border border-emerald-800/30 mb-2 flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono block text-emerald-300">Voice Note Protocol</span>
                      <span className="text-[8px] text-emerald-500/85 font-mono">0:04 • Decoded Successful</span>
                    </div>
                  </div>
                )}

                {/* Message body text */}
                <p className="text-xs leading-relaxed font-sans font-light">
                  {msg.text}
                </p>

                {/* Stats bonus banner if applicable */}
                {msg.statsEffect && (
                  <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex flex-wrap gap-1.5 text-[9px] font-mono">
                    {msg.statsEffect.calories && (
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {msg.statsEffect.calories > 0 ? `+${msg.statsEffect.calories}` : msg.statsEffect.calories} kcal
                      </span>
                    )}
                    {msg.statsEffect.protein && (
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        +{msg.statsEffect.protein}g protein
                      </span>
                    )}
                    {msg.statsEffect.water && (
                      <span className="bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20">
                        +{msg.statsEffect.water}ml water
                      </span>
                    )}
                    {msg.statsEffect.xpGained && (
                      <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center">
                        +{msg.statsEffect.xpGained} XP
                      </span>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[8px] text-slate-500 font-mono mt-1 text-right self-end">
                  {msg.timestamp}
                </span>
                
              </div>
            </motion.div>
          );
        })}

        {/* 2C. REALISTIC "COACH IS EVALUATING..." ANIMATED TYPING STATE */}
        <AnimatePresence>
          {isEvaluating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-start space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center justify-center p-0.5 shrink-0 self-start mt-0.5">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin mx-auto" />
              </div>

              <div className="bg-slate-950 text-slate-300 rounded-2xl rounded-bl-none border border-emerald-500/20 p-3 shadow-lg max-w-[80%] space-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                
                <div className="flex items-center space-x-1.5">
                  <span className="text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest">• EVALUATING COMPLIANCE STATE</span>
                  <span className="flex space-x-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></span>
                  </span>
                </div>

                {/* Live progress logs running above response */}
                <div className="font-mono text-[8px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 space-y-0.5 max-h-24 overflow-y-auto">
                  {evaluationLogs.map((logStr, i) => (
                    <div key={i} className="text-slate-400 flex items-start">
                      <span className="text-emerald-500 mr-1">&gt;</span>
                      <span className="break-all">{logStr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* 2D. SPECIAL MODAL CAMERA FOOD SCANNER */}
      <AnimatePresence>
        {showPhotoScanner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-50 flex flex-col justify-end"
          >
            <div className="bg-slate-900 border-t border-slate-800/80 p-5 rounded-t-3xl max-h-[85vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-bold text-slate-100 text-sm">CHOOSE MEAL IMAGE TO SCAN</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Simulates real camera food detection and OCR parsing</p>
                </div>
                <button 
                  onClick={() => setShowPhotoScanner(false)}
                  className="w-7 h-7 bg-slate-850 hover:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {PRESET_FOOD_SCANS.map((food) => (
                  <div 
                    key={food.name}
                    onClick={() => selectFoodMeal(food)}
                    className="bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 p-2 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group"
                  >
                    <div className="relative rounded-lg overflow-hidden h-24 mb-2 bg-slate-900">
                      <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1 rounded text-[8px] font-mono text-emerald-400 font-bold">
                        +{food.calories} kcal
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{food.name}</h4>
                      <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">{food.description}</p>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span className="text-emerald-500 font-semibold">{food.protein}g protein</span>
                      <span className="text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800 flex items-center">
                        SELECT <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 font-mono leading-relaxed">
                🚀 <span className="text-emerald-400">PWA Functional Test Advantage:</span> Mocking the image uploads provides instant feedback of the machine-learning analysis without requiring expensive backend server load or local disk queries.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2E. TRANSCRIPTION LOADING AND INTERACTION OVERLAYS */}
      <AnimatePresence>
        {micActiveState !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-20 left-4 right-4 bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl z-40 text-center space-y-3"
          >
            {micActiveState === 'recording' ? (
              <>
                <div className="flex items-center justify-center space-x-1 py-2">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-emerald-500 rounded-full"
                      animate={{ height: [12, 36, 12] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display font-bold text-slate-200">RECORDING VOICE HABIT DISCIPLINE</p>
                  <p className="text-[10px] text-slate-500 font-mono">Recording: 0:0{recordingSeconds} / 0:04</p>
                </div>
                <div className="flex items-center justify-center space-x-3 pt-1">
                  <button 
                    onClick={handleCancelVoice}
                    className="bg-slate-900 border border-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleFinishVoiceRecording}
                    className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Transmit Now
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 space-y-3">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-200 tracking-wider">AI TRANSCRIBING VOICE SAMPLE...</p>
                  <p className="text-[9px] text-slate-500 font-mono">Deducing vocal wave parameters & habits context</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2F. DESIGNED BOTTOM INPUT BAR */}
      <div className="p-3 bg-slate-950 border-t border-slate-900 flex items-center space-x-2 shrink-0 safe-pb">
        {/* Camera photo button */}
        <button 
          id="btn-trigger-scanner"
          onClick={() => setShowPhotoScanner(true)}
          className="w-10 h-10 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-emerald-400 rounded-xl flex items-center justify-center group shrink-0 transition-colors cursor-pointer"
          title="Scan fresh healthy meal"
        >
          <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Text Input area */}
        <div className="flex-1 relative flex items-center">
          <input
            id="coach-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type 'sprints', 'water', 'chicken'..."
            className="w-full text-xs bg-slate-900 text-slate-200 placeholder-slate-500 rounded-xl pl-3.5 pr-10 py-3.5 border border-slate-800 focus:border-emerald-500/60 focus:outline-none transition-all font-sans"
            disabled={isEvaluating}
          />
          
          <button
            id="btn-submit-message"
            onClick={handleSendText}
            disabled={!inputText.trim() || isEvaluating}
            className={`absolute right-1.5 w-7.5 h-7.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim() && !isEvaluating
                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                : "bg-slate-950 text-slate-600 border border-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Microphone voice logging button */}
        <button 
          id="btn-voice-note"
          onClick={handleStartVoiceRecording}
          disabled={micActiveState !== 'idle' || isEvaluating}
          className={`w-10 h-10 border text-slate-300 rounded-xl flex items-center justify-center group shrink-0 transition-all cursor-pointer ${
            micActiveState === 'recording'
              ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:text-emerald-400'
          }`}
          title="Hold to record voice meal log"
        >
          <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

    </div>
  );
};
