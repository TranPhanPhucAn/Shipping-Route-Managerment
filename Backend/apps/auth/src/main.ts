import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'email-templates'));
  app.setViewEngine('ejs');
  await app.listen(process.env.AUTH_PORT);
}
bootstrap();
