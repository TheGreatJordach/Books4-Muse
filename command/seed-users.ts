import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/api/src/app/app.module';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

}

bootstrap();
