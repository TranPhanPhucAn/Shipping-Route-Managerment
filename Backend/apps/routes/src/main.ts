import { NestFactory } from '@nestjs/core';
import { RoutesModule } from './routes.module';

async function bootstrap() {
  const app = await NestFactory.create(RoutesModule);
  await app.listen(process.env.ROUTES_PORT);
}
bootstrap();
