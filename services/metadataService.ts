import { Message } from '../types';

// Zeno.fm often exposes metadata via SSE (Server-Sent Events) at this endpoint format.
// The stream token is 'l6kbfxwquuktv'.
const ZENO_SSE_URL = "https://api.zeno.fm/mounts/metadata/subscribe/l6kbfxwquuktv";

const DEMO_PLAYLIST = [
  "Dua Lipa - Houdini",
  "The Weeknd - Blinding Lights",
  "Miley Cyrus - Flowers",
  "Harry Styles - As It Was",
  "Taylor Swift - Cruel Summer",
  "Bruno Mars - Locked Out of Heaven",
  "Coldplay - Viva La Vida",
  "Imagine Dragons - Believer",
  "Ed Sheeran - Shape of You",
  "Calvin Harris - Summer",
  "Rihanna - Diamonds",
  "Katy Perry - Firework",
  "Lady Gaga - Bad Romance",
  "Mix 98 - A Melhor Música", 
  "Mix 98 - Promoção Exclusiva" 
];

// Helper to get simulated track based on time
const getSimulatedMetadata = (): string => {
  const trackDuration = 180000; // 3 minutes
  const now = Date.now();
  const index = Math.floor((now / trackDuration) % DEMO_PLAYLIST.length);
  return DEMO_PLAYLIST[index];
};

/**
 * Subscribes to metadata updates.
 * Attempts to connect to real Zeno FM metadata.
 * Falls back to simulation if connection fails.
 */
export const subscribeToMetadata = (onUpdate: (title: string) => void): () => void => {
  let eventSource: EventSource | null = null;
  let intervalId: any = null;
  let usingFallback = false;

  const startFallback = () => {
    if (usingFallback) return;
    usingFallback = true;
    
    // Close broken connection if exists
    if (eventSource) {
        try {
            eventSource.close();
        } catch(e) { /* ignore */ }
        eventSource = null;
    }
    
    console.log("Using simulated metadata fallback");
    
    // Update immediately
    onUpdate(getSimulatedMetadata());
    
    // Update periodically
    intervalId = setInterval(() => {
        onUpdate(getSimulatedMetadata());
    }, 10000); // Check every 10s
  };

  try {
    // Attempt real connection
    eventSource = new EventSource(ZENO_SSE_URL);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.streamTitle) {
            onUpdate(data.streamTitle);
        }
      } catch (e) {
        console.error("Error parsing metadata", e);
      }
    };

    eventSource.onerror = (err) => {
        // SSE often fails due to CORS or network blocks on client side
        // Switch to fallback immediately
        startFallback();
    };
    
    eventSource.onopen = () => {
        console.log("Connected to Zeno Metadata Stream");
    };

  } catch (e) {
    console.error("Failed to init EventSource", e);
    startFallback();
  }

  // Return cleanup function
  return () => {
    if (eventSource) {
        eventSource.close();
    }
    if (intervalId) {
        clearInterval(intervalId);
    }
  };
};

// Existing message service logic below...

const STORAGE_KEY = 'radio_messages';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
    const updatedMessages = [newMessage, ...messages].slice(0, 50); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    
    return newMessage;
  },

  deleteMessage: (id: string): void => {
    const messages = messageService.getMessages();
    const updated = messages.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
