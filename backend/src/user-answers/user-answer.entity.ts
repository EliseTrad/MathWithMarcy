import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

/**
 * Structural mapping for the `user_answers` table.
 * Pure entity definition — no business logic.
 */
@Entity({ name: 'user_answers' })
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
}
