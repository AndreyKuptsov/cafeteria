import { useTranslation } from 'react-i18next';

const Checkout = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-title text-center">{t('order.title')}</h1>
      <div className="text-center text-primary-600">
        <p>Оформление заказа - подключается к API /api/orders</p>
      </div>
    </div>
  );
};

export default Checkout;
