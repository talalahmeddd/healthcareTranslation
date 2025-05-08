"use client"

import { useState } from "react"
import { Mic, Volume2, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function VoiceTranslator() {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [originalText, setOriginalText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false)
      setIsTranslating(true)

      // Simulate translation delay
      setTimeout(() => {
        setIsTranslating(false)
        toast.success("Translation complete")
      }, 1500)
    } else {
      setIsRecording(true)
      toast.info("Listening...")
    }
  }

  const handlePlayAudio = () => {
    toast.info("Playing audio...")
    // Audio playback logic would go here
  }

  return (
    <div className="medical-card">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Medical Translator</h1>
        <p className="mb-8 text-lg text-muted-foreground">Speak for real-time translation</p>

        <button
          onClick={handleMicClick}
          className={`mic-button flex items-center justify-center ${isRecording ? "mic-button-recording" : ""}`}
        >
          {isRecording ? <Mic className="h-12 w-12 text-red-500" /> : <Mic className="h-12 w-12 text-primary" />}
        </button>

        <div className="translator-input">
          <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">PATIENT STATEMENT</p>
          <p className="text-xl font-medium text-foreground">{originalText}</p>
        </div>

        <div className="translator-input">
          <div className="flex items-center justify-between">
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">TRANSLATION</p>
            {isTranslating && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
          <p className="text-xl font-medium text-foreground">{translatedText}</p>
        </div>

        <div className="mb-6 grid w-full grid-cols-2 gap-4">
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Arabic">Arabic</option>
          </select>

          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="Spanish">Spanish</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>

        <button onClick={handlePlayAudio} className="play-button flex items-center justify-center">
          <Volume2 className="mr-2 h-6 w-6" />
          Play Translation
        </button>
      </div>
    </div>
  )
}
