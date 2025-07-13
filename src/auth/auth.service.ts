// dtos 
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// prisma 
import { PrismaService } from '../prisma/prisma.service';

// token 
import { JwtService } from '@nestjs/jwt';

// mailer 
import { MailerService } from '../mailer/mailer.service';

// common 
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private mailer: MailerService,
    ) { }

    async registerUser(data: RegisterDto) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        // check if user already exists
        if (existUser) {
            throw new Error('User already exists, please login instead.');
        }

        // creating token 
        const verifyToken = this.jwt.sign({
            email: data.email,
            name: data.name,
            method: "register"
        },
            {
                expiresIn: '10m',
            });

        // creating link 
        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verifyToken}`;
        this.mailer.sendMail(data.email, `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button> </a>`);

        return {
            message: `message sent to ${data.email}, please verify your email to complete registration.`,
        }
    }

    // login function 
    async loginUser(data: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!user) {
            throw new HttpException('User not found, please register first.', 404);
        }

        const token = this.jwt.sign({
            email: user.email,
            metod: "login"
        }, { expiresIn: '15m' })

        const magicLink = `${process.env.FRONTEND_URL}/auth/magic?token=${token}`;
        this.mailer.sendMail(user.email, `<a href="${magicLink}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Login</button> </a>`);
        return {
            message: `Magic link sent to ${user.email}, please check your email to login.`,
        }
    }

    // verify token 
    async verifyToken(token: string) {
        const data = this.jwt.verify(token);
        if (!data) {
            throw new HttpException('Invalid token', 400);
        }

        // regestering user 
        if (data.method === "register") {
            const userData = {
                email: data.email,
                name: data.name,
            }

            const newUser = await this.prisma.user.create({ data: userData });
            if (!newUser) {
                throw new HttpException('User registration failed', 500);
            }

            const accessToken = this.jwt.sign(newUser);
            const resetToken = this.jwt.sign(newUser);

            return {
                accessToken,
                resetToken
            }
        };

        // logging user 
        if (data.method === "login") {
            const user = await this.prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                throw new HttpException('User not found', 404);
            }

            const accessToken = this.jwt.sign(user);
            const resetToken = this.jwt.sign(user);
            return {
                accessToken,
                resetToken
            }
        }
    }

}
