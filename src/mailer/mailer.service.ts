import { Injectable } from '@nestjs/common';
import { Transporter } from "nodemailer"
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    };

    send_mail(to: string, text: string) {
        this.transporter.sendMail({
            from: `Raund ${process.env.EMAIL_USER}`,
            to,
            subject: 'Welcome to Raund',
            html: text
        })
    }
}