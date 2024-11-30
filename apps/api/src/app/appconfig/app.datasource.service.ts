import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createBaseDataSourceOptions } from './db/create.datasource.options';

@Injectable()
export class AppDataSourceService {
  private readonly logger = new Logger(AppDataSourceService.name);
  public getAppDataSource: DataSource;

  constructor(private readonly configService: ConfigService) {}

  async initialize(): Promise<void> {
    if (this.getAppDataSource) {
      this.logger.warn('Data source has already been initialized.');
      return;
    }

    const dataSourceOptions = await createBaseDataSourceOptions(this.configService);

    this.logger.log('Initializing database...')
    this.getAppDataSource = new DataSource(dataSourceOptions)

    try {
      await this.getAppDataSource.initialize();
      this.logger.log('Data source initialized successfully.')
    } catch (error) {
      this.logger.error('Failed to initialize data source.', error.stack);
      throw error; // Rethrow error to ensure the app handles initialization failures appropriately
    }
  }
}
