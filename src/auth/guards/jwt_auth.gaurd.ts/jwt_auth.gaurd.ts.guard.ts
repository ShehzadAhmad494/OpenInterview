import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  // you can add multiple fields as you want
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    // 1 Check Authorization header
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    // 2 Split header and validate
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = parts[1];

    // 3 Verify token
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      request.user = decoded; // attach decoded payload to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}
