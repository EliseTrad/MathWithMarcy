import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAnswer } from '../user-answers/user-answer.entity';

// Pure structural mapping for the `questions` table
@Entity('questions')
export class Question {
  // Primary key
  @PrimaryGeneratedColumn()
  question_id!: number;

  // Frequently queried: add index
  @Index('idx_questions_topic')
  @Column({ type: 'varchar', length: 100, nullable: false })
  topic!: string;

  // Frequently queried: add index
  @Index('idx_questions_difficulty')
  @Column({ type: 'varchar', length: 50, nullable: false })
  difficulty!: string;

  // Full prompt
  @Column({ type: 'text', nullable: false })
  question_text!: string;

  // Canonical answer
  @Column({ type: 'varchar', length: 255, nullable: false })
  correct_answer!: string;

  // Optional hint
  @Column({ type: 'text', nullable: true })
  hint: string | null = null;

  /** Reverse relation: all answers submitted for this question */
  @OneToMany(() => UserAnswer, (ua) => ua.question)
  userAnswers!: UserAnswer[];
}
