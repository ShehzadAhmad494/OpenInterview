/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import type { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // Route 1 — Start Google Login
  @Get('google')
@UseGuards(GoogleAuthGuard)
async googleAuth() {
  // this route triggers google login
}

// Route 2 --Google CallBack URL
@Get('google/callback')
@UseGuards(GoogleAuthGuard)
async googleCallback(@Req() req) {
  console.log("Google User", req.user);
  return {
    message: "Google Authentication Successful",
    user: req.user,
  };
}
  // POST /auth/signup
  @Post('signup')
  async signUpUser(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  // POST /auth/login
  @Post('login')
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);

    // Send refresh token in HttpOnly cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7 days
    });

    return {
      message: tokens.message,
      access_token: tokens.access_token,
      user: tokens.user,
    };
  }

  // POST /auth/refresh
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(dto);

    // Rotate refresh token in HttpOnly cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Token refreshed successfully',
      access_token: tokens.access_token,
    };
  }
}
