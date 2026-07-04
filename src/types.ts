export type GameMode = 'MENU' | 'MATH' | 'GERMAN' | 'ADVENTURE' | 'REFLEX' | 'SETTINGS' | 'TIME_UP';
export type GermanFontStyle = 'PRINT' | 'CURSIVE';

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}
