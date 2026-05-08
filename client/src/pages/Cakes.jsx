import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Cakes = () => {
  const { t, i18n } = useTranslation();
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCake, setSelectedCake] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Form state
  const [orderForm, setOrderForm] = useState({
    size: '',
    weight: '',
    decorations: [],
    inscription: '',
    specialRequests: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryAddress: '',
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  });

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cakes');
      if (!response.ok) throw new Error('Failed to fetch cakes');
      const data = await response.json();
      setCakes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cakes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (cake) => {
    setSelectedCake(cake);
    setShowOrderForm(true);
    setOrderForm({
      ...orderForm,
      size: cake.sizes[0] || '',
      weight: cake.sizes[0] || ''
    });
  };

  const handleDecorationToggle = (decoration) => {
    setOrderForm(prev => ({
      ...prev,
      decorations: prev.decorations.includes(decoration)
        ? prev.decorations.filter(d => d !== decoration)
        : [...prev.decorations, decoration]
    }));
  };

  const calculatePrice = () => {
    if (!selectedCake) return 0;
    const basePrice = selectedCake.base_price;
    const sizeMultiplier = orderForm.size === '3 кг' ? 1.5 : 
                          orderForm.size === '2 кг' ? 1.3 : 
                          orderForm.size === '1.5 кг' ? 1.15 : 1;
    const decorationPrice = orderForm.decorations.length * 200;
    return Math.round(basePrice * sizeMultiplier + decorationPrice);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!orderForm.customerName || !orderForm.customerPhone || !orderForm.deliveryDate) {
      alert(t('cakes.fillRequired'));
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cakes/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cake_id: selectedCake.id,
          cake_name: i18n.language === 'ru' ? selectedCake.name_ru : selectedCake.name_en,
          ...orderForm,
          price: calculatePrice()
        })
      });

      if (!response.ok) throw new Error('Failed to place order');
      
      const data = await response.json();
      alert(`${t('cakes.orderSuccess')} ${data.order_number}`);
      setShowOrderForm(false);
      setSelectedCake(null);
      setOrderForm({
        size: '',
        weight: '',
        decorations: [],
        inscription: '',
        specialRequests: '',
        deliveryDate: '',
        deliveryTime: '',
        deliveryAddress: '',
        customerName: '',
        customerPhone: '',
        customerEmail: ''
      });
    } catch (err) {
      alert(t('cakes.orderError') + ': ' + err.message);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + (selectedCake?.min_order_days || 3));
    return date.toISOString().split('T')[0];
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
          <p className="text-red-600 text-lg">❌ {t('common.error')}: {error}</p>
          <button onClick={fetchCakes} className="mt-4 btn-primary">
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
        <h1 className="section-title">{t('cakes.title')}</h1>
        <p className="section-subtitle">{t('cakes.subtitle')}</p>
      </div>

      {/* Cakes Grid */}
      {!showOrderForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cakes.map(cake => (
            <div 
              key={cake.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <img
                  src={cake.image_url}
                  alt={i18n.language === 'ru' ? cake.name_ru : cake.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800';
                  }}
                />
                {cake.is_featured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ {t('menu.featured')}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {i18n.language === 'ru' ? cake.name_ru : cake.name_en}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {i18n.language === 'ru' ? cake.description_ru : cake.description_en}
                </p>

                {/* Available Sizes */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {t('cakes.availableSizes')}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cake.sizes.map((size, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Decorations */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {t('cakes.decorationOptions')}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cake.decorations.slice(0, 3).map((decoration, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                      >
                        {decoration}
                      </span>
                    ))}
                    {cake.decorations.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{cake.decorations.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Min Order Days */}
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ⏰ {t('cakes.minDays', { days: cake.min_order_days })}
                  </p>
                </div>

                {/* Price and Order Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t('cakes.from')}</p>
                    <p className="text-3xl font-bold text-primary-600">
                      {cake.base_price} ₽
                    </p>
                  </div>
                  <button
                    onClick={() => handleOrderClick(cake)}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    {t('cakes.orderNow')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Order Form */
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {i18n.language === 'ru' ? selectedCake.name_ru : selectedCake.name_en}
            </h2>
            <button
              onClick={() => setShowOrderForm(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('cakes.selectSize')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedCake.sizes.map((size, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOrderForm({...orderForm, size, weight: size})}
                    className={`p-4 rounded-lg border-2 font-medium transition-all ${
                      orderForm.size === size
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Decorations */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('cakes.selectDecorations')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedCake.decorations.map((decoration, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDecorationToggle(decoration)}
                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                      orderForm.decorations.includes(decoration)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {decoration}
                  </button>
                ))}
              </div>
            </div>

            {/* Inscription */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('cakes.inscription')}
              </label>
              <input
                type="text"
                value={orderForm.inscription}
                onChange={(e) => setOrderForm({...orderForm, inscription: e.target.value})}
                className="input-field"
                placeholder={t('cakes.inscriptionPlaceholder')}
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('cakes.specialRequests')}
              </label>
              <textarea
                value={orderForm.specialRequests}
                onChange={(e) => setOrderForm({...orderForm, specialRequests: e.target.value})}
                className="input-field"
                rows="3"
                placeholder={t('cakes.specialRequestsPlaceholder')}
              />
            </div>

            {/* Delivery Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('cakes.deliveryDate')} *
                </label>
                <input
                  type="date"
                  value={orderForm.deliveryDate}
                  onChange={(e) => setOrderForm({...orderForm, deliveryDate: e.target.value})}
                  min={getMinDate()}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('cakes.deliveryTime')}
                </label>
                <input
                  type="time"
                  value={orderForm.deliveryTime}
                  onChange={(e) => setOrderForm({...orderForm, deliveryTime: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('cakes.deliveryAddress')}
              </label>
              <input
                type="text"
                value={orderForm.deliveryAddress}
                onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                className="input-field"
                placeholder={t('cakes.addressPlaceholder')}
              />
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('cakes.contactInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('common.name')} *
                  </label>
                  <input
                    type="text"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('common.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={orderForm.customerPhone}
                    onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('common.email')}
                  </label>
                  <input
                    type="email"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 mb-1">{t('cakes.totalPrice')}</p>
                  <p className="text-4xl font-bold text-primary-600">
                    {calculatePrice()} ₽
                  </p>
                </div>
                <button type="submit" className="btn-primary px-8 py-4 text-lg">
                  {t('cakes.placeOrder')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Cakes;
