import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        // ✅ Expect only Authorization header
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token topilmadi (Authorization header yo‘q)');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token formati noto‘g‘ri (Bearer token kerak)');
        }

        // ✅ Verify JWT
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
            (request as any).user = decoded; // attach user info to request
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token noto‘g‘ri yoki muddati o‘tgan');
        }
    }
}
