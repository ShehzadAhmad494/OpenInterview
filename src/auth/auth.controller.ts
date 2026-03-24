import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/signup
  @Post('signup')
  async signUpUser(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }
  //   POST /auth/login
  @Post('login')
  async loginUser(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
