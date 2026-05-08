import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { t } = useTranslation();
  const { cart, getCartTotal } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="section-title text-center">{t('cart.title')}</h1>
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-primary-600 mb-4">{t('cart.empty')}</p>
          <Link to="/menu" className="btn-primary">
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-primary-600">Корзина с товарами</p>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>{t('cart.total')}:</span>
                <span>{getCartTotal().toFixed(2)} ₽</span>
              </div>
              <Link to="/checkout" className="btn-primary w-full mt-4">
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
