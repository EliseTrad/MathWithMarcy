import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DatabaseExceptionFilter } from './filters/database-exception.filter';

/**
 * CommonModule provides shared utilities, filters, and validators
 * used across the entire application.
 *
 * This module follows NestJS best practices by:
 * - Centralizing cross-cutting concerns
 * - Providing global exception filters via providers
 * - Exporting reusable components for other modules
 */
@Module({
  providers: [
    // Register global exception filters via APP_FILTER token
    // This is the recommended approach for global filters in modular applications
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [],
})
export class CommonModule {}
