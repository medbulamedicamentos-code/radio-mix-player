import { Message } from '../types';

const STORAGE_KEY = 'radio_messages';

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Mock database service using LocalStorage for the demo.
// In production, replace this with actual Firebase calls.
export const messageService = {
  getMessages: (): Message[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading messages", e);
      return [];
    }
  },

  addMessage: async (msg: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    const messages = messageService.getMessages();
    
    const newMessage: Message = {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    // Add to front
    const updatedMessages = [newMessage, ...messages].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    
    return newMessage;
  },

  deleteMessage: (id: string): void => {
    const messages = messageService.getMessages();
    const updated = messages.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};