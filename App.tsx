
import React, { useState, useEffect, useCallback } from 'react';
import { AppleData } from './types';
import Apple from './components/Apple';

const GRID_SIZE = 8;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const TARGET_SCORE = 30;

const generateApple = (): AppleData => ({
  id: Math.random().toString(36).substring(7),
  value: Math.floor(Math.random() * 9) + 1,
  isMatched: false,
});

const generateInitialGrid = () => {
  return Array.from({ length: TOTAL_CELLS }, () => generateApple());
};

const App: React.FC = () => {
  const [grid, setGrid] = useState<AppleData[]>(generateInitialGrid());
  const [score, setScore] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Persistence for high score
  useEffect(() => {
    const saved = localStorage.getItem('apple_sum_9_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('apple_sum_9_highscore', score.toString());
    }
    
    // Check for game over condition (30 points)
    if (score >= TARGET_SCORE) {
      setIsGameOver(true);
    }
  }, [score, highScore]);

  const handleAppleClick = (index: number) => {
    if (isProcessing || grid[index].isMatched || isGameOver) return;

    // Toggle selection if clicking the same one
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
      return;
    }

    const nextSelection = [...selectedIndices, index];

    if (nextSelection.length === 2) {
      setIsProcessing(true);
      setSelectedIndices(nextSelection);

      const [firstIdx, secondIdx] = nextSelection;
      const sum = grid[firstIdx].value + grid[secondIdx].value;

      setTimeout(() => {
        if (sum === 9) {
          // Success!
          setScore(prev => prev + 2);
          setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            // Replace matched apples with new ones to keep the board full
            newGrid[firstIdx] = generateApple();
            newGrid[secondIdx] = generateApple();
            return newGrid;
          });
        }
        setSelectedIndices([]);
        setIsProcessing(false);
      }, 500);
    } else {
      setSelectedIndices(nextSelection);
    }
  };

  const resetGame = () => {
    setGrid(generateInitialGrid());
    setScore(0);
    setSelectedIndices([]);
    setIsProcessing(false);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-red-100 relative">
        
        {/* Victory Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-6 scale-150 animate-bounce">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-yellow-500">
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <h2 className="text-4xl font-game text-red-600 mb-2">VICTORY!</h2>
            <p className="text-xl text-slate-600 mb-8 font-bold">You reached {TARGET_SCORE} points!</p>
            <button 
              onClick={resetGame}
              className="bg-red-500 hover:bg-red-600 text-white font-game text-xl px-12 py-4 rounded-full shadow-lg transform transition hover:scale-110 active:scale-95 flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              PLAY AGAIN
            </button>
          </div>
        )}

        {/* Header / Scoreboard */}
        <div className="bg-red-500 p-6 text-white text-center shadow-lg relative">
          <h1 className="text-3xl font-game mb-2 tracking-wider">APPLE SUM 9</h1>
          <div className="flex justify-around items-center gap-4">
            <div className="bg-red-600 px-6 py-2 rounded-full shadow-inner min-w-[120px]">
              <span className="text-xs uppercase font-bold block opacity-80">Score</span>
              <span className="text-2xl font-game">{score} / {TARGET_SCORE}</span>
            </div>
            <div className="bg-red-600 px-6 py-2 rounded-full shadow-inner min-w-[120px]">
              <span className="text-xs uppercase font-bold block opacity-80">High Score</span>
              <span className="text-2xl font-game">{highScore}</span>
            </div>
          </div>
          
          <button 
            onClick={resetGame}
            className="absolute top-6 right-6 bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-md"
            title="Reset Game"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Game Container */}
        <div className="p-4 md:p-8 bg-gradient-to-b from-red-50 to-white">
          <div className="bg-slate-100/50 p-2 rounded-2xl shadow-inner">
            <div className="grid grid-cols-8 gap-1 md:gap-3">
              {grid.map((apple, index) => (
                <Apple
                  key={apple.id}
                  value={apple.value}
                  isSelected={selectedIndices.includes(index)}
                  isMatched={apple.isMatched}
                  onClick={() => handleAppleClick(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center text-slate-500 space-y-2">
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-red-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((score / TARGET_SCORE) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="font-bold flex items-center justify-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Reach <span className="text-red-600 font-game px-2 bg-red-100 rounded">{TARGET_SCORE}</span> points to win!
            </p>
            <p className="text-sm">Find pairs that sum to 9. Every pair = 2 points.</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
            <div className="flex justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>8x8 Matrix</span>
                <span>Target: {TARGET_SCORE}</span>
                <span>+2 Points</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
