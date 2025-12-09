import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

/**
 * UserAnswer entity representing the `user_answers` table.
 *
 * Database Design:
 * - Primary Key: answer_id (auto-increment)
 * - Foreign Keys: user_id → users.user_id, question_id → questions.question_id
 * - Indexes: user_id, question_id, is_correct, composite (user_id, created_at)
 * - Constraints: NOT NULL on all required fields, CASCADE DELETE on foreign keys
 * - Audit Fields: created_at, updated_at
 *
 * Business Logic Enforced at Database Level:
 * - Foreign key constraints ensure referential integrity
 * - Cascade delete maintains data consistency when users/questions are deleted
 * - Indexes optimize queries for user statistics and answer history
 * - Composite index (user_id, created_at) optimizes chronological answer retrieval
 * - Boolean default (false) ensures is_correct always has a value
 */
@Entity({ name: 'user_answers' })
@Index('idx_user_answers_user_created', ['user', 'created_at'])
@Index('idx_user_answers_is_correct', ['is_correct'])
export class UserAnswer {
  /** Primary key: answer_id */
  @PrimaryGeneratedColumn({ name: 'answer_id', type: 'integer' })
  public answer_id!: number;

  /** Foreign key → users.user_id */
  @Index('idx_user_answers_user_id')
  @ManyToOne(() => User, (user) => user.answers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  public user!: User;

  /** Foreign key → questions.question_id */
  @Index('idx_user_answers_question_id')
  @ManyToOne(() => Question, (q) => q.userAnswers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id', referencedColumnName: 'question_id' })
  public question!: Question;

  /** Student's raw answer */
  @Column({
    name: 'user_answer',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public user_answer!: string;

  /** Whether the answer is correct */
  @Column({
    name: 'is_correct',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  public is_correct!: boolean;

  /**
   * Timestamp when the answer was submitted.
   * Critical for tracking user progress and performance over time.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public created_at!: Date;

  /**
   * Timestamp when the answer was last updated.
   * Tracks modifications to submitted answers (if allowed).
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updated_at!: Date;
}
