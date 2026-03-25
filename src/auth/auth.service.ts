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
   * User Signup (Local Authentication)
   */


  async signup(dto: SignUpDto) {
    const { email, password, name } = dto;

    // Check if user already exists
    let existingUser: User | null = null;
    try {
      existingUser = await this.userService.findByEmail(email);
    } catch (error) {
      console.log('User Not Found');
    }

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
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
      },
    };
  }

  /**
   * Login Flow (Access + Refresh Tokens)
   * Steps:
   * 1. Validate user credentials
   * 2. Generate Access Token
   * 3. Generate Refresh Token
   * 4. Hash Refresh Token
   * 5. Store in DB
   * 6. Return tokens
   */
  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Find user by email
    let user: User;
    try {
      user = await this.userService.findByEmail(email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = { sub: user.id, email: user.email };

    // Generate Access Token (short lived)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1m',
    });

    // Generate Refresh Token (long lived)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Hash Refresh Token before storing
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Save hashed refresh token in DB
    user.refresh_token = hashedRefreshToken;
    await this.userService.save(user);

    return {
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken, // temporary (later cookie)
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Refresh Token Rotation Logic
   *
   * Flow:
   * 1. Receive refresh token
   * 2. Verify JWT
   * 3. Extract payload
   * 4. Find user
   * 5. Compare hashed token
   * 6. Generate new access token
   * 7. Generate new refresh token
   * 8. Hash new refresh token
   * 9. Save in DB
   * 10. Return new tokens
   */
  async refreshToken(dto: RefreshDto) {
    const { refresh_token } = dto;

    // Verify refresh token
    let payload;
    try {
      payload = this.jwtService.verify(refresh_token);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Find user from payload
    const user = await this.userService.findOne(payload.sub);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Access denied');
    }

    // Compare incoming token with DB hashed token
    const isMatch = await bcrypt.compare(refresh_token, user.refresh_token);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Create new payload
    const newPayload = {
      sub: user.id,
      email: user.email,
    };

    // Generate new access token
    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });

    // Generate new refresh token (rotation)
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    // Hash new refresh token
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    // Save new refresh token in DB
    user.refresh_token = hashedRefreshToken;
    await this.userService.save(user);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
