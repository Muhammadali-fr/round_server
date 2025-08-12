import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token topilmadi');
        }

        // Token faqat "Bearer <token>" formatida bo'lishi kerak
        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token formati noto‘g‘ri');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
            request.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token noto‘g‘ri');
        }
    }
}
