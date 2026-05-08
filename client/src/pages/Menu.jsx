import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name_ru: 'Все', name_en: 'All', icon: '🍽️' },
    { id: 'breakfast', name_ru: 'Завтраки', name_en: 'Breakfast', icon: '🥞' },
    { id: 'desserts', name_ru: 'Десерты', name_en: 'Desserts', icon: '🍰' },
    { id: 'salads', name_ru: 'Салаты', name_en: 'Salads', icon: '🥗' },
    { id: 'soups', name_ru: 'Супы', name_en: 'Soups', icon: '🍲' },
    { id: 'pasta', name_ru: 'Паста', name_en: 'Pasta', icon: '🍝' },
    { id: 'main', name_ru: 'Основные блюда', name_en: 'Main Dishes', icon: '🍖' },
    { id: 'drinks', name_ru: 'Напитки', name_en: 'Drinks', icon: '☕' }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description_ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: i18n.language === 'ru' ? item.name_ru : item.name_en,
      price: item.price,
      image: item.image_url,
      type: 'menu_item'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg">❌ {t('menu.error')}: {error}</p>
          <button 
            onClick={fetchMenuItems}
            className="mt-4 btn-primary"
          >
            {t('menu.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="section-title">{t('menu.title')}</h1>
        <p className="section-subtitle">
          {t('menu.subtitle')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={t('menu.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-lg"
          />
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl">
            🔍
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {i18n.language === 'ru' ? category.name_ru : category.name_en}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400 mb-4">😔</p>
          <p className="text-gray-600 text-lg">{t('menu.noItems')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={item.image_url}
                  alt={i18n.language === 'ru' ? item.name_ru : item.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
                  }}
                />
                {item.is_featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ {t('menu.featured')}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {i18n.language === 'ru' ? item.name_ru : item.name_en}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {i18n.language === 'ru' ? item.description_ru : item.description_en}
                </p>

                {/* Allergens */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">{t('menu.allergens')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutritional Info */}
                {item.nutritional_info && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <p className="text-gray-500">{t('menu.calories')}</p>
                        <p className="font-bold text-gray-900">{item.nutritional_info.calories}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t('menu.protein')}</p>
                        <p className="font-bold text-gray-900">{item.nutritional_info.protein}г</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t('menu.carbs')}</p>
                        <p className="font-bold text-gray-900">{item.nutritional_info.carbs}г</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{t('menu.fat')}</p>
                        <p className="font-bold text-gray-900">{item.nutritional_info.fat}г</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    {item.price} ₽
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <span>🛒</span>
                    {t('menu.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredItems.length > 0 && (
        <div className="text-center mt-12 text-gray-600">
          {t('menu.showing')} {filteredItems.length} {t('menu.items')}
        </div>
      )}
    </div>
  );
};

export default Menu;
