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

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Controller('chat-gemini')
export class ChatController {
  @Post()
  async chat(
    @Body()
    body: {
      prompt: string;
      conversationHistory?: ChatMessage[]; // Array of previous messages
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
    const conversationHistory = body.conversationHistory || [];

    const contextMessage = context
      ? `This is about the TOEIC exam titled "${context.examTitle}". The user got ${context.correct} correct, ${context.incorrect} incorrect, and skipped ${context.skipped} questions.`
      : '';

    const systemPrompt = `
You are an AI assistant on an English learning website specialized in TOEIC preparation. 
Always provide friendly, clear, briefly, concise and educational responses to help users improve their English and prepare for the TOEIC test. Avoid unnecessary explanations or repetition. If possible, respond in 2-5 sentences.

${contextMessage}
    `.trim();

    if (!apiKey) {
      throw new HttpException(
        'Missing Gemini API key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      // Build the contents array with conversation history
      const contents: ChatMessage[] = [];

      // Add system prompt as the first user message if it's the start of conversation
      if (conversationHistory.length === 0 && contextMessage) {
        contents.push({
          role: 'user',
          parts: [{ text: systemPrompt }],
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'I understand. I\'m ready to help you with TOEIC preparation and English learning. How can I assist you today?' }],
        });
      }

      // Add conversation history
      contents.push(...conversationHistory);

      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: body.prompt }],
      });

      const result = await axios.post<GeminiResponse>(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: contents,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const reply =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply.';

      // Return reply along with updated conversation history
      const updatedHistory = [
        ...contents,
        {
          role: 'model' as const,
          parts: [{ text: reply }],
        },
      ];

      return { 
        reply,
        conversationHistory: updatedHistory // Return updated history for frontend to store
      };
    } catch (error) {
      console.error(error?.response?.data || error);
      throw new HttpException(
        'Gemini API failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}