import { HttpException, Injectable } from '@nestjs/common';
import { register_dto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { login_dto } from './dto/login.dto';
import { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { AwsService } from 'src/common/aws/aws.service';

const secret = process.env.JWT_SECRET;

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private mailer: MailerService,
        private aws: AwsService
    ) { }

    async register_user(data: register_dto) {
        const existUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existUser) {
            throw new HttpException('User already exists, please login instead.', 400);
        }

        const verifyToken = this.jwt.sign({
            email: data.email,
            name: data.name,
            method: "register"
        }, { expiresIn: '5m', secret });

        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verifyToken}`;
        this.mailer.send_mail(
            data.email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button></a>`
        );

        return {
            message: `Message sent to ${data.email}, please verify your email to complete registration.`,
        }
    }

    async login_user(data: login_dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new HttpException('User not found, please register first.', 404);
        }

        const token = this.jwt.sign({
            email: user.email,
            method: "login"
        }, { expiresIn: '5m', secret });

        const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
        this.mailer.send_mail(
            user.email,
            `<a href="${magicLink}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Login</button></a>`
        );

        return {
            message: `Magic link sent to ${user.email}, please check your email to login.`,
        }
    }

    async verify_user(token: string) {
        const data = this.jwt.verify(token, { secret });
        if (!data) {
            throw new HttpException('Invalid token', 400);
        }

        // Registering user
        if (data.method === "register") {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: data.email }
            });

            if (existingUser) {
                throw new HttpException('User already exists, please login instead.', 400);
            }

            const newUser = await this.prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                },
            });

            if (!newUser) {
                throw new HttpException('User registration failed.', 500);
            }

            const accessToken = this.jwt.sign({
                email: newUser.email,
                id: newUser.id,
                action: "access"
            }, { secret });

            const resetToken = this.jwt.sign({
                email: newUser.email,
                id: newUser.id,
                action: "reset"
            }, { secret });

            return { accessToken, resetToken };
        }

        // Logging in user
        if (data.method === "login") {
            const user = await this.prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                throw new HttpException('User not found.', 404);
            }

            const accessToken = this.jwt.sign({
                email: user.email,
                id: user.id,
                action: "access"
            }, { secret });
            const resetToken = this.jwt.sign({
                email: user.email,
                id: user.id,
                action: "reset"
            }, { secret });

            return { accessToken, resetToken };
        }
    }

    async get_profile(req: Req_with_user) {
        const data = await this.prisma.user.findUnique({
            where: { email: req.user.email },
            include: {
                products: true
            }
        })

        if (!data) {
            throw new HttpException('User not found.', 404);
        }

        return data;
    }

    async reset_token(token: string) {
        const payload = this.jwt.verify(token);
        if (!payload || payload.action !== "reset") {
            throw new HttpException('Invalid reset token.', 400);
        }

        const user = await this.prisma.user.findUnique({
            where: { email: payload.email }
        })

        if (!user) {
            throw new HttpException('User not found.', 404);
        }

        const access_token: string = this.jwt.sign(
            {
                id: user.id,
                email: user.email,
                action: 'access',
            },
            { expiresIn: '48h' },
        );

        return access_token
    }
}
