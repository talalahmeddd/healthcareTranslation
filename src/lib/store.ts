import { create } from "zustand";

interface TranslationState {
  transcript: string;
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
  isRecording: boolean;
  setTranscript: (transcript: string) => void;
  setTranslation: (translation: string) => void;
  setSourceLanguage: (language: string) => void;
  setTargetLanguage: (language: string) => void;
  setIsRecording: (isRecording: boolean) => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  transcript: "",
  translation: "",
  sourceLanguage: "en",
  targetLanguage: "es",
  isRecording: false,
  setTranscript: (transcript) => set({ transcript }),
  setTranslation: (translation) => set({ translation }),
  setSourceLanguage: (sourceLanguage) => set({ sourceLanguage }),
  setTargetLanguage: (targetLanguage) => set({ targetLanguage }),
  setIsRecording: (isRecording) => set({ isRecording }),
})); 