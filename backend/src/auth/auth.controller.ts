import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new learner via POST /auth/register.
   *
   * @param registerDto Validated payload containing first & last name, email, and password.
   * @returns Newly created user without password information.
   * @throws BadRequestException When validation fails or email is already registered.
   * @throws InternalServerErrorException For unexpected persistence issues.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Authenticates a learner via POST /auth/login.
   *
   * @param loginDto Validated credentials including email and password.
   * @returns JWT access token combined with the sanitized user profile.
   * @throws UnauthorizedException When the provided credentials are invalid.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
