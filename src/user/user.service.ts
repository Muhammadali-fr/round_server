import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService
    ) { }

    async find_one(id: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                include: { products: true }
            })

            if (!user)
                throw new HttpException('user not found', 404)

            return user;

        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async find_all() {
        try {
            return await this.prisma.user.findMany()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

}