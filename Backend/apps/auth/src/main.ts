import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '_proto/user.proto'),
      // protoPath: 'dist/_proto/user.proto',

      url: 'localhost:50052', // URL and port for gRPC server
    },
  });
  await app.startAllMicroservices();
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'email-templates'));
  app.setViewEngine('ejs');
  await app.listen(process.env.AUTH_PORT);
}
bootstrap();
