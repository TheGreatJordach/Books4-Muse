/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalErrorHandlerFilter } from './app/errors-handler/catch.all.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const appConfig = app.get(ConfigService);

  // Register the custom exception filter globally
  app.useGlobalFilters(new GlobalErrorHandlerFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  const appPort: number = appConfig.get<number>('APP_PORT');

  const port = appPort || 3000;

  await app.listen(port);
  Logger.log(
    `🚀 Books4Muse Platform Application is running on: http://localhost:${port}/${globalPrefix}\n
       ***************************************************************************
    🚀  Api documentation is available on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
