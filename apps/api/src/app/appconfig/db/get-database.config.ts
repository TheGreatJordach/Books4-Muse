import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { createBaseDataSourceOptions } from './create.datasource.options';
import { ConfigService } from '@nestjs/config';
 // Adjust path as needed

export const getDataConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  const baseOptions = await createBaseDataSourceOptions(configService);

  return {
    ...baseOptions,
    // Additional customizations if needed, for example:
    // extra: { ssl: true },
  };
};
