import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  app.use(cookieParser());

  await app.listen(process.env.GATEWAY_PORT);
}
bootstrap();
