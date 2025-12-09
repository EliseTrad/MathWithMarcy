import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Application bootstrap function.
 *
 * Configures:
 * - CORS for frontend communication
 * - Global validation pipe with comprehensive options
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

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\nBackend server is running on http://localhost:${port}`);
  console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(
    `Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`
  );
  console.log(`Ready to accept requests!\n`);
}

bootstrap();
