import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user_activation')
  handleUserActivate(data: any) {
    this.notificationService.handleUserActivate(data);
  }

  @EventPattern('forgot_password')
  handleForgotPassword(data: any) {
    console.log(data);
    this.notificationService.handleForgotPassword(data);
  }
}
