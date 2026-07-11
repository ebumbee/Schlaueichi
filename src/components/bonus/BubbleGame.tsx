import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BubbleGameProps {
  onComplete: (bonusScore: number) => void;
}

interface Bubble {
  id: number;
  x: number;
  size: number;
  color: string;
  duration: number;
}

export default function BubbleGame({ onComplete }: BubbleGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(true);

  const spawnBubble = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 85 + 5;
    const size = Math.random() * 40 + 60; // 60-100px
    const colors = ['#00FFFF', '#FF00FF', '#7FFF00', '#FFFF00', '#FF7F50'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 2 + 2; // 2-4s

    setBubbles(prev => [...prev, { id, x, size, color, duration }]);

    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
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
      spawnBubble();
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [isActive, spawnBubble]);

  const handleBubbleClick = (id: number, x: number) => {
    setScore(s => s + 1);
    setBubbles(prev => prev.filter(b => b.id !== id));
    
    confetti({
      particleCount: 15,
      spread: 50,
      origin: { x: x / 100, y: 0.5 },
      colors: ['#FFFFFF', '#E0FFFF']
    });
  };

  if (!isActive && timeLeft === 0) {
    const finalPoints = Math.floor(score / 4);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[40px] kid-shadow text-center"
      >
        <Zap className="w-16 h-16 text-brand-blue mx-auto mb-6" />
        <h2 className="font-display text-4xl mb-4">Blubber-Spaß vorbei!</h2>
        <p className="text-xl text-gray-600 mb-2">{score} Seifenblasen zerplatzt</p>
        <p className="text-2xl font-bold text-brand-green mb-8">+{finalPoints} Bonus-Punkt{finalPoints === 1 ? '' : 'e'}!</p>
        <button
          onClick={() => onComplete(finalPoints)}
          className="w-full py-4 bg-brand-blue text-white rounded-2xl font-display text-xl kid-shadow kid-shadow-hover"
        >
          Zurück zum Lernen
        </button>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-10 left-10 text-white font-display text-2xl flex flex-col items-start gap-1 bg-black/20 p-3 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-white opacity-50" />
          <span>{score} Blasen</span>
        </div>
        <div className="text-sm opacity-90 font-sans font-bold">
          Punkte: {Math.floor(score / 4)}
        </div>
      </div>
      
      <div className="absolute top-10 right-10 text-white font-display text-2xl flex items-center gap-3">
        <Timer />
        <span>{timeLeft}s</span>
      </div>

      <div className="text-center mb-20">
        <motion.h2 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-white font-display text-5xl md:text-7xl drop-shadow-md"
        >
          Platze die Blasen! 🫧
        </motion.h2>
      </div>

      <div className="relative w-full h-full max-w-4xl max-h-[70vh]">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ y: 800, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: -200, 
                opacity: 0.8,
                scale: 1,
                x: [0, 20, -20, 0] // Wobble
              }}
              transition={{ 
                y: { duration: bubble.duration, ease: "linear" },
                x: { duration: bubble.duration / 2, repeat: Infinity, ease: "easeInOut" }
              }}
              exit={{ scale: 2, opacity: 0 }}
              onClick={() => handleBubbleClick(bubble.id, bubble.x)}
              style={{
                position: 'absolute',
                left: `${bubble.x}%`,
                width: bubble.size,
                height: bubble.size,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                border: `4px solid ${bubble.color}`,
              }}
              className="flex items-center justify-center p-0 m-0 cursor-pointer backdrop-blur-sm"
            >
              <div className="w-1/2 h-1/2 bg-white/30 rounded-full blur-sm -translate-x-1 -translate-y-1" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
