import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 8000).then(() => console.log('running on 8000'));
}
bootstrap();
