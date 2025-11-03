import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: ["http://localhost:3000", 'http://192.168.1.117:3000', 'http://localhost:5173', "https://round-server-3.onrender.com"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
