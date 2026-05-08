import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CustomCake = sequelize.define('CustomCake', {
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
  base_price: {
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
  min_order_days: {
    type: DataTypes.INTEGER,
    defaultValue: 3, // минимум 3 дня на заказ
    allowNull: false
  },
  sizes: {
    type: DataTypes.JSONB, // [{size: "1kg", price_multiplier: 1}, {size: "2kg", price_multiplier: 1.8}]
    allowNull: false
  },
  decorations: {
    type: DataTypes.JSONB, // доступные украшения
    allowNull: true
  }
}, {
  tableName: 'custom_cakes',
  timestamps: true
});

export default CustomCake;
