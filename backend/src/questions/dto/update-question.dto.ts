import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

/**
 * DTO for updating a Question.
 * Inherits validators from CreateQuestionDto but makes all fields optional.
 */
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
