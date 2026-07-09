import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, ArrowLeft, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getMascotFeedback } from '../services/geminiService';
import SquirrelMascot from './SquirrelMascot';

interface MathGameProps {
  onBack: () => void;
  onBonus: () => void;
  maxNumber: number;
  enabledOperators: string[];
  score: number;
  onScoreChange: (amount: number) => void;
  onCorrectAnswer?: () => void;
  adventureMathSolved?: number;
  adventureGermanSolved?: number;
}

type MathTaskType = 'STANDARD' | 'COUNTING' | 'VISUAL' | 'DOT_FRAME' | 'LOGIC' | 'COMPARE' | 'MISSING_NUMBER' | 'MONEY' | 'CLOCK' | 'RECHENTABELLE';

function EuroBill({ value }: { value: number; key?: any }) {
  let bgGradient = "from-blue-700 via-sky-600 to-indigo-500/80";
  let border = "border-blue-800";
  let sizeClass = "w-44 h-24 sm:w-56 sm:h-32"; // 20 Euro
  
  if (value === 10) {
    bgGradient = "from-red-700 via-rose-500 to-amber-600/50";
    border = "border-red-800";
    sizeClass = "w-40 h-22 sm:w-52 sm:h-30"; // 10 Euro
  } else if (value === 5) {
    bgGradient = "from-emerald-800 via-slate-600 to-teal-700/80";
    border = "border-emerald-800";
    sizeClass = "w-36 h-20 sm:w-48 sm:h-28"; // 5 Euro
  }

  return (
    <div className={`relative ${sizeClass} bg-gradient-to-r ${bgGradient} rounded-xl shadow-lg border-2 ${border} p-3 text-white flex flex-col justify-between overflow-hidden flex-shrink-0 select-none transform hover:scale-105 transition-transform duration-200`}>
      {/* Hologram band on the right */}
      <div className="absolute right-4 top-0 bottom-0 w-5 bg-gradient-to-b from-yellow-200/40 via-white/60 to-blue-200/40 opacity-80 mix-blend-overlay border-r border-l border-white/20" />
      
      {/* EU Flag */}
      <div className="absolute left-3 top-3 w-5 h-3.5 bg-blue-900 flex flex-wrap items-center justify-center p-[1px] rounded-sm opacity-95">
        <span className="text-[5px] leading-none text-yellow-300">★</span>
      </div>

      {/* Security thread line */}
      <div className="absolute left-1/3 top-0 bottom-0 w-[1.5px] bg-slate-900/40 border-dashed" />
      
      {/* Giant watermark number in the center background */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-5xl sm:text-7xl font-black text-white/20 select-none pointer-events-none tracking-tight">
        {value}
      </div>

      {/* Top right - massive prominent value */}
      <div className="flex justify-end items-start pr-5 z-10">
        <span className="text-3xl sm:text-5xl font-black tracking-tighter leading-none drop-shadow-md">{value}</span>
      </div>
      
      {/* Middle architecture illustration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <svg className="w-18 h-18 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      {/* Bottom left / right */}
      <div className="flex justify-between items-end z-10">
        <div className="flex flex-col">
          <span className="text-[6px] sm:text-[7px] font-bold tracking-widest leading-none uppercase opacity-90">BCE ECB EZB EKT EKP</span>
          <span className="text-[9px] sm:text-[11px] font-black tracking-wider mt-0.5">EURO</span>
        </div>
        <span className="text-3xl sm:text-4xl font-extrabold leading-none mr-5 drop-shadow-md">€</span>
      </div>
    </div>
  );
}

function EuroCoin({ value, isCent }: { value: number; isCent?: boolean; key?: any }) {
  let sizeClass = "w-20 h-20 text-xl"; // default 2€
  let innerBg = "";
  let outerBg = "";
  let border = "";
  let label = `${value}`;
  let subLabel = "EURO";
  let labelSizeClass = "text-3xl sm:text-5xl";

  if (!isCent) {
    if (value === 2) {
      // 2 Euro: Outer silver, inner gold. Largest coin.
      sizeClass = "w-24 h-24 sm:w-32 sm:h-32";
      outerBg = "bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400";
      innerBg = "bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600";
      border = "border-slate-400 shadow-xl ring-2 ring-slate-400/50";
      subLabel = "EURO";
      labelSizeClass = "text-4xl sm:text-6xl";
    } else {
      // 1 Euro: Outer gold, inner silver. Slightly smaller.
      sizeClass = "w-22 h-22 sm:w-28 sm:h-28";
      outerBg = "bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-500";
      innerBg = "bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400";
      border = "border-amber-600 shadow-xl ring-2 ring-amber-500/50";
      subLabel = "EURO";
      labelSizeClass = "text-3xl sm:text-5xl";
    }
  } else {
    subLabel = "EURO CENT";
    if (value === 50) {
      // 50 Cent: Nordic Gold (shiny gold/yellow)
      sizeClass = "w-22 h-22 sm:w-28 sm:h-28";
      outerBg = "bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-500";
      innerBg = "";
      border = "border-amber-600 shadow-xl ring-2 ring-amber-400/40";
      labelSizeClass = "text-4xl sm:text-6xl";
    } else if (value === 20) {
      // 20 Cent: Nordic Gold, scalloped edges ("Spanish flower")
      sizeClass = "w-20 h-20 sm:w-26 sm:h-26";
      outerBg = "bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-500";
      innerBg = "";
      border = "border-amber-600 shadow-xl border-dashed ring-2 ring-amber-400/40";
      labelSizeClass = "text-3xl sm:text-5xl";
    } else if (value === 10) {
      // 10 Cent: Nordic Gold
      sizeClass = "w-18 h-18 sm:w-23 sm:h-23";
      outerBg = "bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-500";
      innerBg = "";
      border = "border-amber-600 shadow-lg ring-1 ring-amber-400/40";
      labelSizeClass = "text-3xl sm:text-5xl";
    } else if (value === 5) {
      // 5 Cent: Copper steel (reddish-copper)
      sizeClass = "w-16 h-16 sm:w-21 sm:h-21";
      outerBg = "bg-gradient-to-r from-red-800 via-orange-400 to-orange-800";
      innerBg = "";
      border = "border-red-900 shadow-lg ring-1 ring-orange-500/30";
      labelSizeClass = "text-2xl sm:text-4xl";
    } else if (value === 2) {
      // 2 Cent: Copper steel
      sizeClass = "w-14 h-14 sm:w-18 sm:h-18";
      outerBg = "bg-gradient-to-r from-red-800 via-orange-400 to-orange-800";
      innerBg = "";
      border = "border-red-900 shadow-md ring-1 ring-orange-500/30";
      labelSizeClass = "text-2xl sm:text-4xl";
    } else {
      // 1 Cent: Copper steel, smallest
      sizeClass = "w-12 h-12 sm:w-15 sm:h-15";
      outerBg = "bg-gradient-to-r from-red-800 via-orange-400 to-orange-800";
      innerBg = "";
      border = "border-red-900 shadow-sm ring-1 ring-orange-500/20";
      labelSizeClass = "text-xl sm:text-3xl";
    }
  }

  return (
    <div className={`relative ${sizeClass} rounded-full flex items-center justify-center flex-shrink-0 select-none transform hover:scale-110 transition-transform duration-200 border-4 ${border} ${outerBg} font-display`}>
      {innerBg ? (
        <div className="absolute w-[74%] h-[74%] rounded-full flex flex-col items-center justify-center border border-black/10 shadow-inner overflow-hidden text-gray-800 font-extrabold leading-none">
          <div className={`absolute inset-0 ${innerBg} opacity-100 z-0`} />
          <span className={`z-10 tracking-tighter text-shadow font-black ${labelSizeClass}`}>{label}</span>
          <span className="text-[6px] sm:text-[8px] font-black z-10 tracking-widest mt-0.5">{subLabel}</span>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 z-0">
            <span className="text-[12px] sm:text-[14px]">★</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-yellow-950 font-black leading-none drop-shadow-sm select-none">
          <span className={`tracking-tighter font-black ${labelSizeClass}`}>{label}</span>
          <span className="text-[6px] sm:text-[8px] font-black tracking-widest mt-0.5">{subLabel}</span>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-base">★</span>
          </div>
        </div>
      )}
      {innerBg && (
        <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none opacity-45">
          <div className="absolute w-full h-full animate-pulse flex items-center justify-center text-slate-800 text-[6px]">
            <span className="absolute top-1 font-bold">★</span>
            <span className="absolute bottom-1 font-bold">★</span>
            <span className="absolute left-1 font-bold">★</span>
            <span className="absolute right-1 font-bold">★</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full pointer-events-none" />
    </div>
  );
}

function AnalogClock({ hour }: { hour: number }) {
  const size = 300;
  const numRadius = 105;
  
  // Angle calculations for hands (full hours only)
  const hourAngle = hour * 30; // 30 degrees per hour
  const minuteAngle = 0; // always pointing to 12 since it's full hours
  
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full border-8 border-amber-600 shadow-2xl flex items-center justify-center p-1">
        {/* Outer Ring Shadow & Highlight */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 pointer-events-none" />
        
        <svg className="w-full h-full" viewBox="0 0 300 300">
          <defs>
            <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="90%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f3f4f6" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="150" r="140" fill="url(#dialGrad)" />
          
          {/* Minute Ticks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6) * Math.PI / 180;
            const isMajor = i % 5 === 0;
            const tickLen = isMajor ? 12 : 6;
            const tickWidth = isMajor ? 3 : 1.5;
            const color = isMajor ? '#4b5563' : '#9ca3af';
            
            const x1 = 150 + (135 - tickLen) * Math.cos(angle);
            const y1 = 150 + (135 - tickLen) * Math.sin(angle);
            const x2 = 150 + 135 * Math.cos(angle);
            const y2 = 150 + 135 * Math.sin(angle);
            
            return (
              <line 
                key={`tick-${i}`} 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke={color} 
                strokeWidth={tickWidth} 
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Clock Numbers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const h = i + 1;
            const angle = (h * 30 - 90) * Math.PI / 180;
            const x = 150 + numRadius * Math.cos(angle);
            const y = 150 + numRadius * Math.sin(angle) + 8;
            
            return (
              <text
                key={`num-${h}`}
                x={x}
                y={y}
                textAnchor="middle"
                className="font-display font-extrabold text-2xl sm:text-3xl fill-slate-800 select-none"
              >
                {h}
              </text>
            );
          })}
          
          {/* Hour Hand (Red) - Rotated by hourAngle */}
          <g transform={`rotate(${hourAngle} 150 150)`}>
            <line 
              x1="150" 
              y1="150" 
              x2="150" 
              y2="85" 
              stroke="#ef4444" 
              strokeWidth="9" 
              strokeLinecap="round" 
            />
            <path d="M145 90 L150 72 L155 90 Z" fill="#ef4444" />
          </g>
          
          {/* Minute Hand (Blue) - Rotated by minuteAngle (always 0) */}
          <g transform={`rotate(${minuteAngle} 150 150)`}>
            <line 
              x1="150" 
              y1="150" 
              x2="150" 
              y2="55" 
              stroke="#3b82f6" 
              strokeWidth="6" 
              strokeLinecap="round" 
            />
            <path d="M146 60 L150 42 L154 60 Z" fill="#3b82f6" />
          </g>
          
          {/* Center Pin / Hub */}
          <circle cx="150" cy="150" r="12" fill="#1e293b" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="150" cy="150" r="4" fill="#ffffff" />
        </svg>
      </div>

      {/* Elegant label below */}
      <div className="mt-4 flex flex-wrap gap-4 sm:gap-6 justify-center text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-5 bg-red-500 rounded-full block border border-red-600" />
          <span className="text-gray-600">Stundenzeiger (Kurz & Rot)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-5 bg-blue-500 rounded-full block border border-blue-600" />
          <span className="text-gray-600">Minutenzeiger (Lang & Blau)</span>
        </div>
      </div>
    </div>
  );
}

export default function MathGame({ 
  onBack, 
  onBonus, 
  maxNumber, 
  enabledOperators, 
  score, 
  onScoreChange, 
  onCorrectAnswer,
  adventureMathSolved,
  adventureGermanSolved
}: MathGameProps) {
  const [level, setLevel] = useState(1);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [taskType, setTaskType] = useState<MathTaskType>('STANDARD');
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0, story: '', items: '' });
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLastCorrect, setIsLastCorrect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const taskPoolRef = useRef<MathTaskType[]>([]);
  const lastTaskTypeRef = useRef<MathTaskType | null>(null);
  const recentQuestionsRef = useRef<string[]>([]);

  const EMOJIS = ['🍎', '🍐', '🍓', '🥕', '🍦', '🎈', '🚗', '🐶', '🐱', '🐿️', '🦖', '🦄', '🌈', '🍦', '🍩', '🍕', '🍿', '🍟', '🍭', '🍉', '🍋', '🍇', '🫐', '🍒', '🍑', '🍍', '🥥', '🥦', '🌽', '🥨', '🍪', '🍫', '🪐', '🚀', '🛸', '⭐'];
  const ANIMALS = ['🐿️', '🐶', '🐱', '🐰', '🐼', '🦊', '🐻', '🦁', '🐯', '🐮', '🐷', '🐨', '🐵', '🐸', '🐧', '🦆', '🦉', '🦋'];

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateQuestion = () => {
    const op = enabledOperators[Math.floor(Math.random() * enabledOperators.length)];
    
    // Determine which types are valid for the current operator
    const getValidTypes = (operator: string): MathTaskType[] => {
      const types: MathTaskType[] = ['STANDARD', 'VISUAL', 'LOGIC', 'COMPARE', 'COUNTING', 'MONEY', 'CLOCK', 'RECHENTABELLE'];
      if (operator === '+' || operator === '-') {
        types.push('DOT_FRAME');
        types.push('MISSING_NUMBER');
      }
      return types;
    };

    const validTypes = getValidTypes(op);

    // Task Pool Logic
    if (taskPoolRef.current.length === 0) {
      const allPossibleTypes: MathTaskType[] = ['STANDARD', 'COUNTING', 'VISUAL', 'DOT_FRAME', 'LOGIC', 'COMPARE', 'MISSING_NUMBER', 'MONEY', 'CLOCK', 'RECHENTABELLE'];
      const validForOp = allPossibleTypes.filter(t => getValidTypes(op).includes(t));
      let newPool = shuffle(validForOp);
      
      // Ensure the first item of the new pool isn't the same as the last task
      if (newPool.length > 1 && newPool[0] === lastTaskTypeRef.current) {
        // Find something different and swap it to the front
        const swapIdx = newPool.findIndex(t => t !== lastTaskTypeRef.current);
        if (swapIdx !== -1) {
          [newPool[0], newPool[swapIdx]] = [newPool[swapIdx], newPool[0]];
        }
      }
      taskPoolRef.current = newPool;
    }

    const finalType = taskPoolRef.current.shift() || 'STANDARD';
    lastTaskTypeRef.current = finalType;
    setTaskType(finalType);

    let a = 0, b = 0, answer = 0, story = '', items = '';
    let signature = '';

    // Try up to 30 times to find a unique question signature
    for (let attempt = 0; attempt < 30; attempt++) {
      a = 0; b = 0; answer = 0; story = ''; items = '';
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];

      if (finalType === 'LOGIC') {
        const logicSubTypes = ['PATTERN', 'SEQUENCE'];
        const st = logicSubTypes[Math.floor(Math.random() * logicSubTypes.length)];
        if (st === 'PATTERN') {
          const idx1 = Math.floor(Math.random() * EMOJIS.length);
          let idx2 = Math.floor(Math.random() * EMOJIS.length);
          while (idx1 === idx2) idx2 = Math.floor(Math.random() * EMOJIS.length);
          
          const patternEmojis = [EMOJIS[idx1], EMOJIS[idx2]];
          const patternTypes = [
            { pattern: [0, 1, 0, 1, 0], nextIndex: 1 }, // ABABA -> B
            { pattern: [1, 0, 1, 0, 1], nextIndex: 0 }, // BABAB -> A
            { pattern: [0, 0, 1, 0, 0], nextIndex: 1 }, // AABAA -> B
            { pattern: [1, 1, 0, 1, 1], nextIndex: 0 }, // BBABB -> A
            { pattern: [0, 1, 1, 0, 1], nextIndex: 1 }, // ABBAB -> B
            { pattern: [1, 0, 0, 1, 0], nextIndex: 0 }, // BAABA -> A
            { pattern: [0, 0, 1, 1, 0], nextIndex: 0 }, // AABBA -> A
            { pattern: [1, 1, 0, 0, 1], nextIndex: 1 }, // BBAAB -> B
            { pattern: [0, 1, 1, 1, 0], nextIndex: 1 }, // ABBB -> B
            { pattern: [1, 0, 0, 0, 1], nextIndex: 0 }, // BAAA -> A
            { pattern: [0, 0, 0, 1, 0], nextIndex: 0 }, // AAAB -> A
            { pattern: [1, 1, 1, 0, 1], nextIndex: 1 }, // BBBA -> B
            { pattern: [0, 1, 0, 1, 0, 1], nextIndex: 0 }, // ABABAB -> A
            { pattern: [1, 0, 1, 0, 1, 0], nextIndex: 1 }, // BABABA -> B
            { pattern: [0, 0, 1, 1, 0, 0], nextIndex: 1 }, // AABBAA -> B
            { pattern: [1, 1, 0, 0, 1, 1], nextIndex: 0 }, // BBAABB -> A
            { pattern: [0, 1, 1, 0, 1, 1], nextIndex: 0 }, // ABBABB -> A
            { pattern: [1, 0, 0, 1, 0, 0], nextIndex: 1 }, // BAABAA -> B
            { pattern: [0, 0, 0, 1, 0, 0, 0], nextIndex: 1 }, // AAABAAA -> B
            { pattern: [1, 1, 1, 0, 1, 1, 1], nextIndex: 0 }, // BBBA -> A
            { pattern: [0, 0, 1, 1, 1, 0, 0], nextIndex: 1 }, // AABBBAA -> B
            { pattern: [1, 1, 0, 0, 0, 1, 1], nextIndex: 0 }, // BBAAABB -> A
            { pattern: [0, 1, 1, 0, 1, 1, 0], nextIndex: 1 }, // ABBABBA -> B
            { pattern: [1, 0, 0, 1, 0, 0, 1], nextIndex: 0 }, // BAABAAB -> A
            { pattern: [0, 0, 1, 0, 0, 1, 0], nextIndex: 0 }, // AABAABA -> A
            { pattern: [1, 1, 0, 1, 1, 0, 1], nextIndex: 1 }  // BBABBA -> B
          ];
          const selectedPatternConfig = patternTypes[Math.floor(Math.random() * patternTypes.length)];
          const nextIndex = selectedPatternConfig.nextIndex;

          answer = nextIndex + 1; // 1 for emojiA, 2 for emojiB
          story = "Was kommt als Nächstes?";
          items = JSON.stringify({ 
            type: 'PATTERN', 
            sequence: selectedPatternConfig.pattern.map(i => patternEmojis[i]), 
            next: patternEmojis[nextIndex], 
            emojiA: patternEmojis[0], 
            emojiB: patternEmojis[1] 
          });
          signature = `${finalType}_PATTERN_${selectedPatternConfig.pattern.join('')}`;
        } else {
          // Robust, mathematically correct Sequence Generation tailored for maxNumber (e.g. 5, 10, 20, 50, 100)
          // Ensure all terms are >= 0 and <= maxNumber
          const seqTypeChoices: string[] = [];
          
          // 1. Counting up (always possible if maxNumber >= 4)
          if (maxNumber >= 4) {
            seqTypeChoices.push('UP');
          }
          // 2. Counting down (always possible if maxNumber >= 4)
          if (maxNumber >= 4) {
            seqTypeChoices.push('DOWN');
          }
          // 3. Alternating sequence (requires at least maxNumber >= 6)
          // span of alternating is 2 * stepA + 2 * stepB. Minimum is 2*2 + 2*1 = 6. So start + 6 <= maxNumber
          if (maxNumber >= 6) {
            seqTypeChoices.push('ALTERNATING');
          }
          // 4. Geometric doubling sequence (requires maxNumber >= 16)
          if (maxNumber >= 16) {
            seqTypeChoices.push('GEOMETRIC');
          }
          // 5. Fibonacci sequence (requires maxNumber >= 5)
          // 2*f0 + 3*f1 <= maxNumber. Minimum is 2*1 + 3*1 = 5.
          if (maxNumber >= 5) {
            seqTypeChoices.push('FIBONACCI');
          }

          // Fallback if maxNumber is somehow < 4
          if (seqTypeChoices.length === 0) {
            seqTypeChoices.push('UP');
          }

          const chosenType = seqTypeChoices[Math.floor(Math.random() * seqTypeChoices.length)];
          let seq: number[] = [];
          let isMissingIdx = 0;

          if (chosenType === 'UP') {
            // Find all possible steps where 4 * step <= maxNumber
            const possibleSteps = [1, 2, 5, 10].filter(s => 4 * s <= maxNumber);
            const step = possibleSteps.length > 0 ? possibleSteps[Math.floor(Math.random() * possibleSteps.length)] : 1;
            const start = Math.floor(Math.random() * (maxNumber - 4 * step + 1));
            for (let i = 0; i < 5; i++) {
              seq.push(start + i * step);
            }
          } else if (chosenType === 'DOWN') {
            const possibleSteps = [1, 2, 5, 10].filter(s => 4 * s <= maxNumber);
            const step = possibleSteps.length > 0 ? possibleSteps[Math.floor(Math.random() * possibleSteps.length)] : 1;
            const start = Math.floor(Math.random() * (maxNumber - 4 * step + 1)) + 4 * step;
            for (let i = 0; i < 5; i++) {
              seq.push(start - i * step);
            }
          } else if (chosenType === 'ALTERNATING') {
            // Find combinations of positive integers stepA and stepB such that
            // stepA != stepB, and 2 * stepA + 2 * stepB <= maxNumber
            const validPairs: [number, number][] = [];
            for (let sa = 1; sa <= 5; sa++) {
              for (let sb = 1; sb <= 5; sb++) {
                if (sa !== sb && 2 * sa + 2 * sb <= maxNumber) {
                  validPairs.push([sa, sb]);
                }
              }
            }
            const pair = validPairs.length > 0 ? validPairs[Math.floor(Math.random() * validPairs.length)] : [2, 1] as [number, number];
            const [stepA, stepB] = pair;
            const span = 2 * stepA + 2 * stepB;
            const start = Math.floor(Math.random() * (maxNumber - span + 1));
            let current = start;
            for (let i = 0; i < 5; i++) {
              seq.push(current);
              current += (i % 2 === 0) ? stepA : stepB;
            }
          } else if (chosenType === 'GEOMETRIC') {
            // start * 16 <= maxNumber
            const maxStart = Math.floor(maxNumber / 16);
            const start = Math.floor(Math.random() * maxStart) + 1;
            for (let i = 0; i < 5; i++) {
              seq.push(start * Math.pow(2, i));
            }
          } else if (chosenType === 'FIBONACCI') {
            // Find positive f0, f1 pairs such that 2*f0 + 3*f1 <= maxNumber
            const validPairs: [number, number][] = [];
            for (let f0 = 1; f0 <= maxNumber; f0++) {
              for (let f1 = 1; f1 <= maxNumber; f1++) {
                if (2 * f0 + 3 * f1 <= maxNumber) {
                  validPairs.push([f0, f1]);
                }
              }
            }
            const pair = validPairs.length > 0 ? validPairs[Math.floor(Math.random() * validPairs.length)] : [1, 1] as [number, number];
            const [f0, f1] = pair;
            seq.push(f0);
            seq.push(f1);
            seq.push(f0 + f1);
            seq.push(f1 + (f0 + f1));
            seq.push((f0 + f1) + (f1 + (f0 + f1)));
          }

          isMissingIdx = Math.floor(Math.random() * 5);
          answer = seq[isMissingIdx];
          const displaySeq = [...seq];
          displaySeq.splice(isMissingIdx, 1);
          
          story = "Welche Zahl fehlt?";
          items = JSON.stringify({ 
            type: 'SEQUENCE', 
            sequence: displaySeq, 
            missingIdx: isMissingIdx,
            full: seq
          });
          signature = `${finalType}_SEQUENCE_${seq.join(',')}_missing_${isMissingIdx}`;
        }
      } else if (finalType === 'COMPARE') {
        a = Math.floor(Math.random() * maxNumber);
        b = Math.floor(Math.random() * maxNumber);
        if (a < b) answer = 1;
        else if (a === b) answer = 2;
        else answer = 3;
        story = "Vergleiche die Zahlen:";
        signature = `${finalType}_COMPARE_${a}_${b}`;
      } else if (finalType === 'MISSING_NUMBER') {
        const effectiveMax = Math.min(maxNumber, 20);
        const isA = Math.random() > 0.5;
        if (op === '+') {
          const total = Math.floor(Math.random() * (effectiveMax - 2)) + 2;
          const part = Math.floor(Math.random() * (total - 1)) + 1;
          if (isA) { a = part; b = total - part; answer = a; }
          else { a = total - part; b = part; answer = b; }
        } else {
          const start = Math.floor(Math.random() * (effectiveMax - 1)) + 2;
          const sub = Math.floor(Math.random() * (start - 1)) + 1;
          if (isA) { a = start; b = start - sub; answer = a; }
          else { a = start; b = sub; answer = b; }
        }
        items = isA ? 'A' : 'B';
        story = "Welche Zahl fehlt?";
        signature = `${finalType}_MISSING_NUMBER_${a}_${op}_${b}`;
      } else if (finalType === 'COUNTING') {
        const effectiveMax = Math.min(maxNumber, 20);
        answer = Math.floor(Math.random() * effectiveMax) + 1;
        items = emoji;
        story = "Wieviele Punkte siehst Du?";
        signature = `${finalType}_COUNTING_${answer}`;
      } else if (finalType === 'DOT_FRAME') {
        const currentMax = Math.min(maxNumber, 20);
        if (op === '+') {
          answer = Math.floor(Math.random() * (currentMax - 1)) + 2;
          a = Math.floor(Math.random() * (answer - 1)) + 1;
          b = answer - a;
        } else if (op === '-') {
          a = Math.floor(Math.random() * (currentMax - 1)) + 2;
          b = Math.floor(Math.random() * (a - 1)) + 1;
          answer = a - b;
        }
        story = "Wieviele Punkte siehst Du?";
        signature = `${finalType}_DOT_FRAME_${a}_${op}_${b}`;
      } else if (finalType === 'MONEY') {
        const mode = Math.random() > 0.5 ? 'EURO' : 'CENT';
        let sum = 0;
        let moneyItems: { type: string; value: number }[] = [];

        if (mode === 'EURO') {
          // Sum up to 20 Euro
          sum = Math.floor(Math.random() * 20) + 1; // 1 to 20

          // Break down sum into standard Euro bills (20, 10, 5) and coins (2, 1)
          let temp = sum;
          const billsAndCoins = [20, 10, 5, 2, 1];
          for (const val of billsAndCoins) {
            while (temp >= val) {
              if (val === 10 && temp >= 10 && Math.random() > 0.4) {
                moneyItems.push({ type: 'bill', value: 5 });
                moneyItems.push({ type: 'bill', value: 5 });
                temp -= 10;
              } else if (val === 5 && temp >= 5 && Math.random() > 0.4) {
                moneyItems.push({ type: 'coin', value: 2 });
                moneyItems.push({ type: 'coin', value: 2 });
                moneyItems.push({ type: 'coin', value: 1 });
                temp -= 5;
              } else {
                moneyItems.push({ type: val >= 5 ? 'bill' : 'coin', value: val });
                temp -= val;
              }
            }
          }

          moneyItems.sort((x, y) => {
            if (x.type !== y.type) return x.type === 'bill' ? -1 : 1;
            return y.value - x.value;
          });

          story = "Wie viel Euro (€) ist das zusammen?";
          answer = sum;
          items = JSON.stringify({ mode: 'EURO', moneyItems });
          signature = `${finalType}_EURO_${sum}`;
        } else {
          // Cent up to 20 Cent
          sum = Math.floor(Math.random() * 20) + 1; // 1 to 20

          // Cent coins: 20, 10, 5, 2, 1
          let temp = sum;
          const centCoins = [20, 10, 5, 2, 1];
          for (const val of centCoins) {
            while (temp >= val) {
              if (val === 10 && temp >= 10 && Math.random() > 0.4) {
                moneyItems.push({ type: 'coin-c', value: 5 });
                moneyItems.push({ type: 'coin-c', value: 5 });
                temp -= 10;
              } else if (val === 5 && temp >= 5 && Math.random() > 0.4) {
                moneyItems.push({ type: 'coin-c', value: 2 });
                moneyItems.push({ type: 'coin-c', value: 2 });
                moneyItems.push({ type: 'coin-c', value: 1 });
                temp -= 5;
              } else {
                moneyItems.push({ type: 'coin-c', value: val });
                temp -= val;
              }
            }
          }

          moneyItems.sort((x, y) => y.value - x.value);

          story = "Wie viel Cent ist das zusammen?";
          answer = sum;
          items = JSON.stringify({ mode: 'CENT', moneyItems });
          signature = `${finalType}_CENT_${sum}`;
        }
      } else if (finalType === 'CLOCK') {
        const hour = Math.floor(Math.random() * 12) + 1; // 1 to 12
        story = "Wie spät ist es?";
        answer = hour;
        items = JSON.stringify({ hour });
        signature = `${finalType}_${hour}`;
      } else if (finalType === 'RECHENTABELLE') {
        const activeOp = (op === '+' || op === '-' || op === '*') ? op : '+';
        let rowHeaders: number[] = [];
        let colHeaders: number[] = [];
        let grid: number[][] = [];
        
        if (activeOp === '+') {
          const limit = Math.max(3, Math.floor(maxNumber / 2));
          const r1 = Math.floor(Math.random() * (limit - 1)) + 1;
          let r2 = Math.floor(Math.random() * (limit - 1)) + 1;
          if (r1 === r2 && limit > 2) {
            r2 = r1 === limit - 1 ? r1 - 1 : r1 + 1;
          }
          const c1 = Math.floor(Math.random() * (limit - 1)) + 1;
          let c2 = Math.floor(Math.random() * (limit - 1)) + 1;
          if (c1 === c2 && limit > 2) {
            c2 = c1 === limit - 1 ? c1 - 1 : c1 + 1;
          }
          rowHeaders = [r1, r2];
          colHeaders = [c1, c2];
          grid = [
            [r1 + c1, r1 + c2],
            [r2 + c1, r2 + c2]
          ];
        } else if (activeOp === '-') {
          const half = Math.max(2, Math.floor(maxNumber / 2));
          const colLimit = Math.max(2, Math.floor(half / 2));
          const c1 = Math.floor(Math.random() * colLimit) + 1;
          let c2 = Math.floor(Math.random() * colLimit) + 1;
          if (c1 === c2 && colLimit > 1) {
            c2 = c1 === colLimit ? c1 - 1 : c1 + 1;
          }
          const maxC = Math.max(c1, c2);
          const r1 = Math.floor(Math.random() * (maxNumber - maxC)) + maxC + 1;
          let r2 = Math.floor(Math.random() * (maxNumber - maxC)) + maxC + 1;
          if (r1 === r2 && maxNumber - maxC > 1) {
            r2 = r1 === maxNumber ? r1 - 1 : r1 + 1;
          }
          rowHeaders = [r1, r2];
          colHeaders = [c1, c2];
          grid = [
            [r1 - c1, r1 - c2],
            [r2 - c1, r2 - c2]
          ];
        } else { // activeOp === '*'
          const limit = Math.max(3, Math.floor(Math.sqrt(maxNumber)));
          const r1 = Math.floor(Math.random() * (limit - 1)) + 1;
          let r2 = Math.floor(Math.random() * (limit - 1)) + 1;
          if (r1 === r2 && limit > 2) {
            r2 = r1 === limit - 1 ? r1 - 1 : r1 + 1;
          }
          const c1 = Math.floor(Math.random() * (limit - 1)) + 1;
          let c2 = Math.floor(Math.random() * (limit - 1)) + 1;
          if (c1 === c2 && limit > 2) {
            c2 = c1 === limit - 1 ? c1 - 1 : c1 + 1;
          }
          rowHeaders = [r1, r2];
          colHeaders = [c1, c2];
          grid = [
            [r1 * c1, r1 * c2],
            [r2 * c1, r2 * c2]
          ];
        }
        
        const targetRow = Math.floor(Math.random() * 2);
        const targetCol = Math.floor(Math.random() * 2);
        
        answer = grid[targetRow][targetCol];
        story = "Fülle die Rechentabelle aus. Welche Zahl gehört in das Feld mit dem Fragezeichen?";
        items = JSON.stringify({
          operator: activeOp,
          rowHeaders,
          colHeaders,
          targetRow,
          targetCol,
          grid
        });
        signature = `${finalType}_${activeOp}_${rowHeaders.join('_')}_${colHeaders.join('_')}_T_${targetRow}_${targetCol}`;
      } else {
        const effectiveMax = (finalType === 'VISUAL') ? Math.min(maxNumber, 10) : maxNumber;
        
        if (op === '+') {
          answer = Math.floor(Math.random() * (effectiveMax - 1)) + 2;
          a = Math.floor(Math.random() * (answer - 1)) + 1;
          b = answer - a;
          items = animal;
          story = "";
        } else if (op === '-') {
          a = Math.floor(Math.random() * (effectiveMax - 1)) + 2;
          b = Math.floor(Math.random() * (a - 1)) + 1;
          answer = a - b;
          items = '🥜';
          story = "";
        } else if (op === '*') {
          const possible: [number, number][] = [];
          const limit = (finalType === 'VISUAL') ? 10 : maxNumber;
          for (let i = 1; i <= Math.sqrt(limit); i++) {
            for (let j = 1; j <= limit / i; j++) if (i * j <= limit && i > 1 && j > 1) possible.push([i, j]);
          }
          if (possible.length === 0) { a = 1; b = Math.floor(Math.random() * effectiveMax) + 1; }
          else { const p = possible[Math.floor(Math.random() * possible.length)]; a = p[0]; b = p[1]; }
          answer = a * b;
          items = '🍎';
          story = "";
        } else if (op === '/') {
          const limit = (finalType === 'VISUAL') ? 10 : maxNumber;
          const possible: [number, number][] = [];
          for (let d = 2; d <= limit; d++) {
            for (let q = 1; q <= limit / d; q++) possible.push([d * q, d]);
          }
          if (possible.length === 0) { a = Math.floor(Math.random() * effectiveMax) + 1; b = 1; }
          else { const p = possible[Math.floor(Math.random() * possible.length)]; a = p[0]; b = p[1]; }
          answer = a / b;
          items = emoji;
          story = "";
        }
        signature = `${finalType}_${a}_${op}_${b}`;
      }

      // Keep looking if signature has been recently used, unless we ran out of retries
      if (!recentQuestionsRef.current.includes(signature) || attempt === 29) {
        break;
      }
    }

    // Remember signature of recently asked questions
    recentQuestionsRef.current.push(signature);
    if (recentQuestionsRef.current.length > 15) {
      recentQuestionsRef.current.shift();
    }

    setQuestion({ a, b, op, answer, story, items });

    const opts = new Set<number>();
    opts.add(answer);
    
    if (finalType === 'LOGIC') {
      try {
        const data = JSON.parse(items);
        if (data.type === 'PATTERN') {
          opts.add(answer === 1 ? 2 : 1);
        } else {
          while (opts.size < 4) {
            const offset = Math.floor(Math.random() * 5) + 1;
            const o = Math.random() > 0.5 ? answer + offset : answer - offset;
            if (o >= 0) opts.add(o);
          }
        }
      } catch (e) {
        while (opts.size < 4) {
          const offset = Math.floor(Math.random() * 5) + 1;
          const o = Math.random() > 0.5 ? answer + offset : answer - offset;
          if (o >= 0) opts.add(o);
        }
      }
    } else if (finalType === 'COMPARE') {
      opts.add(1);
      opts.add(2);
      opts.add(3);
    } else if (finalType === 'CLOCK') {
      while (opts.size < 4) {
        const o = Math.floor(Math.random() * 12) + 1;
        opts.add(o);
      }
    } else {
      while (opts.size < 4) {
        const offset = Math.floor(Math.random() * 5) + 1;
        const o = Math.random() > 0.5 ? answer + offset : answer - offset;
        if (o >= 0) opts.add(o);
      }
    }
    setOptions(Array.from(opts).sort((x, y) => x - y));
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [maxNumber, enabledOperators.join(',')]);

  const handleAnswer = async (selected: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const isCorrect = selected === question.answer;
    setIsLastCorrect(isCorrect);
    setFeedback("show");
    
    if (isCorrect) {
      onScoreChange(1);
      const newSessionPoints = sessionPoints + 1;
      setSessionPoints(newSessionPoints);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD93D', '#6BCB77', '#4D96FF']
      });

      if (!onCorrectAnswer && newSessionPoints % 5 === 0) {
        setTimeout(() => { 
          setIsProcessing(false); 
          setLevel(l => l + 1); 
          onBonus(); 
          setFeedback(null);
          if (onCorrectAnswer) {
            onCorrectAnswer();
          }
        }, 2000);
        return;
      }
    } else {
      onScoreChange(-1);
    }

    const processingTime = isCorrect ? 2000 : 1000;

    setTimeout(() => {
      setIsProcessing(false);
      setFeedback(null);
      if (isCorrect) {
        if (onCorrectAnswer) {
          onCorrectAnswer();
        } else {
          generateQuestion();
        }
      }
    }, processingTime);
  };

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <button onClick={onBack} className="p-2 rounded-full bg-white kid-shadow kid-shadow-hover hover:bg-gray-50 flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="flex items-center gap-1.5 sm:gap-4 text-[10px] sm:text-xs font-bold">
          {adventureMathSolved !== undefined && adventureGermanSolved !== undefined ? (
            <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full mr-1 sm:mr-2 border border-white/40 shadow-sm">
              <span className="text-[9px] uppercase tracking-wider text-[#8B4513]/70 font-black mr-0.5 leading-none">Aufgaben:</span>
              <div className="flex gap-1 items-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`math-${i}`}
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] sm:text-[9px] transition-all ${
                      i < adventureMathSolved 
                        ? 'bg-brand-blue text-white scale-110 font-black' 
                        : 'bg-gray-150 text-gray-400 border border-gray-200'
                    }`}
                  >
                    +
                  </motion.div>
                ))}
                <span className="text-gray-300 text-[10px] sm:mx-0.5 pointer-events-none">•</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`german-${i}`}
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] sm:text-[9px] transition-all ${
                      i < adventureGermanSolved 
                        ? 'bg-brand-red text-white scale-110 font-black' 
                        : 'bg-gray-150 text-gray-400 border border-gray-200'
                    }`}
                  >
                    A
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-1 items-center bg-white/50 px-2 sm:px-3 py-1 rounded-full mr-1 sm:mr-2">
              {Array.from({ length: sessionPoints % 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-brand-yellow rounded-full"
                />
              ))}
            </div>
          )}
          <div className="bg-brand-yellow px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-white border-2 border-white/50 kid-shadow flex-shrink-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-white" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="bg-brand-green text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex-shrink-0">Level {level}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={`${taskType}-${question.a}-${question.b}-${question.op}-${question.answer}`}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-4 sm:p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] kid-shadow text-center relative overflow-hidden min-h-[300px] md:min-h-[450px] flex flex-col justify-center border-b-8 border-brand-blue/20"
        >
          <div className="absolute top-0 left-0 w-full h-3 md:h-4 bg-brand-blue pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-gray-50 rounded-full opacity-50 pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gray-50 rounded-full opacity-50 pointer-events-none" />
          
          <div className="mb-6 md:mb-8">
          {(taskType === 'STANDARD' || taskType === 'VISUAL' || taskType === 'DOT_FRAME' || taskType === 'COUNTING') && question.story && (
            <p className="font-display text-sm sm:text-base md:text-xl text-brand-blue mb-4 sm:mb-6 bg-brand-blue/5 p-3 sm:p-4 rounded-2xl border border-brand-blue/10 max-w-lg mx-auto leading-relaxed">
              {question.story}
            </p>
          )}
          {taskType === 'COMPARE' && (
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
              {question.story && (
                <p className="font-display text-base sm:text-lg md:text-2xl text-brand-blue mb-2 sm:mb-6 bg-brand-blue/5 p-3 sm:p-4 rounded-2xl border border-brand-blue/10 max-w-lg mx-auto leading-relaxed font-bold">
                  {question.story}
                </p>
              )}
              <div className="flex items-center gap-6 sm:gap-12 md:gap-16 bg-gray-50 p-6 sm:p-10 md:p-14 rounded-[40px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200">
                <span className="font-display text-5xl sm:text-7xl md:text-9xl text-brand-orange font-bold select-none">{question.a}</span>
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-2xl md:rounded-[2rem] border-4 border-gray-200 shadow-inner flex items-center justify-center">
                  <span className="text-3xl sm:text-5xl md:text-7xl text-brand-yellow font-black animate-pulse">?</span>
                </div>
                <span className="font-display text-5xl sm:text-7xl md:text-9xl text-brand-blue font-bold select-none">{question.b}</span>
              </div>
            </div>
          )}
          {taskType === 'MISSING_NUMBER' && (
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
              {question.story && (
                <p className="font-display text-base sm:text-lg md:text-2xl text-brand-blue mb-2 sm:mb-6 bg-brand-blue/5 p-3 sm:p-4 rounded-2xl border border-brand-blue/10 max-w-lg mx-auto leading-relaxed font-bold">
                  {question.story}
                </p>
              )}
              <div className="flex items-center gap-3 sm:gap-6 md:gap-10 font-display text-4xl sm:text-6xl md:text-[5.5rem] bg-gray-50 p-6 sm:p-10 md:p-14 rounded-[40px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200 max-w-full justify-center select-none font-bold">
                {question.items === 'A' ? (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white rounded-2xl border-4 border-gray-200 shadow-inner flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl md:text-6xl text-brand-yellow font-black animate-pulse">?</span>
                  </div>
                ) : (
                  <span className="text-brand-orange">{question.a}</span>
                )}
                
                <span className="text-gray-300">{question.op === '+' ? '+' : '-'}</span>

                {question.items === 'B' ? (
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white rounded-2xl border-4 border-gray-200 shadow-inner flex items-center justify-center">
                    <span className="text-2xl sm:text-4xl md:text-6xl text-brand-yellow font-black animate-pulse">?</span>
                  </div>
                ) : (
                  <span className="text-brand-blue">{question.b}</span>
                )}

                <span className="text-gray-300">=</span>
                
                <span className="text-brand-green font-extrabold">
                  {question.op === '+' ? question.a + question.b : question.a - question.b}
                </span>
              </div>
            </div>
          )}
          {taskType === 'LOGIC' && (
            <div className="flex flex-col items-center gap-4 sm:gap-8 w-full">
              <div className="bg-gray-50 p-4 sm:p-8 md:p-12 rounded-[40px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200 w-full overflow-hidden">
                {(() => {
                  try {
                    const data = JSON.parse(question.items);
                    if (data.type === 'PATTERN') {
                      return (
                        <div className="flex flex-col items-center gap-4 sm:gap-8 w-full">
                          <p className="font-display text-base sm:text-xl md:text-3xl text-brand-blue mb-1 sm:mb-4 font-bold">{question.story}</p>
                          <div className="flex flex-nowrap gap-2 sm:gap-4 md:gap-6 items-center justify-center bg-white p-4 sm:p-8 rounded-3xl shadow-inner border border-gray-100 w-full select-none overflow-x-auto whitespace-nowrap scrollbar-none">
                            {data.sequence.map((s: string, i: number) => (
                              <span key={i} className="text-2xl sm:text-4xl md:text-6xl flex-shrink-0">{s}</span>
                            ))}
                            <span className="text-2xl sm:text-4xl md:text-6xl text-brand-yellow font-blank font-black animate-pulse flex-shrink-0">?</span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex flex-col items-center gap-4 sm:gap-8 w-full">
                          <p className="font-display text-base sm:text-xl md:text-3xl text-brand-blue mb-1 sm:mb-4 font-bold">{question.story}</p>
                          <div className="flex flex-nowrap gap-3 sm:gap-6 md:gap-8 items-center justify-center bg-white p-4 sm:p-8 rounded-3xl shadow-inner border border-gray-100 w-full select-none overflow-x-auto whitespace-nowrap scrollbar-none">
                            {(() => {
                              const data = JSON.parse(question.items);
                              const full = data.full;
                              const missingIdx = data.missingIdx;
                              return full.map((s: number, i: number) => (
                                <React.Fragment key={i}>
                                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                    {i === missingIdx ? (
                                      <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display text-brand-yellow animate-pulse font-black">?</span>
                                    ) : (
                                      <span className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display text-slate-800 font-black">{s}</span>
                                    )}
                                    {i < full.length - 1 && <span className="text-gray-300 text-2xl sm:text-4xl md:text-6xl lg:text-7xl px-1 sm:px-2 pointer-events-none">...</span>}
                                  </div>
                                </React.Fragment>
                              ));
                            })()}
                          </div>
                        </div>
                      );
                    }
                  } catch (e) {
                    return <div>Fehler beim Laden der Logikaufgabe</div>;
                  }
                })()}
              </div>
            </div>
          )}
          {taskType === 'COUNTING' && (
            <div className="flex flex-col items-center gap-4 sm:gap-8 w-full">
              {question.answer <= 20 ? (
                <div className="flex flex-col gap-2 sm:gap-4 md:gap-8 p-3 sm:p-5 md:p-8 bg-gray-100 rounded-3xl md:rounded-[48px] border-2 sm:border-4 border-gray-200 shadow-inner w-full max-w-full overflow-hidden">
                  {[0, 1].map(rowIdx => (
                    <div key={rowIdx} className="flex gap-2 sm:gap-6 md:gap-12 lg:gap-16 justify-center mb-2 sm:mb-4 md:mb-6 lg:mb-8 last:mb-0">
                      {[0, 1].map(groupIdx => (
                        <div key={groupIdx} className="flex gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
                          {Array.from({ length: 5 }).map((_, dotIdx) => {
                            const i = rowIdx * 10 + groupIdx * 5 + dotIdx;
                            let bgColor = "bg-white";
                            if (i < question.answer) {
                              bgColor = Math.floor(i / 5) % 2 === 0 ? "bg-brand-blue" : "bg-brand-red";
                            }
                            return (
                              <div key={i} className={`w-3.5 h-3.5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all ${bgColor} border-[1px] md:border-4 border-gray-200/50 shadow-sm md:shadow-md flex-shrink-0`} />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-4xl sm:text-6xl md:text-7xl tracking-widest leading-relaxed p-6 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200 max-w-full select-none">
                  {Array(question.answer).fill(question.items).join(' ')}
                </div>
              )}
            </div>
          )}
          {taskType === 'VISUAL' && (
            <div className="flex flex-col items-center gap-6 sm:gap-12 w-full">
              <div className="flex justify-center items-center gap-4 sm:gap-12 bg-gray-50 p-6 sm:p-10 rounded-[32px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200 max-w-full">
                <div className="flex flex-wrap max-w-[120px] sm:max-w-[200px] gap-1.5 sm:gap-3 justify-center select-none">{Array(question.a).fill(question.items).map((e,i) => <span key={i} className="text-3xl sm:text-5xl md:text-6xl">{e}</span>)}</div>
                <span className="text-gray-300 font-display text-3xl sm:text-6xl font-bold select-none">{question.op === '*' ? '×' : question.op}</span>
                <div className="flex flex-wrap max-w-[120px] sm:max-w-[200px] gap-1.5 sm:gap-3 justify-center select-none">{Array(question.b).fill(question.items).map((e,i) => <span key={i} className="text-3xl sm:text-5xl md:text-6xl">{e}</span>)}</div>
              </div>
            </div>
          )}
          {taskType === 'DOT_FRAME' && (
            <div className="flex flex-col items-center gap-4 sm:gap-10 w-full">
              <div className="flex flex-col gap-2 sm:gap-4 md:gap-8 p-3 sm:p-5 md:p-8 bg-gray-100 rounded-3xl md:rounded-[48px] border-2 sm:border-4 border-gray-200 shadow-inner w-full max-w-full overflow-hidden">
                {[0, 1].map(rowIdx => (
                  <div key={rowIdx} className="flex gap-2 sm:gap-6 md:gap-12 lg:gap-16 justify-center mb-2 sm:mb-4 md:mb-6 lg:mb-8 last:mb-0">
                    {[0, 1].map(groupIdx => (
                      <div key={groupIdx} className="flex gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
                        {Array.from({ length: 5 }).map((_, dotIdx) => {
                          const i = rowIdx * 10 + groupIdx * 5 + dotIdx;
                          let bgColor = "bg-white";
                          let content = null;

                          if (i < (question.op === '-' ? (question.a - question.b) : (question.a + question.b))) {
                            bgColor = Math.floor(i / 5) % 2 === 0 ? "bg-brand-blue" : "bg-brand-red";
                          }

                          return (
                            <div 
                              key={i} 
                              className={`w-3.5 h-3.5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all ${bgColor} border-[1px] md:border-4 border-gray-200/50 shadow-sm md:shadow-md flex-shrink-0`}
                            >
                              {content}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          )}
          {taskType === 'MONEY' && (
            <div className="flex flex-col items-center gap-4 sm:gap-8 w-full">
              <div className="bg-gray-50 p-4 sm:p-6 md:p-10 rounded-[32px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200 w-full">
                <p className="font-display text-lg sm:text-2xl md:text-3xl text-brand-blue mb-6 sm:mb-8 font-bold leading-normal">
                  {question.story}
                </p>
                <div className="flex flex-wrap gap-y-8 gap-x-6 sm:gap-y-12 sm:gap-x-10 items-center justify-center bg-white p-6 sm:p-12 md:p-16 rounded-3xl shadow-inner border border-gray-150 w-full select-none">
                  {(() => {
                    try {
                      const data = JSON.parse(question.items);
                      return data.moneyItems.map((item: any, idx: number) => {
                        if (item.type === 'bill') {
                          return <EuroBill key={idx} value={item.value} />;
                        } else if (item.type === 'coin') {
                          return <EuroCoin key={idx} value={item.value} />;
                        } else {
                          return <EuroCoin key={idx} value={item.value} isCent={true} />;
                        }
                      });
                    } catch (e) {
                      return <span className="text-brand-red font-bold">Fehler beim Laden</span>;
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
          {taskType === 'CLOCK' && (
            <div className="flex flex-col items-center gap-4 sm:gap-8 w-full">
              <div className="bg-gray-50 p-4 sm:p-6 md:p-10 rounded-[32px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200 w-full flex flex-col items-center justify-center">
                <p className="font-display text-lg sm:text-2xl md:text-3xl text-brand-blue mb-4 font-bold leading-normal text-center">
                  {question.story}
                </p>
                <div className="flex justify-center items-center bg-white p-4 sm:p-8 rounded-3xl shadow-inner border border-gray-150 w-full select-none">
                  {(() => {
                    try {
                      const data = JSON.parse(question.items);
                      return <AnalogClock hour={data.hour} />;
                    } catch (e) {
                      return <span className="text-brand-red font-bold">Fehler beim Laden</span>;
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
          {taskType === 'RECHENTABELLE' && (
            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
              <div className="bg-gray-50 p-4 sm:p-6 md:p-10 rounded-[32px] md:rounded-[3.5rem] border-4 border-dashed border-gray-200 w-full flex flex-col items-center justify-center">
                <p className="font-display text-lg sm:text-2xl md:text-3xl text-brand-blue mb-6 font-bold leading-normal text-center">
                  {question.story}
                </p>
                
                <div className="flex justify-center items-center bg-white p-4 sm:p-8 rounded-3xl shadow-inner border border-gray-150 w-full select-none">
                  {(() => {
                    try {
                      const data = JSON.parse(question.items);
                      const displayOp = data.operator === '*' ? '×' : data.operator;
                      
                      return (
                        <div className="w-full max-w-[280px] sm:max-w-[340px] aspect-square grid grid-cols-3 gap-2 sm:gap-3 bg-slate-100 p-2 sm:p-3 rounded-2xl border-2 border-slate-200">
                          {/* Row 0 */}
                          <div className="flex items-center justify-center bg-brand-orange text-white font-extrabold text-2xl sm:text-3xl rounded-xl shadow-sm">
                            {displayOp}
                          </div>
                          <div className="flex items-center justify-center bg-blue-50 text-brand-blue font-extrabold text-2xl sm:text-3xl rounded-xl border-2 border-blue-100 shadow-sm">
                            {data.colHeaders[0]}
                          </div>
                          <div className="flex items-center justify-center bg-blue-50 text-brand-blue font-extrabold text-2xl sm:text-3xl rounded-xl border-2 border-blue-100 shadow-sm">
                            {data.colHeaders[1]}
                          </div>

                          {/* Row 1 */}
                          <div className="flex items-center justify-center bg-green-50 text-brand-green font-extrabold text-2xl sm:text-3xl rounded-xl border-2 border-green-100 shadow-sm">
                            {data.rowHeaders[0]}
                          </div>
                          {data.targetRow === 0 && data.targetCol === 0 ? (
                            <div className="flex items-center justify-center bg-brand-yellow text-white font-black text-2xl sm:text-3xl rounded-xl shadow-md border-4 border-amber-300 animate-pulse">
                              ?
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-slate-50 text-slate-700 font-bold text-xl sm:text-2xl rounded-xl border border-slate-200 shadow-inner">
                              {data.grid[0][0]}
                            </div>
                          )}
                          {data.targetRow === 0 && data.targetCol === 1 ? (
                            <div className="flex items-center justify-center bg-brand-yellow text-white font-black text-2xl sm:text-3xl rounded-xl shadow-md border-4 border-amber-300 animate-pulse">
                              ?
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-slate-50 text-slate-700 font-bold text-xl sm:text-2xl rounded-xl border border-slate-200 shadow-inner">
                              {data.grid[0][1]}
                            </div>
                          )}

                          {/* Row 2 */}
                          <div className="flex items-center justify-center bg-green-50 text-brand-green font-extrabold text-2xl sm:text-3xl rounded-xl border-2 border-green-100 shadow-sm">
                            {data.rowHeaders[1]}
                          </div>
                          {data.targetRow === 1 && data.targetCol === 0 ? (
                            <div className="flex items-center justify-center bg-brand-yellow text-white font-black text-2xl sm:text-3xl rounded-xl shadow-md border-4 border-amber-300 animate-pulse">
                              ?
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-slate-50 text-slate-700 font-bold text-xl sm:text-2xl rounded-xl border border-slate-200 shadow-inner">
                              {data.grid[1][0]}
                            </div>
                          )}
                          {data.targetRow === 1 && data.targetCol === 1 ? (
                            <div className="flex items-center justify-center bg-brand-yellow text-white font-black text-2xl sm:text-3xl rounded-xl shadow-md border-4 border-amber-300 animate-pulse">
                              ?
                            </div>
                          ) : (
                            <div className="flex items-center justify-center bg-slate-50 text-slate-700 font-bold text-xl sm:text-2xl rounded-xl border border-slate-200 shadow-inner">
                              {data.grid[1][1]}
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return <span className="text-brand-red font-bold">Fehler beim Laden</span>;
                    }
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

          {taskType !== 'COUNTING' && taskType !== 'LOGIC' && taskType !== 'VISUAL' && taskType !== 'DOT_FRAME' && taskType !== 'COMPARE' && taskType !== 'MISSING_NUMBER' && taskType !== 'MONEY' && taskType !== 'CLOCK' && taskType !== 'RECHENTABELLE' && // Fallback
            <h2 className="font-display text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] mb-6 md:mb-12 flex justify-center items-center gap-3 md:gap-6 font-semibold select-none tracking-tight leading-none">
              <span className="text-brand-orange">{question.a}</span>
              <span className="text-gray-300">{question.op === '*' ? '×' : question.op === '/' ? '÷' : question.op}</span>
              <span className="text-brand-blue">{question.b}</span>
              <span className="text-gray-300">=</span>
              <span className="text-brand-yellow animate-bounce">?</span>
            </h2>
          }
          {(taskType === 'COUNTING' || taskType === 'VISUAL' || taskType === 'DOT_FRAME' || taskType === 'MONEY' || taskType === 'CLOCK' || taskType === 'RECHENTABELLE') && <h2 className="font-display text-5xl sm:text-7xl md:text-[7rem] mb-6 md:mb-12 flex justify-center items-center gap-3 md:gap-6 text-brand-yellow font-bold leading-none select-none">?</h2>}

          <div className={`grid ${taskType === 'COMPARE' ? 'grid-cols-3' : 'grid-cols-2'} gap-4 w-full`}>
            {options.map((opt) => (
              <button 
                key={opt} 
                disabled={isProcessing} 
                onClick={() => handleAnswer(opt)} 
                className={`py-6 rounded-2xl font-display text-2xl md:text-3xl kid-shadow kid-shadow-hover border-4 border-transparent transition-all 
                  ${isProcessing && isLastCorrect && opt === question.answer ? 'bg-brand-green text-white scale-105' : ''}
                  ${isProcessing && !isLastCorrect && opt === question.answer ? 'bg-gray-50 opacity-100' : ''}
                  ${isProcessing && opt !== question.answer ? 'opacity-30' : 'bg-gray-50'}
                  ${!isProcessing ? 'bg-gray-50 hover:bg-white active:bg-gray-100' : ''}
                `}
              >
                {taskType === 'COMPARE' ? (
                  opt === 1 ? '<' : opt === 2 ? '=' : '>'
                ) : (taskType === 'LOGIC' && (() => {
                  try {
                    const data = JSON.parse(question.items);
                    if (data.type === 'PATTERN') {
                      return opt === 1 ? data.emojiA : data.emojiB;
                    }
                  } catch (e) {}
                  return null;
                })()) || (taskType === 'MONEY' && (() => {
                  try {
                    const data = JSON.parse(question.items);
                    if (data.mode === 'EURO') {
                      return `${opt} €`;
                    } else {
                      return `${opt} Cent`;
                    }
                  } catch (e) {}
                  return `${opt}`;
                })()) || (taskType === 'CLOCK' && `${opt} Uhr`) || opt}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }} 
                className="mt-6 flex justify-center"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1.4, rotate: 0 }}
                  className={`w-24 h-24 bg-white rounded-[32px] kid-shadow flex flex-col items-center justify-center border-4 ${isLastCorrect ? 'border-brand-green' : 'border-brand-red'}`}
                >
                  <motion.div 
                    animate={isLastCorrect ? 
                      { 
                        y: [0, -40, 0], 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.5, 1.2] 
                      } : 
                      { 
                        y: [0, 10, 0],
                        x: [-5, 5, -5, 5, 0], 
                        rotate: [0, 15, 0],
                        scale: 0.8
                      }
                    }
                    transition={isLastCorrect ? 
                      { repeat: Infinity, duration: 0.8 } : 
                      { duration: 0.5 }
                    }
                    className="w-20 h-20 flex items-center justify-center relative"
                  >
                    {isLastCorrect ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <SquirrelMascot mood="HAPPY" className="w-16 h-16" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl select-none filter drop-shadow-sm">
                        😢
                      </div>
                    )}
                    {!isLastCorrect && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
                      >
                        <span className="text-4xl">🌧️</span>
                      </motion.div>
                    )}
                    {isLastCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-10 -right-10 w-12 h-12"
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                          <path 
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                            fill="#FF4D4D" 
                            stroke="#CC0000" 
                            strokeWidth="1.5" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
