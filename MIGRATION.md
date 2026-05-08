# 🔄 Миграция с SQLite на PostgreSQL

Когда придет время переехать с локальной SQLite базы на PostgreSQL для продакшена, следуйте этой инструкции.

## Зачем мигрировать?

**SQLite** отлично подходит для:
- ✅ Локальной разработки
- ✅ Быстрого старта без настройки БД
- ✅ Прототипирования

**PostgreSQL** необходим для:
- ✅ Продакшена с высокой нагрузкой
- ✅ Одновременной работы нескольких пользователей
- ✅ Расширенных возможностей (полнотекстовый поиск, JSON операции)
- ✅ Масштабирования

## Шаги миграции

### 1. Установите PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Скачайте установщик с [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Создайте базу данных

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Создайте базу данных и пользователя
CREATE DATABASE cafeteria_db;
CREATE USER cafeteria_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE cafeteria_db TO cafeteria_user;

# Выйдите
\q
```

### 3. Обновите .env файл

Отредактируйте `server/.env`:

```env
# Измените тип БД
DB_TYPE=postgres

# Настройте PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cafeteria_db
DB_USER=cafeteria_user
DB_PASSWORD=secure_password_here

# Закомментируйте SQLite
# SQLITE_PATH=./database.sqlite
```

### 4. Перезапустите сервер

```bash
cd server
npm run dev
```

Sequelize автоматически создаст все таблицы в PostgreSQL при первом запуске!

### 5. Экспорт данных из SQLite (опционально)

Если у вас уже есть данные в SQLite, которые нужно перенести:

**Вариант 1: Использовать скрипт миграции**

Создайте файл `server/scripts/migrate-data.js`:

```javascript
import sequelize from '../src/config/database.js';
import { Sequelize } from 'sequelize';

// Подключение к старой SQLite базе
const sqliteDb = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Функция миграции
async function migrateData() {
  try {
    // Получите данные из SQLite
    const [menuItems] = await sqliteDb.query('SELECT * FROM menu_items');
    const [orders] = await sqliteDb.query('SELECT * FROM orders');
    // ... и так далее для всех таблиц

    // Вставьте в PostgreSQL
    await sequelize.models.MenuItem.bulkCreate(menuItems);
    await sequelize.models.Order.bulkCreate(orders);
    // ... и так далее

    console.log('✅ Миграция завершена успешно!');
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    await sqliteDb.close();
    await sequelize.close();
  }
}

migrateData();
```

Запустите:
```bash
node server/scripts/migrate-data.js
```

**Вариант 2: Экспорт через SQL дамп**

```bash
# Экспорт из SQLite
sqlite3 database.sqlite .dump > dump.sql

# Импорт в PostgreSQL (потребуется адаптация SQL)
psql -U cafeteria_user -d cafeteria_db -f dump.sql
```

### 6. Проверка

Убедитесь, что все работает:

```bash
# Проверьте подключение
curl http://localhost:5000/api/health

# Проверьте данные
curl http://localhost:5000/api/menu
```

## Откат на SQLite

Если что-то пошло не так, легко вернуться:

```env
# В server/.env
DB_TYPE=sqlite
SQLITE_PATH=./database.sqlite
```

Перезапустите сервер - готово!

## Производительность

### SQLite
- Запросы: ~1000 req/sec
- Подходит для: 1-10 одновременных пользователей

### PostgreSQL
- Запросы: ~10000+ req/sec
- Подходит для: 100+ одновременных пользователей
- Поддержка репликации и кластеризации

## Рекомендации для продакшена

1. **Используйте пул соединений** (уже настроен в `database.js`)
2. **Настройте бэкапы**:
   ```bash
   pg_dump cafeteria_db > backup.sql
   ```
3. **Мониторинг**: Используйте pgAdmin или DBeaver
4. **Индексы**: Добавьте индексы на часто запрашиваемые поля
5. **SSL**: Включите SSL для удаленных подключений

## Поддержка

Если возникли проблемы:
- Проверьте логи PostgreSQL: `/var/log/postgresql/`
- Убедитесь, что PostgreSQL запущен: `sudo systemctl status postgresql`
- Проверьте права доступа: `GRANT ALL PRIVILEGES ON DATABASE cafeteria_db TO cafeteria_user;`

---

**Важно**: Всегда делайте бэкап данных перед миграцией!
