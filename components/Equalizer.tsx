import React from 'react';

export const Equalizer: React.FC = () => {
  return (
    <div className="flex items-end gap-[1.5px] h-4 mx-auto">
      <span className="w-0.5 h-full bg-amarelo rounded-sm animate-equalizer-1 origin-bottom"></span>
      <span className="w-0.5 h-full bg-amarelo rounded-sm animate-equalizer-2 origin-bottom"></span>
      <span className="w-0.5 h-full bg-amarelo rounded-sm animate-equalizer-3 origin-bottom"></span>
    </div>
  );
};