import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        })
    }

    send_mail(to: string, html: string) {
        this.transporter.sendMail({
            from: `Round eCommerce shop`,
            to,
            subject: 'welcome to Round',
            html
        })
    }
}
