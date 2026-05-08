import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.login, formData.password);
    
    if (result.success) {
      if (result.user.role === 'admin' || result.user.role === 'manager') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin or manager role required.');
        setLoading(false);
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary-800 mb-2">
            🍰 Cafeteria.ru
          </h1>
          <p className="text-xl text-primary-600">Admin Panel</p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-6 text-center">
            Вход в админ-панель
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Email или телефон
              </label>
              <input
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                className="input-field"
                placeholder="admin@cafeteria.ru или +79001234567"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              ← Вернуться на главную
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-primary-600">
          <p>Тестовый доступ:</p>
          <p className="font-mono text-xs mt-2">
            admin@cafeteria.ru / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
