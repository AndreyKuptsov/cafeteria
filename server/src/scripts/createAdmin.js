import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import { syncDatabase } from '../models/index.js';

async function createAdminUser() {
  try {
    // Синхронизация базы данных
    await syncDatabase();

    // Проверка существующего админа
    const existingAdmin = await User.findOne({
      where: { email: 'admin@cafeteria.ru' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Создание админа
    const password_hash = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Администратор',
      email: 'admin@cafeteria.ru',
      phone: '+79001234567',
      password_hash,
      role: 'admin',
      is_active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('You can now login at: http://localhost:3001/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
