/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import type { Response, Request } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt_auth.gaurd.ts/jwt_auth.gaurd.ts.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
   * Google Login Route
   * Redirects user to Google
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // passport handles redirect
  }

  /*
   * Google Callback Route
   * After successful login
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.googleLogin(req.user);

    // send refresh token as cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Google login successful',
      access_token: tokens.access_token,
      user: tokens.user,
    };
  }

  /*
   * Local Signup
   */
  @Post('signup')
  async signUpUser(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  /*
   * Local Login
   */
  @Post('login')
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: tokens.message,
      access_token: tokens.access_token,
      user: tokens.user,
    };
  }

  /*
   * Refresh Token Rotation
   */
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(dto);

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

  /* 
  * Protected Endpoint Checking Route
  */
 @Get('me')
@UseGuards(JwtAuthGuard)
// eslint-disable-next-line @typescript-eslint/require-await
async getProfile(@Req() req: Request) {
  return {
    message: 'User profile fetched successfully',
    user: req.user,
  };
}

  /*
   * Logout
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    // user id token se nikalo (later guard laga sakte hain)
    const userId = req.user?.sub;

    await this.authService.logout(userId);

    // clear cookie
    res.clearCookie('refresh_token');

    return {
      message: 'Logout successful',
    };
  }
}