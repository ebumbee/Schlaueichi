/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Languages, Rocket, Heart, Star, Sparkles, Settings as SettingsIcon, Timer, Coffee, Smartphone } from 'lucide-react';
import MathGame from './components/MathGame';
import GermanGame from './components/GermanGame';
import ReflexGame from './components/ReflexGame';
import Settings from './components/Settings';
import SquirrelMascot from './components/SquirrelMascot';
import InstallAppBanner from './components/InstallAppBanner';
import { GameMode, GermanFontStyle } from './types';

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß".split("");

export default function App() {
  const [mode, setMode] = useState<GameMode>('MENU');
  const [previousMode, setPreviousMode] = useState<GameMode>('MENU');
  const [totalScore, setTotalScore] = useState(0);
  const [bonusCount, setBonusCount] = useState(0);
  const [learnedLetters, setLearnedLetters] = useState<string[]>(ALL_LETTERS);
  const [germanFontStyle, setGermanFontStyle] = useState<GermanFontStyle>('PRINT');
  const [maxNumber, setMaxNumber] = useState(20);
  const [enabledOperators, setEnabledOperators] = useState<string[]>(['+', '-']);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSubject, setCurrentSubject] = useState<'MATH' | 'GERMAN'>('MATH');
  const [adventureMathSolved, setAdventureMathSolved] = useState(0);
  const [adventureGermanSolved, setAdventureGermanSolved] = useState(0);
  const SESSION_LIMIT = 600; // 10 minutes

  const handleMathCorrect = () => {
    setAdventureMathSolved(prev => {
      const nextMath = prev + 1;
      if (nextMath >= 3 && adventureGermanSolved >= 3) {
        setAdventureMathSolved(0);
        setAdventureGermanSolved(0);
        setCurrentSubject('MATH');
        startBonusRound();
        return 0;
      } else {
        setCurrentSubject('GERMAN');
        return nextMath;
      }
    });
  };

  const handleGermanCorrect = () => {
    setAdventureGermanSolved(prev => {
      const nextGerman = prev + 1;
      if (adventureMathSolved >= 3 && nextGerman >= 3) {
        setAdventureMathSolved(0);
        setAdventureGermanSolved(0);
        setCurrentSubject('MATH');
        startBonusRound();
        return 0;
      } else {
        setCurrentSubject('MATH');
        return nextGerman;
      }
    });
  };

  useEffect(() => {
    if (elapsedTime >= SESSION_LIMIT) {
      setMode('TIME_UP');
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [elapsedTime]);

  const toggleLetter = (letter: string) => {
    setLearnedLetters(prev => 
      prev.includes(letter) 
        ? prev.filter(l => l !== letter)
        : [...prev, letter]
    );
  };

  const setAllLetters = (on: boolean) => {
    setLearnedLetters(on ? ALL_LETTERS : []);
  };

  const startBonusRound = () => {
    setPreviousMode(mode);
    setMode('REFLEX');
    setBonusCount(prev => prev + 1);
  };

  const endBonusRound = (score: number) => {
    setTotalScore(prev => prev + score);
    setMode(previousMode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden gradient-mesh dots-pattern">
      {/* Decorative background elements */}
      <div className="absolute top-[10%] left-[5%] w-12 h-12 rounded-full bg-brand-yellow/20 blur-xl floating" />
      <div className="absolute top-[40%] right-[10%] w-24 h-24 rounded-full bg-brand-blue/20 blur-2xl floating" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-[20%] left-[15%] w-16 h-16 rounded-full bg-brand-red/20 blur-xl floating" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[10%] right-[5%] w-20 h-20 rotate-12 flex items-center justify-center text-4xl opacity-10 floating">
        ✏️
      </div>
      <div className="absolute top-[20%] right-[20%] -rotate-12 flex items-center justify-center text-5xl opacity-10 floating" style={{ animationDelay: '1.5s' }}>
        🍎
      </div>

      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between relative z-10">
        <div 
          onClick={() => mode !== 'TIME_UP' && setMode('MENU')}
          className={`flex items-center gap-2 ${mode !== 'TIME_UP' ? 'cursor-pointer group' : ''}`}
        >
          <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl kid-shadow flex items-center justify-center p-1.5 ${mode !== 'TIME_UP' ? 'group-hover:scale-110 transition-transform' : ''}`}>
            <SquirrelMascot mood="HAPPY" className="w-full h-full" />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-3xl font-bold tracking-tight text-[#8B4513] leading-none">
              SchlauEichi
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LernAbenteuer</p>
          </div>
        </div>

        <div className="flex gap-1.5 md:gap-2">
          {mode !== 'TIME_UP' && (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-gray-500 font-bold text-xs md:text-sm">
                <Timer className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{Math.floor((SESSION_LIMIT - elapsedTime) / 60)}:{(SESSION_LIMIT - elapsedTime) % 60 < 10 ? '0' : ''}{(SESSION_LIMIT - elapsedTime) % 60}</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 bg-brand-yellow px-3 py-1.5 rounded-full kid-shadow text-white font-bold border-2 border-white/50 text-sm md:text-base">
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-current text-white" />
                <span>{totalScore}</span>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white kid-shadow flex items-center justify-center text-brand-red">
                <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              </div>
              <button 
                onClick={() => setMode('SETTINGS')}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-white kid-shadow flex items-center justify-center transition-colors ${mode === 'SETTINGS' ? 'text-brand-orange bg-orange-50' : 'text-gray-400 hover:text-brand-orange'}`}
              >
                <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'MENU' && (
            <motion.div
              key="menu"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-6 md:mt-10"
            >
              <div className="text-center mb-6 md:mb-12 px-4">
                <motion.h2 
                  variants={itemVariants}
                  className="font-display text-3xl md:text-6xl text-gray-800 mb-2 tracking-tight font-extrabold"
                >
                  Hallo, kleiner Entdecker! 👋
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-base md:text-xl text-gray-600 font-medium max-w-2xl mx-auto"
                >
                  Bist du bereit für dein Lern-Abenteuer?
                </motion.p>
              </div>

              <div className="max-w-2xl mx-auto px-4">
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    setMode('ADVENTURE');
                    setCurrentSubject('MATH');
                    setAdventureMathSolved(0);
                    setAdventureGermanSolved(0);
                  }}
                  className="w-full group relative bg-gradient-to-br from-white to-brand-orange/5 p-8 sm:p-12 md:p-16 rounded-[2.5rem] md:rounded-[4rem] kid-shadow kid-shadow-hover text-center flex flex-col items-center gap-6 md:gap-8 overflow-hidden border-4 border-brand-orange/30 transition-all cursor-pointer"
                >
                  <div className="absolute -top-12 -left-12 w-32 h-32 md:w-48 md:h-48 bg-brand-blue/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 md:w-48 md:h-48 bg-brand-red/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
                  
                  <div className="flex gap-4 items-center relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue rounded-2xl md:rounded-3xl flex items-center justify-center text-white kid-shadow rotate-[-6deg] group-hover:rotate-[-12deg] transition-all duration-300">
                      <Calculator className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-red rounded-2xl md:rounded-3xl flex items-center justify-center text-white kid-shadow rotate-[6deg] group-hover:rotate-[12deg] transition-all duration-300 -ml-2">
                      <Languages className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                  </div>

                  <div className="relative z-10 max-w-lg">
                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#8B4513] mb-3 leading-tight">
                      Abenteuer starten!
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 font-bold mb-2">
                      Wechselnde Mathe- und Deutschaufgaben für schlaue Köpfe in der 1. Klasse!
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">
                      Lerne spielerisch Rechnen und Lesen und sammle tolle Sterne!
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-brand-orange text-white px-8 py-3.5 rounded-2xl kid-shadow font-extrabold text-lg md:text-2xl transition-transform group-hover:scale-105 border-b-4 border-orange-700">
                    <span>Spiel starten</span>
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </motion.button>
              </div>

              {/* PWA-Installation-Banner */}
              <div className="max-w-2xl mx-auto px-4 mt-6">
                <InstallAppBanner />
              </div>

              <motion.div 
                variants={itemVariants}
                className="mt-12 md:mt-16 text-center animate-pulse"
              >
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full kid-shadow border border-white/20">
                  <Sparkles className="w-4 h-4 text-brand-yellow" />
                  <p className="text-sm md:text-base font-bold text-brand-orange">Sammle Sterne in jedem Level!</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {mode === 'ADVENTURE' && (
            currentSubject === 'MATH' ? (
              <motion.div
                key="adventure-math"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <MathGame 
                  onBack={() => setMode('MENU')} 
                  onBonus={startBonusRound} 
                  maxNumber={maxNumber}
                  enabledOperators={enabledOperators}
                  score={totalScore}
                  onScoreChange={(amount) => setTotalScore(s => Math.max(0, s + amount))}
                  onCorrectAnswer={handleMathCorrect}
                  adventureMathSolved={adventureMathSolved}
                  adventureGermanSolved={adventureGermanSolved}
                />
              </motion.div>
            ) : (
              <motion.div
                key="adventure-german"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <GermanGame 
                  onBack={() => setMode('MENU')} 
                  onBonus={startBonusRound} 
                  learnedLetters={learnedLetters}
                  fontStyle={germanFontStyle}
                  score={totalScore}
                  onScoreChange={(amount) => setTotalScore(s => Math.max(0, s + amount))}
                  onCorrectAnswer={handleGermanCorrect}
                  adventureMathSolved={adventureMathSolved}
                  adventureGermanSolved={adventureGermanSolved}
                />
              </motion.div>
            )
          )}

          {mode === 'SETTINGS' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Settings 
                learnedLetters={learnedLetters}
                onToggleLetter={toggleLetter}
                onSetAllLetters={setAllLetters}
                germanFontStyle={germanFontStyle}
                setGermanFontStyle={setGermanFontStyle}
                maxNumber={maxNumber}
                setMaxNumber={setMaxNumber}
                enabledOperators={enabledOperators}
                setEnabledOperators={setEnabledOperators}
                onBack={() => setMode('MENU')}
              />
            </motion.div>
          )}

          {mode === 'REFLEX' && (
            <motion.div
              key="reflex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReflexGame 
                onComplete={endBonusRound} 
                gameIndex={bonusCount - 1} 
              />
            </motion.div>
          )}

          {mode === 'TIME_UP' && (
            <motion.div
              key="time-up"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-20 text-center max-w-2xl mx-auto"
            >
              <div className="bg-white p-12 rounded-[50px] kid-shadow border-8 border-brand-blue/10">
                <div className="w-32 h-32 bg-brand-blue rounded-full flex items-center justify-center text-white kid-shadow mx-auto mb-8 floating">
                  <Coffee className="w-16 h-16" />
                </div>
                <h2 className="font-display text-5xl md:text-6xl text-gray-800 mb-6">
                  Zeit für eine Pause! 🍎
                </h2>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-3 bg-brand-yellow text-white font-display font-medium text-2xl md:text-3xl px-8 py-3.5 rounded-3xl kid-shadow border-4 border-white mb-8"
                >
                  <Star className="w-8 h-8 fill-current text-white animate-bounce" />
                  <span>{totalScore} {totalScore === 1 ? 'Stern' : 'Sterne'} gesammelt!</span>
                </motion.div>
                <p className="text-xl md:text-2xl text-gray-600 font-medium mb-10 leading-relaxed">
                  Du hast heute super gelernt! Dein Gehirn braucht jetzt eine kleine Ruhepause, 
                  damit es fit bleibt. Komm später wieder!
                </p>
                <div className="bg-orange-50 p-6 rounded-3xl border-2 border-brand-orange/20">
                  <p className="text-brand-orange font-bold text-lg">
                    Tipp für Mama & Papa: Gönnen Sie dem Kind eine kleine Bildschirmpause.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
