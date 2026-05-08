import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu as MenuIcon, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍰</span>
            <span className="text-xl font-display font-bold text-primary-700">
              Cafeteria.ru
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-primary-700 hover:text-primary-900 font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/menu" className="text-primary-700 hover:text-primary-900 font-medium">
              {t('nav.menu')}
            </Link>
            <Link to="/cakes" className="text-primary-700 hover:text-primary-900 font-medium">
              {t('nav.cakes')}
            </Link>
            <Link to="/booking" className="text-primary-700 hover:text-primary-900 font-medium">
              {t('nav.booking')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-5 h-5 text-primary-700" />
              <span className="ml-1 text-sm font-medium text-primary-700">
                {i18n.language.toUpperCase()}
              </span>
            </button>

            <Link to="/cart" className="relative p-2 hover:bg-primary-100 rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-primary-700" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-strawberry text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <MenuIcon className="w-6 h-6 text-primary-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-200">
            <Link
              to="/"
              className="block py-2 text-primary-700 hover:text-primary-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/menu"
              className="block py-2 text-primary-700 hover:text-primary-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.menu')}
            </Link>
            <Link
              to="/cakes"
              className="block py-2 text-primary-700 hover:text-primary-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.cakes')}
            </Link>
            <Link
              to="/booking"
              className="block py-2 text-primary-700 hover:text-primary-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.booking')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
