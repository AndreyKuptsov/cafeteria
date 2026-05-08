import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Coffee, Cake, Clock, MapPin } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-100 via-accent-cream to-accent-lavender py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-800 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-primary-600 mb-4">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg md:text-xl text-primary-700 mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary">
              {t('hero.cta')}
            </Link>
            <Link to="/booking" className="btn-secondary">
              {t('hero.bookTable')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Coffee className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary-800 mb-2">
                {t('menu.categories.breakfast')}
              </h3>
              <p className="text-primary-600">Овсяная каша, яичница, блины</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Cake className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary-800 mb-2">
                {t('menu.categories.desserts')}
              </h3>
              <p className="text-primary-600">Наполеон, Медовик, Тирамису</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary-800 mb-2">
                Удобный график
              </h3>
              <p className="text-primary-600">Пн-Пт: 10:00-20:00<br/>Сб-Вс: 12:00-17:00</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-primary-800 mb-2">
                В центре города
              </h3>
              <p className="text-primary-600">ул. Ванеева, Нижний Новгород</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Закажите торт на заказ
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Лавандовый бисквит, Три шоколада, Бурбоновый мусс - эксклюзивные торты для ваших праздников
          </p>
          <Link to="/cakes" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
            {t('cakes.orderNow')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
