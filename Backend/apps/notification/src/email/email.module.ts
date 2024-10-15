import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.SMTP_HOST,
          secure: true,
          auth: {
            user: 'an.tran.clv@gmail.com',
            pass: 'syvi shdk rnkq ntpg',
          },
        },
        defaults: {
          from: 'Nhom4',
        },
        template: {
          // dir: join(__dirname, '..', 'email-templates'),
          dir: join(__dirname, 'email-templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
