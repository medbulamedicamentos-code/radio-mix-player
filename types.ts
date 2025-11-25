export interface Program {
  id: number;
  hora: number;
  nome: string;
  locutor: string;
  imagem: string;
}

export interface Message {
  id: string;
  nome: string;
  cidade: string;
  texto: string;
  foto: string;
  timestamp: number;
}

export interface MessageFormData {
  nome: string;
  cidade: string;
  texto: string;
  foto: File | null;
}