import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем тип БД из переменной окружения (по умолчанию SQLite)
const DB_TYPE = process.env.DB_TYPE || 'sqlite';

let sequelize;

if (DB_TYPE === 'postgres') {
  // PostgreSQL для продакшена
  sequelize = new Sequelize(
    process.env.DB_NAME || 'cafeteria_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // SQLite для локальной разработки
  const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '../../database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
}

export default sequelize;
