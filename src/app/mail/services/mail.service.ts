import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, msg: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `VU`,
        to,
        subject,
        text: msg,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
