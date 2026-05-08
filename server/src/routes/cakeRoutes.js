import express from 'express';
import { CustomCake, CakeOrder } from '../models/index.js';

const router = express.Router();

// Генерация номера заказа торта
const generateCakeOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CAKE-${year}${month}${day}-${random}`;
};

// Получить все доступные торты для заказа
router.get('/', async (req, res) => {
  try {
    const cakes = await CustomCake.findAll({
      where: { available: true },
      order: [['name_ru', 'ASC']]
    });
    
    res.json(cakes);
  } catch (error) {
    console.error('Error fetching custom cakes:', error);
    res.status(500).json({ error: 'Failed to fetch custom cakes' });
  }
});

// Получить торт по ID
router.get('/:id', async (req, res) => {
  try {
    const cake = await CustomCake.findByPk(req.params.id);
    
    if (!cake) {
      return res.status(404).json({ error: 'Cake not found' });
    }
    
    res.json(cake);
  } catch (error) {
    console.error('Error fetching cake:', error);
    res.status(500).json({ error: 'Failed to fetch cake' });
  }
});

// Создать заказ торта
router.post('/orders', async (req, res) => {
  try {
    const { cake_id, delivery_date } = req.body;
    
    // Проверить, что торт существует
    const cake = await CustomCake.findByPk(cake_id);
    if (!cake) {
      return res.status(404).json({ error: 'Cake not found' });
    }
    
    // Проверить минимальный срок заказа
    const orderDate = new Date();
    const deliveryDate = new Date(delivery_date);
    const daysDiff = Math.ceil((deliveryDate - orderDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < cake.min_order_days) {
      return res.status(400).json({ 
        error: `Minimum order time is ${cake.min_order_days} days` 
      });
    }
    
    const orderData = {
      ...req.body,
      order_number: generateCakeOrderNumber()
    };
    
    const order = await CakeOrder.create(orderData);
    
    // TODO: Отправить уведомление менеджеру и су-шефу
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating cake order:', error);
    res.status(500).json({ error: 'Failed to create cake order' });
  }
});

// Получить все заказы тортов
router.get('/orders/all', async (req, res) => {
  try {
    const { status, user_id } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (user_id) where.user_id = user_id;
    
    const orders = await CakeOrder.findAll({
      where,
      include: [{
        model: CustomCake,
        as: 'cake'
      }],
      order: [['delivery_date', 'ASC']]
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching cake orders:', error);
    res.status(500).json({ error: 'Failed to fetch cake orders' });
  }
});

// Получить заказ торта по ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await CakeOrder.findByPk(req.params.id, {
      include: [{
        model: CustomCake,
        as: 'cake'
      }]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Cake order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching cake order:', error);
    res.status(500).json({ error: 'Failed to fetch cake order' });
  }
});

// Обновить статус заказа торта
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await CakeOrder.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Cake order not found' });
    }
    
    await order.update({ status });
    
    // TODO: Отправить уведомление клиенту
    
    res.json(order);
  } catch (error) {
    console.error('Error updating cake order status:', error);
    res.status(500).json({ error: 'Failed to update cake order status' });
  }
});

// Создать новый торт (для админа)
router.post('/admin', async (req, res) => {
  try {
    const cake = await CustomCake.create(req.body);
    res.status(201).json(cake);
  } catch (error) {
    console.error('Error creating cake:', error);
    res.status(500).json({ error: 'Failed to create cake' });
  }
});

export default router;
