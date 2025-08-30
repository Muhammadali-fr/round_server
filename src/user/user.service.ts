import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { AwsService } from 'src/common/aws/aws.service';

@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private aws: AwsService
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

    async update_profile(
        req: Req_with_user,
        file?: Express.Multer.File,
        name?: string,
        role?: 'CUSTOMER' | 'SELLER'
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: req.user.email
            }
        })

        if (!user) {
            throw new HttpException("user not found.", 404)
        }

        if (!file && !name) {
            throw new HttpException("Nothing to update", 400);
        }

        let profileUrl = user.profile;

        if (file) {
            profileUrl = await this.aws.upload_profile_image(file);
        }

        const updated = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: name ?? user.name,
                profile: profileUrl,
                role: role ?? user.role,
            }
        })

        return {
            message: 'user updated succesfully',
            user: updated
        }
    }

    async delete_user(user_id) {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            throw new HttpException("user not found.", 404)
        }

        await this.prisma.user.delete({
            where: { id: user_id }
        })

        return `User deleted successfully`;
    }

    async delete_all() {
        try {
            await this.prisma.user.deleteMany();
            return `done`;
        } catch (r) {
            throw new InternalServerErrorException(r.message)
        }
    }
}