import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAnswerDto } from './create-user-answer.dto';

/**
 * DTO for updating a UserAnswer. All fields are optional.
 */
export class UpdateUserAnswerDto extends PartialType(CreateUserAnswerDto) {}
