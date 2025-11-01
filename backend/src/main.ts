import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\nBackend server is running on http://localhost:${port}`);
  console.log(
    `Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`
  );
  console.log(`Ready to accept requests!\n`);
}

bootstrap();
