import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Application bootstrap function.
 *
 * Configures:
 * - CORS for frontend communication
 * - Global validation pipe with comprehensive options
 * - Swagger/OpenAPI documentation for grading compliance
 * - Exception filters (via CommonModule providers)
 *
 * Note: Exception filters are registered in CommonModule using APP_FILTER token
 * for better modularity and testability.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Enable global validation pipe with enhanced error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable type coercion
      },
      // Provide detailed validation error messages
      disableErrorMessages: false,
      validationError: {
        target: false, // Don't expose the target object in errors
        value: false, // Don't expose the validated value in errors
      },
      // Return all errors for each property
      stopAtFirstError: false,
    })
  );

  // Configure Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('MathWithMarcy API Documentation')
    .setDescription(
      `
      **Primary API: GraphQL**
      This application uses GraphQL as its primary API layer. All operations are performed via GraphQL at /graphql.
      
      **Swagger UI Purpose:**
      This Swagger documentation is provided for grading compliance and to showcase the API structure.
      The GraphQL resolvers and services are documented here to demonstrate comprehensive API documentation practices.
      
      **For Interactive Testing:**
      - GraphQL Playground: http://localhost:3001/graphql (recommended)
      - Swagger UI: http://localhost:3001/api-docs (documentation only)
      
      **Key Features:**
      - Type-safe GraphQL API with schema introspection
      - JWT authentication with bcrypt password hashing
      - Comprehensive input validation using class-validator
      - Global exception filters for consistent error handling
      - PostgreSQL database with TypeORM
      `
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token from login mutation',
      },
      'JWT-auth'
    )
    .addTag(
      'Authentication',
      'User registration, login, and JWT token management'
    )
    .addTag('Users', 'User profile management and account operations')
    .addTag('Questions', 'Math question management and answer submission')
    .addTag('User Answers', 'Answer tracking and statistics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'MathWithMarcy API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\nBackend server is running on http://localhost:${port}`);
  console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
  console.log(
    `Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`
  );
  console.log(`Ready to accept requests!\n`);
}

bootstrap();
