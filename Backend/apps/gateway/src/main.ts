import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
// import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  //   // all headers that client are allowed to use
  //   allowedHeaders: [
  //     'Accept',
  //     'Authorization',
  //     'Content-Type',
  //     'X-Requested-With',
  //     'apollo-require-preflight',
  //   ],
  //   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  // });
  // app.use(
  //   '/graphql',
  //   graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),
  // );

  app.use((req, _, next) => {
    // console.log(`Got invoked: '${req.originalUrl}'`);
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
