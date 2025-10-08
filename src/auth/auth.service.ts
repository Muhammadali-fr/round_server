import { HttpException, Injectable } from '@nestjs/common';
import { register_dto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { login_dto } from './dto/login.dto';
import { Req_with_user } from 'src/interfaces/req_with_user.interface';
import { AwsService } from 'src/common/aws/aws.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private mailer: MailerService,
        private aws: AwsService,
        private config: ConfigService
    ) { }

    private generateTokens(userId: string, email: string) {
        const secret = this.config.get<string>('JWT_SECRET');

        const accessToken = this.jwt.sign(
            { id: userId, email, action: 'access' },
            { secret, expiresIn: '12h' }
        );

        const refreshToken = this.jwt.sign(
            { id: userId, email, action: 'refresh' },
            { secret, expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    async register_user(data: register_dto) {
        const secret = this.config.get<string>('JWT_SECRET');

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
        }, { secret, expiresIn: '5m' });

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
        const secret = this.config.get<string>('JWT_SECRET');

        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new HttpException('User not found, please register first.', 404);
        };

        const token = this.jwt.sign({
            email: user.email,
            method: "login"
        }, { secret, expiresIn: '5m' });

        const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
        this.mailer.send_mail(
            user.email,
            `<a href="${magicLink}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Login</button></a>`
        );

        return {
            message: `Magic link sent to ${user.email}, please check your email to login.`,
        };
    };

    async verify_user(token: string) {
        const secret = this.config.get<string>('JWT_SECRET');

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

            return { tokens: this.generateTokens(newUser.id, newUser.email), success: true, message: 'Creating account...' };
        };

        // Logging in user
        if (data.method === "login") {
            const user = await this.prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                throw new HttpException('User not found.', 404);
            }

            return { tokens: this.generateTokens(user.id, user.email), success: true, message: 'Logging in, please wait...' };
        }

        throw new HttpException('Invalid token method', 400);
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

        return { user: data, success: true };
    }

    async refresh_token(token: string) {
        const secret = this.config.get<string>('JWT_SECRET');

        try {
            const payload = this.jwt.verify(token, { secret });

            if (!payload || payload.action !== "refresh") {
                throw new HttpException('Invalid refresh token.', 400);
            }

            const user = await this.prisma.user.findUnique({
                where: { email: payload.email }
            })

            if (!user) {
                throw new HttpException('User not found.', 404);
            }

            const accessToken: string = this.jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    action: 'access',
                },
                { secret, expiresIn: '12h' },
            );

            return { accessToken, success: true };
        } catch (e) {
            throw new HttpException('Invalid or expired refresh token.', 401);
        };
    };
};
