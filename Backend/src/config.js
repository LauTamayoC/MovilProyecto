import { config } from 'dotenv';
import Process from 'process';

config();

export default {
  env: Process.env.NODE_ENV || 'development',
  port: Process.env.PORT || 3000,
  dbUser: Process.env.DB_USER,
  dbPassword: Process.env.DB_PASSWORD,
  dbHost: Process.env.DB_HOST,
  dbName: Process.env.DB_NAME,
  dbPort: Process.env.DB_PORT,
  dbTable: Process.env.TABLE_NAME,
};
