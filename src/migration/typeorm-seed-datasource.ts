import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export const datasource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || './data/database.sqlite',
  synchronize: false,
  logging: true,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/migration/seed-migration/*.ts'],
});
