import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys:[process.env.SECRET_KEY]
  }))
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
