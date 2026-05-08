import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user || (!isAdmin() && user.role !== 'manager')) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'menu') {
        const res = await axios.get('http://localhost:5000/api/menu');
        setMenuItems(res.data);
      } else if (activeTab === 'orders') {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
      } else if (activeTab === 'bookings') {
        const res = await axios.get('http://localhost:5000/api/bookings');
        setBookings(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDeleteMenuItem = async (id) => {
    if (!confirm('Удалить этот пункт меню?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      loadData();
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name_ru: formData.get('name_ru'),
      name_en: formData.get('name_en'),
      description_ru: formData.get('description_ru'),
      description_en: formData.get('description_en'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      image_url: formData.get('image_url'),
      available: formData.get('available') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      allergens: formData.get('allergens')?.split(',').map(a => a.trim()).filter(Boolean) || [],
      nutritional_info: {}
    };

    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/menu/${editingItem.id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/menu', data);
      }
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      alert('Ошибка при сохранении');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-800">
              🍰 Cafeteria.ru Admin
            </h1>
            <p className="text-sm text-primary-600">Добро пожаловать, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="btn-secondary text-sm">
              На сайт
            </button>
            <button onClick={handleLogout} className="btn-primary text-sm">
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            {['menu', 'orders', 'bookings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600'
                }`}
              >
                {tab === 'menu' && '📋 Меню'}
                {tab === 'orders' && '🛒 Заказы'}
                {tab === 'bookings' && '📅 Бронирования'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : (
          <>
            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Управление меню</h2>
                  <button
                    onClick={() => { setShowForm(true); setEditingItem(null); }}
                    className="btn-primary"
                  >
                    + Добавить блюдо
                  </button>
                </div>

                {showForm && (
                  <div className="card p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">
                      {editingItem ? 'Редактировать' : 'Новое блюдо'}
                    </h3>
                    <form onSubmit={handleSaveMenuItem} className="grid grid-cols-2 gap-4">
                      <input name="name_ru" defaultValue={editingItem?.name_ru} placeholder="Название (RU)" className="input-field" required />
                      <input name="name_en" defaultValue={editingItem?.name_en} placeholder="Name (EN)" className="input-field" required />
                      <textarea name="description_ru" defaultValue={editingItem?.description_ru} placeholder="Описание (RU)" className="input-field" rows="2" />
                      <textarea name="description_en" defaultValue={editingItem?.description_en} placeholder="Description (EN)" className="input-field" rows="2" />
                      <select name="category" defaultValue={editingItem?.category} className="input-field" required>
                        <option value="breakfast">Завтраки</option>
                        <option value="desserts">Десерты</option>
                        <option value="salads">Салаты</option>
                        <option value="soups">Супы</option>
                        <option value="pasta">Паста</option>
                        <option value="main">Основные блюда</option>
                        <option value="drinks">Напитки</option>
                      </select>
                      <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} placeholder="Цена" className="input-field" required />
                      <input name="image_url" defaultValue={editingItem?.image_url} placeholder="URL изображения" className="input-field col-span-2" />
                      <input name="allergens" defaultValue={editingItem?.allergens?.join(', ')} placeholder="Аллергены (через запятую)" className="input-field col-span-2" />
                      <label className="flex items-center gap-2">
                        <input name="available" type="checkbox" defaultChecked={editingItem?.available ?? true} />
                        Доступно
                      </label>
                      <label className="flex items-center gap-2">
                        <input name="is_featured" type="checkbox" defaultChecked={editingItem?.is_featured} />
                        Рекомендуемое
                      </label>
                      <div className="col-span-2 flex gap-2">
                        <button type="submit" className="btn-primary">Сохранить</button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="btn-secondary">Отмена</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid gap-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="card p-4 flex justify-between items-center">
                      <div className="flex gap-4 items-center flex-1">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name_ru} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold">{item.name_ru} / {item.name_en}</h3>
                          <p className="text-sm text-gray-600">{item.category} • {item.price}₽</p>
                          <p className="text-xs text-gray-500">{item.description_ru}</p>
                        </div>
                        <div className="flex gap-2">
                          {item.available && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Доступно</span>}
                          {item.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">★</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="text-blue-600 hover:text-blue-700 px-3 py-1">✏️</button>
                        <button onClick={() => handleDeleteMenuItem(item.id)} className="text-red-600 hover:text-red-700 px-3 py-1">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Заказы ({orders.length})</h2>
                <div className="grid gap-4">
                  {orders.map(order => (
                    <div key={order.id} className="card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">Заказ #{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{order.customer_name} • {order.customer_phone}</p>
                          <p className="text-sm mt-2">Сумма: {order.total_amount}₽</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Бронирования ({bookings.length})</h2>
                <div className="grid gap-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{booking.customer_name}</h3>
                          <p className="text-sm text-gray-600">{booking.customer_phone}</p>
                          <p className="text-sm mt-2">
                            {new Date(booking.booking_date).toLocaleDateString('ru-RU')} в {booking.booking_time}
                          </p>
                          <p className="text-sm">Гостей: {booking.guests_count}</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
