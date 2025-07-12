// dtos 
import { RegisterDto } from './dto/register.dto';

// prisma 
import { PrismaService } from '../prisma/prisma.service';

// token 
import { JwtService } from '@nestjs/jwt';

// mailer 
import { MailerService } from '../mailer/mailer.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
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
            name: data.name
        },
            {
                expiresIn: '10m',
            });

        // creating link 
        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verifyToken}`;
        this.mailer.sendMail(data.email, `<a href="${link}"><button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Verify Email</button> </a>`);

        return {
            message: `message sent to ${data.email}, please verify your email to complete registration.`,
        }
    }

}
