import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceService } from './app.datasource.service';
import { getDataConfig } from './db/get-database.config';
import { AppInitializationService } from './app.initialization.service';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, envFilePath:".env"}),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getDataConfig
  })],
  providers:[AppDataSourceService,AppInitializationService],
})
export class AppConfigModule {}
