import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAnswer } from '../user-answers/user-answer.entity';

/**
 * Question entity representing the `questions` table.
 *
 * Database Design:
 * - Primary Key: question_id (auto-increment)
 * - Indexes: topic, difficulty (for filtering), composite index on (topic, difficulty)
 * - Constraints: All core fields are NOT NULL to ensure data integrity
 * - Relationships: One-to-Many with UserAnswer (cascade delete)
 * - Audit Fields: created_at, updated_at
 *
 * Business Logic Enforced at Database Level:
 * - Topic and difficulty are indexed for efficient filtering
 * - Composite index supports common query pattern (topic + difficulty)
 * - Cascade delete ensures answers are removed when question is deleted
 */
@Entity('questions')
@Index('idx_questions_topic_difficulty', ['topic', 'difficulty'])
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

  /**
   * Timestamp when the question was created.
   * Useful for tracking question additions and reporting.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public created_at!: Date;

  /**
   * Timestamp when the question was last updated.
   * Tracks modifications to question content.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updated_at!: Date;

  /**
   * Reverse relation: all answers submitted for this question.
   * Cascade delete ensures answers are removed when question is deleted.
   */
  @OneToMany(() => UserAnswer, (ua) => ua.question, {
    cascade: true,
  })
  userAnswers!: UserAnswer[];
}
