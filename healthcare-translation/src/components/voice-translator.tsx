"use client"

import { useState, useCallback, useEffect } from "react"
import { Volume2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { VoiceInput } from "./VoiceInput"

export default function VoiceTranslator() {
  const [originalText, setOriginalText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")

  const translateText = useCallback(async (text: string) => {
    if (!text.trim() || isRecording) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
      toast.success("Translation complete");
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate text');
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLanguage, targetLanguage, isRecording]);

  // Translate when languages change
  useEffect(() => {
    if (originalText && !isRecording) {
      translateText(originalText);
    }
  }, [sourceLanguage, targetLanguage, translateText, originalText, isRecording]);

  const handleTranscriptionComplete = useCallback((text: string) => {
    setOriginalText(text);
    setIsRecording(false);
    // Don't trigger translation here as it will be handled by the useEffect
  }, []);

  const handleRecordingStart = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleTranscriptUpdate = useCallback((final: string, interim: string) => {
    setFinalTranscript(final);
    setInterimTranscript(interim);
  }, []);

  const handlePlayAudio = () => {
    toast.info("Playing audio...")
    // Audio playback logic would go here
  }

  return (
    <div className="medical-card w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">Medical Translator</h1>
        <p className="mb-8 text-base sm:text-lg text-muted-foreground">Speak for real-time translation</p>

        <div className="w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <VoiceInput 
              onTranscriptionComplete={handleTranscriptionComplete}
              isProcessing={isTranslating}
              sourceLanguage={sourceLanguage}
              onRecordingStart={handleRecordingStart}
              onTranscriptUpdate={handleTranscriptUpdate}
            />

            <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8">
              {(interimTranscript || finalTranscript) && (
                <div className="translator-input w-full">
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">LIVE TRANSCRIPTION</p>
                  <div className="space-y-2">
                    {finalTranscript && (
                      <p className="text-lg sm:text-xl font-medium text-foreground">{finalTranscript}</p>
                    )}
                    {interimTranscript && (
                      <p className="text-lg sm:text-xl font-medium text-muted-foreground">{interimTranscript}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="translator-input w-full">
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">PATIENT STATEMENT</p>
                <p className="text-lg sm:text-xl font-medium text-foreground">{originalText}</p>
              </div>
            </div>

            <div className="translator-input w-full">
              <div className="flex items-center justify-between">
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">TRANSLATION</p>
                {isTranslating && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </div>
              <p className="text-lg sm:text-xl font-medium text-foreground">{translatedText}</p>
            </div>

            <div className="mb-8 grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">TRANSCRIPT</p>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="language-selector bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Urdu">Urdu</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">TRANSLATE TO</p>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="language-selector bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Urdu">Urdu</option>
                </select>
              </div>
            </div>

            <button onClick={handlePlayAudio} className="play-button flex items-center justify-center w-full sm:w-auto">
              <Volume2 className="mr-2 h-6 w-6" />
              Play Translation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
