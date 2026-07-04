import React from 'react';

interface SquirrelMascotProps {
  mood?: 'HAPPY' | 'SAD' | 'NEUTRAL';
  className?: string;
  style?: React.CSSProperties;
}

export default function SquirrelMascot({ mood = 'NEUTRAL', className = '', style }: SquirrelMascotProps) {
  // Let's design a beautifully crisp, scalable vector mascot for "SchlauEichi" from scratch.
  // Standard canvas dimensions: viewBox="0 0 100 100"
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`select-none pointer-events-none drop-shadow-md ${className}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'block',
        ...style 
      }}
    >
      <defs>
        {/* Tail gradients */}
        <linearGradient id="sqTailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        {/* Body gradients */}
        <linearGradient id="sqBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E28743" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        {/* Acorn gradients */}
        <linearGradient id="sqAcornGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        {/* Belly gradient */}
        <linearGradient id="sqBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEFBB8" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>

      {/* 1. FLUFFY BUSHY TAIL */}
      {mood === 'SAD' ? (
        // Drooping lower tail for sad mood
        <path 
          d="M 60,65 C 80,68 85,55 80,45 C 75,35 60,40 68,52 C 72,58 65,65 58,62 Z" 
          fill="url(#sqTailGrad)" 
          stroke="#78350F" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
      ) : (
        // Proud upright curly tail for neutral/happy moods
        <path 
          d="M 60,65 C 88,68 96,30 82,18 C 68,4 58,24 72,38 C 82,48 72,58 60,56 Z" 
          fill="url(#sqTailGrad)" 
          stroke="#78350F" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
      )}

      {/* Tail inner fluff detail */}
      {mood !== 'SAD' && (
        <path 
          d="M 68,54 C 84,56 88,38 78,26 C 70,16 66,28 74,38 H 75" 
          fill="none" 
          stroke="#FBBF24" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
      )}

      {/* 2. BACK FEET/LEGS */}
      {/* Left Foot */}
      <ellipse 
        cx="32" 
        cy="81" 
        rx="7.5" 
        ry="4.5" 
        fill="#92400E" 
        stroke="#78350F" 
        strokeWidth="2" 
      />
      {/* Right Foot */}
      <ellipse 
        cx="58" 
        cy="81" 
        rx="7.5" 
        ry="4.5" 
        fill="#92400E" 
        stroke="#78350F" 
        strokeWidth="2" 
      />

      {/* 3. ROUNDED CHUBBY BODY */}
      <ellipse 
        cx="45" 
        cy="61" 
        rx="19" 
        ry="22" 
        fill="url(#sqBodyGrad)" 
        stroke="#78350F" 
        strokeWidth="2.5" 
      />

      {/* Belly Patch Cream Colored */}
      <ellipse 
        cx="43" 
        cy="63" 
        rx="11" 
        ry="14" 
        fill="url(#sqBellyGrad)" 
      />

      {/* 4. HEAD */}
      <ellipse 
        cx="45" 
        cy="36" 
        rx="15.5" 
        ry="13" 
        fill="url(#sqBodyGrad)" 
        stroke="#78350F" 
        strokeWidth="2.5" 
      />

      {/* 5. EARS */}
      {mood === 'SAD' ? (
        // Drooped Ears for Sad Mood
        <>
          {/* Left sad ear */}
          <path 
            d="M 32,30 C 22,29 24,38 31,34 Z" 
            fill="#E28743" 
            stroke="#78350F" 
            strokeWidth="2" 
          />
          <path 
            d="M 33,31 C 26,31 27,36 31,33" 
            fill="#FCA5A5" 
          />
          {/* Right sad ear */}
          <path 
            d="M 58,30 C 68,29 66,38 59,34 Z" 
            fill="#E28743" 
            stroke="#78350F" 
            strokeWidth="2" 
          />
          <path 
            d="M 57,31 C 64,31 63,36 59,33" 
            fill="#FCA5A5" 
          />
        </>
      ) : (
        // Active Upright Ears
        <>
          {/* Left ear */}
          <path 
            d="M 33,26 C 26,13 36,13 37,24 Z" 
            fill="#E28743" 
            stroke="#78350F" 
            strokeWidth="2.5" 
          />
          <path 
            d="M 33.5,24 L 37,24 Q 37,17 34,17 Z" 
            fill="#FCA5A5" 
          />
          {/* Right ear */}
          <path 
            d="M 57,26 C 64,13 54,13 53,24 Z" 
            fill="#E28743" 
            stroke="#78350F" 
            strokeWidth="2.5" 
          />
          <path 
            d="M 56.5,24 L 53,24 Q 53,17 56,17 Z" 
            fill="#FCA5A5" 
          />
        </>
      )}

      {/* 6. EYES */}
      {mood === 'HAPPY' ? (
        // Super joyful curved eyes (laughing arches)
        <>
          <path 
            d="M 34,35 Q 38,30 40,35" 
            fill="none" 
            stroke="#1F2937" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 50,35 Q 52,30 56,35" 
            fill="none" 
            stroke="#1F2937" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </>
      ) : mood === 'SAD' ? (
        // Sad curved/closed down eyes
        <>
          <path 
            d="M 35,35 Q 38,38 41,35" 
            fill="none" 
            stroke="#1F2937" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M 49,35 Q 52,38 55,35" 
            fill="none" 
            stroke="#1F2937" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          {/* Little tears */}
          <circle cx="33" cy="41" r="2" fill="#60A5FA" />
          <path d="M 33,39 L 31,43 L 35,43 Z" fill="#60A5FA" />
        </>
      ) : (
        // Cute big round eyes with shine
        <>
          <circle cx="37" cy="34" r="3.2" fill="#1F2937" />
          <circle cx="38" cy="32.5" r="1.1" fill="#FFFFFF" />
          <circle cx="53" cy="34" r="3.2" fill="#1F2937" />
          <circle cx="54" cy="32.5" r="1.1" fill="#FFFFFF" />
        </>
      )}

      {/* Cute rosy blush cheeks */}
      <circle cx="31" cy="39" r="3.5" fill="#F87171" opacity="0.6" />
      <circle cx="59" cy="39" r="3.5" fill="#F87171" opacity="0.6" />

      {/* 7. NOSE AND MOUTH */}
      {/* Tiny sweet triangle nose */}
      <polygon points="44,37 46,37 45,39" fill="#1F2937" />

      {/* Mouth */}
      {mood === 'HAPPY' ? (
        // Big happy open smiling mouth
        <path 
          d="M 41,41 Q 45,46 49,41" 
          fill="#BE123C" 
          stroke="#1F2937" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
      ) : mood === 'SAD' ? (
        // Sad droopy mouth
        <path 
          d="M 42,43 Q 45,40.5 48,43" 
          fill="none" 
          stroke="#1F2937" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
      ) : (
        // Sweet W-shaped cartoon smile
        <path 
          d="M 41,41 Q 43,43 45,41 Q 47,43 49,41" 
          fill="none" 
          stroke="#1F2937" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      )}

      {/* 8. HANDS & PORTABLE ACORN ENVELOPE */}
      {/* Squirrel's Acorn Nut */}
      {mood !== 'SAD' ? (
        <g transform="translate(0, 4)">
          {/* Acorn cap */}
          <path 
            d="M 38,50 C 37,47 53,47 52,50 Z" 
            fill="#78350F" 
            stroke="#451A03" 
            strokeWidth="1.5" 
          />
          {/* Acorn body */}
          <path 
            d="M 39.5,50 C 39.5,58 45,62 45,62 C 45,62 50.5,58 50.5,50 Z" 
            fill="url(#sqAcornGrad)" 
            stroke="#78350F" 
            strokeWidth="1.5" 
          />
          {/* Acorn stem */}
          <path 
            d="M 45,47 Q 44,43 47,43" 
            fill="none" 
            stroke="#451A03" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
        </g>
      ) : (
        // Sad empty hands
        <path 
          d="M 41,54 Q 45,56 49,54" 
          fill="none" 
          stroke="#451A03" 
          strokeWidth="1.5" 
          strokeDasharray="2" 
        />
      )}

      {/* Hands holding the acorn */}
      <ellipse 
        cx="35" 
        cy="56" 
        rx="4.2" 
        ry="3.2" 
        fill="#E28743" 
        stroke="#78350F" 
        strokeWidth="2" 
      />
      <ellipse 
        cx="55" 
        cy="56" 
        rx="4.2" 
        ry="3.2" 
        fill="#E28743" 
        stroke="#78350F" 
        strokeWidth="2" 
      />
    </svg>
  );
}
