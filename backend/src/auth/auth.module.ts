import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * Encapsulates authentication concerns by wiring the controller, service, and JWT strategy.
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
