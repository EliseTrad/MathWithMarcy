import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string | number;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
};

/**
 * Passport strategy that validates bearer JWTs and attaches payload-derived identity to requests.
 * Implements comprehensive token validation with detailed error handling.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });

    if (!process.env.JWT_SECRET) {
      this.logger.error(
        'JWT_SECRET is not configured in environment variables'
      );
      throw new Error('JWT_SECRET must be configured');
    }
  }

  /**
   * Ensures the decoded JWT payload contains required identifiers and exposes them to downstream handlers.
   *
   * @param payload Decoded JWT payload (sub, email, role, iat, exp).
   * @returns Minimal user-like object bound to the request context.
   * @throws UnauthorizedException When required payload attributes are missing or token is invalid.
   */
  public async validate(payload: JwtPayload) {
    try {
      // Validate required fields
      if (!payload?.sub || !payload?.email) {
        this.logger.warn('JWT validation failed: missing required fields');
        throw new UnauthorizedException(
          'Invalid token: missing required information'
        );
      }

      // Additional validation: check if token is expired (redundant with passport, but explicit)
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.logger.warn('JWT validation failed: token expired');
        throw new UnauthorizedException(
          'Your session has expired. Please login again.'
        );
      }

      this.logger.debug(
        `JWT validated successfully for user: ${payload.email}`
      );

      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role ?? 'student',
      };
    } catch (error) {
      // Re-throw UnauthorizedException
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log and wrap unexpected errors
      this.logger.error('Unexpected error during JWT validation:', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
