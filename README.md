# Healthcare Translation Assistant

A real-time healthcare translation application that helps break down language barriers in medical settings.

## Features

- 🎙️ Voice-to-Text Transcription with medical terminology optimization
- 🌐 Real-time translation using OpenAI 
- 🔊 Text-to-Speech playback using OpenAI's TTS API
- 📱 Mobile-first responsive design
- 🔒 Basic data encryption with no transcript storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Speech Processing**: Web Speech API
- **Translation**: OpenAI GPT-4o
- **Text-to-Speech**: OpenAI TTS API
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/healthcare-translation.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API keys:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Voice Recording**:
   - Click the microphone button to start recording
   - Speak clearly in your preferred language
   - Click again to stop recording

2. **Translation**:
   - Select your source language (the language you're speaking in)
   - Select your target language (the language you want to translate to)
   - The translation will appear automatically

3. **Text-to-Speech**:
   - After translation is complete, click the "Play Translation" button
   - The translated text will be converted to speech and played back
   - The audio is generated on-demand using OpenAI's TTS API

## Security Considerations

- No transcripts or translations are stored permanently
- API keys are securely handled using environment variables
- Client-side encryption for data in transit
- Regular security audits and dependency updates

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   ├── translate/  # Translation endpoint
│   │   └── text-to-speech/ # Text-to-speech endpoint
├── components/          # Reusable UI components
├── lib/                 # Utility functions and hooks
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
 
