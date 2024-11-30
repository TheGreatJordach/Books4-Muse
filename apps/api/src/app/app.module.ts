import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './appconfig/appConfigModule';
import { AuthModule } from '@books4-muse/auth';
import { UsersModule } from '@books4-muse/users';

@Module({
  imports: [AppConfigModule,AuthModule,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
