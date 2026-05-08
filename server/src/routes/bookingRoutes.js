import express from 'express';
import { Booking } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Генерация номера бронирования
const generateBookingNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${year}${month}${day}-${random}`;
};

// Проверить доступность времени
const checkAvailability = async (date, time, guestsCount) => {
  // Простая проверка: максимум 5 бронирований на один временной слот
  const existingBookings = await Booking.count({
    where: {
      booking_date: date,
      booking_time: time,
      status: {
        [Op.in]: ['pending', 'confirmed', 'seated']
      }
    }
  });
  
  return existingBookings < 5;
};

// Создать бронирование
router.post('/', async (req, res) => {
  try {
    const { booking_date, booking_time, guests_count } = req.body;
    
    // Проверить доступность
    const isAvailable = await checkAvailability(booking_date, booking_time, guests_count);
    
    if (!isAvailable) {
      return res.status(400).json({ 
        error: 'This time slot is not available. Please choose another time.' 
      });
    }
    
    const bookingData = {
      ...req.body,
      booking_number: generateBookingNumber()
    };
    
    const booking = await Booking.create(bookingData);
    
    // TODO: Отправить уведомление менеджеру Анне
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Получить все бронирования
router.get('/', async (req, res) => {
  try {
    const { status, date, user_id } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (user_id) where.user_id = user_id;
    if (date) where.booking_date = date;
    
    const bookings = await Booking.findAll({
      where,
      order: [['booking_date', 'ASC'], ['booking_time', 'ASC']]
    });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Получить бронирование по ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Получить бронирование по номеру
router.get('/number/:bookingNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_number: req.params.bookingNumber }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Получить доступные слоты для даты
router.get('/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const dayOfWeek = new Date(date).getDay();
    
    // Определить рабочие часы
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const openTime = isWeekend ? '12:00' : '10:00';
    const closeTime = isWeekend ? '17:00' : '20:00';
    
    // Генерация временных слотов (каждые 30 минут)
    const slots = [];
    let currentHour = parseInt(openTime.split(':')[0]);
    const closeHour = parseInt(closeTime.split(':')[0]);
    
    while (currentHour < closeHour) {
      for (let minute of ['00', '30']) {
        const time = `${String(currentHour).padStart(2, '0')}:${minute}`;
        const available = await checkAvailability(date, time, 1);
        slots.push({ time, available });
      }
      currentHour++;
    }
    
    res.json({ date, slots, openTime, closeTime });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Подтвердить бронирование (для менеджера)
router.patch('/:id/confirm', async (req, res) => {
  try {
    const { confirmed_by, confirmation_notes } = req.body;
    
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    await booking.update({ 
      status: 'confirmed',
      confirmed_by,
      confirmation_notes
    });
    
    // TODO: Отправить уведомление клиенту
    
    res.json(booking);
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

// Обновить статус бронирования
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    await booking.update({ status });
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Отменить бронирование
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }
    
    await booking.update({ status: 'cancelled' });
    
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
