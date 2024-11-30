import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppDataSourceService } from './app.datasource.service';

@Injectable()
export class AppInitializationService implements OnModuleInit, OnApplicationShutdown {
   private readonly logger = new Logger(AppInitializationService.name);

   constructor(
     private readonly configService:ConfigService,
     private readonly appDataSourceService:AppDataSourceService,
   ) {}

  async onApplicationShutdown(signal:string): Promise<void> {
     this.logger.log(`Application shutdown due to signal ${signal}`);

     try{
       await this.appDataSourceService.getAppDataSource.destroy()
       this.logger.log('Data source destroyed successfully.');
     } catch (error){
       this.logger.error('Error during data source destruction', error.stack);
     }
  }

  async onModuleInit() {
    this.logger.log('Initializing application...');

    // Load configuration
    this.loadConfiguration()

    try {
      await this.appDataSourceService.initialize()
    } catch (error) {
      this.logger.error('Data source initialization failed', error.stack);
      throw error; // Prevent app from starting if data source initialization fails
    }

    // Test database connection
    await this.testDatabaseConnection()

    this.logger.log('Data source initialized successfully.')
    this.logger.log('Application initialization complete!');
  }

  private loadConfiguration(){
     const env= this.configService.get<string>("NODE_ENV");
     this.logger.log(`Running in ${env} mode`)
  }
  private async testDatabaseConnection() {
    try {
      await this.appDataSourceService.getAppDataSource.query('SELECT 1');
      this.logger.log('Database connection successful');
    } catch (error) {
      this.logger.error('Database connection failed', error.stack);
      throw error; // Optionally throw an error to prevent the app from starting
    }
  }
}
