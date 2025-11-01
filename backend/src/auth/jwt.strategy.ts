import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string | number;
  email: string;
  role?: string;
};

/**
 * Passport strategy that validates bearer JWTs and attaches payload-derived identity to requests.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  /**
   * Ensures the decoded JWT payload contains required identifiers and exposes them to downstream handlers.
   *
   * @param payload Decoded JWT payload (sub, email, role).
   * @returns Minimal user-like object bound to the request context.
   * @throws UnauthorizedException When required payload attributes are missing.
   */
  public async validate(payload: JwtPayload) {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role ?? 'student',
    };
  }
}
