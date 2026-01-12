
import React from 'react';

interface AppleProps {
  value: number;
  isSelected: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const Apple: React.FC<AppleProps> = ({ value, isSelected, isMatched, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isMatched}
      className={`
        relative w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-300 transform
        ${isMatched ? 'opacity-0 scale-50 pointer-events-none' : 'hover:scale-105 active:scale-95'}
        ${isSelected ? 'ring-4 ring-yellow-400 scale-110 z-10' : 'ring-0'}
        bg-white shadow-md border-b-4 border-slate-200
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl opacity-10">
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-500">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
         </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className={`
          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-game text-xl md:text-2xl shadow-inner
          ${isSelected ? 'bg-yellow-400 text-white' : 'bg-red-500 text-white'}
        `}>
          {value}
        </div>
      </div>

      {/* Apple stem */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
    </button>
  );
};

export default Apple;
