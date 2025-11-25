import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../services/messageService';
import { DEFAULT_AVATAR } from '../constants';
import { MessageFormData } from '../types';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: Omit<MessageFormData, 'foto'> & { foto: string }) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, onSend }) => {
  const [formData, setFormData] = useState<MessageFormData>({
    nome: '',
    cidade: '',
    texto: '',
    foto: null,
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, foto: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cidade || !formData.texto) return;

    setLoading(true);
    try {
      let fotoBase64 = DEFAULT_AVATAR;
      if (formData.foto) {
        fotoBase64 = await fileToBase64(formData.foto);
      }

      onSend({
        nome: formData.nome,
        cidade: formData.cidade,
        texto: formData.texto,
        foto: fotoBase64
      });

      // Reset form
      setFormData({ nome: '', cidade: '', texto: '', foto: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Error processing message", error);
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-start justify-center pt-10 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-card w-full max-w-[320px] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-[fadeIn_0.3s_ease-out] border border-transparent dark:border-gray-700 transition-colors duration-300">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-black/20 p-3 flex justify-end border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition flex items-center justify-center font-bold"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <h3 className="text-vermelho dark:text-red-500 text-xl font-bold text-center mb-4">
            Envie seu Recado
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              maxLength={50}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-vermelho focus:ring-1 focus:ring-vermelho outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              placeholder="Sua cidade"
              maxLength={50}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-vermelho focus:ring-1 focus:ring-vermelho outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />

            <textarea
              name="texto"
              value={formData.texto}
              onChange={handleChange}
              placeholder="Seu recado (máx. 300)"
              maxLength={300}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-vermelho focus:ring-1 focus:ring-vermelho outline-none text-sm resize-none h-24 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600 dark:text-gray-400 font-semibold">📸 Foto (opcional):</label>
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 dark:file:bg-red-900/20 file:text-red-700 dark:file:text-red-400 hover:file:bg-red-100 dark:hover:file:bg-red-900/40 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 w-full bg-vermelho text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i> Enviar Recado
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};