import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log(process.env.BACKEND_PORT);
  await app.listen(process.env.BACKEND_PORT || 5500);
}
bootstrap();
