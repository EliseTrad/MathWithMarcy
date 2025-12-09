import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';

/**
 * AuthModule - Authentication and Authorization Module
 *
 * Responsibilities:
 * - User authentication (login/register)
 * - JWT token generation and validation
 * - Password management
 * - Passport.js JWT strategy
 *
 * Architecture:
 * - Uses forwardRef to resolve circular dependency with UsersModule
 * - JwtModule configured asynchronously using ConfigService for proper DI
 * - Exports AuthService and JwtStrategy for use in other modules
 *
 * Best Practices:
 * - Separation of concerns: controller for HTTP, service for business logic
 * - Async module configuration with dependency injection
 * - Exports only necessary components (AuthService, JwtStrategy)
 * - Uses Passport guards for route protection
 */
@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const signOptions: JwtSignOptions = {};
        const expiresInFromEnv = config.get<string>('JWT_EXPIRES_IN');
        const resolvedExpiresIn = (expiresInFromEnv ??
          '1d') as JwtSignOptions['expiresIn'];

        signOptions.expiresIn = resolvedExpiresIn;

        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions,
        };
      },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
