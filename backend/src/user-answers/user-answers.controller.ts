import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAnswersService } from './user-answers.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { GetUserAnswersFilterDto } from './dto/get-user-answers-filter.dto';
import { UserStatisticsDto } from './dto/user-statistics.dto';

/**
 * REST controller for user answers. Thin: delegates all logic to the service.
 */
@UseGuards(AuthGuard('jwt'))
@Controller('user-answers')
export class UserAnswersController {
  constructor(private readonly userAnswersService: UserAnswersService) {}

  /**
   * GET /user-answers — list current user's answers with optional filters.
   * Example: GET /user-answers?topic=Geometry&difficulty=Medium
   */
  @Get()
  async getForCurrentUser(
    @Req() req: any,
    @Query() filters: GetUserAnswersFilterDto
  ) {
    try {
      const userId = Number(req?.user?.id);
      const results = await this.userAnswersService.getUserAnswers(
        userId,
        filters
      );
      return results;
    } catch (error) {
      console.error(
        '[USER_ANSWERS] Controller error in GET /user-answers:',
        error
      );
      throw new InternalServerErrorException('Failed to fetch answers');
    }
  }

  /**
   * GET /user-answers/statistics/me
   * Returns comprehensive statistics for the currently authenticated user
   */
  @Get('statistics/me')
  async getUserStatistics(@Req() req: any): Promise<UserStatisticsDto> {
    const userId = req.user.id; // Extracted from JWT by AuthGuard
    console.log('[USER_ANSWERS] Fetching stats for user:', userId);
    return this.userAnswersService.getUserStatistics(userId);
  }

  /** GET /user-answers/:id — get a single user answer by id */
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const userAnswer = await this.userAnswersService.getUserAnswerById(id);
    return { userAnswer };
  }

  /** POST /user-answers — create a user answer */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserAnswerDto) {
    const userAnswer = await this.userAnswersService.createUserAnswer(dto);
    return { message: 'User answer created successfully.', userAnswer };
  }

  /** PATCH /user-answers/:id — update an existing user answer */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAnswerDto
  ) {
    const userAnswer = await this.userAnswersService.updateUserAnswer(id, dto);
    return { message: 'User answer updated successfully.', userAnswer };
  }

  /** DELETE /user-answers/:id — delete a user answer */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userAnswersService.deleteUserAnswer(id);
    return { message: 'User answer deleted successfully.' };
  }
}
