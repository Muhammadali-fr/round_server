import { HttpException, Injectable } from '@nestjs/common';
import { register_dto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService
    ) { }

    async register_user(data: register_dto) {
        const existUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existUser) {
            throw new HttpException('User already exists, please login instead.', 400);
        }

    }

}
