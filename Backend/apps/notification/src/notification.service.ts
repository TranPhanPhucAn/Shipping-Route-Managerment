import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationService {
  constructor(private readonly emailService: EmailService) {}
  handleUserActivate(value: any) {
    this.emailService.sendMail({
      email: value.email,
      subject: value.subject,
      name: value.name,
      activationCode: value.activationCode,
      template: './activation-mail',
    });
  }
  handleForgotPassword(value: any) {
    this.emailService.sendMail({
      email: value.email,
      subject: value.subject,
      name: value.name,
      activationCode: value.activationCode,
      template: './forgot-password-mail',
    });
  }
}
