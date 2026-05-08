import express from 'express';
import { Order } from '../models/index.js';

const router = express.Router();

// Генерация номера заказа
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

// Создать новый заказ
router.post('/', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      order_number: generateOrderNumber()
    };
    
    const order = await Order.create(orderData);
    
    // TODO: Отправить уведомление менеджеру (email/SMS)
    // TODO: Интеграция с такси API для доставки
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Получить все заказы (с фильтрацией)
router.get('/', async (req, res) => {
  try {
    const { status, user_id, order_type } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (user_id) where.user_id = user_id;
    if (order_type) where.order_type = order_type;
    
    const orders = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Получить заказ по ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Получить заказ по номеру
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { order_number: req.params.orderNumber }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Обновить статус заказа
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.update({ status });
    
    // TODO: Отправить уведомление клиенту об изменении статуса
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Обновить статус оплаты
router.patch('/:id/payment', async (req, res) => {
  try {
    const { payment_status, payment_method } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await order.update({ payment_status, payment_method });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Отменить заказ
router.patch('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }
    
    await order.update({ status: 'cancelled' });
    
    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
