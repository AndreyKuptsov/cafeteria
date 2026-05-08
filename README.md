# 🍰 Cafeteria.ru - Цифровая экосистема

Современное веб-приложение (PWA) для авторского кафетерия с полным функционалом заказов, бронирования и управления меню.

## 📋 Описание проекта

Cafeteria.ru - это полнофункциональная платформа для управления авторским кафе, включающая:

- **Интерактивное меню** с категориями (завтраки, десерты, салаты, супы, основные блюда, напитки)
- **Конструктор тортов на заказ** с выбором размера, украшений и даты доставки
- **Система онлайн-заказов** с доставкой и самовывозом
- **Бронирование столов** с проверкой доступности
- **Программа лояльности** для постоянных клиентов
- **Мультиязычность** (RU/EN)
- **PWA функционал** для установки на мобильные устройства

## 🏗️ Архитектура

### Backend (Node.js + Express + PostgreSQL)
```
server/
├── src/
│   ├── config/
│   │   └── database.js          # Конфигурация БД
│   ├── models/                  # Sequelize модели
│   │   ├── User.js              # Пользователи и лояльность
│   │   ├── MenuItem.js          # Пункты меню
│   │   ├── CustomCake.js        # Торты на заказ
│   │   ├── Order.js             # Заказы еды
│   │   ├── CakeOrder.js         # Заказы тортов
│   │   ├── Booking.js           # Бронирования
│   │   └── index.js             # Связи между моделями
│   ├── routes/                  # API маршруты
│   │   ├── menuRoutes.js        # /api/menu
│   │   ├── orderRoutes.js       # /api/orders
│   │   ├── cakeRoutes.js        # /api/cakes
│   │   └── bookingRoutes.js     # /api/bookings
│   └── index.js                 # Точка входа сервера
└── .env.example                 # Пример конфигурации
```

### Frontend (React + Vite + Tailwind CSS)
```
client/
├── src/
│   ├── components/              # Переиспользуемые компоненты
│   │   ├── Header.jsx           # Шапка с навигацией
│   │   └── Footer.jsx           # Подвал
│   ├── pages/                   # Страницы приложения
│   │   ├── Home.jsx             # Главная страница
│   │   ├── Menu.jsx             # Меню
│   │   ├── Cakes.jsx            # Торты на заказ
│   │   ├── Booking.jsx          # Бронирование
│   │   ├── Cart.jsx             # Корзина
│   │   └── Checkout.jsx         # Оформление заказа
│   ├── context/
│   │   └── CartContext.jsx      # Управление корзиной
│   ├── i18n/                    # Интернационализация
│   │   ├── config.js
│   │   └── locales/
│   │       ├── ru.json          # Русский язык
│   │       └── en.json          # Английский язык
│   ├── App.jsx                  # Главный компонент
│   ├── main.jsx                 # Точка входа
│   └── index.css                # Глобальные стили
├── index.html
├── vite.config.js               # Конфигурация Vite + PWA
└── tailwind.config.js           # Конфигурация Tailwind
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- npm или yarn

**Для локальной разработки**: SQLite (встроен, ничего устанавливать не нужно)  
**Для продакшена**: PostgreSQL 14+ (опционально)

### Установка

1. **Клонируйте репозиторий**
```bash
cd /home/andrey/Desktop/cafeteriy
```

2. **Установите зависимости**
```bash
npm run install:all
```

3. **Настройте переменные окружения**

Скопируйте файл примера:
```bash
cp server/.env.example server/.env
```

**Для локальной разработки (SQLite)** - готово! Файл `.env` уже настроен:
```env
DB_TYPE=sqlite
SQLITE_PATH=./database.sqlite
```

**Для продакшена (PostgreSQL)** - отредактируйте `server/.env`:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cafeteria_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

И создайте базу данных:
```sql
CREATE DATABASE cafeteria_db;
```

4. **Запустите приложение**

Для разработки (запускает и клиент, и сервер):
```bash
npm run dev
```

Или запустите отдельно:
```bash
# Терминал 1 - Backend
cd server
npm run dev

