import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your app password
      },
    });
  }

  async send_mail(to: string, html: string, subject = 'Welcome to Raund') {
    try {
      const info = await this.transporter.sendMail({
        from: `"Raund" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Email send failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
