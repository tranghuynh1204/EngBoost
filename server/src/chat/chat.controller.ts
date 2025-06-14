import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}


@Controller('chat-gemini')
export class ChatController {
  @Post()
  async chat(
    @Body()
    body: {
      prompt: string;
      context?: {
        examTitle: string;
        correct: number;
        incorrect: number;
        skipped: number;
      };
    },
  ) {
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
    const apiKey = process.env.GEMINI_API_KEY;
    const context = body.context;
    const contextMessage = context
      ? `This is about the TOEIC exam titled "${context.examTitle}". The user got ${context.correct} correct, ${context.incorrect} incorrect, and skipped ${context.skipped} questions.`
      : '';

    const enhancedPrompt = `
You are an AI assistant on an English learning website specialized in TOEIC preparation.

Always provide friendly, clear, briefly, concise and educational responses to help users improve their English and prepare for the TOEIC test. Avoid unnecessary explanations or repetition. If possible, respond in 2-5 sentences.

${contextMessage}

User: ${body.prompt}
`.trim();

    if (!apiKey) {
      throw new HttpException(
        'Missing Gemini API key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const result = await axios.post<GeminiResponse>(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: enhancedPrompt }],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const reply =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply.';
      return { reply };
    } catch (error) {
      console.error(error?.response?.data || error);
      throw new HttpException(
        'Gemini API failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
