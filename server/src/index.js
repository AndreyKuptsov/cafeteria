import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { syncDatabase } from './models/index.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cakeRoutes from './routes/cakeRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cakes', cakeRoutes);
app.use('/api/bookings', bookingRoutes);

// Проверка работы сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Cafeteria.ru API is running',
    timestamp: new Date().toISOString()
  });
});

// Информация о рабочих часах
app.get('/api/business-hours', (req, res) => {
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  res.json({
    weekdays: {
      open: process.env.WEEKDAY_OPEN || '10:00',
      close: process.env.WEEKDAY_CLOSE || '20:00'
    },
    weekends: {
      open: process.env.WEEKEND_OPEN || '12:00',
      close: process.env.WEEKEND_CLOSE || '17:00'
    },
    today: {
      isWeekend,
      open: isWeekend ? (process.env.WEEKEND_OPEN || '12:00') : (process.env.WEEKDAY_OPEN || '10:00'),
      close: isWeekend ? (process.env.WEEKEND_CLOSE || '17:00') : (process.env.WEEKDAY_CLOSE || '20:00')
    }
  });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Запуск сервера
const startServer = async () => {
  try {
    // Синхронизация базы данных
    await syncDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🍰  Cafeteria.ru API Server                        ║
║                                                       ║
║   Server running on: http://0.0.0.0:${PORT}           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
║                                                       ║
║   API Endpoints:                                      ║
║   - GET  /api/health                                  ║
║   - GET  /api/business-hours                          ║
║   - GET  /api/menu                                    ║
║   - POST /api/orders                                  ║
║   - GET  /api/cakes                                   ║
║   - POST /api/bookings                                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
