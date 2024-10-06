import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use((req, _, next) => {
    next();
  });

  app.use(
    '/api/v1/auth-api',
    createProxyMiddleware({
      target: `http://localhost:${process.env.AUTH_PORT}`,
      changeOrigin: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(process.env.GATEWAY_PORT);
}
bootstrap();
