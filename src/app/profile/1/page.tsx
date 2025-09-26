'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { User } from '@/lib/database';

export default function ProfilePage({ params }: Readonly<{ params: { id: string } }>) {
  const [user, setUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          setStatusMessage('Ошибка загрузки профиля');
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setStatusMessage('Ошибка загрузки профиля');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setStatusMessage('Ошибка сети: ' + error.message);
        } else {
          setStatusMessage('Ошибка сети');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    setStatusMessage('Сохранение...');
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: user.address,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setStatusMessage('Профиль успешно обновлен!');
        setIsEditing(false);
      } else {
        setStatusMessage(data.error || 'Ошибка сохранения');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatusMessage('Ошибка сети при сохранении: ' + error.message);
      } else {
        setStatusMessage('Ошибка сети при сохранении');
      }
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f5f7f9] rounded-lg shadow-none p-6 md:p-10">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-10 bg-blue-600 rounded mr-4"></div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">Профиль</h1>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Аватар сол жақта, үлкейтілген */}
            <div className="flex flex-col items-center justify-start w-[260px]">
              <div className="w-[200px] h-[200px] border-4 border-blue-500 rounded-full flex items-center justify-center bg-gray-100 mb-2">
                <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 text-center">Загрузка профиля...</div>
            ) : (
              /* Форма оң жақта */
              <div className="flex-1 space-y-7">
                <div>
                  <label htmlFor="login" className="block text-lg font-medium text-gray-700 mb-2">Логин</label>
                  <input
                    id="login"
                    type="text"
                    readOnly
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg text-gray-500"
                    value={user.login || ''}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    readOnly
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg text-gray-500"
                    value={user.email || ''}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Имя</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className={`w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                    value={user.name || ''}
                    onChange={handleProfileChange}
                    placeholder="Ваше имя"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">Телефон</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className={`w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                    value={user.phone || ''}
                    onChange={handleProfileChange}
                    placeholder="Ваш телефон"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-lg font-medium text-gray-700 mb-2">Адрес</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    className={`w-full px-5 py-3 border border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                    value={user.address || ''}
                    onChange={handleProfileChange}
                    placeholder="Ваш адрес"
                    readOnly={!isEditing}
                  />
                </div>
                {statusMessage && <p className="text-center text-gray-600">{statusMessage}</p>}
                <div className="pt-6">
                  {isEditing ? (
                    <div className="flex gap-4">
                      <button onClick={handleSave} className="w-full bg-green-600 text-white py-4 px-4 rounded-lg font-semibold text-xl hover:bg-green-700 transition-colors">
                        Сохранить
                      </button>
                      <button onClick={() => setIsEditing(false)} className="w-full bg-gray-500 text-white py-4 px-4 rounded-lg font-semibold text-xl hover:bg-gray-600 transition-colors">
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-[#0057ff] text-white py-4 px-4 rounded-lg font-semibold text-xl hover:bg-blue-700 transition-colors"
                    >
                      Редактировать
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

