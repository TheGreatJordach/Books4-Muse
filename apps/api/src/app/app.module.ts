import { Module, ValidationPipe } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './appconfig/app.config.module';
import { AuthModule } from '@books4-muse/auth';
import { UsersModule } from '@books4-muse/users';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AppConfigModule,AuthModule,UsersModule],
  controllers: [AppController],
  providers: [AppService, AppConfigModule,
    {provide : APP_PIPE,
    useValue : new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })}],
})
export class AppModule {}
