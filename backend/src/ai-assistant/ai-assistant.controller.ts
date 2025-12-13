import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('AI Assistant')
@Controller('ai')
export class AiAssistantController {
  /**
   * Ask a question to the AI math assistant.
   * @param question The user's question.
   * @returns The AI's answer.
   */
  @Post('ask')
  @ApiOperation({ summary: 'Ask a question to the AI assistant' })
  @ApiBody({
    schema: {
      properties: {
        question: { type: 'string', example: 'How do I solve 2x + 5 = 11?' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'AI answer returned',
    schema: {
      properties: { answer: { type: 'string', example: 'Step 1: ...' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async askQuestion(@Body('question') question: string) {
    // TODO: Integrate with Python LLM service here
    // For now, return a placeholder answer
    return { answer: `You asked: ${question}. (LLM answer goes here)` };
  }
}
