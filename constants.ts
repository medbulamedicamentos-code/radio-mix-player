import { Program } from './types';

export const RADIO_STREAM_URL = "https://stream.zeno.fm/l6kbfxwquuktv";

export const PROGRAMS: Program[] = [
  { 
    id: 1,
    hora: 0, 
    nome: "Madrugada com Zara", 
    locutor: "Zara", 
    imagem: "https://www.dropbox.com/scl/fi/piczrd9z2vnlveho8vxht/Design-sem-nome-5.png?rlkey=7tftbt38t4fqlnrdleh338hgm&st=x60pjlvb&dl=1" 
  },
  { 
    id: 2,
    hora: 8, 
    nome: "Dia com Kira", 
    locutor: "Kira", 
    imagem: "https://www.dropbox.com/scl/fi/kz3lxe7lfgidx0bqow1kk/Image_fx-2.jpg?rlkey=x4vfluvt9e3zpuu86ed4h3e8j&st=cr0iy63y&dl=1" 
  },
  { 
    id: 3,
    hora: 16, 
    nome: "Noite com Khaled", 
    locutor: "Khaled", 
    imagem: "https://www.dropbox.com/scl/fi/fzrccm8iwgeka5n5lxmio/Image_fx-57.jpg?rlkey=wen7pv62uuo09y9d1yh8oj2op&st=1j5r2h77&dl=1" 
  }
];

export const DEFAULT_AVATAR = "https://via.placeholder.com/60?text=Foto";