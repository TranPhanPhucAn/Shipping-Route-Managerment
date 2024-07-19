import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(process.env.AUTH_PORT);
}
bootstrap();
