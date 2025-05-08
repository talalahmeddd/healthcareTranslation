'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscriptionComplete: (text: string) => void;
  isProcessing?: boolean;
  sourceLanguage: string;
  onRecordingStart: () => void;
  onTranscriptUpdate?: (final: string, interim: string) => void;
}

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function VoiceInput({ 
  onTranscriptionComplete, 
  isProcessing = false, 
  sourceLanguage,
  onRecordingStart,
  onTranscriptUpdate
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const finalTranscriptRef = useRef('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const translationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, []);

  const translateToSourceLanguage = async (text: string) => {
    if (!text.trim()) {
      return text;
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage: 'English',
          targetLanguage: sourceLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const debouncedTranslate = (text: string) => {
    if (!text.trim()) {
      return;
    }

    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    translationTimeoutRef.current = setTimeout(async () => {
      const translatedText = await translateToSourceLanguage(text);
      onTranscriptionComplete(translatedText);
    }, 300);
  };

  const startRecording = async () => {
    try {
      setIsInitializing(true);
      setFinalTranscript('');
      setInterimTranscript('');
      finalTranscriptRef.current = '';
      audioChunksRef.current = [];

      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setIsInitializing(false);
        setRecordingTime(0);
        onRecordingStart();
        
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        mediaRecorder.start();
        toast.success('Recording started');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (final) {
          finalTranscriptRef.current += final;
          setFinalTranscript(finalTranscriptRef.current);
          debouncedTranslate(finalTranscriptRef.current);
        }
        
        setInterimTranscript(interim);
        if (interim) {
          debouncedTranslate(finalTranscriptRef.current + interim);
        }

        // Notify parent component of transcript updates
        onTranscriptUpdate?.(finalTranscriptRef.current, interim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        stopRecording();
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start();
        } else {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
          }
          
          stream.getTracks().forEach(track => track.stop());
          
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setRecordingTime(0);
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start recording');
      setIsInitializing(false);
    }
  };

  const stopRecording = async () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      recognitionRef.current.stop();
      toast.info('Processing audio...');

      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        await new Promise<void>((resolve) => {
          mediaRecorderRef.current!.onstop = () => resolve();
          mediaRecorderRef.current!.stop();
        });
      }

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);

      try {
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        if (data.text) {
          // Send the transcribed text directly without translation
          onTranscriptionComplete(data.text);
        }
      } catch (error) {
        console.error('Error processing audio:', error);
        toast.error('Failed to process audio');
        const completeTranscript = finalTranscriptRef.current.trim();
        if (completeTranscript) {
          // Send the final transcript directly without translation
          onTranscriptionComplete(completeTranscript);
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isInitializing || isProcessing}
        className="h-12 w-12"
      >
        {isInitializing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      <div className="flex flex-col items-center">
        <span className="text-sm text-muted-foreground">
          {isRecording ? 'Stop' : 'Click to Speak'}
        </span>
        {isRecording && (
          <span className="text-sm font-medium text-destructive">
            {formatTime(recordingTime)}
          </span>
        )}
      </div>
    </div>
  );
} 