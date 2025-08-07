import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
    constructor(
        private database: DatabaseService,
        private jwt: JwtService,
        private mailer: MailerService
    ) { }

    async register(data: RegisterDto) {
        const exist_user = await this.database.user.findUnique({
            where: { email: data.email }
        })

        if (exist_user) throw new HttpException('user already exists', 400)

        const verify_token = await this.jwt.sign({
            email: data.email,
            name: data.name,
            action: "register"
        }, { expiresIn: "10m" })

        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verify_token}`
        await this.mailer.send_mail(
            data.email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button></a>`
        )

        return `message sent to ${data.email}`
    }
}
