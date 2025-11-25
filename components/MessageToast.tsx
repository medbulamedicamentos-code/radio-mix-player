import React, { useEffect, useState } from 'react';
import { Message } from '../types';

interface MessageToastProps {
  messages: Message[];
  isVisible: boolean;
  onDelete: (id: string) => void;
}

export const MessageToast: React.FC<MessageToastProps> = ({ messages, isVisible, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Carousel Logic
  useEffect(() => {
    if (messages.length === 0 || !isVisible) return;

    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setAnimating(false);
      }, 500); // Time to fade out
    }, 8000); // Display time per message

    return () => clearInterval(interval);
  }, [messages.length, isVisible]);

  if (messages.length === 0) return null;

  const currentMessage = messages[currentIndex];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const password = prompt("🔐 Senha do moderador:");
    if (password === "mod123") {
      if (confirm("Excluir mensagem?")) {
        onDelete(currentMessage.id);
      }
    } else if (password !== null) {
      alert("Senha incorreta.");
    }
  };

  return (
    <div 
      className={`
        fixed bottom-[90px] right-5 w-[280px] md:w-[320px] h-auto min-h-[100px]
        bg-gradient-to-br from-vermelho to-[#800]
        text-white rounded-xl p-3 shadow-xl z-[40]
        transition-all duration-500 ease-in-out
        border border-white/10
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        ${animating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
    >
      <div className="flex items-center relative">
        <img 
          src={currentMessage.foto} 
          alt="Ouvinte" 
          className="w-12 h-12 rounded-full object-cover border-2 border-white mr-3 shadow-md flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm truncate pr-6">
            {currentMessage.nome}
          </div>
          <div className="text-xs italic text-red-200 truncate mb-1">
            {currentMessage.cidade}
          </div>
          <div className="text-xs text-white/90 line-clamp-2 leading-tight">
            {currentMessage.texto}
          </div>
        </div>

        <button 
          onClick={handleDelete}
          className="absolute -top-1 -right-1 w-6 h-6 bg-white text-red-700 rounded-full flex items-center justify-center text-xs shadow hover:scale-110 transition"
          title="Excluir (Moderador)"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
};