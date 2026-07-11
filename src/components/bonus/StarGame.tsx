import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Timer, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StarGameProps {
  onComplete: (bonusScore: number) => void;
}

interface FloatingStar {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function StarGame({ onComplete }: StarGameProps) {
  const [stars, setStars] = useState<FloatingStar[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(true);

  const spawnStar = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 70 + 15; // 15% to 85%
    const size = Math.random() * 20 + 40; // 40px to 60px
    const colors = ['#FFD93D', '#FF8400', '#6BCB77', '#4D96FF', '#FF6B6B'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setStars(prev => [...prev, { id, x, y, size, color }]);

    // Star disappears after 1.5 seconds if not clicked
    setTimeout(() => {
      setStars(prev => prev.filter(s => s.id !== id));
    }, 1500);
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
      spawnStar();
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [isActive, spawnStar]);

  const handleStarClick = (id: number) => {
    setScore(s => s + 1);
    const star = stars.find(s => s.id === id);
    setStars(prev => prev.filter(s => s.id !== id));
    
    if (star) {
      confetti({
        particleCount: 20,
        spread: 30,
        origin: { x: star.x / 100, y: star.y / 100 },
        colors: ['#FFD93D', '#FFFFFF']
      });
    }
  };

  if (!isActive && timeLeft === 0) {
    const finalPoints = Math.floor(score / 4);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[40px] kid-shadow text-center"
      >
        <Sparkles className="w-16 h-16 text-brand-yellow mx-auto mb-6" />
        <h2 className="font-display text-4xl mb-4">Bonus-Runde beendet!</h2>
        <p className="text-xl text-gray-600 mb-2">{score} Sterne gesammelt</p>
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
    <div className="fixed inset-0 z-50 bg-brand-blue/90 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-10 left-10 text-white font-display text-2xl flex flex-col items-start gap-1 bg-black/20 p-3 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Star className="fill-brand-yellow text-brand-yellow w-7 h-7" />
          <span>{score} Sterne</span>
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
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white font-display text-5xl md:text-7xl drop-shadow-lg"
        >
          Schnapp die Sterne! ✨
        </motion.h2>
      </div>

      <div className="relative w-full h-full max-w-4xl max-h-[60vh]">
        <AnimatePresence>
          {stars.map((star) => (
            <motion.button
              key={star.id}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => handleStarClick(star.id)}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                color: star.color,
              }}
              className="flex items-center justify-center p-0 m-0 border-none bg-transparent cursor-pointer active:scale-150 transition-transform"
            >
              <Star className="w-full h-full fill-current drop-shadow-md" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
