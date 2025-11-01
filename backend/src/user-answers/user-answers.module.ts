import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAnswer } from './user-answer.entity';
import { UserAnswersService } from './user-answers.service';
import { UserAnswersController } from './user-answers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAnswer])],
  controllers: [UserAnswersController],
  providers: [UserAnswersService],
})
export class UserAnswersModule {}
