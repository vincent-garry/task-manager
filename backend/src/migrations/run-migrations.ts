// src/migrations/run-migrations.ts
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { up } from './add-project-id-to-tasks.migration';

dotenv.config();

async function runMigrations() {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await up(sequelize.getQueryInterface());
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

runMigrations();