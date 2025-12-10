import { Module } from '@nestjs/common';
import { HandwritingService } from './handwriting.service';
import { HandwritingResolver } from './handwriting.resolver';
import { QuestionsModule } from '../questions/questions.module';
import { UserAnswersModule } from '../user-answers/user-answers.module';

/**
 * Handwriting Recognition Module
 *
 * Provides handwriting recognition capabilities for math expressions
 * using TensorFlow.js with a pre-trained MNIST model for digit recognition
 * and custom symbol detection for operators.
 */
@Module({
  imports: [QuestionsModule, UserAnswersModule],
  providers: [HandwritingService, HandwritingResolver],
  exports: [HandwritingService],
})
export class HandwritingModule {}
