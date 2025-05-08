import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Use OpenAI's Whisper model for transcription
    const file = new File([audioFile], 'audio.webm', { type: 'audio/webm' });
    const response = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    const transcription = response;

    if (!transcription) {
      return NextResponse.json(
        { error: 'No transcription generated' },
        { status: 500 }
      );
    }

    // Post-process with GPT-4 for medical terminology enhancement
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a medical transcription specialist. Your task is to enhance the accuracy of medical terminology in the provided transcription. Correct any medical terms, add proper punctuation, and ensure the text is grammatically correct while maintaining the original meaning. Only return the enhanced text without any explanations."
        },
        {
          role: "user",
          content: transcription
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const enhancedText = gptResponse.choices[0]?.message?.content || transcription;

    return NextResponse.json({ text: enhancedText });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
} 