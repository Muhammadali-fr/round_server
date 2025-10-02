import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        // 1) Try cookie first
        let token = request.cookies?.['accessToken'];

        // 2) If no cookie, check Authorization header
        if (!token) {
            const authHeader = request.headers['authorization'];
            if (authHeader) {
                const [type, tokenPart] = authHeader.split(' ');
                if (type === 'Bearer' && tokenPart) {
                    token = tokenPart;
                }
            }
        }

        // 3) If still no token
        if (!token) {
            throw new UnauthorizedException('Token topilmadiiii');
        }

        // 4) Verify JWT
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
            (request as any).user = decoded; // attach user payload
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token noto‘g‘ri');
        }
    }
}
