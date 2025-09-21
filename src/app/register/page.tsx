'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateRegistrationForm } from '@/lib/validation';
import { ValidationError } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибки при изменении поля
    setErrors(prev => prev.filter(error => error.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация на клиенте
    const validationErrors = validateRegistrationForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
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
        setErrors(data.errors || [{ field: 'general', message: 'Ошибка регистрации' }]);
      }
    } catch (error) {
      setErrors([{ field: 'general', message: 'Ошибка соединения с сервером' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.login && formData.email && formData.password && formData.confirmPassword && errors.length === 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200">
        <div className="flex">
          {/* Левая часть - форма */}
          <div className="flex-1 p-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ЛОГОТИП</h1>
                <p className="text-gray-600">Регистрация</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите логин"
                  />
                  {errors.filter(e => e.field === 'login').map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error.message}</p>
                  ))}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите email"
                  />
                  {errors.filter(e => e.field === 'email').map((error, index) => (
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
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Повторите пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Повторите пароль"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.filter(e => e.field === 'confirmPassword').map((error, index) => (
                    <p key={index} className="text-red-500 text-sm mt-1">{error.message}</p>
                  ))}
                </div>

                {errors.filter(e => e.field === 'general').map((error, index) => (
                  <p key={index} className="text-red-500 text-sm text-center">{error.message}</p>
                ))}

                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Отправка...' : 'Отправить'}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">или</p>
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                  >
                    Вход
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Правая часть - изображение */}
          <div className="hidden md:block flex-1 bg-gray-100">
            <div className="h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full max-w-md">
                <img
                  src="/Frame 2095585499.png"
                  alt="Hyundai Santa Fe"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    // Fallback если изображение не загрузилось
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
                  <span className="text-gray-500 text-lg">Изображение автомобиля</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
