import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

/**
 * REST controller for Questions.
 * Thin delegator: no business logic; validation occurs via DTOs and pipes.
 */
@UseGuards(AuthGuard('jwt'))
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * GET /questions
   * Returns a list of questions filtered by topic, difficulty, and optionally randomized.
   * Query params: topic, difficulty, random
   */
  @Get()
  async getAll(@Query() filters: GetQuestionsFilterDto) {
    const questions = await this.questionsService.getFilteredQuestions(filters);
    return { questions };
  }

  /**
   * POST /questions/:id/answer
   * Submit an answer to a specific question.
   * Requires authentication to identify the user.
   */
  @Post(':id/answer')
  @HttpCode(HttpStatus.OK)
  async submitAnswer(
    @Param('id', ParseIntPipe) questionId: number,
    @Body() dto: SubmitAnswerDto,
    @Request() req: any
  ) {
    const userId = req.user.id; // Extracted from JWT by AuthGuard ('sub' field)
    const result = await this.questionsService.submitAnswer(
      userId,
      questionId,
      dto
    );
    return {
      message: result.isCorrect
        ? 'Correct answer!'
        : 'Incorrect answer. Try again!',
      isCorrect: result.isCorrect,
      correctAnswer: result.isCorrect ? undefined : result.correctAnswer,
    };
  }

  /**
   * GET /questions/:id
   * Returns a single question by id.
   */
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const question = await this.questionsService.getQuestionById(id);
    return { question };
  }

  /**
   * POST /questions
   * Creates a new question.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateQuestionDto) {
    const question = await this.questionsService.createQuestion(dto);
    return { message: 'Question created successfully.', question };
  }

  /**
   * PATCH /questions/:id
   * Updates an existing question by id.
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto
  ) {
    const question = await this.questionsService.updateQuestion(id, dto);
    return { message: 'Question updated successfully.', question };
  }

  /**
   * DELETE /questions/:id
   * Deletes a question by id.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.questionsService.deleteQuestion(id);
    // For NO_CONTENT, body is typically empty; returning message for clarity if needed.
    return { message: 'Question deleted successfully.' };
  }
}
