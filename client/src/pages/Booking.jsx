import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Booking = () => {
  const { t } = useTranslation();
  const [bookingForm, setBookingForm] = useState({
    bookingDate: '',
    bookingTime: '',
    guestsCount: 2,
    tablePreference: '',
    specialRequests: '',
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00'
  ];

  const tablePreferences = [
    { value: 'window', label_ru: 'У окна', label_en: 'By the window' },
    { value: 'corner', label_ru: 'В углу', label_en: 'In the corner' },
    { value: 'center', label_ru: 'В центре зала', label_en: 'Center of the hall' },
    { value: 'terrace', label_ru: 'На террасе', label_en: 'On the terrace' }
  ];

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingForm.customerName || !bookingForm.customerPhone || 
        !bookingForm.bookingDate || !bookingForm.bookingTime) {
      alert(t('booking.fillRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });

      if (!response.ok) throw new Error('Failed to create booking');
      
      const data = await response.json();
      alert(`${t('booking.success')} ${data.booking_number}`);
      
      // Reset form
      setBookingForm({
        bookingDate: '',
        bookingTime: '',
        guestsCount: 2,
        tablePreference: '',
        specialRequests: '',
        customerName: '',
        customerPhone: '',
        customerEmail: ''
      });
    } catch (err) {
      alert(t('booking.error') + ': ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="section-title">{t('booking.title')}</h1>
        <p className="section-subtitle">{t('booking.subtitle')}</p>
      </div>

      {/* Business Hours Info */}
      <div className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>🕐</span> {t('booking.businessHours')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold">📅</span>
            <span>{t('booking.weekdays', { open: '10:00', close: '20:00' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">🎉</span>
            <span>{t('booking.weekends', { open: '12:00', close: '17:00' })}</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('booking.selectDate')} *
              </label>
              <input
                type="date"
                value={bookingForm.bookingDate}
                onChange={(e) => setBookingForm({...bookingForm, bookingDate: e.target.value})}
                min={getMinDate()}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('booking.selectTime')} *
              </label>
              <select
                value={bookingForm.bookingTime}
                onChange={(e) => setBookingForm({...bookingForm, bookingTime: e.target.value})}
                className="input-field"
                required
              >
                <option value="">{t('booking.chooseTime')}</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('booking.guestsCount')} *
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setBookingForm({...bookingForm, guestsCount: Math.max(1, bookingForm.guestsCount - 1)})}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl"
              >
                −
              </button>
              <span className="text-3xl font-bold text-primary-600 w-16 text-center">
                {bookingForm.guestsCount}
              </span>
              <button
                type="button"
                onClick={() => setBookingForm({...bookingForm, guestsCount: Math.min(20, bookingForm.guestsCount + 1)})}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-xl"
              >
                +
              </button>
            </div>
          </div>

          {/* Table Preference */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('booking.tablePreference')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tablePreferences.map(pref => (
                <button
                  key={pref.value}
                  type="button"
                  onClick={() => setBookingForm({...bookingForm, tablePreference: pref.value})}
                  className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                    bookingForm.tablePreference === pref.value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t('common.language') === 'ru' ? pref.label_ru : pref.label_en}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('booking.specialRequests')}
            </label>
            <textarea
              value={bookingForm.specialRequests}
              onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
              className="input-field"
              rows="3"
              placeholder={t('booking.requestsPlaceholder')}
            />
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('booking.contactInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.name')} *
                </label>
                <input
                  type="text"
                  value={bookingForm.customerName}
                  onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
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
                  value={bookingForm.customerPhone}
                  onChange={(e) => setBookingForm({...bookingForm, customerPhone: e.target.value})}
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
                  value={bookingForm.customerEmail}
                  onChange={(e) => setBookingForm({...bookingForm, customerEmail: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t('common.loading') : t('booking.bookNow')}
            </button>
          </div>
        </form>
      </div>

      {/* Contact Info */}
      <div className="max-w-3xl mx-auto mt-8 text-center text-gray-600">
        <p className="mb-2">
          💬 {t('booking.contactAnna')}
        </p>
        <p className="text-sm">
          {t('booking.confirmationNote')}
        </p>
      </div>
    </div>
  );
};

export default Booking;
