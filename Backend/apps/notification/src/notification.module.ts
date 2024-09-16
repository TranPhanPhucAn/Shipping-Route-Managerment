import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
