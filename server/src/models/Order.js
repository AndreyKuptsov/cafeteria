import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true // может быть гостевой заказ
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order_type: {
    type: DataTypes.ENUM('delivery', 'pickup', 'dine_in'),
    allowNull: false
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  delivery_coordinates: {
    type: DataTypes.JSONB, // {lat, lng}
    allowNull: true
  },
  items: {
    type: DataTypes.JSONB, // [{item_id, name, quantity, price, options}]
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'pending',      // ожидает подтверждения
      'confirmed',    // подтвержден
      'preparing',    // готовится
      'ready',        // готов
      'delivering',   // доставляется
      'completed',    // завершен
      'cancelled'     // отменен
    ),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('card', 'cash', 'sbp'),
    allowNull: true
  },
  special_instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scheduled_time: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

export default Order;
