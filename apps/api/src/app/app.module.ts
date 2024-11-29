import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppconfigModule } from './appconfig/appconfig.module';

@Module({
  imports: [AppconfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
