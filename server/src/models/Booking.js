import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_number: {
    type: DataTypes.STRING,
    unique: true,
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
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  booking_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  guests_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  table_preference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'pending',      // ожидает подтверждения
      'confirmed',    // подтвержден
      'seated',       // гости за столом
      'completed',    // завершен
      'cancelled',    // отменен
      'no_show'       // не пришли
    ),
    defaultValue: 'pending'
  },
  confirmed_by: {
    type: DataTypes.STRING, // имя менеджера (Анна)
    allowNull: true
  },
  confirmation_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

export default Booking;
