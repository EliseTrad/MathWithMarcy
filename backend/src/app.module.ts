import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { UserAnswersModule } from './user-answers/user-answers.module';
import { User } from './users/user.entity';
import { Question } from './questions/question.entity';
import { UserAnswer } from './user-answers/user-answer.entity';

/**
 * Root application module following NestJS best practices.
 *
 * Architecture:
 * - ConfigModule: Global configuration and environment variable validation
 * - TypeORM: Database connection with dependency injection
 * - CommonModule: Shared utilities, filters, and validators
 * - Feature Modules: UsersModule, AuthModule, QuestionsModule, UserAnswersModule
 *
 * Best Practices Implemented:
 * - Module-based architecture for separation of concerns
 * - Async configuration using factories and dependency injection
 * - Environment variable validation at startup
 * - Global modules for cross-cutting concerns
 */
@Module({
  imports: [
    // Load environment variables and validate them
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),

    // Configure TypeORM using ConfigService for proper dependency injection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Question, UserAnswer],
        synchronize: true, // Only for development
        logging: true,
      }),
    }),

    // Configure GraphQL module with Apollo driver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }: { req: any }) => ({ req }),
    }),

    // Shared/Common module with global filters and utilities
    CommonModule,

    // Feature modules (order doesn't matter due to proper dependency injection)
    UsersModule,
    AuthModule,
    QuestionsModule,
    UserAnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
