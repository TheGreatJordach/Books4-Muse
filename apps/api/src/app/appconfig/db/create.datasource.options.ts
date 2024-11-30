import { DataSourceOptions } from 'typeorm';
import { EUser } from '@books4-muse/models';
import { ConfigService } from '@nestjs/config';

export const createBaseDataSourceOptions = async (configService: ConfigService): Promise<DataSourceOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATASOURCE_HOST', 'localhost'),
    port: configService.get<number>('DATASOURCE_PORT', 5433),
    username: configService.get<string>('DATASOURCE_USERNAME'),
    password: configService.get<string>('DATASOURCE_PASSWORD'),
    database: configService.get<string>('DATASOURCE_NAME'),
    entities: [EUser], // Adjust path to your entities
    synchronize: configService.get<boolean>(
      'DATASOURCE_SYNCHRONIZE',
      true
    ), // Disable in production
    logging:configService.get<boolean>('DATASOURCE_LOGGING', false),
  };
};
