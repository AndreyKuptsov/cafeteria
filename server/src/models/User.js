import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('customer', 'manager', 'admin'),
    defaultValue: 'customer'
  },
  loyalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  loyalty_tier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  total_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_spent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  favorite_items: {
    type: DataTypes.JSONB, // массив ID любимых блюд
    defaultValue: []
  },
  preferences: {
    type: DataTypes.JSONB, // предпочтения, аллергии и т.д.
    defaultValue: {}
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

// Метод для проверки пароля
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

export default User;
