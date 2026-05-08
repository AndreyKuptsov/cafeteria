import express from 'express';
import { MenuItem } from '../models/index.js';
import { Op } from 'sequelize';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Получить все пункты меню с фильтрацией
router.get('/', async (req, res) => {
  try {
    const { category, available, featured, search } = req.query;
    
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (available !== undefined) {
      where.available = available === 'true';
    }
    
    if (featured !== undefined) {
      where.is_featured = featured === 'true';
    }
    
    if (search) {
      where[Op.or] = [
        { name_ru: { [Op.iLike]: `%${search}%` } },
        { name_en: { [Op.iLike]: `%${search}%` } },
        { description_ru: { [Op.iLike]: `%${search}%` } },
        { description_en: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const items = await MenuItem.findAll({
      where,
      order: [['category', 'ASC'], ['name_ru', 'ASC']]
    });
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Получить пункт меню по ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Получить меню по категориям (структурированный вывод)
router.get('/by-category/all', async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      where: { available: true },
      order: [['category', 'ASC'], ['name_ru', 'ASC']]
    });
    
    const categorized = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    
    res.json(categorized);
  } catch (error) {
    console.error('Error fetching categorized menu:', error);
    res.status(500).json({ error: 'Failed to fetch categorized menu' });
  }
});

// Создать новый пункт меню (для админа)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Обновить пункт меню (для админа)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Удалить пункт меню (для админа)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    await item.destroy();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router;
