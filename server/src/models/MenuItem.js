import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name_ru: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description_ru: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(
      'breakfast',      // Завтраки весь день
      'desserts',       // Изысканные & Домашние десерты
      'salads',         // Свежие салаты
      'soups_pasta',    // Супчики & Лингвини
      'main_dishes',    // Домашняя сытная кухня
      'drinks'          // Напитки
    ),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ingredients_ru: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ingredients_en: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergens_ru: {
    type: DataTypes.STRING,
    allowNull: true
  },
  allergens_en: {
    type: DataTypes.STRING,
    allowNull: true
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  preparation_time: {
    type: DataTypes.INTEGER, // в минутах
    allowNull: true
  }
}, {
  tableName: 'menu_items',
  timestamps: true
});

export default MenuItem;
