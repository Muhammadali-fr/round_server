import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { LoginDto } from './dto/login.dto';

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
        }, { expiresIn: "3m" })

        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verify_token}`
        this.mailer.send_mail(
            data.email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button></a>`
        )

        return `message sent to ${data.email}, token expires in 3 minutes`
    }

    async login(data: LoginDto) {
        const user = await this.database.user.findUnique({ where: { email: data.email } });

        if (!user) throw new NotFoundException('user not found, register first')

        const verify_token = await this.jwt.sign({
            email: user.email,
            name: user.name,
            action: 'login'
        }, { expiresIn: '3m' })

        const link = `${process.env.FRONTEND_URL}/auth/verify?token=${verify_token}`

        this.mailer.send_mail(
            user.email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button></a>`
        )

        return `message sent to ${user.email}, token expires in 3 minutes`
    }

    async verify_user(token: string) {

        const data = this.jwt.verify(token)
        if (!data) throw new HttpException('invalid token', 400)

        // register user function here 
        if (data.action = 'register') {

            const exist_user = await this.database.user.findUnique({ where: { email: data.email } })

            if (exist_user) throw new HttpException('user already exists, login instead', 400)

            const new_user = await this.database.user.create({
                data: {
                    email: data.email,
                    name: data.name
                }
            })

            if (!new_user) throw new HttpException('user registration failed', 400)

            const access_token = this.jwt.sign({
                email: new_user.email,
                name: new_user.name,
                action: 'access'
            })

            const reset_token = this.jwt.sign({
                email: new_user.email,
                name: new_user.name,
                action: 'reset'
            })

            return { access_token, reset_token }
        }

        // login user function 
        if (data.action = 'login') {

            const user = await this.database.user.findUnique({ where: { email: data.email } });

            if (!user) throw new NotFoundException('user not found, register first')

            const access_token = this.jwt.sign({
                email: user.email,
                name: user.name,
                action: 'access'
            })

            const reset_token = this.jwt.sign({
                email: user.email,
                name: user.name,
                action: 'reset'
            })

            return {access_token, reset_token}
        }
    }

}
