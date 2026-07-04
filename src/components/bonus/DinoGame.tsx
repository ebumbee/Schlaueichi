import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Star, Timer, RefreshCw, X } from 'lucide-react';

interface DinoGameProps {
  onComplete: (bonusScore: number) => void;
}

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_Y = 250;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 50;
const INITIAL_SPEED = 3;
const SPEED_INCREMENT = 0.002; // Faster scaling since we start very slow
const STAR_THRESHOLD = 10;

export default function DinoGame({ onComplete }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [attempts, setAttempts] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });
  const [survivalTime, setSurvivalTime] = useState(0);
  const [starsBanner, setStarsBanner] = useState(0);
  
  const frameRef = useRef<number>(0);
  const dinoRef = useRef({ y: GROUND_Y, vy: 0, isJumping: false });
  const obstaclesRef = useRef<{ x: number, type: number }[]>([]);
  const speedRef = useRef(INITIAL_SPEED);
  const timeRef = useRef(0);
  const lastObstacleTime = useRef(0);
  const gameActiveRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        const newWidth = Math.min(width, 800);
        setCanvasSize({ width: newWidth, height: 300 });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [gameState, attempts]);

  const jump = () => {
    if (gameState === 'START') {
      startGame();
    } else if (gameState === 'PLAYING' && !dinoRef.current.isJumping) {
      dinoRef.current.vy = JUMP_FORCE;
      dinoRef.current.isJumping = true;
    } else if (gameState === 'GAMEOVER' && attempts < 3) {
      startGame();
    }
  };

  const startGame = () => {
    if (attempts >= 3) return;
    
    setAttempts(prev => prev + 1);
    setGameState('PLAYING');
    gameActiveRef.current = true;
    dinoRef.current = { y: GROUND_Y, vy: 0, isJumping: false };
    obstaclesRef.current = [];
    speedRef.current = INITIAL_SPEED;
    timeRef.current = 0;
    lastObstacleTime.current = 0;
    setSurvivalTime(0);
    setStarsBanner(0);
    requestAnimationFrame(update);
  };

  const update = (timestamp: number) => {
    if (!gameActiveRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update time and survival score
    timeRef.current += 1/60; // Approximate
    setSurvivalTime(Math.floor(timeRef.current));
    const currentStars = Math.floor(timeRef.current / STAR_THRESHOLD);
    if (currentStars > starsBanner) {
        setStarsBanner(currentStars);
    }

    // Increase speed slowly
    speedRef.current += SPEED_INCREMENT;

    // Dinosaur physics
    dinoRef.current.vy += GRAVITY;
    dinoRef.current.y += dinoRef.current.vy;

    if (dinoRef.current.y > GROUND_Y) {
      dinoRef.current.y = GROUND_Y;
      dinoRef.current.vy = 0;
      dinoRef.current.isJumping = false;
    }

    // Obstacle spawning
    if (timestamp - lastObstacleTime.current > 1500 + Math.random() * 2000 / (speedRef.current / INITIAL_SPEED)) {
      obstaclesRef.current.push({ x: canvas.width, type: Math.random() > 0.5 ? 1 : 0 });
      lastObstacleTime.current = timestamp;
    }

    // Obstacle logic
    obstaclesRef.current = obstaclesRef.current.filter(obs => {
      obs.x -= speedRef.current;
      
      // Collision detection
      const dinoLeft = 50;
      const dinoRight = dinoLeft + DINO_WIDTH - 10;
      const dinoTop = dinoRef.current.y;
      const dinoBottom = dinoRef.current.y + DINO_HEIGHT;

      const obsLeft = obs.x;
      const obsRight = obs.x + OBSTACLE_WIDTH;
      const obsTop = GROUND_Y + DINO_HEIGHT - (obs.type === 1 ? OBSTACLE_HEIGHT : OBSTACLE_HEIGHT * 0.7);
      const obsBottom = GROUND_Y + DINO_HEIGHT;

      if (dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop && dinoTop < obsBottom) {
        setGameState('GAMEOVER');
        gameActiveRef.current = false;
      }

      return obs.x + OBSTACLE_WIDTH > 0;
    });

    draw(ctx, canvas);
    frameRef.current = requestAnimationFrame(update);
  };

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ground line
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + DINO_HEIGHT);
    ctx.lineTo(canvas.width, GROUND_Y + DINO_HEIGHT);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#D1D5DB';
    ctx.stroke();

    // Draw "Dino" (Squirrel emoji flipped to face right)
    ctx.save();
    ctx.font = '40px serif';
    ctx.translate(50 + DINO_WIDTH / 2, dinoRef.current.y + 20);
    ctx.scale(-1, 1);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐿️', 0, 0);
    ctx.restore();

    // Draw Obstacles (Trees or Cacti)
    obstaclesRef.current.forEach(obs => {
      ctx.font = '30px serif';
      ctx.fillText(obs.type === 1 ? '🌲' : '🌵', obs.x, GROUND_Y + 35);
    });
  };

  const handleFinish = () => {
    const totalStars = Math.floor(timeRef.current / STAR_THRESHOLD);
    onComplete(totalStars);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 md:gap-8 p-4 md:p-6">
      <div className="text-center">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-3">
          <Rocket className="w-10 h-10 text-brand-blue" />
          Eichis Eilflug
        </h2>
        <p className="text-gray-500 font-medium">Springe über Hindernisse! Pro 10 Sekunden gibt es 1 Stern.</p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl bg-white rounded-[40px] kid-shadow overflow-hidden p-4" 
        onClick={jump}
      >
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="flex gap-2">
            <div className="bg-brand-blue/10 px-4 py-2 rounded-full font-display font-bold text-brand-blue flex items-center gap-2">
              <Timer className="w-5 h-5" />
              {survivalTime}s
            </div>
            <div className="bg-brand-yellow/10 px-4 py-2 rounded-full font-display font-bold text-brand-orange flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              {Math.floor(survivalTime / STAR_THRESHOLD)}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full kid-shadow-sm transition-colors ${i <= attempts ? 'bg-gray-300' : 'bg-brand-red animate-pulse'}`} 
              />
            ))}
          </div>
        </div>

        <canvas 
          ref={canvasRef} 
          width={canvasSize.width} 
          height={canvasSize.height} 
          className="w-full h-auto cursor-pointer"
        />

        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
            >
              <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center text-white kid-shadow animate-bounce">
                <Rocket className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-gray-800">Versuch {Math.min(attempts + 1, 3)} von 3</p>
                <p className="text-gray-500 font-medium">Bist du bereit?</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-4 bg-brand-green text-white rounded-full font-display text-xl font-bold kid-shadow hover:scale-105 active:scale-95 transition-all"
              >
                SPIEL STARTEN
              </button>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
            >
              <div className="text-center">
                {attempts < 3 ? (
                  <p className="text-brand-red font-display text-4xl font-bold mb-2">OOPS!</p>
                ) : (
                  <p className="text-brand-green font-display text-4xl font-bold mb-2">SUPER!</p>
                )}
                <p className="text-gray-600 font-medium">
                  {attempts < 3 
                    ? `Du hast noch ${3 - attempts} Versuche!` 
                    : "Du hast alle Versuche genutzt!"}
                </p>
                <div className="flex items-center justify-center gap-2 text-2xl font-display font-bold text-brand-orange mt-2">
                    <Star className="w-8 h-8 fill-current" />
                    + {Math.floor(survivalTime / STAR_THRESHOLD)} Sterne
                </div>
              </div>

              <div className="flex gap-4">
                {attempts < 3 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                    className="w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center kid-shadow hover:rotate-180 transition-all duration-500"
                    title="Nochmal versuchen"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleFinish(); }}
                  className="px-8 py-4 bg-brand-green text-white rounded-full font-display text-xl font-bold kid-shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <X className="w-6 h-6" /> {attempts < 3 ? 'BEENDEN' : 'WEITER'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {gameState === 'PLAYING' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); jump(); }}
          className="w-full max-w-xs py-3.5 sm:py-5 bg-gradient-to-r from-brand-orange to-amber-500 text-white rounded-2xl md:rounded-[2rem] font-display text-2xl font-black tracking-wider kid-shadow-lg border-b-8 border-amber-700 active:border-b-2 active:translate-y-1 transition-all select-none touch-none flex items-center justify-center gap-3 cursor-pointer"
          id="squirrel-jump-button"
        >
          <svg className="w-8 h-8 fill-current antialiased" viewBox="0 0 24 24">
            <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
          </svg>
          SPRINGEN!
        </motion.button>
      )}

      <div className="text-gray-400 text-sm font-bold animate-pulse text-center">
        Tippe aufs Spielfeld, den Knopf oder drücke die LEERTASTE zum Springen!
      </div>
    </div>
  );
}
