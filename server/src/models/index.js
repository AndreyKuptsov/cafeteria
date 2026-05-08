import sequelize from '../config/database.js';
import User from './User.js';
import MenuItem from './MenuItem.js';
import CustomCake from './CustomCake.js';
import Order from './Order.js';
import CakeOrder from './CakeOrder.js';
import Booking from './Booking.js';

// Определение связей между моделями
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(CakeOrder, { foreignKey: 'user_id', as: 'cakeOrders' });
CakeOrder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

CustomCake.hasMany(CakeOrder, { foreignKey: 'cake_id', as: 'orders' });
CakeOrder.belongsTo(CustomCake, { foreignKey: 'cake_id', as: 'cake' });

// Функция для синхронизации базы данных
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await sequelize.sync({ force, alter: !force });
    console.log(`✅ Database synchronized ${force ? '(force mode)' : '(alter mode)'}.`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export {
  sequelize,
  User,
  MenuItem,
  CustomCake,
  Order,
  CakeOrder,
  Booking
};
