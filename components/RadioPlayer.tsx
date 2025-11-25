import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RADIO_STREAM_URL, PROGRAMS } from '../constants';
import { Program } from '../types';
import { Equalizer } from './Equalizer';
import { subscribeToMetadata } from '../services/metadataService';

interface RadioPlayerProps {
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  onOpenModal: () => void;
  playTrigger?: number;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({ isOpen, onToggleOpen, onOpenModal, playTrigger = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [songTitle, setSongTitle] = useState<string>("Carregando...");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(RADIO_STREAM_URL);
    audioRef.current.volume = volume;

    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clock & Program Logic
  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      // Clock
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);

      // Program
      const currentHour = now.getHours();
      let program = PROGRAMS[0];
      // Find the latest program that started before or at current hour
      for (const p of PROGRAMS) {
        if (currentHour >= p.hora) {
          program = p;
        }
      }
      setCurrentProgram(program);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Metadata Subscription
  useEffect(() => {
    const unsubscribe = subscribeToMetadata((title) => {
      setSongTitle(title || "Mix 98 - A Melhor Música");
    });
    return () => unsubscribe();
  }, []);

  // Handle Play/Pause
  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        if (!isOpen) onToggleOpen(true); // Auto open bar if hidden
      } catch (error) {
        console.error("Playback failed", error);
        alert("Não foi possível reproduzir a rádio. Tente novamente.");
      }
    }
  }, [isPlaying, isOpen, onToggleOpen]);

  // Watch for external play triggers (autoplay)
  useEffect(() => {
    if (playTrigger > 0 && !isPlaying) {
      togglePlay();
    }
  }, [playTrigger, isPlaying, togglePlay]);

  // Handle Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  return (
    <>
      {/* Fixed Buttons */}
      {!isOpen && (
        <button 
          onClick={() => {
            onToggleOpen(true);
            togglePlay();
          }}
          className="fixed top-3 left-4 bg-vermelho text-amarelo font-bold py-3 px-5 rounded-full shadow-[0_0_20px_rgba(230,0,35,0.6)] hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(230,0,35,0.9)] transition-all duration-300 z-50 flex items-center gap-2"
        >
          <i className="fa-solid fa-headphones"></i> Ouça Agora
        </button>
      )}
      
      {isOpen && (
        <button 
          onClick={() => {
            onToggleOpen(false);
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }}
          className="fixed top-3 left-4 bg-amarelo text-vermelho font-bold py-3 px-5 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 active:scale-95 hover:bg-yellow-300 transition-all duration-300 z-50 flex items-center gap-2"
        >
          <i className="fa-solid fa-times"></i> Fechar
        </button>
      )}

      {/* Bottom Player Bar */}
      <div className={`
        fixed bottom-0 left-0 right-0 h-[85px] md:h-[90px]
        bg-gradient-to-br from-vermelho to-vermelho-escuro
        backdrop-blur-md shadow-[0_-6px_20px_rgba(0,0,0,0.5)]
        flex items-center justify-between px-3 md:px-6 z-[9999]
        transition-transform duration-500 ease-in-out text-white
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        
        {/* Info Area (Image + Text) */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 pr-4">
          <div className="relative group cursor-default flex-shrink-0">
            <img 
              src={currentProgram?.imagem || 'https://via.placeholder.com/56'} 
              alt="Locutor" 
              className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-lg object-cover border-2 border-amarelo shadow-[0_0_12px_rgba(255,215,0,0.5)] transition-transform duration-300 group-hover:scale-105"
            />
            {isPlaying && (
               <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 border-2 border-vermelho rounded-full animate-pulse shadow-md"></div>
            )}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 justify-center h-full py-1">
            
            {/* Metadata / Song Title - Primary Focus */}
            <div className="relative h-6 md:h-7 overflow-hidden w-full mb-0.5">
               <div className={`absolute whitespace-nowrap font-black text-amarelo text-base md:text-lg leading-tight drop-shadow-md ${songTitle.length > 25 ? 'animate-marquee pl-[100%]' : ''}`}>
                 {songTitle.length > 25 ? songTitle : (
                   <span className="flex items-center gap-2">
                     <i className="fa-solid fa-music text-xs opacity-70"></i> {songTitle}
                   </span>
                 )}
               </div>
            </div>

            {/* Program Info - Secondary Focus */}
            <div className="text-xs md:text-sm text-white/90 truncate flex items-center gap-1.5 font-medium">
              <span className="text-red-200">No Ar:</span>
              <span>{currentProgram?.nome || "Mix 98"}</span>
              <span className="w-1 h-1 bg-white/50 rounded-full mx-0.5"></span>
              <span className="opacity-75">{currentProgram?.locutor}</span>
            </div>
            
          </div>
        </div>

        {/* Clock (Hidden on very small screens) */}
        <div className="hidden lg:block font-mono font-bold text-amarelo text-2xl mx-6 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] cursor-default">
          {currentTime}
        </div>

        {/* Controls Area */}
        <div className="flex items-center gap-3 md:gap-6 flex-shrink-0 pl-2 border-l border-white/10 md:border-none">
          
          {/* Volume */}
          <div className="hidden sm:flex items-center w-20 md:w-28 group relative h-10 justify-center">
             <i className="fa-solid fa-volume-high text-white/80 mr-2 text-xs"></i>
             <input 
               type="range" 
               min="0" 
               max="1" 
               step="0.01" 
               value={volume} 
               onChange={handleVolumeChange}
               className="w-full h-1.5 group-hover:h-2 transition-all duration-300 ease-out rounded-lg appearance-none cursor-pointer absolute right-0"
               style={{
                 backgroundImage: `linear-gradient(to right, #FFD700 0%, #FFD700 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
               }}
             />
          </div>

          {/* Play Button */}
          <button 
            onClick={togglePlay}
            className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full bg-white text-vermelho border-4 border-amarelo flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 ease-out shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)]"
          >
            {isPlaying ? <Equalizer /> : <i className="fa-solid fa-play ml-1 text-2xl"></i>}
          </button>

          {/* Message Button */}
          <button 
            onClick={onOpenModal}
            className="hidden md:flex flex-col items-center justify-center text-white hover:text-amarelo transition-colors gap-0.5 p-2"
          >
            <i className="fa-solid fa-comment-dots text-xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-wider">Recado</span>
          </button>
        </div>
      </div>
    </>
  );
};