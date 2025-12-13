import { Controller, Post, Body } from '@nestjs/common';

@Controller('ai')
export class AiAssistantController {
  @Post('ask')
  async askQuestion(@Body('question') question: string) {
    // TODO: Integrate with Python LLM service here
    // For now, return a placeholder answer
    return { answer: `You asked: ${question}. (LLM answer goes here)` };
  }
}
