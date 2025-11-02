import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async send_mail(to: string, html: string) {
    try {
      const response = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject: 'Welcome to Raund',
        html,
      });

      this.logger.log('✅ Email sent successfully');
      return response;
    } catch (error) {
      this.logger.error('❌ Failed to send email');
      this.logger.error(error);
      throw error;
    }
  }
}
