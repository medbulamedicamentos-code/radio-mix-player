import React, { useState, useEffect } from 'react';
import { RadioPlayer } from './components/RadioPlayer';
import { MessageModal } from './components/MessageModal';
import { MessageToast } from './components/MessageToast';
import { messageService } from './services/messageService';
import { Message, MessageFormData } from './types';
import { PROGRAMS } from './constants';

// --- CONFIGURAÇÃO DE IMAGENS ---
// ⚠️ PARA USAR SUA IMAGEM:
// 1. Faça upload da imagem que você enviou (no Imgur.com, Dropbox, etc).
// 2. Copie o "Link Direto" da imagem.
// 3. Cole o link dentro das aspas abaixo, substituindo o link atual.
const HERO_IMAGE_URL = "https://www.dropbox.com/scl/fi/rmam1uwd8yvwdioe75687/Image_fx-99.jpg?rlkey=9odgxubeflnq8mywtojxzieqq&st=5457b9nk&dl=1";

const App: React.FC = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load initial messages
  useEffect(() => {
    setMessages(messageService.getMessages());
  }, []);

  const handleSendMessage = async (data: Omit<MessageFormData, 'foto'> & { foto: string }) => {
    try {
      const newMsg = await messageService.addMessage(data);
      setMessages(prev => [newMsg, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleDeleteMessage = (id: string) => {
    messageService.deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleStartRadio = () => {
    setIsPlayerOpen(true);
    setPlayTrigger(Date.now());
  };

  return (
    <div className="min-h-screen bg-white dark:bg-bgDark text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300 relative flex flex-col">
      
      {/* --- TOP BAR --- */}
      <div className="h-2 bg-amarelo w-full z-50"></div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-card shadow-md border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 bg-vermelho rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md rotate-3">
                98
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-vermelho dark:text-white leading-none">
                  MIX <span className="text-amarelo">98</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">A Rádio Pop</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="font-semibold text-gray-700 dark:text-gray-300 hover:text-vermelho dark:hover:text-amarelo transition-colors">Início</button>
              <button onClick={() => scrollToSection('programacao')} className="font-semibold text-gray-700 dark:text-gray-300 hover:text-vermelho dark:hover:text-amarelo transition-colors">Programação</button>
              <button onClick={() => scrollToSection('sobre')} className="font-semibold text-gray-700 dark:text-gray-300 hover:text-vermelho dark:hover:text-amarelo transition-colors">Sobre</button>
              
              {/* Dark Mode Toggle Desktop */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-amarelo flex items-center justify-center hover:scale-110 transition-transform"
                title="Alternar tema"
              >
                {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
              </button>

              <button 
                onClick={handleStartRadio}
                className="bg-vermelho text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-vermelho-escuro hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-play mr-2"></i> Ao Vivo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-gray-600 dark:text-amarelo text-xl"
              >
                {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 dark:text-white text-2xl focus:outline-none"
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-card border-t dark:border-gray-700 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex flex-col p-4 space-y-4">
              <button onClick={() => scrollToSection('home')} className="text-left font-semibold text-gray-800 dark:text-gray-200">Início</button>
              <button onClick={() => scrollToSection('programacao')} className="text-left font-semibold text-gray-800 dark:text-gray-200">Programação</button>
              <button onClick={() => scrollToSection('sobre')} className="text-left font-semibold text-gray-800 dark:text-gray-200">Sobre</button>
              <button 
                onClick={() => { handleStartRadio(); setIsMobileMenuOpen(false); }}
                className="bg-vermelho text-white px-4 py-3 rounded-lg font-bold text-center"
              >
                Ouvir Agora
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header id="home" className="relative h-[500px] md:h-[650px] flex items-center justify-center text-center overflow-hidden bg-bgDark">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000"
          style={{ 
            backgroundImage: `url('${HERO_IMAGE_URL}')`,
            backgroundPosition: 'top center' // Keeps faces visible on mobile
          }}
        ></div>
        
        {/* Gradient Overlay - Adjusted to ensure white text pops against any background image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 dark:from-black/70 dark:to-bgDark"></div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-bgDark to-transparent"></div>

        <div className="relative z-10 px-4 max-w-5xl mx-auto flex flex-col items-center pt-10">
          <div className="inline-block px-5 py-1.5 mb-6 border border-amarelo/40 rounded-full bg-black/60 text-amarelo text-xs md:text-sm font-bold uppercase tracking-widest backdrop-blur-md animate-[fadeInDown_1s_ease-out] shadow-xl">
            🔴 Rádio Online 24h
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-[0.9] animate-[fadeInUp_1s_ease-out]">
            A MELHOR MÚSICA <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amarelo to-yellow-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">ONDE VOCÊ ESTIVER</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-100 font-medium mb-10 max-w-2xl animate-[fadeInUp_1.2s_ease-out] drop-shadow-md leading-relaxed">
            Sintonize na <span className="text-amarelo font-bold">Mix 98</span> e curta os maiores sucessos do momento, notícias e entretenimento sem parar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 animate-[fadeInUp_1.4s_ease-out] w-full justify-center">
            <button 
              onClick={handleStartRadio}
              className="bg-vermelho text-white px-10 py-5 rounded-full font-black text-lg shadow-[0_0_25px_rgba(209,0,37,0.5)] hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-4 border-red-500/30"
            >
              <i className="fa-solid fa-play text-xl"></i> COMEÇAR A OUVIR
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-vermelho hover:border-white transition-all duration-300 backdrop-blur-md shadow-lg"
            >
              ENVIAR RECADO
            </button>
          </div>
        </div>
      </header>

      {/* --- CARDS SECTION --- */}
      <section id="sobre" className="py-20 container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-vermelho group text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-music text-3xl text-vermelho"></i>
            </div>
            <h3 className="font-bold text-2xl mb-3 text-gray-800 dark:text-white">Hits Mundiais</h3>
            <p className="text-gray-600 dark:text-gray-400">Uma seleção impecável com as músicas mais tocadas no mundo todo.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-amarelo group text-center transform md:-translate-y-4">
            <div className="w-16 h-16 mx-auto bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-microphone-lines text-3xl text-amarelo"></i>
            </div>
            <h3 className="font-bold text-2xl mb-3 text-gray-800 dark:text-white">Ao Vivo</h3>
            <p className="text-gray-600 dark:text-gray-400">Locutores interagindo em tempo real com você. Peça sua música!</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-vermelho group text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-users text-3xl text-vermelho"></i>
            </div>
            <h3 className="font-bold text-2xl mb-3 text-gray-800 dark:text-white">Comunidade</h3>
            <p className="text-gray-600 dark:text-gray-400">Envie recados, participe de promoções e faça parte da família Mix.</p>
          </div>
        </div>
      </section>

      {/* --- SCHEDULE SECTION --- */}
      <section id="programacao" className="py-16 bg-gray-50 dark:bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-vermelho font-bold tracking-wider uppercase text-sm">Nossa Grade</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">
              Programação <span className="text-amarelo">Diária</span>
            </h2>
            <div className="w-20 h-1 bg-vermelho mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((prog) => (
              <div key={prog.id} className="bg-white dark:bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow flex group">
                <div className="w-1/3 relative overflow-hidden">
                  <img 
                    src={prog.imagem} 
                    alt={prog.locutor} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-center">
                  <div className="bg-red-100 dark:bg-red-900/30 text-vermelho dark:text-red-300 text-xs font-bold px-2 py-1 rounded inline-block self-start mb-2">
                    {String(prog.hora).padStart(2, '0')}:00h
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white leading-tight mb-1">{prog.nome}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amarelo"></span> {prog.locutor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- APP DOWNLOAD / CTA SECTION --- */}
      <section className="py-20 bg-vermelho text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amarelo/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Baixe Nosso App</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Leve a Mix 98 no seu bolso. Disponível para Android e iOS.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-900 transition shadow-lg">
              <i className="fa-brands fa-google-play text-2xl"></i>
              <div className="text-left">
                <div className="text-[10px] uppercase">Disponível no</div>
                <div className="font-bold leading-none">Google Play</div>
              </div>
            </button>
            <button className="bg-white text-black px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition shadow-lg">
              <i className="fa-brands fa-apple text-2xl"></i>
              <div className="text-left">
                <div className="text-[10px] uppercase">Baixar na</div>
                <div className="font-bold leading-none">App Store</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-bgDark text-white pt-16 pb-28 md:pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-vermelho rounded flex items-center justify-center text-white font-bold text-sm">98</div>
                <span className="text-xl font-black text-white">MIX <span className="text-amarelo">98</span></span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                A rádio que toca o seu ritmo. Música, informação e entretenimento 24 horas por dia para você.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-vermelho transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-vermelho transition-colors"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-vermelho transition-colors"><i className="fa-brands fa-twitter"></i></a>
              </div>
            </div>

            {/* Column 2: Links */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Navegação</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#home" className="hover:text-amarelo transition-colors">Início</a></li>
                <li><a href="#programacao" className="hover:text-amarelo transition-colors">Programação</a></li>
                <li><a href="#sobre" className="hover:text-amarelo transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-amarelo transition-colors">Promoções</a></li>
              </ul>
            </div>

             {/* Column 3: Contact */}
             <div>
              <h4 className="font-bold text-lg mb-4 text-white">Contato</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-location-dot mt-1 text-vermelho"></i>
                  <span>Av. Paulista, 1000 - São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-phone text-vermelho"></i>
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-envelope text-vermelho"></i>
                  <span>contato@mix98.com</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Receba as novidades da programação no seu e-mail.</p>
              <form className="flex">
                <input type="email" placeholder="Seu e-mail" className="bg-gray-800 border-none text-white px-4 py-2 rounded-l-lg w-full focus:ring-1 focus:ring-vermelho outline-none text-sm" />
                <button className="bg-vermelho text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition"><i className="fa-solid fa-arrow-right"></i></button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Mix 98. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Floating Buttons (if Player is closed) */}
      {!isPlayerOpen && (
        <button 
          onClick={handleStartRadio}
          className="fixed bottom-6 right-6 bg-vermelho text-white font-bold w-14 h-14 rounded-full shadow-[0_0_20px_rgba(230,0,35,0.6)] hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(230,0,35,0.9)] transition-all duration-300 z-[50] flex items-center justify-center animate-bounce"
          title="Ouvir Rádio"
        >
          <i className="fa-solid fa-headphones text-2xl"></i>
        </button>
      )}

      {/* Components */}
      <MessageToast 
        messages={messages} 
        isVisible={isPlayerOpen && !isModalOpen} 
        onDelete={handleDeleteMessage}
      />

      <MessageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSend={handleSendMessage} 
      />

      <RadioPlayer 
        isOpen={isPlayerOpen} 
        onToggleOpen={setIsPlayerOpen} 
        onOpenModal={() => setIsModalOpen(true)} 
        playTrigger={playTrigger}
      />
    </div>
  );
};

export default App;