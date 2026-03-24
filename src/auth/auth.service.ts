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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignUpDto) {
    const { email, password, name } = dto;

    // Check if user exists
    let existingUser: User | null = null;
    try {
      existingUser = await this.userService.findByEmail(email);
    } catch (error) {
      console.log('User Not Found');
    }
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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

  /*
   * Login Part (User Authentication)
   */
  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Find user
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

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

  }
  // 1. Generate Access Token
  // 2. Generate Refresh Token
  // 3. Hash refresh token
  // 4. Save in DB
  // 5. Send tokens to client
  
}
