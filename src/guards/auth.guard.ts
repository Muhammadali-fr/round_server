import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  // FIX: canActivate is now an async function to properly await the JWT verification
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // FIX: Added the 'secret' option to the verify method
      const userData = await this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (userData.action !== 'access') {
        throw new UnauthorizedException('Invalid token action');
      }

      // If validation is successful, attach the user data to the request object
      request.user = userData;
      return true;
    } catch (error) {
      // FIX: The catch block now properly handles all JWT verification errors
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
