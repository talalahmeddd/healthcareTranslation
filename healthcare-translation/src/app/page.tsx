"use client";

import { useState } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
]

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [transcript, setTranscript] = useState('')
  const [translation, setTranslation] = useState('')

  const handleStartRecording = () => {
    setIsRecording(true)
    // TODO: Implement speech recognition
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // TODO: Stop speech recognition
  }

  const handleSpeak = () => {
    if (!translation) return
    // TODO: Implement text-to-speech
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Healthcare Translation Assistant
          </h1>
          <p className="mt-2 text-muted-foreground">
            Speak in your language, get instant medical translations
          </p>
        </div>

        {/* Language Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="sourceLanguage" className="text-sm font-medium">
              From
            </label>
            <select
              id="sourceLanguage"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="targetLanguage" className="text-sm font-medium">
              To
            </label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recording Button */}
        <div className="flex justify-center">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isRecording
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {isRecording ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Transcripts */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original Text</label>
            <div className="min-h-[200px] rounded-lg border border-input bg-background p-4">
              {transcript || 'Speak to see the transcript...'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Translation</label>
              <button
                onClick={handleSpeak}
                disabled={!translation}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-[200px] rounded-lg border border-input bg-background p-4">
              {translation || 'Translation will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
