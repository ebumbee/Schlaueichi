import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Circle, Smartphone, Download } from 'lucide-react';

import { GermanFontStyle } from '../types';

interface SettingsProps {
  learnedLetters: string[];
  maxNumber: number;
  setMaxNumber: (val: number) => void;
  enabledOperators: string[];
  setEnabledOperators: (ops: string[] | ((prev: string[]) => string[])) => void;
  onToggleLetter: (letter: string) => void;
  onSetAllLetters: (on: boolean) => void;
  germanFontStyle: GermanFontStyle;
  setGermanFontStyle: (style: GermanFontStyle) => void;
  onBack: () => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß".split("");
const OPERATORS = [
  { symbol: '+', label: 'Plus (+)' },
  { symbol: '-', label: 'Minus (-)' },
  { symbol: '*', label: 'Mal (×)' },
  { symbol: '/', label: 'Geteilt (÷)' },
];

export default function Settings({ 
  learnedLetters, 
  maxNumber, 
  setMaxNumber, 
  enabledOperators, 
  setEnabledOperators, 
  onToggleLetter, 
  onSetAllLetters,
  germanFontStyle,
  setGermanFontStyle,
  onBack 
}: SettingsProps) {
  const toggleOperator = (op: string) => {
    setEnabledOperators(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(o => o !== op);
      }
      return [...prev, op];
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white kid-shadow kid-shadow-hover hover:bg-gray-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-display text-2xl font-bold text-gray-800">Einstellungen</h2>
        <div className="w-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* German Settings */}
        <section className="bg-white rounded-[2rem] p-4 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] kid-shadow border-4 border-brand-red/5 text-left">
          <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-brand-red flex items-center gap-2 underline decoration-brand-red/20 underline-offset-8">
            <span>📚</span> Deutsch: Buchstaben-Auswahl
          </h3>
          <p className="text-gray-500 mb-4 font-medium text-sm md:text-base">
            Wähle die Buchstaben aus, die dein Kind schon gelernt hat.
          </p>

          <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-2">
            {ALPHABET.map((letter) => {
              const isSelected = learnedLetters.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => onToggleLetter(letter)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 font-display transition-all border-2
                    ${isSelected 
                      ? 'bg-brand-red border-brand-red text-white kid-shadow translate-y-[-2px]' 
                      : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                    }
                  `}
                >
                  <span className="text-2xl font-bold">{letter}</span>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => onSetAllLetters(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
            >
              Alle an
            </button>
            <button
              onClick={() => onSetAllLetters(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
            >
              Alle aus
            </button>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-50">
            <label className="block text-gray-700 font-bold mb-4">Schriftart für Übungen:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGermanFontStyle('PRINT')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 font-display transition-all border-2
                  ${germanFontStyle === 'PRINT' 
                    ? 'bg-brand-red border-brand-red text-white kid-shadow' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                  }
                `}
              >
                <span className="text-3xl font-bold">Aa</span>
                <span className="text-sm font-bold uppercase tracking-wider">Druckbuchstaben</span>
              </button>
              <button
                onClick={() => setGermanFontStyle('CURSIVE')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 font-display transition-all border-2
                  ${germanFontStyle === 'CURSIVE' 
                    ? 'bg-brand-red border-brand-red text-white kid-shadow' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                  }
                `}
              >
                <span className="text-4xl font-school">Aa</span>
                <span className="text-sm font-bold uppercase tracking-wider">Schreibschrift</span>
              </button>
            </div>
          </div>
        </section>

        {/* Math Settings */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] kid-shadow border-4 border-brand-blue/5">
          <h3 className="font-display text-2xl font-bold mb-4 text-brand-blue flex items-center gap-2 underline decoration-brand-blue/20 underline-offset-8">
            <span>➕</span> Mathe: Schwierigkeit
          </h3>
          
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-4">Höchste Zahl: <span className="text-brand-blue text-2xl">{maxNumber}</span></label>
            <div className="flex gap-3 flex-wrap">
              {[10, 20, 50, 100, 1000].map(val => (
                <button
                  key={val}
                  onClick={() => setMaxNumber(val)}
                  className={`px-6 py-3 rounded-xl font-display font-bold transition-all border-2
                    ${maxNumber === val 
                      ? 'bg-brand-blue border-brand-blue text-white kid-shadow' 
                      : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                    }
                  `}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-4">Rechenarten:</label>
            <div className="grid grid-cols-2 gap-4">
              {OPERATORS.map((op) => {
                const isSelected = enabledOperators.includes(op.symbol);
                return (
                  <button
                    key={op.symbol}
                    onClick={() => toggleOperator(op.symbol)}
                    className={`p-4 rounded-2xl flex items-center gap-4 font-display font-bold transition-all border-2
                      ${isSelected 
                        ? 'bg-brand-blue border-brand-blue text-white kid-shadow' 
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl
                      ${isSelected ? 'bg-white/20' : 'bg-white'}
                    `}>
                      {op.symbol === '*' ? '×' : op.symbol === '/' ? '÷' : op.symbol}
                    </div>
                    <span>{op.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* App Installation Section */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] kid-shadow border-4 border-brand-yellow/5 text-left">
          <h3 className="font-display text-2xl font-bold mb-4 text-brand-orange flex items-center gap-2 underline decoration-brand-orange/20 underline-offset-8">
            <span>📱</span> SchlauEichi App installieren
          </h3>
          <p className="text-gray-500 mb-6 font-medium text-sm md:text-base leading-relaxed">
            Möchtest du SchlauEichi als vollwertige App auf deinem Handy, Tablet oder Computer speichern? Dann kannst du jederzeit blitzschnell und offline spielen!
          </p>
          <button
            id="settings-install-app-btn"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('show-pwa-install-guide'));
            }}
            className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-extrabold px-6 py-4 rounded-2xl kid-shadow text-base hover:bg-brand-blue/95 transition-transform hover:scale-102 border-b-4 border-blue-800 cursor-pointer"
          >
            <Smartphone className="w-5 h-5" />
            <span>Installations-Anleitung öffnen</span>
          </button>
        </section>
      </motion.div>
    </div>
  );
}
