import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CakeOrder = sequelize.define('CakeOrder', {
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
  cake_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
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
  cake_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true
  },
  decorations: {
    type: DataTypes.JSONB, // выбранные украшения
    allowNull: true
  },
  inscription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  delivery_time: {
    type: DataTypes.STRING,
    allowNull: true
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'pending',      // ожидает подтверждения
      'confirmed',    // подтвержден
      'in_progress',  // в работе
      'ready',        // готов
      'completed',    // завершен
      'cancelled'     // отменен
    ),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'deposit_paid', 'paid', 'refunded'),
    defaultValue: 'pending'
  },
  deposit_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'cake_orders',
  timestamps: true
});

export default CakeOrder;
