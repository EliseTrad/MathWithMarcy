import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from './question.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { UserAnswer } from '../user-answers/user-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, UserAnswer])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