# Терминал 2 - Frontend
cd client
npm run dev
```

5. **Откройте в браузере**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Меню
- `GET /api/menu` - Получить все пункты меню
- `GET /api/menu/:id` - Получить пункт по ID
- `GET /api/menu/by-category/all` - Получить меню по категориям
- `POST /api/menu` - Создать пункт меню (админ)
- `PUT /api/menu/:id` - Обновить пункт меню (админ)
- `DELETE /api/menu/:id` - Удалить пункт меню (админ)

### Заказы
- `POST /api/orders` - Создать заказ
- `GET /api/orders` - Получить все заказы
- `GET /api/orders/:id` - Получить заказ по ID
- `GET /api/orders/number/:orderNumber` - Получить заказ по номеру
- `PATCH /api/orders/:id/status` - Обновить статус заказа
- `PATCH /api/orders/:id/payment` - Обновить статус оплаты
- `PATCH /api/orders/:id/cancel` - Отменить заказ

### Торты на заказ
- `GET /api/cakes` - Получить доступные торты
- `GET /api/cakes/:id` - Получить торт по ID
- `POST /api/cakes/orders` - Создать заказ торта
- `GET /api/cakes/orders/all` - Получить все заказы тортов
- `GET /api/cakes/orders/:id` - Получить заказ торта по ID
- `PATCH /api/cakes/orders/:id/status` - Обновить статус заказа торта

### Бронирование
- `POST /api/bookings` - Создать бронирование
- `GET /api/bookings` - Получить все бронирования
- `GET /api/bookings/:id` - Получить бронирование по ID
- `GET /api/bookings/number/:bookingNumber` - Получить по номеру
- `GET /api/bookings/availability/:date` - Проверить доступность
- `PATCH /api/bookings/:id/confirm` - Подтвердить бронирование
- `PATCH /api/bookings/:id/status` - Обновить статус
- `PATCH /api/bookings/:id/cancel` - Отменить бронирование

### Служебные
- `GET /api/health` - Проверка работы сервера
- `GET /api/business-hours` - Получить часы работы

## 🎨 Дизайн и UI/UX

### Цветовая палитра
- **Primary**: Теплые коричневые тона (#8B4513, #B8860B)
- **Accent**: Лавандовый (#E6E6FA), Клубничный (#FF6B9D), Кремовый (#FFFACD)
- **Background**: Светло-бежевый (#FFF8DC)

### Шрифты
- **Display**: Playfair Display (заголовки)
- **Body**: Inter (основной текст)

### Адаптивность
- Mobile First подход
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🌐 Мультиязычность

Приложение поддерживает русский и английский языки. Переключение через кнопку в шапке сайта.

Файлы переводов:
- `client/src/i18n/locales/ru.json`
- `client/src/i18n/locales/en.json`

## 📱 PWA функционал

Приложение настроено как Progressive Web App:
- Установка на домашний экран
- Офлайн работа (Service Worker)
- Кэширование изображений и API запросов
- Push-уведомления (готово к интеграции)

## 🔐 Безопасность

- JWT аутентификация (готово к интеграции)
- Хеширование паролей (bcrypt)
- CORS настроен
- Валидация данных (express-validator)
- SQL injection защита (Sequelize ORM)

## 📊 База данных

### Основные таблицы

**users** - Пользователи и программа лояльности
- id, name, email, phone, password_hash
- loyalty_points, loyalty_tier, total_orders, total_spent
- favorite_items, preferences

**menu_items** - Пункты меню
- id, name_ru, name_en, description_ru, description_en
- category, price, image_url, available
- ingredients, allergens, calories, preparation_time

**custom_cakes** - Торты на заказ
- id, name_ru, name_en, description_ru, description_en
- base_price, image_url, min_order_days
- sizes (JSONB), decorations (JSONB)

**orders** - Заказы еды
- id, order_number, user_id, customer_name, customer_phone
- order_type, delivery_address, items (JSONB)
- subtotal, delivery_fee, total
- status, payment_status, payment_method

**cake_orders** - Заказы тортов
- id, order_number, cake_id, customer_name
- size, weight, decorations (JSONB), inscription
- delivery_date, delivery_time, price
- status, payment_status

**bookings** - Бронирования столов
- id, booking_number, customer_name, customer_phone
- booking_date, booking_time, guests_count
- table_preference, special_requests
- status, confirmed_by

## 🚧 Дальнейшее развитие

### Приоритет 1 (MVP)
- [ ] Полная реализация компонентов меню с фильтрацией
- [ ] Интеграция платежной системы (Stripe/Yookassa)
- [ ] Email/SMS уведомления для заказов и бронирований
- [ ] Админ-панель для управления меню и заказами

### Приоритет 2
- [ ] Интеграция с API такси для доставки
- [ ] Система отзывов и рейтингов
- [ ] Фото-галерея блюд
- [ ] Интеграция с социальными сетями

### Приоритет 3
- [ ] Мобильное приложение (React Native)
- [ ] Аналитика и отчеты
- [ ] CRM для менеджеров
- [ ] Интеграция с кассовым ПО (Poster/iiko)

## 👥 Команда

- **Менеджер**: Анна (бронирование столов)
- **Су-шеф**: Сергей (заказы тортов, дополнительные услуги)

## 📞 Контакты

- **Адрес**: ул. Ванеева, Нижний Новгород
- **Телефон**: +7 (831) 123-45-67
- **Email**: info@cafeteria.ru
- **Часы работы**:
  - Будни: 10:00 - 20:00
  - Выходные: 12:00 - 17:00

## 📄 Лицензия

MIT License - свободное использование для коммерческих целей

---

**Создано с ❤️ для Cafeteria.ru**
