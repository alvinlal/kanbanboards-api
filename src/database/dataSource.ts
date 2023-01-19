import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: configService.get('NODE_ENV') === 'staging',
  logging: configService.get('NODE_ENV') === 'development',
  synchronize: false,
  dropSchema: configService.get('NODE_ENV') === 'staging',
};

export default new DataSource(dataSourceOptions);
