import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserAnswer } from '../user-answers/user-answer.entity';
/**
 * Represents a student record stored in the `users` table.
 *
 * Database Design:
 * - Primary Key: user_id (auto-increment)
 * - Unique Constraint: email (enforces one account per email)
 * - Indexes: email (for login lookups), created_at (for reporting)
 * - Relationships: One-to-Many with UserAnswer (cascade delete)
 * - Audit Fields: created_at, updated_at (automatic timestamp management)
 *
 * The entity definition enforces business rules at the database level:
 * - Email uniqueness prevents duplicate accounts
 * - Non-null constraints ensure data integrity
 * - Cascade delete ensures referential integrity
 */
@Entity({ name: 'users' })
@Unique('uq_users_email', ['email'])
export class User {
  /**
   * Auto-incrementing primary key persisted as `user_id` (integer).
   *
   * Leveraged by TypeORM repositories to reference users reliably while
   * mirroring the PostgreSQL sequence-backed primary key constraint.
   */
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'integer' })
  public user_id!: number;

  /**
   * Student's display name capped at 100 characters and required.
   *
   * Enforced at the database layer to guarantee non-null values and avoid
   * overlong inputs that violate the defined varchar constraint.
   */
  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  public name!: string;

  /**
   * Unique email identifier for the student, maximum 150 characters.
   *
   * The combination of the explicit unique constraint and non-null
   * requirement prevents duplicate accounts and supports login lookups.
   */
  @Column({ name: 'email', type: 'varchar', length: 150, nullable: false })
  public email!: string;

  /**
   * Hashed password stored as a varchar with a 255-character limit.
   *
   * Required column ensures every persisted user has credentials while
   * keeping raw hashes private to the data layer only.
   */
  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  public password!: string;

  /**
   * Timestamp when the user account was created.
   * Automatically set by TypeORM on insert.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Index('idx_users_created_at')
  public created_at!: Date;

  /**
   * Timestamp when the user account was last updated.
   * Automatically updated by TypeORM on any modification.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updated_at!: Date;

  /**
   * Reverse relation: a user can have many submitted answers.
   * Cascade delete ensures answers are removed when user is deleted.
   */
  @OneToMany(() => UserAnswer, (answer) => answer.user, {
    cascade: true,
  })
  public answers!: UserAnswer[];
}
