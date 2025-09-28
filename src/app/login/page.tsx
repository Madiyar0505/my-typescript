'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateLoginForm } from '@/lib/validation';
import { ValidationError } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибки при изменении поля
    setErrors(prev => prev.filter(error => error.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация на клиенте
    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrors(data.errors || [{ field: 'general', message: 'Ошибка входа' }]);
      }
    } catch (error) {
      setErrors([{ field: 'general', message: 'Ошибка соединения с сервером' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.login && formData.password && errors.length === 0;

  return (
    <div className="min-h-screen bg-[#f4f6f8] w-full h-screen flex items-center justify-center p-0 m-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full flex overflow-hidden border border-gray-200">
        {/* Сол жақ: форма 60% */}
        <div className="flex flex-col justify-center w-full md:w-[60%] p-12 h-full">
          <div className="max-w-lg mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-wide">ЛОГОТИП</h1>
              <p className="text-gray-600 text-lg">Вход</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                  Логин
                </label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
                  placeholder="Введите логин"
                />
                {errors.filter(e => e.field === 'login').map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mt-1">{error.message}</p>
                ))}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900"
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.filter(e => e.field === 'password').map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mt-1">{error.message}</p>
                ))}
              </div>

              {errors.filter(e => e.field === 'general').map((error, index) => (
                <p key={index} className="text-red-500 text-sm text-center">{error.message}</p>
              ))}

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              <div className="text-center mt-2">
                <p className="text-gray-600 text-base">или</p>
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-blue-600 hover:text-blue-800 text-base font-medium mt-2"
                >
                  Регистрация
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Оң жақ: фото 40% */}
        <div className="hidden md:flex w-[40%] h-full">
          <div className="relative w-full h-full">
            <img
              src="/Frame 2095585499.png"
              alt="Hyundai Santa Fe"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback если изображение не загрузилось
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <div className="w-full h-full bg-gray-300 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
              <span className="text-gray-500 text-lg">Изображение автомобиля</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
