import React, { useState, useEffect } from 'react';
import StarGame from './bonus/StarGame';
import DinoGame from './bonus/DinoGame';
import BubbleGame from './bonus/BubbleGame';

interface ReflexGameProps {
  onComplete: (bonusScore: number) => void;
  gameIndex: number;
}

type BonusType = 'STAR' | 'DINO' | 'BUBBLE';

export default function ReflexGame({ onComplete, gameIndex }: ReflexGameProps) {
  const [selectedGame, setSelectedGame] = useState<BonusType | null>(null);

  useEffect(() => {
    const games: BonusType[] = ['STAR', 'DINO', 'BUBBLE'];
    const game = games[gameIndex % games.length];
    setSelectedGame(game);
  }, [gameIndex]);

  if (!selectedGame) return null;

  switch (selectedGame) {
    case 'STAR':
      return <StarGame onComplete={onComplete} />;
    case 'DINO':
      return <DinoGame onComplete={onComplete} />;
    case 'BUBBLE':
      return <BubbleGame onComplete={onComplete} />;
    default:
      return null;
  }
}
