import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserAnswer } from '../user-answers/user-answer.entity';
/**
 * Represents a student record stored in the `users` table.
 *
 * The entity definition informs TypeORM about the exact column mappings,
 * constraints, and data limits enforced by PostgreSQL so repository
 * operations in the service layer remain consistent with the schema.
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
   * Reverse relation: a user can have many submitted answers.
   */
  @OneToMany(() => UserAnswer, (answer) => answer.user)
  public answers!: UserAnswer[];
}
