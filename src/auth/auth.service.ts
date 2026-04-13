import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /*
   * Local Signup
   */
  async signup(dto: SignUpDto) {
    const { email, password, name } = dto;

    let existingUser: User | null = null;
    try {
      existingUser = await this.userService.findByEmail(email);
    } catch (error) {
      console.log('User Not Found');
    }

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.create({
      email,
      name,
      password_hash: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role, // optional but useful
      },
    };
  }

  /*
   * Local Login
   */
  async login(dto: LoginDto) {
    const { email, password } = dto;

    let user: User;
    try {
      user = await this.userService.findByEmail(email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  /*
   * Google Login
   */
  async googleLogin(profile: any) {
    const email = profile.emails?.[0]?.value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const name = profile.displayName;
    const googleId = profile.id;

    if (!email) {
      throw new UnauthorizedException('Google email not found');
    }

    let user: User | null = null;

    try {
      user = await this.userService.findByEmail(email);
    } catch (error) {
      console.log('New Google user');
    }

    if (!user) {
      user = await this.userService.create({
        email,
        name,
        google_id: googleId,
      });
    }

    return this.generateTokens(user);
  }

  /*
   * Refresh Token Rotation
   */
  async refreshToken(dto: RefreshDto) {
    const { refresh_token } = dto;

    let payload;
    try {
      payload = this.jwtService.verify(refresh_token);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findOne(payload.sub);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = await bcrypt.compare(refresh_token, user.refresh_token);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  /*
   * Logout (Remove Refresh Token)
   */
  async logout(userId: number) {
    const user = await this.userService.findOne(userId.toString());

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.refresh_token = null;
    await this.userService.save(user);

    return {
      message: 'Logout successful',
    };
  }

  /*
   * Common Token Generator
   * (Used by Local + Google + Refresh)
   */
  private async generateTokens(user: User) {
    // ROLE ADDED HERE (IMPORTANT FOR AUTHORIZATION)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refresh_token = hashedRefreshToken;
    await this.userService.save(user);

    return {
      message: 'Authentication successful',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, //  send role to frontend
      },
    };
  }
}