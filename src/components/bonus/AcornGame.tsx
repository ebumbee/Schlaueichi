import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Timer, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AcornGameProps {
  onComplete: (bonusScore: number) => void;
}

interface FallingAcorn {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export default function AcornGame({ onComplete }: AcornGameProps) {
  const [acorns, setAcorns] = useState<FallingAcorn[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(true);

  const spawnAcorn = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10;
    const duration = Math.random() * 1.5 + 1.5; // 1.5 to 3s

    setAcorns(prev => [...prev, { id, x, delay: 0, duration }]);

    // Remove acorn if it falls off screen (duration + buffer)
    setTimeout(() => {
      setAcorns(prev => prev.filter(a => a.id !== id));
    }, duration * 1000 + 100);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsActive(false);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      spawnAcorn();
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [isActive, spawnAcorn]);

  const handleAcornClick = (id: number, x: number) => {
    setScore(s => s + 1);
    setAcorns(prev => prev.filter(a => a.id !== id));
    
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x: x / 100, y: 0.8 }, // Approximate bottom position visual
      colors: ['#8B4513', '#D2691E']
    });
  };

  if (!isActive && timeLeft === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[40px] kid-shadow text-center"
      >
        <Trophy className="w-16 h-16 text-brand-orange mx-auto mb-6" />
        <h2 className="font-display text-4xl mb-4">Ernte beendet!</h2>
        <p className="text-2xl font-bold text-brand-green mb-8">+{score} Bonus-Punkte!</p>
        <button
          onClick={() => onComplete(score)}
          className="w-full py-4 bg-brand-orange text-white rounded-2xl font-display text-xl kid-shadow kid-shadow-hover"
        >
          Zurück zum Lernen
        </button>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FDF5E6] flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-[#228B22]/20" />
      
      <div className="absolute top-10 left-10 text-[#8B4513] font-display text-2xl flex items-center gap-3">
        <Sparkles className="text-brand-orange" />
        <span>{score}</span>
      </div>
      
      <div className="absolute top-10 right-10 text-[#8B4513] font-display text-2xl flex items-center gap-3">
        <Timer />
        <span>{timeLeft}s</span>
      </div>

      <div className="text-center mb-20">
        <motion.h2 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[#8B4513] font-display text-5xl md:text-7xl"
        >
          Sammle die Kastanien! 🌰
        </motion.h2>
      </div>

      <div className="relative w-full h-full max-w-4xl max-h-[70vh]">
        <AnimatePresence>
          {acorns.map((acorn) => (
            <motion.button
              key={acorn.id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ 
                y: 1000, // Fall down far enough to cross the screen
                opacity: 1 
              }}
              transition={{ 
                duration: acorn.duration,
                ease: "linear"
              }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleAcornClick(acorn.id, acorn.x)}
              style={{
                position: 'absolute',
                left: `${acorn.x}%`,
                top: 0
              }}
              className="text-6xl p-0 m-0 border-none bg-transparent cursor-pointer active:scale-150 transition-transform z-10"
            >
              🌰
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
