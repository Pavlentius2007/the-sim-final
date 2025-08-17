import { NextRequest, NextResponse } from 'next/server'
import { translateText } from '@/lib/translate'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'ru' } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing text or target language' },
        { status: 400 }
      )
    }

    const translatedText = await translateText(text, targetLanguage, sourceLanguage)

    return NextResponse.json({ 
      translatedText,
      originalText: text,
      targetLanguage,
      sourceLanguage
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
} 