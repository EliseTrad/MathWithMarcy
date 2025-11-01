import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { UserAnswersModule } from './user-answers/user-answers.module';
import { User } from './users/user.entity';
import { Question } from './questions/question.entity';
import { UserAnswer } from './user-answers/user-answer.entity';

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

    // Configure TypeORM using ConfigService
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

    // Application modules
    UsersModule,
    AuthModule,
    QuestionsModule,
    UserAnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
